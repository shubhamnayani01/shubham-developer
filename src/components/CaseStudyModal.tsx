import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowUpRight, Award, ExternalLink, Sliders, Volume2, Sparkles, Check, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { CaseStudy } from '../types';
import { CASE_STUDIES } from '../data/portfolioData';
import { soundFx } from '../utils/soundEffects';
import { SEOHead } from './SEOHead';

interface CaseStudyModalProps {
  caseStudy: CaseStudy | null;
  onClose: () => void;
  onSelectProject: (study: CaseStudy) => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  caseStudy,
  onClose,
  onSelectProject
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'narrative' | 'interactive' | 'gallery'>('narrative');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Interactive 3D Viewer Mock State
  const [material, setMaterial] = useState<'titanium' | 'gold' | 'obsidian'>('titanium');
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);

  // Interactive Typography Tester State
  const [customText, setCustomText] = useState<string>('Mobile-First Architecture & High Performance');
  const [typeSize, setTypeSize] = useState<number>(42);

  // Interactive Sound Wave State
  const [frequency, setFrequency] = useState<number>(440);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const currentIndex = caseStudy ? CASE_STUDIES.findIndex((c) => c.id === caseStudy.id) : 0;
  const prevProject = CASE_STUDIES[(currentIndex - 1 + CASE_STUDIES.length) % CASE_STUDIES.length];
  const nextProject = CASE_STUDIES[(currentIndex + 1) % CASE_STUDIES.length];

  // Reset scroll to top whenever a new case study is selected
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [caseStudy?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundFx.playClick();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        soundFx.playClick();
        onSelectProject(prevProject);
      } else if (e.key === 'ArrowRight') {
        soundFx.playClick();
        onSelectProject(nextProject);
      }
    };
    if (caseStudy) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [caseStudy, onClose, prevProject, nextProject, onSelectProject]);

  const [copiedLink, setCopiedLink] = useState(false);

  if (!caseStudy) return null;

  const handleCopyHex = (hex: string) => {
    soundFx.playClick(1100);
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleCopyLink = () => {
    soundFx.playClick(1000);
    const url = new URL(window.location.href);
    url.searchParams.set('project', caseStudy.id);
    navigator.clipboard.writeText(url.toString());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  // Tailored unique SEO descriptions for search engine indexing
  const projectSEODescriptions: Record<string, string> = {
    'khedut-kharch': 'Case study of Khedut Kharch (ખેડૂત ખર્ચ નોંધ) by Shubham Nayani: Major agritech offline-first PWA for Gujarati farmers with crop expense, profit-loss, voice entries, and IndexedDB sync.',
    'dharashuddhjal': 'Case study of Dharashuddhjal by Shubham Nayani: Pure RO + UV drinking water platform with WhatsApp dispatch and local Gujarat SEO ranking.',
    'shiv-enterprises': 'Case study of Shiv Enterprises by Shubham Nayani: Digital e-governance, ticketing, and agricultural services portal for Kotda Jadodar, Gujarat.',
    'family-footwear': 'Case study of Family Footwear by Shubham Nayani: Mobile-first footwear catalog and WhatsApp ordering portal with 5000+ happy customers.',
    'mehandi-art-by-pn': 'Case study of Mehandi Art by PN by Shubham Nayani: Luxury bridal henna portfolio with curated galleries and instant WhatsApp booking.',
    'expense-tracker': 'Case study of Expense Tracker by Shubham Nayani: High-performance reactive personal finance management app with sub-10ms calculation latency.'
  };

  const projectTitle = `${caseStudy.title} — ${caseStudy.subtitle} | Case Study — Shubham Nayani`;
  const projectDescription = projectSEODescriptions[caseStudy.id] ||
    `${caseStudy.title} (${caseStudy.year}): ${caseStudy.subtitle}. Case study by web developer Shubham Nayani detailing ${caseStudy.challenge.slice(0, 110)}...`;

  return (
    <AnimatePresence>
      {/* Dynamic SEO Meta Title and Description via React Helmet */}
      <SEOHead
        title={projectTitle}
        description={projectDescription}
        image={caseStudy.heroImage}
        type="article"
        keywords={`${caseStudy.title}, ${caseStudy.technologies.join(', ')}, ${caseStudy.category}, Shubham Nayani, web developer Nakhatrana Gujarat, case study`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          'headline': `${caseStudy.title} — ${caseStudy.subtitle}`,
          'name': `${caseStudy.title} Case Study`,
          'description': projectDescription,
          'image': caseStudy.heroImage,
          'author': {
            '@type': 'Person',
            'name': 'Shubham Nayani',
            'jobTitle': 'Web Developer'
          },
          'publisher': {
            '@type': 'Person',
            'name': 'Shubham Nayani'
          },
          'about': {
            '@type': 'CreativeWork',
            'name': caseStudy.title,
            'creator': 'Shubham Nayani',
            'keywords': caseStudy.technologies.join(', ')
          }
        }}
      />

      <div 
        id="case-study-modal-overlay"
        data-lenis-prevent
        className="fixed inset-0 z-50 flex justify-end overflow-hidden"
      >
        {/* Backdrop dismiss */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          data-cursor="hover"
        />

        {/* Modal Sheet Content */}
        <motion.div
          id="case-study-modal"
          data-lenis-prevent
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-[#F4F3F1] h-full h-[100dvh] max-h-screen shadow-2xl z-10 flex flex-col text-[#1A1A1A] overflow-hidden"
        >
          {/* Pinned Top Header with Navigation & Close */}
          <div className="shrink-0 z-30 bg-[#F4F3F1]/95 backdrop-blur-md px-6 md:px-10 py-5 border-b border-[#1A1A1A]/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A]/50">CASE STUDY / 0{currentIndex + 1}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A]">{caseStudy.category}</span>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Copy Direct Link / Share */}
              <button
                onClick={handleCopyLink}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#1A1A1A]/5 hover:bg-[#1A1A1A]/10 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A] transition-colors"
                title="Copy direct link to this project"
                data-cursor="hover"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3 h-3" />
                    <span className="hidden xs:inline">Share</span>
                  </>
                )}
              </button>

              {caseStudy.liveUrl && (
                <a
                  href={caseStudy.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-[#1A1A1A]/5 hover:bg-[#1A1A1A]/10 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A] transition-colors"
                >
                  <span>Live Experience</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              <button
                onClick={() => {
                  soundFx.playClick();
                  onClose();
                }}
                className="w-9 h-9 rounded-full bg-[#1A1A1A]/5 hover:bg-[#1A1A1A]/10 text-[#1A1A1A] flex items-center justify-center transition-colors"
                aria-label="Close modal"
                data-cursor="hover"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dedicated Smooth Scrollable Body */}
          <div 
            ref={scrollRef}
            data-lenis-prevent
            tabIndex={0}
            className="flex-1 overflow-y-auto overscroll-contain px-6 md:px-12 py-8 md:py-10 space-y-8 focus:outline-none"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {/* Title & Clean Description Header */}
            <div className="space-y-4 pb-6 border-b border-[#1A1A1A]/10">
              <div className="flex items-center space-x-3 text-[10px] font-mono-tech uppercase tracking-widest text-[#1A1A1A]/50">
                <span>{caseStudy.category}</span>
                <span>•</span>
                <span>{caseStudy.year}</span>
              </div>

              <h1 className="font-serif italic text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#1A1A1A]">
                {caseStudy.title}
              </h1>

              {caseStudy.subtitle && (
                <p className="font-serif italic text-xl md:text-2xl text-[#1A1A1A]/65 font-light">
                  {caseStudy.subtitle}
                </p>
              )}

              {/* Clean Concise Project Description */}
              <p className="text-[#1A1A1A]/80 text-base md:text-lg leading-relaxed pt-2 max-w-3xl font-light">
                {caseStudy.description || caseStudy.overview}
              </p>
            </div>

            {/* Hero Main Project Banner */}
            <div className="rounded-[24px] overflow-hidden border border-[#1A1A1A]/10 bg-[#16161D] shadow-xl flex flex-col">
              {/* Browser Mockup Chrome Bar */}
              <div className="w-full h-8 bg-[#0F0F14] border-b border-white/10 px-4 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/90" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/90" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/90" />
                </div>
                <div className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-white/50 max-w-[280px] sm:max-w-md truncate">
                  {caseStudy.liveUrl ? caseStudy.liveUrl : `https://${caseStudy.id}.com`}
                </div>
                {caseStudy.liveUrl && (
                  <a
                    href={caseStudy.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-mono text-white/70 hover:text-white flex items-center space-x-1"
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Image Frame with natural desktop aspect ratio */}
              <div className="relative w-full aspect-[16/9] sm:aspect-[2.05/1] overflow-hidden bg-[#16161D]">
                <img
                  src={caseStudy.heroImage}
                  alt={caseStudy.title}
                  className="w-full h-full object-contain object-top"
                />
              </div>
            </div>

          </div>

          {/* Pinned Bottom Project Switcher */}
          <div className="shrink-0 z-30 bg-[#F4F3F1] px-6 md:px-12 py-4 border-t border-[#1A1A1A]/10 flex items-center justify-between">
            <button
              onClick={() => {
                soundFx.playClick();
                onSelectProject(prevProject);
              }}
              className="flex items-center space-x-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>PREV: {prevProject.title}</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onSelectProject(nextProject);
              }}
              className="flex items-center space-x-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <span>NEXT: {nextProject.title}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
