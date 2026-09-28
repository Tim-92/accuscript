'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface IndustryData {
  id: string;
  icon: string;
  name: string;
  tagline: string;
  description: string;
  services: string[];
  benefits: { title: string; body: string }[];
  note?: string;
  bg: string;
}

const industries: IndustryData[] = [
  {
    id: 'legal',
    icon: 'ScaleIcon',
    name: 'Legal',
    tagline: 'Accurate documentation for professional legal workflows.',
    description:
      'Legal professionals rely on precise, well-formatted transcripts. I transcribe depositions, hearings, consultations, recorded statements, client interviews and other case-related recordings with careful attention to speaker identification, terminology, formatting and readability.',
    services: [
      'Deposition transcripts',
      'Hearing recordings',
      'Attorney–client consultations',
      'Recorded witness statements',
      'Investigative interviews',
      'Case-related audio and video',
    ],
    benefits: [
      {
        title: 'Formatted to your specification',
        body: 'Legal transcript formatting varies by firm, jurisdiction and purpose. I follow your provided template or style guide — including Q&A formatting, line numbering, page headers, timestamps and speaker labels.',
      },
      {
        title: 'Careful speaker identification',
        body: 'Multiple speakers, attorneys, witnesses and court reporters are clearly identified and consistently labeled throughout the transcript.',
      },
      {
        title: 'Terminology accuracy',
        body: 'Legal proceedings involve specific terminology, case names, statutes and proper nouns. I review these carefully rather than accepting raw AI output that may misinterpret specialized language.',
      },
      {
        title: 'Confidentiality',
        body: 'Legal recordings are sensitive. Your files are handled with discretion and used solely for the purpose of completing your transcription project.',
      },
    ],
    note: 'Please note: Accuscript provides professional transcription services. I do not provide court-certified, notarized or officially court-admissible transcripts. Please confirm your specific requirements before ordering.',
    bg: 'bg-muted',
  },
  {
    id: 'insurance',
    icon: 'ShieldCheckIcon',
    name: 'Insurance',
    tagline: 'Organized documentation for claims and investigations.',
    description:
      'Insurance professionals need accurate, organized transcripts of recorded statements, claimant interviews, witness accounts and adjuster recordings. I turn claim-related audio into clean, readable documentation that supports your workflow.',
    services: [
      'Recorded claimant statements',
      'Witness interviews',
      'Adjuster field recordings',
      'Investigative audio',
      'Claim-related phone recordings',
      'SIU interview transcripts',
    ],
    benefits: [
      {
        title: 'Clear speaker identification',
        body: 'Claimants, adjusters, witnesses and interviewers are clearly labeled so the transcript is immediately usable for documentation and review.',
      },
      {
        title: 'Verbatim or clean read options',
        body: 'Choose verbatim transcription that captures every word exactly as spoken, or a clean-read version that removes filler words and false starts for easier reading.',
      },
      {
        title: 'Timestamps on request',
        body: 'Timestamps can be added at regular intervals or at each speaker change, making it easy to cross-reference the transcript against the original recording.',
      },
      {
        title: 'Consistent formatting',
        body: 'Transcripts are delivered in a consistent, professional format that integrates cleanly into claim files and documentation systems.',
      },
    ],
    bg: 'bg-background',
  },
  {
    id: 'education',
    icon: 'AcademicCapIcon',
    name: 'Education',
    tagline: 'Transcription and captions for learning environments.',
    description:
      'Educators, institutions and researchers need accurate transcripts and captions to make content accessible, searchable and reusable. I transcribe lectures, seminars, webinars, research interviews, academic discussions and educational recordings.',
    services: [
      'Lecture and seminar transcripts',
      'Webinar and online course transcripts',
      'Research interview transcripts',
      'Academic discussion recordings',
      'Educational video captions',
      'Accessibility captions for course content',
    ],
    benefits: [
      {
        title: 'Accessibility and inclusion',
        body: 'Captions and transcripts make educational content accessible to students with hearing impairments, non-native speakers and anyone who learns better from text.',
      },
      {
        title: 'Searchable content',
        body: 'A transcript turns a recorded lecture into a searchable, referenceable document. Students can find specific topics, quotes and explanations without rewatching entire recordings.',
      },
      {
        title: 'SDH captions for course videos',
        body: 'For online courses and educational videos, SDH captions include speaker identification and relevant non-speech cues, meeting accessibility standards for educational platforms.',
      },
      {
        title: 'Research-grade accuracy',
        body: 'Academic interviews and focus groups require accurate speaker identification and precise transcription. I review terminology, names and context carefully.',
      },
    ],
    bg: 'bg-muted',
  },
  {
    id: 'business',
    icon: 'BriefcaseIcon',
    name: 'Business',
    tagline: 'Meetings, training and corporate recordings — documented.',
    description:
      'Business professionals need reliable transcripts of meetings, interviews, presentations, training sessions and corporate recordings. I provide clean, organized documentation that saves time and keeps your team aligned.',
    services: [
      'Meeting and conference transcripts',
      'Job interview recordings',
      'Training session transcripts',
      'Presentation and webinar transcripts',
      'Corporate video captions',
      'Internal communication recordings',
    ],
    benefits: [
      {
        title: 'Meeting documentation',
        body: 'Turn recorded meetings into organized transcripts with clear speaker labels. Easier to reference than audio, faster to search than video, and ready to share with stakeholders.',
      },
      {
        title: 'Training content accessibility',
        body: 'Add captions to training videos and transcripts to training recordings so employees can engage with content in their preferred format, on their own schedule.',
      },
      {
        title: 'Interview transcripts',
        body: 'Recorded job interviews, client interviews and research interviews are transcribed with accurate speaker identification so you can focus on evaluation rather than note-taking.',
      },
      {
        title: 'Professional formatting',
        body: 'Business transcripts are delivered in clean, professional formats suitable for internal documentation, board reports, compliance records and team distribution.',
      },
    ],
    bg: 'bg-background',
  },
  {
    id: 'research',
    icon: 'BeakerIcon',
    name: 'Research',
    tagline: 'Accurate transcripts for qualitative research and analysis.',
    description:
      'Researchers depend on precise transcripts for qualitative analysis, coding and publication. I transcribe research interviews, focus groups, academic recordings and fieldwork audio with careful attention to speaker identification, accuracy and formatting.',
    services: [
      'One-on-one research interviews',
      'Focus group recordings',
      'Fieldwork and observation audio',
      'Academic conference recordings',
      'Oral history interviews',
      'Qualitative data recordings',
    ],
    benefits: [
      {
        title: 'Speaker identification for analysis',
        body: 'Research transcripts require consistent, accurate speaker labeling. Each participant is clearly identified throughout, making qualitative coding and analysis straightforward.',
      },
      {
        title: 'Verbatim transcription',
        body: 'Qualitative research often requires verbatim transcripts that capture hesitations, repetitions and natural speech patterns. I deliver exactly what was said, not a cleaned-up version.',
      },
      {
        title: 'Timestamps for reference',
        body: 'Timestamps at regular intervals or speaker changes allow researchers to quickly locate specific moments in the original recording for verification and citation.',
      },
      {
        title: 'Confidential handling',
        body: 'Research recordings often involve participant confidentiality. Your files are handled with care and used solely for transcription purposes.',
      },
    ],
    bg: 'bg-muted',
  },
  {
    id: 'content-creators',
    icon: 'VideoCameraIcon',
    name: 'Content Creators',
    tagline: 'Captions and transcripts that grow your audience.',
    description:
      'Content creators need accurate captions and transcripts to reach wider audiences, improve accessibility, boost SEO and repurpose content. I provide captions for YouTube videos, podcasts, online courses, interviews and social media content.',
    services: [
      'YouTube video captions',
      'Podcast transcripts',
      'Online course captions',
      'Interview transcripts',
      'Social media video captions',
      'Webinar and livestream transcripts',
    ],
    benefits: [
      {
        title: 'Reach more viewers',
        body: 'Captions make your content accessible to viewers who are deaf or hard of hearing, watching without sound, or speaking a different language. More accessible content reaches a larger audience.',
      },
      {
        title: 'YouTube SEO',
        body: 'Accurate captions and transcripts give YouTube more text to index, improving your video\'s discoverability in search results. Auto-generated captions are often inaccurate — mine are reviewed.',
      },
      {
        title: 'Non-SDH and SDH options',
        body: 'Non-SDH captions cover spoken dialogue. SDH captions additionally include relevant sound effects, music cues and speaker identification — ideal for accessibility-focused platforms.',
      },
      {
        title: 'Repurpose your content',
        body: 'A podcast transcript becomes a blog post, a show notes page, a quotable excerpt or a social media caption. I give you the text so you can use it however you need.',
      },
    ],
    bg: 'bg-background',
  },
];

function IndustrySection({ industry, index }: { industry: IndustryData; index: number }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>('.reveal-hidden');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('reveal-visible'); }),
      { threshold: 0.08 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const isEven = index % 2 === 0;

  return (
    <section
      ref={ref}
      id={industry.id}
      className={`py-20 border-b border-border ${industry.bg}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className={`grid lg:grid-cols-12 gap-12 items-start ${isEven ? '' : ''}`}>
          {/* Left: industry info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="reveal-hidden stagger-1 flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0">
                <Icon name={industry.icon as Parameters<typeof Icon>[0]['name']} size={22} className="text-white" />
              </div>
              <span className="pill-badge">{industry.name}</span>
            </div>
            <h2 className="reveal-hidden stagger-2 text-3xl font-700 text-foreground leading-tight tracking-tight">
              {industry.tagline}
            </h2>
            <p className="reveal-hidden stagger-3 text-base text-muted-foreground leading-relaxed">
              {industry.description}
            </p>

            {/* Services list */}
            <div className="reveal-hidden stagger-4 space-y-2">
              <p className="text-xs font-700 text-foreground uppercase tracking-widest mb-3">What I transcribe</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {industry.services.map((service) => (
                  <div key={service} className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {industry.note && (
              <div className="reveal-hidden stagger-5 bg-secondary border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground leading-relaxed">{industry.note}</p>
              </div>
            )}

            <div className="reveal-hidden stagger-5 pt-2">
              <Link
                href={`/request-a-quote?service=transcription&industry=${industry.id}`}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-700 hover:bg-accent transition-colors"
              >
                Get a Quote for {industry.name} <Icon name="ArrowRightIcon" size={15} />
              </Link>
            </div>
          </div>

          {/* Right: benefits */}
          <div className="lg:col-span-7 lg:pl-8">
            <p className="reveal-hidden stagger-1 text-xs font-700 text-foreground uppercase tracking-widest mb-5">
              Service benefits
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {industry.benefits.map((benefit, bi) => (
                <div
                  key={benefit.title}
                  className={`reveal-hidden stagger-${(bi % 4) + 1} bg-card border border-border rounded-2xl p-5 space-y-2 card-hover`}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name="CheckIcon" size={11} className="text-white" />
                    </div>
                    <h3 className="text-sm font-700 text-foreground leading-snug">{benefit.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-7">{benefit.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function IndustryDetail() {
  return (
    <>
      {industries.map((industry, i) => (
        <IndustrySection key={industry.id} industry={industry} index={i} />
      ))}
    </>
  );
}
