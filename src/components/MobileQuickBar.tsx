import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, ArrowUpRight, Phone, Copy, Check, X, FileText } from 'lucide-react';

interface MobileQuickBarProps {
  onOpenInquiry: () => void;
}

export const MobileQuickBar: React.FC<MobileQuickBarProps> = ({ onOpenInquiry }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigator.clipboard.writeText('+919427209737');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleInquiryClick = () => {
    setIsOpen(false);
    onOpenInquiry();
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end"
    >
      {/* Pop-up Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 w-[clamp(275px,86vw,320px)] sm:w-[320px] rounded-2xl bg-[#0A0A0A]/96 backdrop-blur-xl border border-white/20 text-white p-3.5 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col gap-2.5 sm:gap-3"
          >
            {/* Header / Profile Status */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                </span>
                <div>
                  <h4 className="text-xs font-bold tracking-tight text-white leading-none">
                    Shubham Nayani
                  </h4>
                  <p className="text-[9px] font-mono-tech uppercase tracking-widest text-white/50 mt-1">
                    Available for projects
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close popup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. Phone Number Action */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-1.5 text-[10px] font-mono-tech uppercase tracking-wider text-white/50">
                  <Phone className="w-3 h-3 text-white/70" />
                  <span>Phone Number</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="inline-flex items-center space-x-1 text-[9px] font-mono-tech uppercase tracking-wider text-white/60 hover:text-white transition-colors px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20"
                  title="Copy phone number"
                >
                  {copiedPhone ? (
                    <>
                      <Check className="w-2.5 h-2.5 text-white" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-2.5 h-2.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <a
                href="tel:+919427209737"
                className="flex items-center justify-between pt-1 group"
                aria-label="Call +91 94272 09737"
              >
                <span className="text-sm font-semibold tracking-wide font-mono-tech text-white group-hover:text-white/80 transition-colors">
                  +91 94272 09737
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 group-hover:bg-neutral-200 transition-colors">
                  <span>Call</span>
                  <ArrowUpRight className="w-2.5 h-2.5" />
                </span>
              </a>
            </div>

            {/* 2. WhatsApp Button */}
            <a
              href="https://wa.me/919427209737"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white tracking-tight flex items-center space-x-1">
                    <span>WhatsApp</span>
                  </div>
                  <div className="text-[10px] text-white/50 font-mono-tech">
                    Direct instant chat
                  </div>
                </div>
              </div>
              <div className="p-1.5 rounded-full bg-white/10 group-hover:bg-white group-hover:text-black transition-colors">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </a>

            {/* 3. Inquiry Button */}
            <button
              type="button"
              onClick={handleInquiryClick}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold transition-all shadow-md group active:scale-[0.98]"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold tracking-tight">
                    Project Inquiry
                  </div>
                  <div className="text-[10px] text-black/60 font-mono-tech uppercase tracking-wider">
                    Estimate & Brief
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Small Pop-up Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close contact menu' : 'Open contact menu'}
        className="relative group flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#111111] text-white border border-white/20 hover:border-white/40 shadow-[0_10px_35px_rgba(0,0,0,0.5)] hover:scale-105 active:scale-95 transition-all duration-200"
      >
        {/* Status indicator pulse dot */}
        <span className="absolute top-0 right-0 -mt-0.5 -mr-0.5 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white border-2 border-black" />
        </span>

        {/* Dynamic Icon */}
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close-icon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-5 h-5 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="contact-icon"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center"
            >
              <MessageSquare className="w-5 h-5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};
