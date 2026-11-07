import React, { useState, useEffect } from 'react';
import { useLenisSmoothScroll } from './hooks/useLenisSmoothScroll';
import { CustomCursor } from './components/CustomCursor';
import { EditorialLoader } from './components/EditorialLoader';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MarqueeBanner } from './components/MarqueeBanner';
import { SelectedWorks } from './components/SelectedWorks';
import { Experience } from './components/Experience';
import { EditorialGallery } from './components/EditorialGallery';
import { TechnicalSkills } from './components/TechnicalSkills';
import { AboutMe } from './components/AboutMe';
import { ClientTestimonials } from './components/ClientTestimonials';
import { ContactSection } from './components/ContactSection';
import { CaseStudyModal } from './components/CaseStudyModal';
import { ProjectInquiryModal } from './components/ProjectInquiryModal';
import { MobileQuickBar } from './components/MobileQuickBar';
import { SEOHead } from './components/SEOHead';
import { CaseStudy } from './types';
import { CASE_STUDIES } from './data/portfolioData';
import { soundFx } from './utils/soundEffects';

export default function App() {
  const { scrollTo, stop, start } = useLenisSmoothScroll();
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [isLoaderActive, setIsLoaderActive] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);
  const [loaderKey, setLoaderKey] = useState(1);

  // Check URL query parameters on initial mount for direct deep-linking
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('project');
    if (projectId) {
      const match = CASE_STUDIES.find((cs) => cs.id === projectId);
      if (match) {
        setSelectedCaseStudy(match);
      }
    }
  }, []);

  // Synchronize browser address bar with active case study without page reload
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const currentUrl = new URL(window.location.href);
    if (selectedCaseStudy) {
      currentUrl.searchParams.set('project', selectedCaseStudy.id);
      window.history.replaceState({ projectId: selectedCaseStudy.id }, '', currentUrl.toString());
    } else if (currentUrl.searchParams.has('project')) {
      currentUrl.searchParams.delete('project');
      window.history.replaceState({}, '', currentUrl.pathname + currentUrl.hash);
    }
  }, [selectedCaseStudy]);

  // Pause Lenis smooth-scroll while modal sheets are open so nested containers scroll natively
  useEffect(() => {
    if (selectedCaseStudy || inquiryModalOpen) {
      stop();
    } else {
      start();
    }
  }, [selectedCaseStudy, inquiryModalOpen, stop, start]);

  const handleRevealStart = React.useCallback(() => {
    setIsRevealed(true);
  }, []);

  const handleLoaderComplete = React.useCallback(() => {
    setIsRevealed(true);
    setIsLoaderActive(false);
  }, []);

  const handleOpenInquiry = () => {
    soundFx.playClick(900);
    setInquiryModalOpen(true);
  };

  const handleSelectCaseStudy = (study: CaseStudy) => {
    soundFx.playClick(950);
    setSelectedCaseStudy(study);
  };

  const handleNavigate = (target: string) => {
    soundFx.playClick(750);
    scrollTo(target, -20);
  };

  const handleScrollToTop = () => {
    soundFx.playClick(1000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReplayIntro = () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setIsRevealed(false);
    setIsLoaderActive(true);
    setLoaderKey((prev) => prev + 1);
  };

  return (
    <div className="relative min-h-screen bg-[#F4F3F1] text-[#1A1A1A] overflow-x-hidden selection:bg-[#1A1A1A] selection:text-white">
      {/* Dynamic Baseline Portfolio SEO Tags (Active when no modal is open) */}
      {!selectedCaseStudy && <SEOHead />}

      {/* Editorial Luxury Loading Animation */}
      {isLoaderActive && (
        <EditorialLoader
          key={loaderKey}
          onRevealStart={handleRevealStart}
          onComplete={handleLoaderComplete}
        />
      )}

      {/* Subtle Noise Texture Grain */}
      <div className="fixed inset-0 pointer-events-none z-30 grain-overlay opacity-60" />

      {/* Dynamic Contextual Custom Cursor */}
      <CustomCursor />

      {/* Main Experience Container with Smooth Reveal Transition */}
      <div
        className={`transition-all duration-1000 ease-out ${
          isRevealed
            ? 'opacity-100 filter-none transform-none'
            : 'opacity-0 filter blur-sm scale-[0.99]'
        }`}
      >
        {/* Luxury Sticky Floating Navigation Header */}
        <Header
          onOpenInquiry={handleOpenInquiry}
          onNavigate={handleNavigate}
        />

        {/* Main Experience Flow */}
        <main className="relative z-10">
          
          {/* 1. Cinematic Typographic Hero */}
          <Hero
            onExploreClick={() => handleNavigate('#portfolio')}
            onInquireClick={handleOpenInquiry}
          />

          {/* 2. Kinetic Client & Accolade Ticker */}
          <MarqueeBanner />

          {/* 3. Selected Works / Flagship Portfolio */}
          <SelectedWorks
            onSelectCaseStudy={handleSelectCaseStudy}
          />

          {/* 4. Client Endorsements & Reviews (Social proof immediately following works) */}
          <ClientTestimonials
            onOpenInquiry={handleOpenInquiry}
          />

          {/* 5. About Me (Human story, background & live status) */}
          <AboutMe />

          {/* 6. Timeline & Experience Journey */}
          <Experience />

          {/* 7. Technical Stack & Interactive Skills Constellation */}
          <TechnicalSkills />

          {/* 8. Editorial Photography Exhibition & 3D Gallery */}
          <EditorialGallery />

        </main>

        {/* 8. Grand Kinetic Closing Footer */}
        <ContactSection
          onOpenInquiry={handleOpenInquiry}
          onScrollToTop={handleScrollToTop}
        />

        {/* Full-Bleed In-Depth Case Study Modal */}
        <CaseStudyModal
          caseStudy={selectedCaseStudy}
          onClose={() => setSelectedCaseStudy(null)}
          onSelectProject={(study) => setSelectedCaseStudy(study)}
        />

        {/* Guided Project Inquiry Configurator */}
        <ProjectInquiryModal
          isOpen={inquiryModalOpen}
          onClose={() => setInquiryModalOpen(false)}
        />

        {/* Minimal Mobile Quick Conversion Action Bar */}
        <MobileQuickBar onOpenInquiry={handleOpenInquiry} />
      </div>
    </div>
  );
}
