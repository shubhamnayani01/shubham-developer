import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code2, 
  CheckCircle2, 
  BookOpen, 
  RotateCcw,
  Zap,
  Activity,
  Flame,
  MousePointer,
  Sparkles,
  X
} from 'lucide-react';
import { SIMPLE_SKILLS } from '../data/skillsData';
import { soundFx } from '../utils/soundEffects';

interface NodePosition {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  radius: number;
  label: string;
  shortCode: string;
  isLearning?: boolean;
  isFocus?: boolean;
  level: number;
}

const CLIENT_BENEFITS: Record<string, string> = {
  html5: 'Semantic tag hierarchy, WAI-ARIA accessibility, and fast search indexing.',
  css: 'Fluid responsive layouts and hardware-accelerated animations.',
  js: 'Async event handling, real-time feedback, and zero-lag interactions.',
  react: 'Dynamic component state and seamless client portal experiences.',
  typescript: 'Strict type safety eliminating production runtime issues.',
  'ai-engineering': 'Automated structured workflows and prompt integrations.',
  python: 'Backend microservices, task pipelines, and data orchestration.',
  c: 'Algorithmic efficiency and low-level memory architecture.',
  sql: 'Relational schema design, ACID transactions, and indexed queries.'
};

export const TechnicalSkills: React.FC = () => {
  // Selected & Hovered Node in Constellation (initially null so telemetry detail only appears if user taps any skill)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [isSimulatingPulse, setIsSimulatingPulse] = useState<boolean>(true);
  const [pulseSpeed] = useState<number>(1);

  // Canvas Refs & Physics
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef<string | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);

  const activeSkill = useMemo(() => {
    const currentId = hoveredNodeId || selectedNodeId;
    if (!currentId) return null;
    return SIMPLE_SKILLS.find(s => s.id === currentId) || null;
  }, [hoveredNodeId, selectedNodeId]);

  // Initial Constellation Nodes geometry with natural, generous spacing
  const nodesRef = useRef<NodePosition[]>([
    { id: 'html5', x: 120, y: 95, baseX: 120, baseY: 95, vx: 0, vy: 0, radius: 22, label: 'HTML5', shortCode: 'H5', level: 5 },
    { id: 'css', x: 270, y: 55, baseX: 270, baseY: 55, vx: 0, vy: 0, radius: 22, label: 'CSS', shortCode: 'C3', level: 5 },
    { id: 'js', x: 420, y: 95, baseX: 420, baseY: 95, vx: 0, vy: 0, radius: 22, label: 'JS', shortCode: 'ES', level: 4 },
    { id: 'react', x: 460, y: 195, baseX: 460, baseY: 195, vx: 0, vy: 0, radius: 22, label: 'REACT.JS', shortCode: 'RC', isLearning: true, level: 3 },
    { id: 'typescript', x: 405, y: 295, baseX: 405, baseY: 295, vx: 0, vy: 0, radius: 22, label: 'TYPESCRIPT', shortCode: 'TS', isLearning: true, level: 3 },
    { id: 'sql', x: 270, y: 315, baseX: 270, baseY: 315, vx: 0, vy: 0, radius: 22, label: 'SQL', shortCode: 'SQL', level: 4 },
    { id: 'python', x: 135, y: 295, baseX: 135, baseY: 295, vx: 0, vy: 0, radius: 22, label: 'PYTHON', shortCode: 'PY', level: 4 },
    { id: 'c', x: 80, y: 195, baseX: 80, baseY: 195, vx: 0, vy: 0, radius: 22, label: 'C', shortCode: 'C', level: 3 },
    { id: 'ai-engineering', x: 270, y: 180, baseX: 270, baseY: 180, vx: 0, vy: 0, radius: 32, label: 'AI ENGINEERING', shortCode: 'AI', isFocus: true, level: 4 }
  ]);

  // Constellation Connection Map: Centered on AI with surrounding network connections
  const connections = useMemo(() => [
    // Radial connections from luminous AI center to all skills
    { from: 'ai-engineering', to: 'css', flow: 0.18, dashed: false },
    { from: 'ai-engineering', to: 'js', flow: 0.22, dashed: false },
    { from: 'ai-engineering', to: 'react', flow: 0.25, dashed: true },
    { from: 'ai-engineering', to: 'typescript', flow: 0.28, dashed: true },
    { from: 'ai-engineering', to: 'sql', flow: 0.2, dashed: false },
    { from: 'ai-engineering', to: 'python', flow: 0.24, dashed: false },
    { from: 'ai-engineering', to: 'c', flow: 0.16, dashed: true },
    { from: 'ai-engineering', to: 'html5', flow: 0.15, dashed: false },

    // Surrounding constellation perimeter connections
    { from: 'html5', to: 'css', flow: 0.15, dashed: false },
    { from: 'css', to: 'js', flow: 0.15, dashed: false },
    { from: 'js', to: 'react', flow: 0.2, dashed: false },
    { from: 'react', to: 'typescript', flow: 0.22, dashed: false },
    { from: 'typescript', to: 'sql', flow: 0.18, dashed: false },
    { from: 'sql', to: 'python', flow: 0.2, dashed: false },
    { from: 'python', to: 'c', flow: 0.18, dashed: false },
    { from: 'c', to: 'html5', flow: 0.15, dashed: false },

    // Cross-links
    { from: 'js', to: 'typescript', flow: 0.25, dashed: true }
  ], []);

  // Responsive Canvas Sizing with ResizeObserver - Spreads constellation naturally with ample spacing
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Base design canvas size: 540 x 360
      // Calculate responsive scale factor that preserves wide spacing without clipping on small viewports
      const availableW = Math.max(260, rect.width - 40);
      const availableH = Math.max(220, rect.height - 40);
      const scaleX = availableW / 490;
      const scaleY = availableH / 320;
      const scale = Math.min(Math.max(0.6, Math.min(scaleX, scaleY)), 1.15);

      const centerRadius = Math.round(30 * scale);
      const outerRadius = Math.round(21 * scale);

      // Base design offsets relative to center (270, 180)
      const baseOffsets: Record<string, { ox: number; oy: number }> = {
        'ai-engineering': { ox: 0, oy: 0 },
        css: { ox: 0, oy: -125 },
        js: { ox: 150, oy: -85 },
        react: { ox: 190, oy: 15 },
        typescript: { ox: 135, oy: 115 },
        sql: { ox: 0, oy: 135 },
        python: { ox: -135, oy: 115 },
        c: { ox: -190, oy: 15 },
        html5: { ox: -150, oy: -85 }
      };

      nodesRef.current.forEach(node => {
        const offset = baseOffsets[node.id];
        if (node.id === 'ai-engineering') {
          node.radius = Math.max(24, centerRadius);
          node.baseX = centerX;
          node.baseY = centerY;
        } else {
          node.radius = Math.max(17, outerRadius);
          if (offset) {
            node.baseX = centerX + offset.ox * scale;
            node.baseY = centerY + offset.oy * scale;
          }
        }

        if (!isDraggingRef.current || isDraggingRef.current !== node.id) {
          node.x = node.baseX;
          node.y = node.baseY;
        }
      });
    };

    handleResize();
    const observer = new ResizeObserver(() => handleResize());
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Physics Simulation & Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.016 * pulseSpeed;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Physics update: spring pull back to base position
      const nodes = nodesRef.current;
      nodes.forEach(node => {
        if (isDraggingRef.current === node.id) {
          node.x = mousePosRef.current.x;
          node.y = mousePosRef.current.y;
          node.vx = 0;
          node.vy = 0;
        } else {
          // Spring force
          const dx = node.baseX - node.x;
          const dy = node.baseY - node.y;
          const k = 0.045; // spring constant
          const damping = 0.82; // friction

          node.vx = (node.vx + dx * k) * damping;
          node.vy = (node.vy + dy * k) * damping;
          node.x += node.vx;
          node.y += node.vy;

          // Subtle organic float
          if (isSimulatingPulse) {
            node.x += Math.sin(time * 1.5 + node.baseX * 0.02) * 0.25;
            node.y += Math.cos(time * 1.5 + node.baseY * 0.02) * 0.25;
          }
        }
      });

      // 1. Draw Network Connection Lines (matching image.png)
      connections.forEach(conn => {
        const fromNode = nodes.find(n => n.id === conn.from);
        const toNode = nodes.find(n => n.id === conn.to);
        if (!fromNode || !toNode) return;

        const isHighlighted = 
          (activeSkill ? (activeSkill.id === fromNode.id || activeSkill.id === toNode.id) : false) ||
          (hoveredNodeId === fromNode.id || hoveredNodeId === toNode.id);

        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);

        if (isHighlighted) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
          ctx.lineWidth = 1.8;
          ctx.setLineDash([4, 4]);
          ctx.lineDashOffset = -time * 24;
        } else if (conn.dashed) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
          ctx.lineWidth = 1.2;
          ctx.setLineDash([4, 4]);
          ctx.lineDashOffset = -time * 10;
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
          ctx.lineWidth = 1.2;
          ctx.setLineDash([]);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Animated Energy Pulses
        if (isSimulatingPulse) {
          const pulseT = (time * (conn.flow * 2.2) + (fromNode.baseX + toNode.baseY) * 0.005) % 1;
          const px = fromNode.x + (toNode.x - fromNode.x) * pulseT;
          const py = fromNode.y + (toNode.y - fromNode.y) * pulseT;

          ctx.beginPath();
          ctx.arc(px, py, isHighlighted ? 2.8 : 2, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = isHighlighted ? 8 : 4;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // 2. Draw Nodes (Exact match to image.png)
      nodes.forEach(node => {
        const isSelected = selectedNodeId === node.id;
        const isHovered = hoveredNodeId === node.id;
        const isAi = node.id === 'ai-engineering';

        const effectiveRadius = isHovered 
          ? node.radius * 1.08 
          : isSelected 
          ? node.radius * 1.04 
          : node.radius;

        if (isAi) {
          // ==========================================
          // CENTER NODE "AI": LUMINOUS PURE WHITE (as in image.png)
          // ==========================================
          // Luminous concentric outer halo ring
          ctx.beginPath();
          ctx.arc(node.x, node.y, effectiveRadius + 5, 0, Math.PI * 2);
          ctx.strokeStyle = isHovered || isSelected ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.45)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Solid pure white circular body with glow
          ctx.beginPath();
          ctx.arc(node.x, node.y, effectiveRadius, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = 'rgba(255, 255, 255, 0.65)';
          ctx.shadowBlur = 18;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Crisp white border
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Bold Monospace Black Text "AI"
          ctx.font = `bold ${Math.max(12, Math.round(effectiveRadius * 0.46))}px "JetBrains Mono", monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#000000';
          ctx.fillText('AI', node.x, node.y);
        } else {
          // ==========================================
          // 8 ORBITAL NODES: DARK CHARCOAL WITH WHITE TEXT (as in image.png)
          // ==========================================
          if (isSelected || isHovered) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, effectiveRadius + 4, 0, Math.PI * 2);
            ctx.strokeStyle = isHovered ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.45)';
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }

          // Dark circular disc fill
          ctx.beginPath();
          ctx.arc(node.x, node.y, effectiveRadius, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? '#1E1E26' : isHovered ? '#23232C' : '#121217';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Circular node border
          ctx.beginPath();
          ctx.arc(node.x, node.y, effectiveRadius, 0, Math.PI * 2);
          ctx.strokeStyle = isSelected 
            ? '#FFFFFF' 
            : isHovered 
            ? 'rgba(255, 255, 255, 0.85)' 
            : 'rgba(255, 255, 255, 0.22)';
          ctx.lineWidth = isSelected || isHovered ? 1.5 : 1;
          ctx.stroke();

          // Monospace White ShortCode Label (C3, ES, PY, SQL, RC, TS, C, H5)
          ctx.font = `bold ${Math.max(9.5, Math.round(effectiveRadius * 0.48))}px "JetBrains Mono", monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.95)';
          ctx.fillText(node.shortCode, node.x, node.y);
        }
      });

      ctx.restore();
      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [selectedNodeId, hoveredNodeId, isSimulatingPulse, pulseSpeed, activeSkill?.id, connections]);

  // Pointer Interaction Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mousePosRef.current = { x, y };

    const clicked = nodesRef.current.find(n => {
      const dx = n.x - x;
      const dy = n.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= n.radius + 8;
    });

    if (clicked) {
      soundFx.playClick(1050);
      setSelectedNodeId(clicked.id);
      isDraggingRef.current = clicked.id;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        // pointer capture catch
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mousePosRef.current = { x, y };

    if (!isDraggingRef.current) {
      const hovered = nodesRef.current.find(n => {
        const dx = n.x - x;
        const dy = n.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist <= n.radius + 8;
      });
      setHoveredNodeId(hovered ? hovered.id : null);
      canvas.style.cursor = hovered ? 'pointer' : 'crosshair';
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = null;
      try {
        canvasRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        // release catch
      }
    }
  };

  const handleResetConstellation = () => {
    soundFx.playClick(800);
    nodesRef.current.forEach(n => {
      n.x = n.baseX;
      n.y = n.baseY;
      n.vx = 0;
      n.vy = 0;
    });
  };

  return (
    <section id="skills" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto text-[#111111]">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 pb-5 sm:pb-6 border-b border-black/10">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-black/50 block mb-1.5 sm:mb-2">
            Technical Stack & Architecture
          </span>
          <h2 className="font-serif italic text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#111111] leading-[1.08]">
            Core Skills & Capabilities
          </h2>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-black/70 bg-[#EBEAE8] px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-black/10 self-start sm:self-auto">
          <Code2 className="w-3.5 h-3.5 text-black" />
          <span>Interactive Constellation</span>
        </div>
      </div>

      {/* Main Cockpit: Constellation Canvas (Left) + Telemetry Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        
        {/* 1. LEFT / MAIN: THE INTERACTIVE CONSTELLATION CANVAS */}
        <div className="flex flex-col lg:col-span-7 rounded-2xl sm:rounded-3xl bg-[#0A0A0D] border border-white/15 shadow-xl p-3 sm:p-5 md:p-6 justify-between relative overflow-hidden min-h-[320px] sm:min-h-[380px] md:min-h-[460px]">
          
          {/* Canvas Header Controls */}
          <div className="flex items-center justify-between z-20 pb-2.5 sm:pb-3 border-b border-white/10 text-[9px] sm:text-[10px] font-mono text-white/60">
            <div className="flex items-center space-x-2">
              <Activity className="w-3.5 h-3.5 text-white" />
              <span className="uppercase tracking-widest text-white font-bold text-[9px] sm:text-[10px]">Orbital Physics Canvas</span>
            </div>

            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <button
                onClick={() => setIsSimulatingPulse(!isSimulatingPulse)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg border text-[9px] font-mono uppercase transition-all flex items-center space-x-1 cursor-pointer ${
                  isSimulatingPulse ? 'bg-white/10 border-white/30 text-white' : 'bg-transparent border-white/10 text-white/40'
                }`}
              >
                <Zap className="w-2.5 h-2.5" />
                <span>{isSimulatingPulse ? 'Pulse ON' : 'Pulse OFF'}</span>
              </button>

              <button
                onClick={handleResetConstellation}
                className="p-1 sm:p-1.5 rounded-md sm:rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors cursor-pointer"
                title="Reset node positions"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Interactive HTML5 Canvas Element */}
          <div ref={containerRef} className="relative flex-1 w-full h-full min-h-[260px] sm:min-h-[320px] md:min-h-[370px] my-1 sm:my-2 cursor-crosshair">
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="absolute inset-0 w-full h-full touch-none select-none"
            />

            {/* Micro Helper Note */}
            <div className="absolute bottom-2 left-2 pointer-events-none flex items-center space-x-1.5 text-[8.5px] sm:text-[9px] font-mono text-white/50 bg-black/75 px-2.5 py-0.5 rounded-full border border-white/10 backdrop-blur-md">
              <MousePointer className="w-2.5 h-2.5 text-white" />
              <span>Tap or drag nodes</span>
            </div>
          </div>

          {/* Bottom Quick-Select & Hover Bar */}
          <div className="z-20 pt-2.5 sm:pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
            <span className="text-[8.5px] sm:text-[9px] font-mono text-white/40 uppercase tracking-widest">
              SELECT NODE:
            </span>
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              {SIMPLE_SKILLS.map(skill => {
                const isCurrent = activeSkill?.id === skill.id;
                return (
                  <button
                    key={skill.id}
                    onMouseEnter={() => {
                      soundFx.playClick(900);
                      setHoveredNodeId(skill.id);
                    }}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    onClick={() => {
                      soundFx.playClick(950);
                      setSelectedNodeId(skill.id);
                    }}
                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[9px] sm:text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-white text-black border border-white shadow-md scale-105'
                        : 'bg-[#14141A] text-white/70 border border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {skill.name}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* 2. RIGHT: COMPACT TELEMETRY SPECIFICATION (SHOWN WHEN USER TAPS ANY SKILL) */}
        <div className="lg:col-span-5 rounded-2xl sm:rounded-3xl bg-[#0E0E14] border border-white/15 shadow-xl p-4 sm:p-6 lg:p-7 flex flex-col justify-between text-white relative overflow-hidden min-h-[320px]">
          {/* Subtle Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-white/5 blur-3xl pointer-events-none" />

          <AnimatePresence mode="wait">
            {activeSkill ? (
              <motion.div
                key={activeSkill.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col justify-between h-full space-y-4"
              >
                <div className="space-y-4 relative z-10">
                  {/* Clean Editorial Status Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 gap-2">
                    <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest uppercase text-white/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span>{activeSkill.category}</span>
                      <span>·</span>
                      <span className="text-white/80">{activeSkill.isFocus ? 'Core Focus' : activeSkill.isLearning ? 'Active Expansion' : 'Production Ready'}</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedNodeId(null);
                        setHoveredNodeId(null);
                      }}
                      className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title="Dismiss spec"
                      aria-label="Dismiss spec"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Skill Name & Experience */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-serif italic text-3xl sm:text-4xl font-normal text-white leading-tight">
                        {activeSkill.name}
                      </h3>
                      {activeSkill.experienceMonths && (
                        <span className="font-mono text-[10px] text-white/60 tracking-wider uppercase">
                          {activeSkill.experienceMonths}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono text-white/70">
                      {activeSkill.tagline}
                    </p>
                  </div>

                  {/* Direct Client Benefit Callout */}
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
                      Production Impact
                    </span>
                    <p className="text-xs sm:text-[13px] text-white/90 leading-relaxed font-light">
                      {CLIENT_BENEFITS[activeSkill.id] || activeSkill.description}
                    </p>
                  </div>

                  {/* Capabilities as Clean Inline Text (No Pill Soup) */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 block">
                      Capabilities
                    </span>
                    <p className="text-xs font-mono text-white/75 leading-relaxed">
                      {activeSkill.tags.join('  ·  ')}
                    </p>
                  </div>
                </div>

                {/* Micro Footer Guidance */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/40">
                  <span>Interactive Telemetry</span>
                  <span className="text-white/60">0{SIMPLE_SKILLS.findIndex(s => s.id === activeSkill.id) + 1} / 0{SIMPLE_SKILLS.length}</span>
                </div>
              </motion.div>
            ) : (
              /* State when no skill has been tapped yet */
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6 space-y-4 my-auto"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                  <MousePointer className="w-5 h-5 text-white/50" />
                </div>
                <div className="space-y-1.5 max-w-xs">
                  <h4 className="font-serif italic text-lg sm:text-xl text-white font-normal">
                    Skills Telemetry
                  </h4>
                  <p className="text-xs font-mono text-white/50 leading-relaxed">
                    Select any node in the orbital canvas to inspect architecture specifications.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </section>
  );
};
