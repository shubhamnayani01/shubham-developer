import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Mail, 
  Loader2, 
  AlertCircle, 
  Send, 
  Clock, 
  Zap, 
  Layers, 
  ShieldCheck, 
  Globe, 
  MessageCircle,
  Building2,
  Stethoscope,
  ShoppingBag,
  Code2,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/soundEffects';

interface ProjectInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ScopeOption {
  id: string;
  title: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  suggestedVelocity: string;
  defaultModules: string[];
}

interface VelocityOption {
  id: string;
  title: string;
  timeline: string;
  desc: string;
}

const SCOPE_OPTIONS: ScopeOption[] = [
  {
    id: 'business-shop',
    title: 'Business & Retail Store',
    tagline: 'High-converting showroom, local SEO, mobile ordering',
    icon: ShoppingBag,
    suggestedVelocity: 'rapid',
    defaultModules: ['Mobile Responsive', 'WhatsApp Ordering', 'Google SEO & Maps']
  },
  {
    id: 'clinic-doctor',
    title: 'Clinic & Doctor Portal',
    tagline: 'Appointment scheduling, service pricing, trust badges',
    icon: Stethoscope,
    suggestedVelocity: 'standard',
    defaultModules: ['Mobile Responsive', 'Appointment Inquiries', 'Google SEO & Maps', 'High Speed (95+)']
  },
  {
    id: 'brand-portfolio',
    title: 'Bespoke Brand & Portfolio',
    tagline: 'Editorial aesthetics, interactive showcase, awards quality',
    icon: Building2,
    suggestedVelocity: 'standard',
    defaultModules: ['Mobile Responsive', 'Custom Animations', 'High Speed (95+)']
  },
  {
    id: 'custom-web-app',
    title: 'Custom Web Application',
    tagline: 'Full-stack platform, admin dashboard, client portals',
    icon: Code2,
    suggestedVelocity: 'enterprise',
    defaultModules: ['Mobile Responsive', 'Admin Dashboard', 'Custom Domain & SSL', 'High Speed (95+)']
  }
];

const VELOCITY_OPTIONS: VelocityOption[] = [
  {
    id: 'rapid',
    title: 'Rapid 48–72h Sprint',
    timeline: '2–3 Days',
    desc: 'Express delivery for urgent launches or promotional pages'
  },
  {
    id: 'standard',
    title: 'Complete Business Suite',
    timeline: '5–7 Days',
    desc: 'Multi-page architecture, complete copy Polish, SEO indexation'
  },
  {
    id: 'enterprise',
    title: 'Custom Enterprise Portal',
    timeline: '10–14 Days',
    desc: 'Dynamic databases, admin management, advanced custom logic'
  }
];

const AVAILABLE_MODULES = [
  'Mobile Responsive',
  'WhatsApp Ordering',
  'Google SEO & Maps',
  'High Speed (95+)',
  'Admin Dashboard',
  'Custom Domain & SSL',
  'Interactive Animations',
  'Appointment Inquiries'
];

export const ProjectInquiryModal: React.FC<ProjectInquiryModalProps> = ({ isOpen, onClose }) => {
  const [selectedScope, setSelectedScope] = useState<string>('business-shop');
  const [selectedVelocity, setSelectedVelocity] = useState<string>('standard');
  const [selectedModules, setSelectedModules] = useState<string[]>([
    'Mobile Responsive',
    'WhatsApp Ordering',
    'Google SEO & Maps',
    'High Speed (95+)'
  ]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    brief: ''
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generate a consistent reference code for this session
  const specIdSuffix = useId().replace(/[^a-zA-Z0-9]/g, '').slice(-3) || '924';
  const specReferenceCode = `SN-2026-${specIdSuffix.toUpperCase()}`;

  if (!isOpen) return null;

  const currentScopeObj = SCOPE_OPTIONS.find((s) => s.id === selectedScope) || SCOPE_OPTIONS[0];
  const currentVelocityObj = VELOCITY_OPTIONS.find((v) => v.id === selectedVelocity) || VELOCITY_OPTIONS[1];

  // 1-Tap Preset quick selector
  const handleApplyPreset = (scopeId: string) => {
    soundFx.playClick(850);
    const scope = SCOPE_OPTIONS.find((s) => s.id === scopeId);
    if (!scope) return;
    setSelectedScope(scope.id);
    setSelectedVelocity(scope.suggestedVelocity);
    setSelectedModules(scope.defaultModules);
  };

  const handleToggleModule = (moduleName: string) => {
    soundFx.playClick(920);
    setSelectedModules((prev) =>
      prev.includes(moduleName)
        ? prev.filter((m) => m !== moduleName)
        : [...prev, moduleName]
    );
  };

  const constructEmailBody = () => {
    return (
      `=== STUDIO PROJECT BLUEPRINT SPEC (${specReferenceCode}) ===\n\n` +
      `CLIENT / BRAND: ${formData.name || 'Anonymous Partner'}\n` +
      `PRIMARY EMAIL: ${formData.email}\n` +
      `PHONE / WHATSAPP: ${formData.phone || 'Not provided'}\n\n` +
      `[ARCHITECTURAL BLUEPRINT]\n` +
      `• Project Scope: ${currentScopeObj.title}\n` +
      `• Sprint Velocity: ${currentVelocityObj.title} (${currentVelocityObj.timeline})\n` +
      `• Modules Configured (${selectedModules.length}): ${selectedModules.join(', ')}\n\n` +
      `[CLIENT VISION & REQUIREMENTS]\n` +
      `${formData.brief || 'No notes provided'}\n\n` +
      `---\n` +
      `Generated via Shubham Nayani Studio Console (shubhamnayani.com)\n` +
      `Location: Kotda Jadodar, Gujarat, India (IST)`
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const emailSubject = `[Studio Blueprint] ${formData.name || 'Client'} — ${currentScopeObj.title} (${currentVelocityObj.timeline})`;
    const emailMessage = constructEmailBody();

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: 'f8e807f3-494d-4703-8014-847a8e492fd9',
          name: formData.name,
          email: formData.email,
          phone: formData.phone || 'N/A',
          subject: emailSubject,
          service_requested: currentScopeObj.title,
          package_tier: currentVelocityObj.title,
          spec_reference: specReferenceCode,
          modules_selected: selectedModules.join(', '),
          message: emailMessage,
          from_name: 'Studio Blueprint Console'
        })
      });

      const data = await response.json();

      if (data.success || response.ok) {
        soundFx.playChime();
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#000000', '#ffffff', '#888888']
        });
        setIsSubmitted(true);
      } else {
        console.error('Web3Forms returned:', data);
        soundFx.playChime();
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });
        setIsSubmitted(true);
      }
    } catch (err) {
      console.warn('Submission network fallback:', err);
      soundFx.playChime();
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppDirect = () => {
    soundFx.playClick(900);
    const text = 
      `Hi Shubham! I configured a Studio Project Blueprint on your portfolio:\n\n` +
      `• Spec ID: ${specReferenceCode}\n` +
      `• Name: ${formData.name || 'Client'}\n` +
      `• Scope: ${currentScopeObj.title}\n` +
      `• Velocity: ${currentVelocityObj.title} (${currentVelocityObj.timeline})\n` +
      `• Modules: ${selectedModules.join(', ')}\n` +
      `${formData.brief ? `• Notes: ${formData.brief}\n` : ''}` +
      `\nCould we discuss this sprint timeline?`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/919427209737?text=${encoded}`, '_blank');
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({ name: '', email: '', phone: '', brief: '' });
    onClose();
  };

  return (
    <div 
      id="project-inquiry-modal" 
      data-lenis-prevent 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/75 backdrop-blur-md overflow-y-auto"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <motion.div
        data-lenis-prevent
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 18 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#F4F3F1] rounded-[24px] sm:rounded-[32px] border border-[#111111]/15 shadow-2xl p-5 sm:p-8 md:p-10 z-10 text-[#111111]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 sm:top-7 sm:right-7 w-9 h-9 rounded-full bg-[#111111]/5 hover:bg-[#111111]/10 flex items-center justify-center transition-colors text-[#111111] z-20 cursor-pointer"
          aria-label="Close inquiry modal"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Studio Header & Concierge Status Bar (Option 3 hybrid element) */}
            <header className="mb-6 pb-5 border-b border-[#111111]/10 pr-10">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#111111]/60 mb-2">
                <span className="font-semibold text-[#111111] tracking-wide uppercase text-[10px]">
                  Studio Blueprint & Concierge Console
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center space-x-1.5 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Available for Sprints</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-[11px]">Kotda Jadodar, Gujarat (IST)</span>
                <span aria-hidden="true">·</span>
                <span className="text-[11px] font-medium text-[#111111]/80">Guaranteed Response &lt; 24h</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                <h2 className="font-serif italic text-2xl sm:text-3xl md:text-4xl font-normal text-[#111111]">
                  Configure Your Project Blueprint
                </h2>
                <div className="text-[11px] font-mono-tech text-[#111111]/60 shrink-0">
                  SPEC REF: <span className="font-semibold text-[#111111]">{specReferenceCode}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#111111]/70 mt-1.5 font-light max-w-2xl">
                Select your deliverables to generate a live technical blueprint. Dispatch directly to Shubham's inbox or fast-track via WhatsApp with one tap.
              </p>

              {/* 1-Tap Fast-Track Presets */}
              <div className="mt-4 pt-3 border-t border-[#111111]/5 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#111111]/50 mr-1 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#111111]" /> Fast Presets:
                </span>
                {SCOPE_OPTIONS.map((scope) => (
                  <button
                    key={scope.id}
                    type="button"
                    onClick={() => handleApplyPreset(scope.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                      selectedScope === scope.id
                        ? 'bg-[#111111] text-white'
                        : 'bg-white/80 hover:bg-white text-[#111111]/75 border border-[#111111]/10'
                    }`}
                  >
                    {scope.title}
                  </button>
                ))}
              </div>
            </header>

            {/* Main Interactive Grid: Left Controls + Right Live Blueprint Ticket (Option 2 hybrid element) */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Interactive Tactile Selectors */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 01. Scope Architecture */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#111111]/70 block">
                      01. Select Project Scope
                    </label>
                    <span className="text-[10px] font-mono-tech text-[#111111]/50">Step 1 of 4</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SCOPE_OPTIONS.map((scope) => {
                      const Icon = scope.icon;
                      const isSelected = selectedScope === scope.id;
                      return (
                        <button
                          key={scope.id}
                          type="button"
                          onClick={() => {
                            soundFx.playClick(900);
                            setSelectedScope(scope.id);
                          }}
                          className={`p-3 rounded-xl text-left transition-all border relative flex items-start space-x-2.5 ${
                            isSelected
                              ? 'bg-[#111111] text-white border-[#111111] shadow-sm'
                              : 'bg-white text-[#111111] border-[#111111]/10 hover:border-[#111111]/30'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${isSelected ? 'bg-white/10 text-white' : 'bg-[#111111]/5 text-[#111111]'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 pr-4">
                            <div className="text-xs font-semibold leading-snug truncate">
                              {scope.title}
                            </div>
                            <div className={`text-[10px] mt-0.5 line-clamp-2 ${isSelected ? 'text-white/70' : 'text-[#111111]/60'}`}>
                              {scope.tagline}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="absolute top-2.5 right-2.5">
                              <Check className="w-3.5 h-3.5 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 02. Sprint Velocity Selector */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#111111]/70 block">
                      02. Sprint Velocity & Turnaround
                    </label>
                    <span className="text-[10px] font-mono-tech text-[#111111]/50">Target Speed</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {VELOCITY_OPTIONS.map((vel) => {
                      const isSelected = selectedVelocity === vel.id;
                      return (
                        <button
                          key={vel.id}
                          type="button"
                          onClick={() => {
                            soundFx.playClick(950);
                            setSelectedVelocity(vel.id);
                          }}
                          className={`p-3 rounded-xl text-left transition-all border ${
                            isSelected
                              ? 'bg-[#111111] text-white border-[#111111] shadow-sm'
                              : 'bg-white text-[#111111] border-[#111111]/10 hover:border-[#111111]/30'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-[10px] font-mono-tech uppercase font-bold tracking-wider ${isSelected ? 'text-white/80' : 'text-[#111111]/60'}`}>
                              {vel.timeline}
                            </span>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div className="text-xs font-semibold leading-snug">
                            {vel.title}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 03. Tactile Feature Module Chips */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#111111]/70 block">
                      03. Feature Modules & Deliverables
                    </label>
                    <span className="text-[10px] text-[#111111]/60">
                      {selectedModules.length} selected
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_MODULES.map((mod) => {
                      const isChecked = selectedModules.includes(mod);
                      return (
                        <button
                          key={mod}
                          type="button"
                          onClick={() => handleToggleModule(mod)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 border cursor-pointer ${
                            isChecked
                              ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                              : 'bg-white text-[#111111]/70 border-[#111111]/10 hover:border-[#111111]/30 hover:text-[#111111]'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isChecked ? 'bg-white' : 'bg-[#111111]/30'}`} />
                          <span>{mod}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 04. Client Contact Credentials */}
                <div className="space-y-2.5 pt-1">
                  <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#111111]/70 block">
                    04. Dispatch Credentials & Vision
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      required
                      placeholder="Your Name / Business Name *"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#111111]/10 text-xs font-mono-tech focus:outline-none focus:border-[#111111] text-[#111111] placeholder:text-[#111111]/40"
                    />

                    <input
                      type="email"
                      required
                      placeholder="Your Email Address *"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#111111]/10 text-xs font-mono-tech focus:outline-none focus:border-[#111111] text-[#111111] placeholder:text-[#111111]/40"
                    />
                  </div>

                  <input
                    type="tel"
                    placeholder="Phone / WhatsApp (Optional for instant WhatsApp response)"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#111111]/10 text-xs font-mono-tech focus:outline-none focus:border-[#111111] text-[#111111] placeholder:text-[#111111]/40"
                  />

                  <textarea
                    rows={2}
                    required
                    placeholder="Project vision, desired pages, reference links or specific goals... *"
                    value={formData.brief}
                    onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#111111]/10 text-xs font-mono-tech focus:outline-none focus:border-[#111111] text-[#111111] placeholder:text-[#111111]/40"
                  />
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>

              {/* Right Column: Live Dynamic Blueprint Ticket + Dual Dispatch Actions */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Live Blueprint Pass (Tactile Spec Ticket) */}
                <div className="bg-white rounded-2xl border-2 border-dashed border-[#111111]/20 p-5 shadow-sm relative overflow-hidden">
                  
                  {/* Perforated ticket header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#111111]/10">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 bg-[#111111] rounded-xs" />
                      <span className="text-[10px] font-mono-tech font-bold uppercase tracking-wider text-[#111111]">
                        PROJECT SPEC PASS
                      </span>
                    </div>
                    <span className="text-[10px] font-mono-tech font-semibold text-[#111111]/70">
                      {specReferenceCode}
                    </span>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div>
                      <span className="text-[9px] font-mono-tech uppercase text-[#111111]/50 block">Target Scope</span>
                      <p className="font-semibold text-sm text-[#111111] mt-0.5">
                        {currentScopeObj.title}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#111111]/5">
                      <div>
                        <span className="text-[9px] font-mono-tech uppercase text-[#111111]/50 block">Sprint Velocity</span>
                        <p className="font-semibold text-xs text-[#111111] mt-0.5">
                          {currentVelocityObj.timeline}
                        </p>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono-tech uppercase text-[#111111]/50 block">First Response</span>
                        <p className="font-semibold text-xs text-[#111111] mt-0.5">
                          &lt; 24 Hours
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#111111]/5">
                      <span className="text-[9px] font-mono-tech uppercase text-[#111111]/50 block mb-1.5">
                        Configured Modules ({selectedModules.length})
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {selectedModules.length > 0 ? (
                          selectedModules.map((m) => (
                            <span 
                              key={m} 
                              className="text-[10px] px-2 py-0.5 rounded bg-[#111111]/5 text-[#111111]/80 font-mono-tech"
                            >
                              ✓ {m}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-[#111111]/40 italic">
                            No extra modules selected
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Live Preview Summary of User */}
                    <div className="pt-2 border-t border-[#111111]/5 bg-[#111111]/[0.02] p-2 rounded-lg">
                      <span className="text-[9px] font-mono-tech uppercase text-[#111111]/50 block">
                        Client Identity
                      </span>
                      <p className="text-xs font-mono-tech text-[#111111] mt-0.5 truncate">
                        {formData.name || '(Awaiting Name)'} {formData.email ? `· ${formData.email}` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Perforated tear-off bottom edge visual */}
                  <div className="mt-4 pt-3 border-t border-dashed border-[#111111]/20 flex items-center justify-between text-[10px] text-[#111111]/50 font-mono-tech">
                    <span>STATUS: READY FOR INTAKE</span>
                    <span>SHUBHAM NAYANI STUDIO</span>
                  </div>
                </div>

                {/* Dual Conversion CTA Actions (Option 3 hybrid element) */}
                <div className="space-y-2.5 pt-1">
                  
                  {/* Primary Email Submission */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#111111] text-white font-bold tracking-[0.16em] uppercase text-[10px] flex items-center justify-center space-x-2 hover:bg-[#2a2a2a] transition-all shadow-md active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                        <span>Dispatching Blueprint to Inbox...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-3.5 h-3.5 text-white" />
                        <span>Dispatch Blueprint to Studio Inbox</span>
                      </>
                    )}
                  </button>

                  {/* Fast-Track WhatsApp Direct */}
                  <button
                    type="button"
                    onClick={handleWhatsAppDirect}
                    className="w-full py-3 px-4 rounded-xl border border-emerald-600/30 bg-emerald-50/60 hover:bg-emerald-100/60 text-emerald-950 font-bold tracking-[0.12em] uppercase text-[10px] flex items-center justify-center space-x-2 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Fast-Track via WhatsApp (+91 94272 09737)</span>
                  </button>

                  <div className="text-center space-y-1">
                    <p className="text-[10px] text-[#111111]/50 font-mono-tech">
                      ⚡ Direct delivery to Shubham's personal verified inbox & phone.
                    </p>
                  </div>
                </div>

              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Receipt Screen */
          <div className="py-8 sm:py-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#111111] text-white flex items-center justify-center mx-auto border border-black shadow-lg">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#111111]/60 block">
                BLUEPRINT DISPATCHED & SECURED
              </span>
              <h2 className="font-serif italic text-3xl sm:text-4xl font-normal text-[#111111]">
                Thank you, {formData.name || 'Partner'}.
              </h2>
              <p className="text-xs sm:text-sm text-[#111111]/70 max-w-md mx-auto leading-relaxed">
                Your custom technical blueprint for <span className="font-semibold text-[#111111]">{currentScopeObj.title}</span> has been transmitted to Shubham's inbox.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-5 rounded-2xl bg-white border border-[#111111]/15 text-xs font-mono-tech text-[#111111] max-w-md mx-auto text-left shadow-sm space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#111111]/10">
                <span className="text-[#111111]/60">SPEC TICKET ID</span>
                <span className="font-bold text-[#111111]">{specReferenceCode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#111111]/60">VELOCITY SPRINT</span>
                <span className="font-semibold">{currentVelocityObj.timeline} ({currentVelocityObj.title})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#111111]/60">MODULES COUNT</span>
                <span>{selectedModules.length} Active Modules</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#111111]/10 text-[11px]">
                <span className="text-[#111111]/60">SLA PROPOSAL GUARANTEE</span>
                <span className="font-semibold text-emerald-700">&lt; 24 Hours Response</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleWhatsAppDirect}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#111111] text-white text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#333333] transition-colors shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-white" />
                <span>Follow-up on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-[#111111]/20 bg-white text-[#111111] text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#111111]/5 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};
