import React, { useState } from 'react';
import { ArrowUpRight, Copy, Check, ArrowUp, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MagneticElement } from './MagneticElement';
import { soundFx } from '../utils/soundEffects';

interface ContactSectionProps {
  onOpenInquiry: () => void;
  onScrollToTop: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenInquiry, onScrollToTop }) => {
  const [copied, setCopied] = useState(false);
  const email = 'shubhamnayani01@gmail.com';

  const handleCopyEmail = () => {
    soundFx.playChime();
    navigator.clipboard.writeText(email);
    setCopied(true);

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.85 },
      colors: ['#000000', '#ffffff', '#888888']
    });

    setTimeout(() => setCopied(false), 2000);
  };

  const socials = [
    { label: 'WhatsApp', href: 'https://wa.me/919427209737' },
    { label: 'Instagram', href: 'https://www.instagram.com/shubhm_nayani' },
    { label: 'GitHub', href: 'https://github.com/shubhamnayani01' },
    { label: 'Call Direct', href: 'tel:+919427209737' }
  ];

  return (
    <footer id="contact" className="pt-24 sm:pt-36 md:pt-48 pb-14 sm:pb-20 px-4 sm:px-6 md:px-10 bg-[#111111] text-white relative overflow-hidden">
      
      <div className="max-w-6xl mx-auto space-y-16 sm:space-y-24 relative z-10">
        
        {/* Main CTA */}
        <div className="space-y-6 sm:space-y-8">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/70">
            Get in Touch
          </span>

          <div className="space-y-2 max-w-4xl">
            <h2 className="font-serif italic text-3xl sm:text-6xl md:text-7xl font-normal tracking-tight text-white leading-[1.05]">
              Let's create something{' '}
              <span className="text-white underline decoration-1 underline-offset-8">
                impactful.
              </span>
            </h2>
          </div>

          <p className="text-xs sm:text-base text-white/70 max-w-md font-light leading-relaxed">
            High-speed web platforms and digital storefronts with 2–5 day turnaround.
          </p>

          {/* Contact Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            
            {/* Copy Email Button */}
            <MagneticElement strength={0.3} onClick={handleCopyEmail}>
              <button
                id="contact-copy-email"
                className="w-full sm:w-auto px-5 sm:px-6 py-3.5 rounded-full bg-white text-[#111111] text-[10px] font-bold tracking-[0.18em] uppercase flex items-center justify-center space-x-2.5 hover:bg-white/90 hover:text-black transition-colors shadow-sm active:scale-95"
                data-cursor="copy"
                data-cursor-text="COPY"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{email}</span>
                {copied ? (
                  <span className="flex items-center space-x-1 text-black bg-white/30 px-2 py-0.5 rounded-full text-[9px] font-bold border border-black/20">
                    <Check className="w-3 h-3 text-black" />
                    <span>COPIED</span>
                  </span>
                ) : (
                  <Copy className="w-3 h-3 opacity-50" />
                )}
              </button>
            </MagneticElement>

            {/* Initiate Brief Button */}
            <MagneticElement strength={0.3} onClick={onOpenInquiry}>
              <button
                id="contact-open-inquiry"
                className="w-full sm:w-auto px-5 sm:px-6 py-3.5 rounded-full border border-white/20 hover:border-white text-white text-[10px] font-bold tracking-[0.18em] uppercase flex items-center justify-center space-x-2 transition-all hover:bg-white/10"
                data-cursor="hover"
              >
                <span>Initiate Project Brief</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white" />
              </button>
            </MagneticElement>

          </div>
        </div>

        {/* Studio Locations */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-white/10 text-xs">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 block mb-1">STUDIO LOCATION</span>
            <p className="text-white font-serif italic text-base">Kotda Jadodar</p>
            <span className="text-white/60 text-xs">Kutch, Gujarat, India (IST)</span>
          </div>

          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 block mb-1">REGIONAL COVERAGE</span>
            <p className="text-white font-serif italic text-base">Kutch & Gujarat</p>
            <span className="text-white/60 text-xs">Full Digital & Web Services</span>
          </div>

          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 block mb-1">PHONE / WHATSAPP</span>
            <p className="text-white font-serif italic text-base">+91 94272 09737</p>
            <span className="text-white/60 text-xs">Available Mon — Sat</span>
          </div>
        </div>

        {/* Social Links & Back to Top */}
        <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-5 text-[10px] font-bold tracking-[0.18em] uppercase">
            {socials.map((soc) => (
              <a
                key={soc.label}
                href={soc.href}
                target="_blank"
                rel="noreferrer"
                className="text-white/70 hover:text-white transition-colors flex items-center space-x-1"
                data-cursor="hover"
              >
                <span>{soc.label}</span>
                <ArrowUpRight className="w-3 h-3 text-white" />
              </a>
            ))}
          </div>

          <MagneticElement strength={0.3} onClick={onScrollToTop}>
            <button
              id="back-to-top-button"
              className="flex items-center space-x-2 px-4 py-2 rounded-full border border-white/20 hover:border-white text-[10px] font-bold tracking-[0.18em] uppercase text-white/70 hover:text-white transition-colors"
              data-cursor="hover"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </MagneticElement>
        </div>

        {/* Footer Note */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px] font-bold tracking-[0.15em] uppercase text-white/40">
          <p>© {new Date().getFullYear()} Shubham Nayani. All Rights Reserved.</p>
          <p className="text-white/50">Web Developer — Gujarat, India</p>
        </div>

      </div>
    </footer>
  );
};
