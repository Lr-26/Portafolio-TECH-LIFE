"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { useLanguage } from "./context/LanguageContext";

/* --- NEW CHATBOT COMPONENT --- */
const ChatBot = ({ locale }: { locale: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ type: 'bot' | 'user', text: string }[]>([
    { type: 'bot', text: locale === 'es' ? '¡Hola! Soy tu asistente de Z-RAI. ¿En qué puedo ayudarte hoy?' : 'Hello! I am your Z-RAI assistant. How can I help you today?' }
  ]);

  const quickQueries = locale === 'es' 
    ? ['¿Qué servicios ofrecen?', '¿Cómo empezar un proyecto?', 'Ver portafolio'] 
    : ['What services do you offer?', 'How to start a project?', 'View portfolio'];

  const handleQuery = (query: string) => {
    setMessages(prev => [...prev, { type: 'user', text: query }]);
    setTimeout(() => {
      let response = '';
      if (query.includes('servicios') || query.includes('services')) {
        response = locale === 'es' 
          ? 'Desarrollamos sistemas de IA de próxima generación, automatización neuronal y arquitecturas escalables para la élite digital.'
          : 'We develop next-generation AI systems, neural automation, and scalable architectures for the digital elite.';
      } else {
        response = locale === 'es'
          ? 'Interesante consulta. El equipo de Z-RAI está listo para profundizar en tu visión. ¿Deseas agendar una reunión?'
          : 'Interesting inquiry. The Z-RAI team is ready to dive into your vision. Would you like to schedule a meeting?';
      }
      setMessages(prev => [...prev, { type: 'bot', text: response }]);
    }, 600);
  };

  return (
    <>
      <div className={styles.chatFab} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <span style={{ fontSize: '1.2rem', color: '#fff' }}>×</span>
        ) : (
          <div className={styles.neuralPulse}>
            <img src="/zrai-logo-removebg-preview.png" alt="Z-R" width="32" height="auto" style={{ filter: 'brightness(0) invert(1)' }} />
          </div>
        )}
      </div>

      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div className={styles.chatInfo}>
              <div className={styles.neuralStatus} />
              <span className={styles.brandTitle}>Z-RAI NEURAL CORE</span>
            </div>
            <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <div className={styles.chatBody}>
            {messages.map((msg, i) => (
              <div key={i} className={msg.type === 'bot' ? styles.msgBot : styles.msgUser}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className={styles.chatInputArea}>
            <div className={styles.quickActionsContainer}>
              {quickQueries.map((q, i) => (
                <button key={i} onClick={() => handleQuery(q)} className={styles.quickActionBtn}>{q}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* Ultimate 3D Wireframe Brain Particle Engine - Studio Quality */
const ParticleEngine = ({ mousePos, isForming }: { mousePos: { x: number, y: number, active: boolean }, isForming: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // THE "ATLAS NETWORK" - Global AI Core with Orbital Data Rings
  const targetPoints = useMemo(() => {
    const points: { x: number, y: number, z: number, s?: number } [] = [];
    const pCount = 1500;

    // --- FORMING A "NEURAL CORE" (3D ICOSAHEDRON FRAME) ---
    // Phi for icosahedron vertices
    const phi = (1 + Math.sqrt(5)) / 2;
    const vertices = [
        [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
        [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
        [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ];

    const radius = 180;
    const scale = radius;

    // Helper to add lines between vertices
    const addLine = (v1: number[], v2: number[], count: number) => {
        for (let i = 0; i < count; i++) {
            const t = i / count;
            points.push({
                x: (v1[0] + (v2[0] - v1[0]) * t) * scale + 300,
                y: (v1[1] + (v2[1] - v1[1]) * t) * scale + 300,
                z: (v1[2] + (v2[2] - v1[2]) * t) * scale,
                s: 0.9
            });
        }
    };

    // Connect vertices to form the frame
    for (let i = 0; i < vertices.length; i++) {
        for (let j = i + 1; j < vertices.length; j++) {
            const dx = vertices[i][0] - vertices[j][0];
            const dy = vertices[i][1] - vertices[j][1];
            const dz = vertices[i][2] - vertices[j][2];
            const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
            // Icosahedron edge length is 2. The vertices are normalized.
            // Distance between neighbors is exactly 2.
            if (dist < 2.1) {
                addLine(vertices[i], vertices[j], 40);
            }
        }
    }

    // --- INNER QUANTUM NUCLEUS ---
    const coreCount = 400;
    for (let i = 0; i < coreCount; i++) {
        const u = Math.random(); const v = Math.random();
        const theta = u * 2 * Math.PI; const phi_angle = Math.acos(2 * v - 1);
        const r = 40 * Math.pow(Math.random(), 0.5);
        points.push({
            x: r * Math.sin(phi_angle) * Math.cos(theta) + 300,
            y: r * Math.sin(phi_angle) * Math.sin(theta) + 300,
            z: r * Math.cos(phi_angle),
            s: 1.5
        });
    }

    // Ambient floating data stream
    while (points.length < pCount) {
        const r = 250 + Math.random() * 50;
        const theta = Math.random() * 2 * Math.PI;
        const p_z = (Math.random() - 0.5) * 400;
        points.push({
            x: Math.cos(theta) * r + 300,
            y: Math.sin(theta) * r + 300,
            z: p_z,
            s: 0.3
        });
    }

    return points;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    let isMobile = window.innerWidth < 768;

    class Particle {
      x: number; y: number; vx: number; vy: number; size: number;
      tx: number; ty: number; tz: number; 
      constructor(w: number, h: number, target: { x: number, y: number, z: number, s?: number }) {
        this.x = Math.random() * w; this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 2.2; this.vy = (Math.random() - 0.5) * 2.2;
        this.size = (0.8 + Math.random() * 1.5) * (target.s || 1);
        this.tx = target.x; this.ty = target.y;
        this.tz = target.z;
      }
      update(w: number, h: number, forming: boolean, rotation: number) {
        if (forming) {
          const centerX = w * 0.5;
          const dx = this.tx - centerX;
          const dz = this.tz;
          const cos = Math.cos(rotation);
          const sin = Math.sin(rotation);
          const rx = (dx * cos + dz * sin) + centerX;
          const rz = -dx * sin + dz * cos;
          const perspective = (rz + 200) / 400;
          const targetSize = this.size * (0.8 + perspective * 0.6);
          this.x += (rx - this.x) * 0.12 + Math.sin(Date.now() * 0.0035 + this.ty) * 0.45;
          this.y += (this.ty - this.y) * 0.12 + Math.cos(Date.now() * 0.0035 + this.tx) * 0.45;
          return { alpha: 0.1 + perspective * 0.8, size: targetSize };
        } else {
          this.x += this.vx; this.y += this.vy;
          if (this.x < 0 || this.x > w) this.vx *= -1;
          if (this.y < 0 || this.y > h) this.vy *= -1;
          return { alpha: 0.5, size: this.size };
        }
      }
    }

    const init = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      isMobile = w < 768;
      particles = [];

      const densityModifier = isMobile ? 0.4 : 1;
      const pCountLocal = Math.floor(targetPoints.length * densityModifier);

      for (let i = 0; i < pCountLocal; i++) {
        const target = targetPoints[i];
        const realTarget = {
          x: ((target.x / 600) - 0.5) * (isMobile ? 300 : 400) + (w * 0.5),
          y: ((target.y / 600) - 0.5) * (isMobile ? 300 : 400) + (h * 0.5),
          z: target.z,
          s: target.s
        };
        particles.push(new Particle(w, h, realTarget));
      }
    };

    const animate = (time: number) => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width, h = canvas.height;

      const rotation = isForming ? (time * 0.0001) : 0; // Much slower, majestic rotation

      // DELETED: Unprofessional Horizon Ocean Code. Clean 3D is vastly superior.

      // 2. Dynamic Adaptive Node Connections
      const maxConnDist = isForming ? 45 : 120; 
      const connDistSq = maxConnDist * maxConnDist;

      ctx.fillStyle = isForming ? 'rgba(0, 242, 255, 1)' : 'rgba(0, 242, 255, 0.5)';
      particles.forEach((p, i) => {
        const { alpha, size } = p.update(w, h, isForming, rotation);
        ctx.globalAlpha = alpha;
        ctx.beginPath(); ctx.arc(p.x, p.y, size, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1.0;

        // Skip connections for micro-dust to keep the "Atlas Network" crisp
        if (isForming && p.size < 1) return;

        let connections = 0;
        const maxConnections = isForming ? 1 : 2; 

        // Hyper-optimized loop: strict culling guarantees 60 FPS
        for (let j = i + 1; j < Math.min(i + 15, particles.length); j++) {
          if (connections >= maxConnections) break;
          const p2 = particles[j];
          if (isForming && p2.size < 1) continue;

          const dx = p.x - p2.x; const dy = p.y - p2.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < connDistSq) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
            // Ultra-simplified opacity for a cleaner "Neural" look
            ctx.strokeStyle = `rgba(0, 242, 255, ${isForming ? 0.08 : 0.15})`;
            ctx.lineWidth = isForming ? 0.4 : 0.6;
            ctx.stroke();
            connections++;
          }
        }

        if (mousePos.active) {
          const mdx = p.x - mousePos.x; const mdy = p.y - mousePos.y;
          const md2 = mdx * mdx + mdy * mdy;
          if (md2 < 260 * 260) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mousePos.x, mousePos.y);
            ctx.strokeStyle = `rgba(0, 242, 255, ${0.5 * (1 - Math.sqrt(md2) / 260)})`;
            ctx.lineWidth = 1; ctx.stroke();
            p.x -= mdx * 0.04; p.y -= mdy * 0.04;
          }
        }
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', init);
    // Timeout for first init to ensure layout bounds
    setTimeout(init, 50);
    requestAnimationFrame(animate);
    return () => { window.removeEventListener('resize', init); cancelAnimationFrame(animationFrameId); };
  }, [mousePos, isForming, targetPoints]);

  return <canvas ref={canvasRef} className={styles.particleCanvas} />;
};

const NeuralSynapse = ({ isForming }: { isForming: boolean }) => {
  const [mounted, setMounted] = useState(false);
  const [cables, setCables] = useState<any[]>([]);

  useEffect(() => {
    const generatedCables = Array.from({ length: 16 }).map((_, i) => {
      const angle = (i / 16) * Math.PI * 2;
      const length = 200 + Math.random() * 210;
      const endX = 300 + Math.cos(angle) * length;
      const endY = 300 + Math.sin(angle) * length;
      return { d: `M300 300 Q${300 + Math.random() * 50} ${300 + Math.random() * 50} ${endX} ${endY}`, id: i, delay: Math.random() * 5 };
    });
    setCables(generatedCables);
    setMounted(true);
  }, []);

  if (!mounted) return <div style={{ width: 600, height: 600 }} />;

  return (
    <div className={styles.neuralContainer}>
      <svg width="600" height="600" viewBox="0 0 600 600" fill="none" className={styles.neuralSvg}>
        <g style={{ transition: 'opacity 1s ease', opacity: isForming ? 0.3 : 0.09 }}>
          {cables.map(c => <path key={`bg-${c.id}`} d={c.d} stroke="var(--primary)" strokeWidth="1" />)}
        </g>
        <g className={styles.corePulse}>
          <circle cx="300" cy="300" r={isForming ? 85 : 55} fill="var(--primary)" opacity={isForming ? 0.25 : 0.1} style={{ transition: 'all 1s ease', filter: 'blur(10px)' }} />
          <circle cx="300" cy="300" r={isForming ? 40 : 25} fill="var(--primary)" opacity={isForming ? 0.4 : 0.2} style={{ transition: 'all 1s ease', filter: 'blur(5px)' }} />
          <defs>
            <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity="1" />
              <stop offset="60%" stopColor="var(--primary)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="300" cy="300" r={isForming ? 22 : 14} fill="url(#coreGrad)" style={{ transition: 'all 1s ease', filter: 'drop-shadow(0 0 15px var(--primary))' }} />
        </g>
        <g stroke="var(--primary)" strokeWidth="2.8" className={styles.runningLights}>
          {cables.filter((_, i) => i % 3 === 0).map((c) => (
            <path key={`pulse-${c.id}`} d={c.d} strokeDasharray="16 200" style={{ animationDelay: `${c.delay}s`, animationDuration: `${isForming ? 1.8 : 4}s` }} />
          ))}
        </g>
      </svg>
    </div>
  );
};

const ZraiBrand = () => (
  <a href="/" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', textDecoration: 'none' }}>
    <img
      src="/zrai-logo-removebg-preview.png"
      alt="Z-RAI Logo"
      width="140"
      height="auto"
      style={{
        objectFit: 'contain',
        filter: 'drop-shadow(0 0 8px rgba(0, 242, 255, 0.3))'
      }}
    />
  </a>
);

export default function Home() {
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { t, locale, setLocale } = useLanguage();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, active: false });
  const [isForming, setIsForming] = useState(true);
  const [projectSearch, setProjectSearch] = useState('');
  const [contactStatus, setContactStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const heroRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setMounted(true);
    
    // Professional "Cache Clear" / Versioning Logic
    const APP_VERSION = "2.5.0";
    const storedVersion = localStorage.getItem("zrai_version");
    if (storedVersion !== APP_VERSION) {
      console.log("New version detected, clearing stale cache...");
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem("zrai_version", APP_VERSION);
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always show at the very top
      if (currentScrollY < 50) {
        setShowNav(true);
      } else {
        // Hide if scrolling down, show if scrolling up
        if (currentScrollY > lastScrollY) {
          setShowNav(false);
        } else {
          setShowNav(true);
        }
      }
      setLastScrollY(currentScrollY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      // If mouse is near top (top 80px), show nav
      if (e.clientY < 80) {
        setShowNav(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [lastScrollY]);

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top, active: true });
    }
  };

  if (!mounted) return <div style={{ background: '#020617', minHeight: '100vh' }} />;

  return (
    <div className={styles.page}>
      <nav className={`${styles.nav} ${!showNav ? styles.navHidden : ""}`}>
        <ZraiBrand />
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div className={styles.languageSwitcher} style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: '1.5rem' }}>
            <span onClick={() => setLocale("es")} style={{ cursor: 'pointer', opacity: locale === "es" ? 1 : 0.4, transition: '0.3s', color: locale === "es" ? 'var(--primary)' : 'inherit' }}>ESP</span>
            <span onClick={() => setLocale("en")} style={{ cursor: 'pointer', opacity: locale === "en" ? 1 : 0.4, transition: '0.3s', color: locale === "en" ? 'var(--primary)' : 'inherit' }}>ENG</span>
          </div>

          <div className={styles.navActions}>
            <button className={styles.loginBtn}>{t.nav.login}</button>
            <button className={styles.registerBtn}>{t.nav.register}</button>
          </div>
        </div>
      </nav>

      <header id="hero" className={styles.hero} ref={heroRef} onMouseMove={handleHeroMouseMove} onMouseLeave={() => setMousePos(prev => ({ ...prev, active: false }))}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.reveal}>{t.hero.headline} <span className="gradient-text">{t.hero.accent}</span></h1>
            <p className={styles.reveal} style={{ animationDelay: '0.1s' }}>{t.hero.description}</p>
            <div className={styles.reveal} style={{ display: 'flex', gap: '1.25rem', animationDelay: '0.2s', zIndex: 100, flexWrap: 'wrap', justifyContent: 'inherit' }}>
              <button className="btn-primary" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>{locale === "es" ? "Explorar Soluciones" : "Explore Solutions"}</button>
              <button className="btn-outline" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>{t.hero.viewProjects}</button>
            </div>
          </div>
          <div className={styles.heroImageContainer}>
            <div className={styles.heroGlow} />
            <div className={styles.particleContainer}>
              <ParticleEngine mousePos={mousePos} isForming={isForming} />
            </div>
            <NeuralSynapse isForming={isForming} />
          </div>
        </div>
      </header>

      <section id="services" className={styles.section} style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
        <div className={styles.sectionTitle}>
          <h2 className={styles.reveal} style={{ fontSize: '3rem' }}>{t.services.title} <span className="gradient-text">{t.services.accent}</span></h2>
          <p className={styles.reveal} style={{ animationDelay: '0.1s', color: '#94a3b8', marginTop: '1rem', fontSize: '1.2rem' }}>{t.services.description || 'Elevating architecture through pure code.'}</p>
        </div>

        <div className={styles.servicesGrid}>
          {t.services.items.map((service: any, idx: number) => {
            // Custom designed SVG Icons for AI logic
            const SVGs = [
              <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
              <svg key="2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
              <svg key="3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
            ];
            return (
              <div key={idx} className={`${styles.serviceCard} ${styles.reveal}`} style={{ animationDelay: (0.15 + idx * 0.1) + 's' }}>
                <div className={styles.serviceHeader}>
                  <div className={styles.serviceIcon}>
                    {SVGs[idx % SVGs.length]}
                  </div>
                  <div className={styles.serviceNumber}>0{idx + 1}</div>
                </div>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDesc}>{service.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="projects" className={styles.section} style={{ background: 'rgba(10, 15, 30, 0.3)' }}>
        <div className={styles.sectionTitle}>
          <h2 className={styles.reveal}>{t.projects.title} <span className="gradient-text">{t.projects.accent}</span></h2>
          <p className={styles.reveal} style={{ animationDelay: '0.1s', color: '#94a3b8' }}>{t.projects.description}</p>
        </div>

        {/* Dynamic Project Search */}
        <div className={styles.reveal} style={{ maxWidth: '600px', margin: '0 auto 4rem', position: 'relative', animationDelay: '0.2s' }}>
          <div style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, color: 'var(--primary)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <input
            type="text"
            placeholder={locale === 'es' ? 'Filtrar por tecnología o nombre... (ej: E-commerce, SaaS, AI)' : 'Filter by tech or name... (e.g. E-commerce, SaaS, AI)'}
            className={styles.projectSearchInput}
            value={projectSearch}
            onChange={(e) => setProjectSearch(e.target.value)}
            suppressHydrationWarning
            style={{
              width: '100%',
              padding: '1.2rem 1.5rem 1.2rem 4rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              color: '#fff',
              fontSize: '0.95rem',
              outline: 'none',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
            }}
          />
        </div>

        <div className={styles.projectsGrid}>
          {t.projects.items
            .filter((p: any) => {
              const query = projectSearch.toLowerCase();
              return p.title.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query);
            })
            .map((project: any, idx: number) => (
              <a href={project.link} target="_blank" rel="noopener noreferrer" key={project.id} className={`${styles.projectCard} ${styles.reveal}`} style={{ animationDelay: (0.1 + idx * 0.1) + 's', textDecoration: 'none' }}>
                <div className={styles.projectImagePlaceholder}>
                  <img src={project.image} alt={project.title} className={styles.projectImage} />
                  <div className={styles.projectCategory}>{project.category}</div>
                </div>
                <div className={styles.projectContent}>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p className={styles.projectDesc}>{project.description}</p>
                  <div className={styles.projectBtn}>
                    {locale === 'es' ? 'Ver Proyecto' : 'View Project'} ➔
                  </div>
                </div>
              </a>
            ))}
        </div>
      </section>



      <footer className={styles.footerMega}>
        <div className={styles.footerGlow} />
        <section className={styles.footerTop}>
          <div className={styles.reveal}>
            <h2 className={styles.footerCtaTitle}>{locale === 'es' ? '¿Listo para evolucionar?' : 'Ready to evolve?'}</h2>
            <p className={styles.footerCtaDesc}>{locale === 'es' ? 'Hablemos sobre tu próximo proyecto de IA.' : "Let's talk about your next AI project."}</p>
          </div>
          <button className="btn-primary" style={{ padding: '1rem 3rem' }}>{locale === 'es' ? 'Empezar ahora' : 'Get Started'}</button>
        </section>

        <div className={styles.footerMainGrid}>
          <div className={styles.footerInfo}>
            <ZraiBrand />
            <p className={styles.footerBrandDesc}>
              {locale === 'es'
                ? 'Liderando la vanguardia tecnológica con soluciones inteligentes que redefinen lo posible.'
                : 'Leading the technological vanguard with intelligent solutions that redefine what is possible.'}
            </p>
            <div className={styles.footerSocialsList}>
              <a href="#" className={styles.footerSocialLink}>IN</a>
              <a href="#" className={styles.footerSocialLink}>X</a>
              <a href="#" className={styles.footerSocialLink}>GH</a>
            </div>
          </div>

          <div className={styles.footerLinksBlock}>
            <h4>{locale === 'es' ? 'Compañía' : 'Company'}</h4>
            <a href="#hero">{locale === 'es' ? 'Sobre Nosotros' : 'About'}</a>
            <a href="#services">{locale === 'es' ? 'Soluciones' : 'Solutions'}</a>
            <a href="#projects">{locale === 'es' ? 'Trabajos' : 'Works'}</a>
          </div>

          <div className={styles.footerLinksBlock}>
            <h4>{locale === 'es' ? 'Soporte' : 'Support'}</h4>
            <a href="#">{locale === 'es' ? 'Consultoría' : 'Consulting'}</a>
            <a href="#">{locale === 'es' ? 'Legal' : 'Legal'}</a>
            <a href="#">API</a>
          </div>

          <div className={styles.footerNewsletter}>
            <h4>Newsletter</h4>
            <div className={styles.newsletterInputWrap}>
              <input type="email" placeholder="email@agency.com" suppressHydrationWarning />
              <button>→</button>
            </div>
          </div>
        </div>

        <div className={styles.footerCopyright}>
          <p>© 2026 Z-RAI. {locale === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}</p>
        </div>
      </footer>

      {/* --- AI CHATBOT SYSTEM --- */}
      <ChatBot locale={locale} />
    </div>
  );
}
