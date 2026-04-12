"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { useLanguage } from "./context/LanguageContext";

/* Ultimate 3D Wireframe Brain Particle Engine - Studio Quality */
const ParticleEngine = ({ mousePos, isForming }: { mousePos: { x: number, y: number, active: boolean }, isForming: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // THE "ATLAS NETWORK" - Global AI Core with Orbital Data Rings
  const targetPoints = useMemo(() => {
    const points: { x: number, y: number, z: number, s?: number }[] = [];
    const pCount = 1000; // Optimal density for visual weight and 60FPS fluid performance

    // 1. Core Sphere (Global Brain) - 400 points
    const sRadius = 45; // Compact core
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < 400; i++) {
        const y = 1 - (i / (400 - 1)) * 2;
        const radius = Math.sqrt(1 - y * y);
        const theta = phi * i;

        points.push({
            x: Math.cos(theta) * radius * sRadius + 300,
            y: y * sRadius + 300,
            z: Math.sin(theta) * radius * sRadius,
            s: 0.8 
        });
    }

    // 2. Six High-Density Orbital Data Rings - 480 points
    const rings = [
        { r: 65,  count: 80, tiltX: 0.2, tiltZ: 0.1 },
        { r: 75,  count: 80, tiltX: -0.5, tiltZ: 0.3 },
        { r: 85,  count: 80, tiltX: 0.1, tiltZ: -0.6 },
        { r: 95,  count: 80, tiltX: 0.8, tiltZ: 0.2 },
        { r: 105, count: 80, tiltX: -0.2, tiltZ: 0.8 },
        { r: 115, count: 80, tiltX: 0.5, tiltZ: -0.4 }
    ];

    rings.forEach(ring => {
        for (let i = 0; i < ring.count; i++) {
            const angle = (i / ring.count) * Math.PI * 2;
            let px = Math.cos(angle) * ring.r;
            let py = 0;
            let pz = Math.sin(angle) * ring.r;

            // Apply XYZ tilts
            const y1 = py * Math.cos(ring.tiltX) - pz * Math.sin(ring.tiltX);
            const z1 = py * Math.sin(ring.tiltX) + pz * Math.cos(ring.tiltX);
            const x2 = px * Math.cos(ring.tiltZ) - y1 * Math.sin(ring.tiltZ);
            const y2 = px * Math.sin(ring.tiltZ) + y1 * Math.cos(ring.tiltZ);

            points.push({
                x: x2 + 300,
                y: y2 + 300,
                z: z1,
                s: Math.random() > 0.95 ? 2.5 : 0.6 // Tiny dots, rare glowing nodes
            });
        }
    });

    // 3. Stardust Cloud (Ambient particles filling the void) - 600 points
    while (points.length < pCount) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const p = Math.acos(2.0 * v - 1.0);
        const r = 50 + Math.random() * 80; // Tightly packed cloud around the rings
        points.push({
            x: r * Math.sin(p) * Math.cos(theta) + 300,
            y: r * Math.sin(p) * Math.sin(theta) + 300,
            z: r * Math.cos(p),
            s: 0.3 // Micro dust
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

    const hCount = 30; // Further reduced (was 60)

    class Particle {
      x: number; y: number; vx: number; vy: number; size: number;
      tx: number; ty: number; tz: number; // Added TZ for 3D depth
      constructor(w: number, h: number, target: { x: number, y: number, z: number, s?: number }) {
        this.x = Math.random() * w; this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 2.2; this.vy = (Math.random() - 0.5) * 2.2;
        this.size = (0.8 + Math.random() * 1.5) * (target.s || 1); // Much bigger, bold particles
        this.tx = target.x; this.ty = target.y;
        this.tz = target.z; 
      }
      update(w: number, h: number, forming: boolean, rotation: number) {
        if (forming) {
          // TRUE Y-AXIS 3D ROTATION (Left to Right)
          const centerX = w * 0.75;
          const dx = this.tx - centerX;
          const dz = this.tz;

          const cos = Math.cos(rotation);
          const sin = Math.sin(rotation);

          // Rotation Matrix Y-Axis
          const rx = (dx * cos + dz * sin) + centerX;
          const rz = -dx * sin + dz * cos;

          // Perspective scaling based on depth
          const perspective = (rz + 200) / 400; // 0.25 to 0.75 range
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
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const w = canvas.width, h = canvas.height;
      particles = []; horizonParticles = [];

      const pCountLocal = targetPoints.length;
      for (let i = 0; i < pCountLocal; i++) {
        const target = targetPoints[i];

        // Scale targets to screen space
        const realTarget = {
          x: ((target.x / 600) - 0.5) * 400 + (w * 0.75),
          y: ((target.y / 600) - 0.5) * 400 + (h * 0.5),
          z: target.z, // Direct Z from spherical distribution
          s: target.s // Passed size modifier
        };

        const p = new Particle(w, h, realTarget);
        particles.push(p);
      }
      for (let i = 0; i < hCount; i++) {
        horizonParticles.push({ x: (i / hCount) * w, baseY: h * 0.8, offset: Math.random() * Math.PI * 2 });
      }
    };

    const animate = (time: number) => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width, h = canvas.height;

      const rotation = isForming ? (time * 0.0001) : 0; // Much slower, majestic rotation

      // DELETED: Unprofessional Horizon Ocean Code. Clean 3D is vastly superior.

      // 2. Dynamic Adaptive Node Connections
      const maxConnDist = isForming ? 70 : 120; // Reduced for performance optimization
      const connDistSq = maxConnDist * maxConnDist;

      ctx.fillStyle = isForming ? 'rgba(0, 242, 255, 1)' : 'rgba(0, 242, 255, 0.5)';
      particles.forEach((p, i) => {
        const { alpha, size } = p.update(w, h, isForming, rotation);
        ctx.globalAlpha = alpha;
        ctx.beginPath(); ctx.arc(p.x, p.y, size, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1.0;

        let connections = 0;
        // Hyper-optimized loop: strict culling guarantees 60 FPS
        for (let j = i + 1; j < Math.min(i + 10, particles.length); j++) {
          if (connections > 2) break; // Strict connection limit for lightning-fast render
          const p2 = particles[j];
          const dx = p.x - p2.x; const dy = p.y - p2.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < connDistSq) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
            // Ultra-simplified opacity
            ctx.strokeStyle = `rgba(0, 242, 255, ${0.15})`;
            ctx.lineWidth = 0.6;
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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    // Neural core is now permanent as requested
  }, []);

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top, active: true });
    }
  };

  return (
    <div className={styles.page}>
      <nav className={`${styles.nav} ${!showNav ? styles.navHidden : ""}`}>
        <ZraiBrand />
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div className={styles.languageSwitcher} style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: '1.5rem' }}>
            <span onClick={() => setLocale("es")} style={{ cursor: 'pointer', opacity: locale === "es" ? 1 : 0.4, transition: '0.3s', color: locale === "es" ? 'var(--primary)' : 'inherit' }}>ESP</span>
            <span onClick={() => setLocale("en")} style={{ cursor: 'pointer', opacity: locale === "en" ? 1 : 0.4, transition: '0.3s', color: locale === "en" ? 'var(--primary)' : 'inherit' }}>ENG</span>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a href="#" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', textDecoration: 'none', transition: '0.3s' }}>
              {t.nav.login}
            </a>
            <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '8px', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', boxShadow: 'none' }}>
              {t.nav.register}
            </button>
          </div>
        </div>
      </nav>

      <header id="hero" className={styles.hero} ref={heroRef} onMouseMove={handleHeroMouseMove} onMouseLeave={() => setMousePos(prev => ({ ...prev, active: false }))}>
        <div className={styles.particleOverlay}>
          <ParticleEngine mousePos={mousePos} isForming={isForming} />
        </div>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <h1 className={styles.reveal}>{t.hero.headline} <span className="gradient-text">{t.hero.accent}</span></h1>
          <p className={styles.reveal} style={{ animationDelay: '0.1s', maxWidth: '550px', margin: '0 0 2.5rem' }}>{t.hero.description}</p>
          <div className={styles.reveal} style={{ display: 'flex', gap: '1.25rem', animationDelay: '0.2s', zIndex: 100, position: 'relative' }}>
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



      <footer className={styles.footerMain}>
        <div className={styles.footerGrid}>
          <div className={styles.footerCol}>
            <ZraiBrand />
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
            {contactStatus === 'success' ? (
              <div style={{ background: 'rgba(45, 212, 191, 0.1)', border: '1px solid rgba(45, 212, 191, 0.2)', padding: '1.5rem', borderRadius: '12px', color: '#2dd4bf', fontSize: '0.9rem', lineHeight: '1.6' }}>
                {locale === 'es'
                  ? '¡Mensaje enviado con éxito! Nuestro sistema de IA está analizando tu caso y te contactaremos en menos de 24hs.'
                  : 'Message sent successfully! Our AI system is analyzing your case and we will contact you within 24 hours.'}
              </div>
            ) : (
              <form className={styles.footerContactForm} onSubmit={async (e) => {
                e.preventDefault();
                setContactStatus('loading');
                const form = e.currentTarget;
                const email = (form.elements[0] as HTMLInputElement).value;
                const message = (form.elements[1] as HTMLTextAreaElement).value;

                try {
                  const res = await fetch('/api/contact', {
                    method: 'POST',
                    body: JSON.stringify({ email, message }),
                    headers: { 'Content-Type': 'application/json' }
                  });
                  if (res.ok) {
                    setContactStatus('success');
                    form.reset();
                  } else {
                    setContactStatus('error');
                  }
                } catch (err) {
                  setContactStatus('error');
                }
              }}>
                <input type="email" required placeholder={locale === 'es' ? 'Tu email corporativo' : 'Corporate email'} className={styles.footerInput} />
                <textarea required placeholder={locale === 'es' ? '¿En qué podemos ayudarte?' : 'How can we help?'} className={`${styles.footerInput} ${styles.footerTextarea}`}></textarea>
                <button type="submit" className="btn-primary" style={{ padding: '0.8rem' }} disabled={contactStatus === 'loading'}>
                  {contactStatus === 'loading'
                    ? (locale === 'es' ? 'Enviando...' : 'Sending...')
                    : (locale === 'es' ? 'Enviar Mensaje' : 'Send Message')}
                </button>
                {contactStatus === 'error' && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.5rem' }}>{locale === 'es' ? 'Error al enviar. Intente de nuevo.' : 'Failed to send. Try again.'}</p>}
              </form>
            )}
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
    </div>
  );
}
