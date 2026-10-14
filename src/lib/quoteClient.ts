interface InitSingle {
  mode: 'single';
  jobRef: string;
  uploadToken: string;
  url: string;
  contentType: string;
}
interface InitMultipart {
  mode: 'multipart';
  jobRef: string;
  uploadToken: string;
  partSize: number;
  partUrls: string[];
  contentType: string;
}
type InitResponse = InitSingle | InitMultipart;

function putWithProgress(
  url: string,
  body: Blob,
  contentType: string | null,
  onProgress: (loaded: number) => void
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    if (contentType) xhr.setRequestHeader('Content-Type', contentType);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.getResponseHeader('ETag'));
      else reject(new Error(`Upload failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.onabort = () => reject(new Error('Upload cancelled'));
    xhr.send(body);
  });
}

async function postJson<T>(path: string, payload: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Request failed');
  return data as T;
}

export async function uploadFileToR2(
  file: File,
  onProgress: (fraction: number) => void
): Promise<{ jobRef: string; verifiedToken: string }> {
  const init = await postJson<InitResponse>('/api/upload/init', { filename: file.name, size: file.size });

  if (init.mode === 'single') {
    await putWithProgress(init.url, file, init.contentType, (loaded) => onProgress(loaded / file.size));
    const done = await postJson<{ jobRef: string; verifiedToken: string }>('/api/upload/complete', {
      uploadToken: init.uploadToken,
    });
    return { jobRef: done.jobRef, verifiedToken: done.verifiedToken };
  }

  const parts: { partNumber: number; etag: string }[] = [];
  let completedBytes = 0;
  try {
    for (let i = 0; i < init.partUrls.length; i++) {
      const start = i * init.partSize;
      const chunk = file.slice(start, Math.min(start + init.partSize, file.size));
      let etag: string | null = null;
      let lastErr: unknown;
      for (let attempt = 0; attempt < 3 && !etag; attempt++) {
        try {
          etag = await putWithProgress(init.partUrls[i], chunk, null, (loaded) =>
            onProgress((completedBytes + loaded) / file.size)
          );
          if (!etag) throw new Error('Missing ETag. Check the R2 CORS ExposeHeaders setting.');
        } catch (e) {
          lastErr = e;
          etag = null;
        }
      }
      if (!etag) throw lastErr instanceof Error ? lastErr : new Error('Part upload failed');
      completedBytes += chunk.size;
      parts.push({ partNumber: i + 1, etag });
    }
    const done = await postJson<{ jobRef: string; verifiedToken: string }>('/api/upload/complete', {
      uploadToken: init.uploadToken,
      parts,
    });
    return { jobRef: done.jobRef, verifiedToken: done.verifiedToken };
  } catch (e) {
    await postJson('/api/upload/complete', { uploadToken: init.uploadToken, abort: true }).catch(() => undefined);
    throw e;
  }
}

export async function submitQuote(payload: Record<string, unknown>) {
  return postJson<{ ok: boolean; jobRef: string; confirmationSent?: boolean }>('/api/quote', payload);
}
