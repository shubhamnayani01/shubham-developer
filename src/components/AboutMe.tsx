import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Clock, 
  Sparkles, 
  MessageCircle, 
  ArrowUpRight
} from 'lucide-react';

export const AboutMe: React.FC = () => {
  const [localTime, setLocalTime] = useState<string>('');

  // Live Gujarat IST Time Clock
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        };
        setLocalTime(new Intl.DateTimeFormat('en-GB', options).format(now));
      } catch {
        setLocalTime('18:15:00');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector('#contact');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="about" className="pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto text-[#111111]">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 pb-5 sm:pb-6 border-b border-black/10">
        <div>
          <div className="inline-flex items-center space-x-2 text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-black/50 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-black/60" />
            <span>About Me · The Human Side</span>
          </div>
          <h2 className="font-serif italic text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#111111] leading-[1.08]">
            Craft over noise. Simple, honest & fast.
          </h2>
        </div>

        {/* Live Badges: Time, Location & Status */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Live Gujarat Time */}
          <div className="flex items-center space-x-2 text-xs font-mono font-medium text-black/80 bg-white/80 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-black/10 shadow-xs backdrop-blur-xs">
            <Clock className="w-3.5 h-3.5 text-black/60" />
            <span>{localTime ? `${localTime} IST` : 'Gujarat, IN'}</span>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-2 text-xs font-mono font-medium text-black/80 bg-white/80 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-black/10 shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-black" />
            <span>Kotda Jadodar, Gujarat</span>
          </div>

          {/* Availability */}
          <div className="flex items-center space-x-2 text-xs font-mono font-medium text-emerald-800 bg-emerald-500/10 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Available for Projects</span>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        
        {/* =========================================================================
            CARD 1: Personal Intro (7 cols on large screens)
           ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="lg:col-span-12 flex flex-col justify-between p-2 sm:p-4 md:p-6 relative max-w-4xl"
        >
          <div className="space-y-5 sm:space-y-6">
            <div className="inline-flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.2em] text-black/50">
              <Sparkles className="w-3.5 h-3.5 text-black/70" />
              <span>Who I Am</span>
            </div>

            <div className="space-y-3">
              <h3 className="font-serif italic text-2xl sm:text-3xl md:text-5xl font-normal text-[#111111] leading-snug">
                Hey, I’m Shubham Nayani.
              </h3>
              <p className="text-black/80 text-base sm:text-lg font-light leading-relaxed">
                I’m a 18-year-old frontend web developer and photographer from Kotda Jadodar, a quiet town in Kutch, Gujarat.
              </p>
            </div>

            <p className="text-black/70 text-sm sm:text-base font-light leading-relaxed">
              I don’t like complicated corporate buzzwords. I simply enjoy building crisp, clean websites that load fast on everyday mobile phones, help regional businesses get found on Google, and convert visitors into real customers.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-black/70">
              <span className="px-3 py-1 rounded-lg bg-black/5 border border-black/10">18 Years Old</span>
              <span className="px-3 py-1 rounded-lg bg-black/5 border border-black/10">Computer Eng. Student</span>
              <span className="px-3 py-1 rounded-lg bg-black/5 border border-black/10">Photographer</span>
              <span className="px-3 py-1 rounded-lg bg-black/5 border border-black/10">Gujarat, India</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-black/10 flex items-center justify-between text-xs font-mono text-black/60">
            <span>Fast Turnaround · 2 to 5 Days</span>
            <span className="text-black/40">Clean Code · Zero Bloat</span>
          </div>
        </motion.div>



        {/* =========================================================================
            ROW 3: Direct Connect Banner
           ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="lg:col-span-12 p-6 sm:p-8 rounded-3xl bg-[#EBEAE8] border border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
        >
          <div className="space-y-1">
            <h4 className="font-serif italic text-xl sm:text-2xl text-[#111111]">
              Need a modern website for your shop, clinic, or portfolio?
            </h4>
            <p className="text-xs sm:text-sm text-black/60 font-light">
              Send me a message with what you need. I usually reply within a couple of hours.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#contact"
              onClick={scrollToContact}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#111111] text-white text-xs font-mono font-medium hover:bg-black transition-colors shadow-xs"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            
            <a
              href="https://wa.me/919925232770"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-full bg-white text-black text-xs font-mono font-medium border border-black/15 hover:border-black/40 transition-colors shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
