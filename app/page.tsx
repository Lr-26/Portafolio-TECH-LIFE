"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { useLanguage } from "./context/LanguageContext";

/* --- NEW CHATBOT COMPONENT --- */
const ChatBot = ({ locale }: { locale: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<{ type: 'bot' | 'user', text: string }[]>([
    { type: 'bot', text: locale === 'es' ? '¡Hola! Soy el asistente de Z-RAI. Estoy aquí para guiarte a través de nuestras capacidades de IA de vanguardia. ¿En qué puedo ayudarte?' : 'Hello! I am the Z-RAI assistant. I am here to guide you through our cutting-edge AI capabilities. How can I assist you?' }
  ]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const handleQuery = (query: string) => {
    if (!query.trim()) return;
    const q = query.toLowerCase();
    setMessages(prev => [...prev, { type: 'user', text: query }]);
    setInputValue('');
    
    setTimeout(() => {
      let response = '';
      
      // Smart Intent Detection & Knowledge Base with Proactive Follow-ups
      if (q.includes('servicio') || q.includes('service') || q.includes('hacen') || q.includes('do you do')) {
        response = locale === 'es'
          ? 'En Z-RAI nos especializamos en tres pilares: Inteligencia de Datos, Automatización SaaS y Desarrollo de Interfaces de Élite. \n\n¿En qué área específica de tu negocio crees que la IA podría generar el mayor impacto ahora mismo?'
          : 'At Z-RAI we specialize in three pillars: Data Intelligence, SaaS Automation, and Elite Interface development. \n\nIn which specific area of your business do you think AI could generate the greatest impact right now?';
        setTimeout(() => scrollToSection('services'), 6000);
      } 
      else if (q.includes('proceso') || q.includes('process') || q.includes('como trabajan') || q.includes('how do you work')) {
        response = locale === 'es'
          ? 'Nuestro proceso es metódico: Descubrimiento, Arquitectura, Desarrollo y Optimización. \n\n¿Tienes un proyecto con una fecha de lanzamiento definida o estás en una etapa de exploración inicial?'
          : 'Our process is methodical: Discovery, Architecture, Development, and Optimization. \n\nDo you have a project with a defined launch date or are you in an initial exploration stage?';
        setTimeout(() => scrollToSection('process'), 6000);
      }
      else if (q.includes('proyecto') || q.includes('project') || q.includes('portafolio') || q.includes('portfolio') || q.includes('trabajos') || q.includes('work')) {
        response = locale === 'es'
          ? 'Hemos desarrollado desde E-commerce de lujo hasta plataformas SaaS complejas. \n\n¿Buscas una solución para optimizar procesos internos o una plataforma centrada directamente en el usuario final?'
          : 'We have developed everything from luxury E-commerce to complex SaaS platforms. \n\nAre you looking for a solution to optimize internal processes or a platform focused directly on the end user?';
        setTimeout(() => scrollToSection('projects'), 5000);
      }
      else if (q.includes('contacto') || q.includes('contact') || q.includes('hablar') || q.includes('talk') || q.includes('reunion') || q.includes('meeting')) {
        response = locale === 'es'
          ? 'Podemos agendar una llamada de descubrimiento para profundizar en tu visión. \n\n¿Prefieres que conectemos por videollamada o prefieres una auditoría técnica inicial por correo?'
          : 'We can schedule a discovery call to dive into your vision. \n\nWould you prefer a video call or an initial technical audit via email?';
        setTimeout(() => scrollToSection('contact'), 2000);
      }
      else if (q.includes('quienes') || q.includes('who') || q.includes('zrai') || q.includes('empresa') || q.includes('company')) {
        response = locale === 'es'
          ? 'Z-RAI es una vanguardia tecnológica dedicada a redefinir lo posible mediante software de alto rendimiento. \n\n¿Tu empresa ya está utilizando alguna solución de IA o están buscando su primera implementación estratégica?'
          : 'Z-RAI is a technological vanguard dedicated to redefining what is possible through high-performance software. \n\nIs your company already using an AI solution or are you looking for your first strategic implementation?';
      }
      else {
        response = locale === 'es'
          ? 'Entiendo tu punto. El equipo de Z-RAI siempre busca la excelencia técnica. \n\n¿Qué desafío tecnológico te ha traído hoy a nuestro portafolio?'
          : 'I understand your point. The Z-RAI team always strives for technical excellence. \n\nWhat technological challenge has brought you to our portfolio today?';
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
              <span className={styles.brandTitle}>Z-RAI</span>
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
            <input 
              type="text" 
              className={styles.chatInput} 
              placeholder={locale === 'es' ? 'Escribe tu respuesta...' : 'Type your answer...'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleQuery(inputValue)}
            />
            <button className={styles.sendBtn} onClick={() => handleQuery(inputValue)}>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

/* Advanced Dual-Layer Neural Engine: 3D Core + Reactive Fluid Background */
const ParticleEngine = ({ mousePos }: { mousePos: { x: number, y: number, active: boolean } }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let coreParticles: CoreParticle[] = [];
    let dnaParticles: DNAParticle[] = [];
    let isMobile = window.innerWidth < 1024;
    let rotationAngle = 0;
    let pulse = 0;
    let time = 0;

    class CoreParticle {
      x: number; y: number; baseSize: number;
      tx: number; ty: number; tz: number;

      constructor(w: number, h: number, radius: number, i: number, total: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        const phi = Math.acos(-1 + (2 * i) / total);
        const theta = Math.sqrt(total * Math.PI) * phi;
        this.tx = radius * Math.cos(theta) * Math.sin(phi);
        this.ty = radius * Math.sin(theta) * Math.sin(phi);
        this.tz = radius * Math.cos(phi);
        this.baseSize = Math.random() * 4 + 7;
      }

      update(w: number, h: number, mouse: { x: number, y: number, active: boolean }, rotation: number) {
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        const rx = this.tx * cos - this.tz * sin;
        const rz = this.tx * sin + this.tz * cos;
        const perspective = 400 / (400 + rz);
        const finalX = (w * 0.5) + rx * perspective;
        const finalY = (h * 0.5) + this.ty * perspective;
        this.x += (finalX - this.x) * 0.08;
        this.y += (finalY - this.y) * 0.08;
        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 150 * 150) {
            const force = (150 - Math.sqrt(distSq)) / 150;
            this.x += dx * force * 0.05;
            this.y += dy * force * 0.05;
          }
        }
        return { opacity: 0.3 + perspective * 0.7, perspective };
      }

      draw(opacity: number, perspective: number) {
        if (!ctx) return;
        const size = this.baseSize * perspective;
        const cx = this.x, cy = this.y;

        // Matte-Sphere Shading (Realism over Light)
        ctx.beginPath();
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size);
        const isAccent = this.tx % 6 > 0.5; // Significantly more Indigo (~90%), fewer Cyan
        
        if (isAccent) {
          grad.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.4})`); // Duller core
          grad.addColorStop(0.3, `rgba(67, 56, 202, ${opacity * 0.8})`); // Solid Indigo
          grad.addColorStop(0.8, `rgba(30, 27, 75, ${opacity * 0.5})`);
        } else {
          grad.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.3})`);
          grad.addColorStop(0.3, `rgba(8, 145, 178, ${opacity * 0.8})`); // Solid Cyan/Teal
          grad.addColorStop(0.8, `rgba(8, 51, 68, ${opacity * 0.5})`);
        }
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.arc(cx, cy, size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle Specular Reflection (No Glow)
        if (opacity > 0.5) {
          ctx.beginPath();
          ctx.arc(cx - size * 0.35, cy - size * 0.35, size * 0.06, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }
    }

    class DNAParticle {
      x: number; y: number; z: number;
      strand: number; angle: number;
      baseY: number;

      constructor(strand: number, index: number, total: number, w: number, h: number) {
        this.strand = strand;
        this.angle = (index / total) * Math.PI * 8; // Multiple loops
        this.baseY = (index / total) * h;
        this.x = 0; this.y = 0; this.z = 0;
      }

      update(t: number, w: number, h: number) {
        const radius = isMobile ? 120 : 350; // Larger radius to ensure it's visible behind the core
        const speed = 0.4;
        const currentAngle = this.angle + t * speed + (this.strand * Math.PI);
        
        const tx = Math.cos(currentAngle) * radius;
        const tz = Math.sin(currentAngle) * radius;
        
        const perspective = 600 / (600 + tz);
        this.x = (w * 0.5) + tx * perspective;
        this.y = this.baseY;
        this.z = tz;

        // Add some floating
        this.y += Math.sin(t + this.angle) * 15;
      }

      draw(opacity: number) {
        if (!ctx) return;
        const size = (this.z + 200) / 120 + 0.8;
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        
        // Matte DNA strands (Boosted Visibility)
        if (this.strand === 0) {
          ctx.fillStyle = `rgba(0, 242, 255, ${opacity * 0.8})`; 
        } else {
          ctx.fillStyle = `rgba(99, 102, 241, ${opacity * 0.9})`;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const init = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      isMobile = w < 1024;

      coreParticles = [];
      const coreCount = isMobile ? 16 : 24; // Rebalanced for structural clarity
      const coreRadius = isMobile ? 120 : 190; // Large radius for crisp separation
      for (let i = 0; i < coreCount; i++) {
        // Diversified 'Ultra-Large' molecule sizes (range 15 to 60) for depth
        const p = new CoreParticle(w, h, coreRadius, i, coreCount);
        p.baseSize = Math.random() * 45 + 15;
        coreParticles.push(p);
      }

      dnaParticles = [];
      const dnaCount = isMobile ? 50 : 100; // More particles for better definition
      for (let i = 0; i < dnaCount; i++) {
        dnaParticles.push(new DNAParticle(0, i, dnaCount, w, h));
        dnaParticles.push(new DNAParticle(1, i, dnaCount, w, h));
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      const cx = w * 0.5, cy = h * 0.5;

      rotationAngle += 0.01;
      pulse += 0.015;
      time += 0.02;
      const pulseVal = Math.sin(pulse) * 0.15 + 0.85;

      // Draw Neural DNA Helix Background
      ctx.lineWidth = 1;
      for (let i = 0; i < dnaParticles.length; i += 2) {
        const p1 = dnaParticles[i];
        const p2 = dnaParticles[i + 1];
        
        p1.update(time, w, h);
        p2.update(time, w, h);

        const avgZ = (p1.z + p2.z) * 0.5;
        const opacity = (avgZ + 350) / 700 * 0.5; // Boosted opacity logic

        p1.draw(opacity);
        p2.draw(opacity);

        // Matte DNA Rungs
        ctx.beginPath();
        const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        gradient.addColorStop(0, `rgba(8, 145, 178, ${opacity * 0.3})`);
        gradient.addColorStop(1, `rgba(67, 56, 202, ${opacity * 0.3})`);
        
        ctx.strokeStyle = gradient;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Persistent Data-Node details (Matte)
        if (opacity > 0.1) {
          const midX = (p1.x + p2.x) * 0.5;
          const midY = (p1.y + p2.y) * 0.5;
          ctx.beginPath();
          ctx.arc(midX, midY, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.6})`;
          ctx.fill();
        }
      }

      // Draw Core
      const coreMetas: any[] = [];
      coreParticles.forEach((p, i) => {
        const m = p.update(w, h, mousePos, rotationAngle);
        p.draw(m.opacity, m.perspective);
        coreMetas[i] = m;
      });

      // Central Node (Matte)
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.1 * pulseVal})`;
      ctx.fill();

      // High-Definition Structural Mesh (Forms the Circle)
      ctx.lineWidth = 1;
      for (let i = 0; i < coreParticles.length; i++) {
        for (let j = i + 1; j < coreParticles.length; j++) {
          const p1 = coreParticles[i], p2 = coreParticles[j];
          const d2 = (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
          // Connecting lines to form the circular web
          if (d2 < 180 * 180) {
            const alpha = (1 - Math.sqrt(d2) / 180) * 0.15 * coreMetas[i].opacity;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 242, 255, ${alpha})`;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', init);
    init();
    animate();
    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos]);

  return <canvas ref={canvasRef} className={styles.particleCanvas} />;
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
  const [projectSearch, setProjectSearch] = useState('');
  const [contactStatus, setContactStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const heroRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Performance & State Sync (Force refresh for fluidity)
    const APP_VERSION = "2.9.0";
    const storedVersion = localStorage.getItem("zrai_version");
    if (storedVersion !== APP_VERSION) {
      console.log("New version detected, clearing stale cache...");
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem("zrai_version", APP_VERSION);
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        setShowNav(true);
      } else {
        if (currentScrollY > lastScrollY) {
          setShowNav(false);
          setIsMenuOpen(false); // Close menu on scroll
        } else {
          setShowNav(true);
        }
      }
      setLastScrollY(currentScrollY);
    };

    const handleMouseMove = (e: MouseEvent) => {
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
      <nav className={`${styles.nav} ${!showNav ? styles.navHidden : ""} ${isMenuOpen ? styles.navExpanded : ""}`}>
        <ZraiBrand />

        {/* Desktop Links */}
        <div className={styles.navDesktop}>
          <div className={styles.languageSwitcher}>
            <span onClick={() => setLocale("es")} style={{ cursor: 'pointer', opacity: locale === "es" ? 1 : 0.4, transition: '0.3s', color: locale === "es" ? 'var(--primary)' : '#94a3b8', fontWeight: 800 }}>ESP</span>
            <span onClick={() => setLocale("en")} style={{ cursor: 'pointer', opacity: locale === "en" ? 1 : 0.4, transition: '0.3s', color: locale === "en" ? 'var(--primary)' : '#94a3b8', fontWeight: 800 }}>ENG</span>
          </div>

          <div className={styles.navActions}>
            <button className={styles.loginBtn}>{t.nav.login}</button>
            <button className={styles.registerBtn}>{t.nav.register}</button>
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button className={styles.menuToggle} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen : ""}`}>
            <span></span>
            <span></span>
          </div>
        </button>

        {/* Mobile Dropdown Menu */}
        <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuVisible : ""}`}>
          <div className={styles.mobileNavLinks}>
            <button className={styles.loginBtn}>{t.nav.login}</button>
            <button className={styles.registerBtn}>{t.nav.register}</button>
            <div className={styles.mobileLang}>
              <span onClick={() => { setLocale("es"); setIsMenuOpen(false); }}>ESP</span>
              <span onClick={() => { setLocale("en"); setIsMenuOpen(false); }}>ENG</span>
            </div>
          </div>
        </div>
      </nav>

      <header id="hero" className={styles.hero} ref={heroRef} onMouseMove={handleHeroMouseMove} onMouseLeave={() => setMousePos(prev => ({ ...prev, active: false }))}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.reveal}>{t.hero.headline} <span className="gradient-text">{t.hero.accent}</span></h1>
            <p className={styles.reveal} style={{ animationDelay: '0.1s' }}>{t.hero.description}</p>
            <div className={`${styles.reveal} ${styles.heroActions}`} style={{ display: 'flex', gap: '1.5rem', animationDelay: '0.2s', zIndex: 100, flexWrap: 'wrap', justifyContent: 'inherit' }}>
              <button className="btn-primary" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>{locale === "es" ? "Explorar Soluciones" : "Explore Solutions"}</button>
              <button className="btn-outline" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>{t.hero.viewProjects}</button>
            </div>
          </div>

          <div className={styles.heroVisuals}>
            <div className={styles.heroGlow} />
            <div className={styles.particleContainer}>
               <ParticleEngine mousePos={mousePos} />
            </div>
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
