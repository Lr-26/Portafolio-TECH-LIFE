"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { useLanguage } from "./context/LanguageContext";

/* Ultimate 3D Wireframe Brain Particle Engine - Studio Quality */
const ParticleEngine = ({ mousePos, isForming }: { mousePos: { x: number, y: number, active: boolean }, isForming: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ADVANCED IMAGE SAMPLING ALGORITHM - Generates a highly realistic and recognizable Neural Brain shape
  const brainTargets = useMemo(() => {
    if (typeof document === 'undefined') return []; // Prevent SSR errors

    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return [];

    const path = new Path2D();
    // Anatomical structure based directly on biological brain profiles
    path.ellipse(240, 220, 85, 75, -0.3, 0, Math.PI * 2); // Frontal
    path.ellipse(330, 175, 105, 75, 0, 0, Math.PI * 2);   // Parietal
    path.ellipse(410, 245, 80, 80, 0.2, 0, Math.PI * 2);  // Occipital
    path.ellipse(310, 290, 95, 65, -0.1, 0, Math.PI * 2); // Temporal
    path.ellipse(390, 330, 60, 45, -0.4, 0, Math.PI * 2); // Cerebellum
    path.ellipse(340, 390, 25, 65, -0.3, 0, Math.PI * 2); // Brain Stem

    // 1. High opacity edges for the "cortex" rim
    ctx.lineWidth = 14;
    ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
    ctx.stroke(path);

    // 2. Low opacity fill for internal "white matter"
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fill(path);

    // 3. Draw internal Sulci (Primary Folds) to mimic deep neural pathways
    ctx.beginPath();
    ctx.moveTo(330, 175); ctx.quadraticCurveTo(350, 245, 310, 290); // Central sulcus
    ctx.moveTo(280, 205); ctx.quadraticCurveTo(290, 245, 240, 275); // Lateral fissure part 1
    ctx.moveTo(380, 205); ctx.quadraticCurveTo(370, 255, 410, 285); // Parieto-occipital
    ctx.lineWidth = 8;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.stroke();

    // Sample pixels mapping alpha density to spawn weight
    const imgData = ctx.getImageData(0, 0, 600, 600).data;
    const candidatePoints: { x: number, y: number, weight: number }[] = [];

    for (let y = 0; y < 600; y += 4) { // Fast subsampling
      for (let x = 0; x < 600; x += 4) {
        const alpha = imgData[(y * 600 + x) * 4 + 3]; // get Alpha channel
        if (alpha > 5) {
          candidatePoints.push({ x, y, weight: alpha });
        }
      }
    }

    // Weighted random selection: favors bright areas (edges & sulci)
    const points: { x: number, y: number }[] = [];
    const pCount = 550; // Increased particle density for brain form

    // Shuffle and sort by weight
    candidatePoints.sort(() => Math.random() - 0.5);
    candidatePoints.sort((a, b) => (b.weight * Math.random()) - (a.weight * Math.random()));

    const scale = 0.65; // Make the brain noticeably smaller (65% of original size)
    for (let i = 0; i < Math.min(pCount, candidatePoints.length); i++) {
      points.push({
        // Scale towards the center (300, 300) and adjust balance offset
        x: (candidatePoints[i].x - 300) * scale + 300 - 15,
        y: (candidatePoints[i].y - 300) * scale + 300 - 20
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
    let horizonParticles: any[] = [];

    const hCount = 90;

    class Particle {
      x: number; y: number; vx: number; vy: number; size: number;
      tx: number; ty: number;
      constructor(w: number, h: number, target: { x: number, y: number }) {
        this.x = Math.random() * w; this.y = Math.random() * h;
        // INCREASED FLUIDITY: 3x faster base movement
        this.vx = (Math.random() - 0.5) * 2.2; this.vy = (Math.random() - 0.5) * 2.2;
        this.size = 0.5 + Math.random() * 1.5;
        this.tx = target.x; this.ty = target.y;
      }
      update(w: number, h: number, forming: boolean) {
        if (forming) {
          // Aggressive snap + much more fluid breathing animation
          this.x += (this.tx - this.x) * 0.16 + Math.sin(Date.now() * 0.0035 + this.ty) * 0.45;
          this.y += (this.ty - this.y) * 0.16 + Math.cos(Date.now() * 0.0035 + this.tx) * 0.45;
        } else {
          this.x += this.vx; this.y += this.vy;
          if (this.x < 0 || this.x > w) this.vx *= -1;
          if (this.y < 0 || this.y > h) this.vy *= -1;
        }
      }
    }

    const init = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const w = canvas.width, h = canvas.height;
      particles = []; horizonParticles = [];

      const pCountLocal = brainTargets.length > 0 ? brainTargets.length : 550;
      for (let i = 0; i < pCountLocal; i++) {
        // Fallback target if empty during SSR
        const target = brainTargets.length > 0 ? brainTargets[i % brainTargets.length] : { x: 300, y: 300 };
        // Scale targets contextually to screen space, shifted perfectly into right column
        const boundingSize = Math.min(w * 0.8, h); // Keep brain proportional without stretching
        const realTarget = {
          // 0.75 moves the center point to 75% horizontally (right half)
          x: ((target.x / 600) - 0.5) * boundingSize + (w * 0.75),
          y: ((target.y / 600) - 0.5) * boundingSize + (h * 0.5)
        };
        particles.push(new Particle(w, h, realTarget));
      }
      for (let i = 0; i < hCount; i++) {
        horizonParticles.push({ x: (i / hCount) * w, baseY: h * 0.8, offset: Math.random() * Math.PI * 2 });
      }
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width, h = canvas.height;

      // 1. Horizon Ocean
      ctx.beginPath(); ctx.strokeStyle = 'rgba(0, 242, 255, 0.12)'; ctx.lineWidth = 0.5;
      horizonParticles.forEach((hp, i) => {
        // INCREASED FLUIDITY: Faster waves
        const waveY = hp.baseY + Math.sin(time * 0.0028 + hp.offset) * 25;
        ctx.beginPath(); ctx.arc(hp.x, waveY, 1.2, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0, 242, 255, 0.3)'; ctx.fill();
        if (i > 0) {
          const prevY = horizonParticles[i - 1].baseY + Math.sin(time * 0.0028 + horizonParticles[i - 1].offset) * 25;
          ctx.beginPath(); ctx.moveTo(horizonParticles[i - 1].x, prevY); ctx.lineTo(hp.x, waveY); ctx.stroke();
        }
      });

      // 2. Dynamic Adaptive Node Connections
      const maxConnDist = isForming ? 55 : 110;
      const connDistSq = maxConnDist * maxConnDist;

      ctx.fillStyle = isForming ? 'rgba(0, 242, 255, 1)' : 'rgba(0, 242, 255, 0.5)';
      particles.forEach((p, i) => {
        p.update(w, h, isForming);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();

        let connections = 0;
        // ULTRA OPTIMIZATION: Check only nearby array neighbors, prevents framedrops
        for (let j = i + 1; j < Math.min(i + 22, particles.length); j++) {
          if (connections > 6) break; // Optimization: max lines per node
          const p2 = particles[j];
          const dx = p.x - p2.x; const dy = p.y - p2.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < connDistSq) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
            const intensity = isForming ? 0.35 : 0.08;
            ctx.strokeStyle = `rgba(0, 242, 255, ${intensity * (1 - Math.sqrt(d2) / maxConnDist)})`;
            ctx.lineWidth = isForming ? 0.8 : 0.4; ctx.stroke();
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
  }, [mousePos, isForming, brainTargets]);

  return <canvas ref={canvasRef} className={styles.particleCanvas} />;
};

const NeuralSynapse = ({ isForming }: { isForming: boolean }) => {
  const [mounted, setMounted] = useState(false);
  const [cables, setCables] = useState<any[]>([]);

  useEffect(() => {
    const generatedCables = Array.from({ length: 36 }).map((_, i) => {
      const angle = (i / 36) * Math.PI * 2;
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
          <circle cx="300" cy="300" r={isForming ? 75 : 45} fill="var(--primary)" opacity={isForming ? 0.35 : 0.15} style={{ transition: 'all 1s ease' }} />
          <circle cx="300" cy="300" r={isForming ? 25 : 15} fill="#fff" opacity="0.9" style={{ filter: 'blur(3.5px)', transition: 'all 1s ease' }} />
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

const TechLifeBrand = () => (
  <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', textDecoration: 'none' }}>
    <svg viewBox="0 0 100 100" width="44" height="44" fill="none" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))' }}>
      <defs>
        {/* Hyper-Vibrant Cyan Gradient */}
        <linearGradient id="metal-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        {/* Polished Chrome Silver */}
        <linearGradient id="metal-silver" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="20%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        
        {/* Glow Filters */}
        <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="ring-neon" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* BACKGROUND BADGE BODY */}
      <circle cx="50" cy="50" r="48" fill="#020617" />
      
      {/* VIBRANT OUTER NEON RING */}
      <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(14, 165, 233, 0.15)" strokeWidth="4" />
      <path d="M 50,4 A 46,46 0 0,1 96,50" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" filter="url(#ring-neon)" />
      
      {/* DEEP INNER CORE PLATE */}
      <circle cx="50" cy="50" r="42" fill="#050615" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

      {/* THE LT MONOGRAM (Scaled and Centered Upper Bound) */}
      <g transform="translate(22, 11) scale(0.50)" filter="url(#neon-glow)">
        {/* BLUE-CYAN "L" */}
        <g>
          <path d="M 25,20 L 25,75 A 5,5 0 0,0 30,80 L 88,80" stroke="url(#metal-cyan)" strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 25,20 L 25,75 A 5,5 0 0,0 30,80 L 88,80" stroke="rgba(255,255,255,0.3)" strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
        </g>

        {/* SILVER "T" */}
        <g>
          <path d="M 52,20 L 88,20 M 70,20 L 70,55" stroke="url(#metal-silver)" strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 52,20 L 88,20 M 70,20 L 70,55" stroke="rgba(255,255,255,0.5)" strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
        </g>
      </g>

      {/* CYAN HORIZONTAL DIVIDER */}
      <line x1="25" y1="72" x2="75" y2="72" stroke="#22d3ee" strokeWidth="1" opacity="0.6" filter="url(#ring-neon)" />
      
      {/* BOTTOM TEXT INSIDE THE BADGE */}
      <text x="50" y="83" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="9" fontWeight="800" fill="url(#metal-silver)" letterSpacing="0.4" textAnchor="middle">AI TECH-LIFE</text>
    </svg>
  </a>
);

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { t, locale, setLocale } = useLanguage();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, active: false });
  const [isForming, setIsForming] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const cycle = setInterval(() => setIsForming(f => !f), 7500);
    return () => clearInterval(cycle);
  }, []);

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top, active: true });
    }
  };

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <TechLifeBrand />
        <div className={styles.navLinks} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div className={styles.languageSwitcher}>
            <span onClick={() => setLocale("es")} style={{ cursor: 'pointer', opacity: locale === "es" ? 1 : 0.3 }}>ESP</span>
            <span style={{ opacity: 0.1 }}>/</span>
            <span onClick={() => setLocale("en")} style={{ cursor: 'pointer', opacity: locale === "en" ? 1 : 0.3 }}>ENG</span>
          </div>
          <button className="btn-primary" style={{ padding: '0.5rem 1.25rem' }}>{t.nav.consultation}</button>
        </div>
      </nav>

      <header id="hero" className={styles.hero} ref={heroRef} onMouseMove={handleHeroMouseMove} onMouseLeave={() => setMousePos(prev => ({ ...prev, active: false }))}>
        <div className={styles.particleOverlay}>
          <ParticleEngine mousePos={mousePos} isForming={isForming} />
        </div>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <h1 className={styles.reveal}>{t.hero.headline} <span className="gradient-text">{t.hero.accent}</span></h1>
          <p className={styles.reveal} style={{ animationDelay: '0.2s', maxWidth: '550px', margin: '0 0 2.5rem' }}>{t.hero.description}</p>
          <div className={styles.reveal} style={{ display: 'flex', gap: '1.25rem', animationDelay: '0.4s', zIndex: 100, position: 'relative' }}>
            <button className="btn-primary" style={{ padding: '0.8rem 1.75rem' }} onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>{locale === "es" ? "Explorar Soluciones" : "Explore Solutions"}</button>
            <button className="btn-outline" style={{ padding: '0.8rem 1.75rem' }} onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>{t.hero.viewProjects}</button>
          </div>
        </div>
        <div className={styles.heroImageContainer} style={{ overflow: 'visible' }}>
          <NeuralSynapse isForming={isForming} />
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
               <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
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
                 <div className={styles.serviceFooter}>
                   <span className={styles.serviceLink}>
                     {locale === 'es' ? 'Explorar caso de éxito' : 'Explore use case'} 
                     <span style={{ fontSize: '1.2rem' }}>➔</span>
                   </span>
                 </div>
               </div>
             );
          })}
        </div>
      </section>



      <footer className={styles.footerMain}>
        <div className={styles.footerGrid}>
          <div className={styles.footerCol}>
            <TechLifeBrand />
            <p style={{ maxWidth: '300px' }}>
              {locale === 'es' 
                ? 'Transformando negocios tradicionales en potencias digitales mediante soluciones de búsqueda inteligente y automatización SaaS de alto rendimiento.' 
                : 'Transforming traditional businesses into digital powerhouses through intelligent search solutions and high-performance SaaS automation.'}
            </p>
          </div>
          
          <div className={styles.footerCol}>
            <h4>{locale === 'es' ? 'Navegación' : 'Navigation'}</h4>
            <ul className={styles.footerLinkList}>
              <li><a href="#hero">{locale === 'es' ? 'Inicio' : 'Home'}</a></li>
              <li><a href="#services">{locale === 'es' ? 'Servicios' : 'Services'}</a></li>
              <li><a href="#process">{locale === 'es' ? 'Proceso' : 'Process'}</a></li>
              <li><a href="#contact">{locale === 'es' ? 'Contacto' : 'Contact'}</a></li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4>{locale === 'es' ? 'Soporte' : 'Support'}</h4>
            <ul className={styles.footerLinkList}>
              <li><a href="#">{locale === 'es' ? 'Documentación' : 'Documentation'}</a></li>
              <li><a href="#">{locale === 'es' ? 'Privacidad' : 'Privacy Policy'}</a></li>
              <li><a href="#">{locale === 'es' ? 'Términos' : 'Terms of Service'}</a></li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4>{locale === 'es' ? 'Nueva Consulta' : 'New Inquiry'}</h4>
            <form className={styles.footerContactForm} onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder={locale === 'es' ? 'Tu email corporativo' : 'Corporate email'} className={styles.footerInput} />
              <textarea placeholder={locale === 'es' ? '¿En qué podemos ayudarte?' : 'How can we help?'} className={`${styles.footerInput} ${styles.footerTextarea}`}></textarea>
              <button className="btn-primary" style={{ padding: '0.8rem' }}>
                {locale === 'es' ? 'Enviar Mensaje' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© 2026 TECHLIFE. {locale === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}</p>
          <div className={styles.socialLinks}>
            <a href="https://linkedin.com" className={styles.socialIcon} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://github.com/Lr-26" className={styles.socialIcon} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://twitter.com" className={styles.socialIcon} target="_blank" rel="noopener noreferrer">Twitter</a>
          </div>
        </div>
      </footer>
      <div className={styles.chatFab} onClick={() => setIsChatOpen(!isChatOpen)}>
        <svg viewBox="0 0 100 100" width="32" height="32" fill="none">
          <path d="M 25,20 L 25,75 A 5,5 0 0,0 30,80 L 88,80" stroke="#fff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 52,20 L 88,20 M 70,20 L 70,55" stroke="#fff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {isChatOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div className={styles.chatInfo}>
              <div className={styles.statusDot}></div>
              <div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9rem', color: '#fff' }}>TECHLIFE AI</p>
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#2dd4bf' }}>Online</p>
              </div>
            </div>
            <span onClick={() => setIsChatOpen(false)} style={{ cursor: 'pointer', color: '#475569', fontSize: '1.2rem' }}>✕</span>
          </div>

          <div className={styles.chatBody}>
            <div className={`${styles.message} ${styles.msgBot}`}>
              {locale === 'es' 
                ? '¡Hola! Soy el asistente de TECHLIFE. ¿En qué proyecto de automatización o búsqueda inteligente estás pensando?' 
                : 'Hello! I am the TECHLIFE assistant. What automation or intelligent search project are you thinking about?'}
            </div>
            <div className={`${styles.message} ${styles.msgUser}`}>
               {locale === 'es' ? 'Quiero escalar mi negocio' : 'I want to scale my business'}
            </div>
            <div className={`${styles.message} ${styles.msgBot}`}>
               {locale === 'es' 
                ? 'Excelente. Analizamos tus cuellos de botella y diseñamos una arquitectura SaaS a medida. ¿Te gustaría agendar una llamada?' 
                : 'Excellent. We analyze your bottlenecks and design a custom SaaS architecture. Would you like to schedule a call?'}
            </div>
          </div>

          <div className={styles.chatInputArea}>
            <input 
              type="text" 
              placeholder={locale === 'es' ? 'Escribe tu mensaje...' : 'Type your message...'} 
              className={styles.chatInput}
            />
            <button className="btn-primary" style={{ padding: '0.6rem 1rem', borderRadius: '10px' }}>➔</button>
          </div>
        </div>
      )}
    </div>
  );
}
