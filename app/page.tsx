"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { useLanguage } from "./context/LanguageContext";
import { X, CheckCircle, ChevronRight, Mail, User, Building, UserCircle, LogOut } from "lucide-react";
import { supabase } from "../lib/supabase";

/* --- NEW CHATBOT COMPONENT --- */
const ChatBot = ({ locale }: { locale: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<{ type: 'bot' | 'user', text: string }[]>([
    { type: 'bot', text: locale === 'es' ? 'Señal recibida. Soy el Consultor Neural de Z-RAI. Desplegando capacidades de análisis técnico. ¿Cuál es su requerimiento de arquitectura para hoy?' : 'Signal received. I am the Z-RAI Neural Consultant. Deploying technical analysis capabilities. What is your architecture requirement for today?' }
  ]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const handleQuery = async (query: string) => {
    if (!query.trim()) return;
    const q = query.toLowerCase();
    
    // Add user message to UI
    const newUserMsg = { type: 'user' as const, text: query };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    
    try {
      // Connect to the Neural Backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, newUserMsg] 
        })
      });

      const data = await response.json();
      
      if (data.text) {
        setMessages(prev => [...prev, { type: 'bot', text: data.text }]);
        
        // Trigger lead capture after first exchange if not already logged in
        if (messages.length === 1) {
          setTimeout(() => {
            setMessages(prev => [...prev, { 
              type: 'bot', 
              text: locale === 'es' ? 'Veo que buscas soluciones serias. Te invito a registrarte para acceder a mi panel de arquitectura completa.' : 'I see you are looking for serious solutions. I invite you to register to access my full architecture panel.' 
            }]);
            window.dispatchEvent(new CustomEvent('openModal', { detail: 'register' }));
          }, 1500);
        }
        
        // Smart Scroll Actions
        if (q.includes('servicio') || q.includes('service')) {
          setTimeout(() => scrollToSection('services'), 3000);
        } else if (q.includes('proceso') || q.includes('process')) {
          setTimeout(() => scrollToSection('process'), 3000);
        } else if (q.includes('proyecto') || q.includes('project')) {
          setTimeout(() => scrollToSection('projects'), 3000);
        }
      }
    } catch (error) {
      console.error("Neural Link Error:", error);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: locale === 'es' ? 'Error de conexión neuronal.' : 'Neural connection error.' 
      }]);
    }
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
            <div className={styles.chatHeaderActions}>
              <a 
                href="/api/whatsapp" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.whatsappChatLink}
                title={locale === 'es' ? 'Soporte Directo' : 'Direct Support'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.675 1.439 5.662 1.439h.056c6.555 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          </div>
          <div className={styles.chatBody}>
            {messages.map((msg, i) => (
              <div key={i} className={msg.type === 'bot' ? styles.msgBot : styles.msgUser}>
                {msg.text.split(/(\[.*?\]\(.*?\))/g).map((part, idx) => {
                  const match = part.match(/\[(.*?)\]\((.*?)\)/);
                  if (match) {
                    const [_, label, url] = match;
                    return (
                      <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className={styles.chatCta}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.675 1.439 5.662 1.439h.056c6.555 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        {label}
                      </a>
                    );
                  }
                  return part;
                })}
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
      const coreCount = isMobile ? 20 : 32; // Increased density for smaller particles
      const coreRadius = isMobile ? 120 : 190; // Keeping the large separation
      for (let i = 0; i < coreCount; i++) {
        // Precise smaller molecule sizes (range 8 to 22)
        const p = new CoreParticle(w, h, coreRadius, i, coreCount);
        p.baseSize = Math.random() * 14 + 8;
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
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' });
  const heroRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!supabase) return;

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setModalOpen(false); 
      }
    });

    // Inactivity Guard Logic
    const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 Minutes
    const updateActivity = () => { lastActivityRef.current = Date.now(); };
    
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach(evt => document.addEventListener(evt, updateActivity));

    const inactivityInterval = setInterval(() => {
      if (user && (Date.now() - lastActivityRef.current > INACTIVITY_LIMIT)) {
        console.log("Session expired due to inactivity");
        supabase.auth.signOut();
        setIsUserMenuOpen(false);
        // Optional: Trigger a notification or modal
      }
    }, 60000); // Check every minute

    return () => {
      subscription.unsubscribe();
      activityEvents.forEach(evt => document.removeEventListener(evt, updateActivity));
      clearInterval(inactivityInterval);
    };
  }, [user]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'consultation'|'project'|'register'|'login'>('consultation');
  const [modalStatus, setModalStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [modalForm, setModalForm] = useState({ firstName: '', lastName: '', email: '', phone: '', company: '', role: '', message: '', password: '' });

  const openModal = (type: 'consultation'|'project'|'register'|'login') => {
    setModalType(type);
    setModalOpen(true);
    setModalStatus('idle');
    document.body.style.overflow = 'hidden';
  };

  useEffect(() => {
    const handleOpenModal = (e: any) => openModal(e.detail);
    window.addEventListener('openModal', handleOpenModal);
    return () => window.removeEventListener('openModal', handleOpenModal);
  }, []);

  const handleProjectAction = (url: string) => {
    if (user) {
      window.open(url, '_blank');
    } else {
      openModal('project');
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setModalStatus('idle'), 300);
    document.body.style.overflow = 'auto';
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setModalStatus('loading');
    
    // Auto-Trim values for security and integrity
    const trimmedForm = {
      ...modalForm,
      firstName: modalForm.firstName.trim(),
      lastName: modalForm.lastName.trim(),
      email: modalForm.email.trim().toLowerCase(),
      password: modalForm.password.trim(),
      phone: modalForm.phone.trim()
    };

    try {
      if (modalType === 'register') {
        const { error } = await supabase.auth.signUp({
          email: trimmedForm.email,
          password: trimmedForm.password,
          options: {
            data: {
              siteName: 'Z-RAI ELITE',
              first_name: trimmedForm.firstName,
              last_name: trimmedForm.lastName,
              phone: trimmedForm.phone,
            }
          }
        });
        if (error) throw error;
        setModalStatus('success');
      } else if (modalType === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: trimmedForm.email,
          password: trimmedForm.password,
        });
        if (error) throw error;
        setModalStatus('idle');
        setModalOpen(false);
      } else {
        // Handle normal contact/consultation
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: trimmedForm.firstName,
            lastName: trimmedForm.lastName,
            email: trimmedForm.email,
            phone: trimmedForm.phone,
            message: trimmedForm.message,
            metadata: {
              siteName: 'Z-RAI ELITE',
              company: trimmedForm.company,
              role: trimmedForm.role,
              type: modalType,
              url: window.location.href,
              timestamp: new Date().toISOString()
            }
          })
        });

        if (response.ok) {
          setModalStatus('success');
          setModalForm({ firstName: '', lastName: '', email: '', phone: '', company: '', role: '', message: '', password: '' });
        } else {
          setModalStatus('error');
        }
      }
    } catch (error: any) {
      console.error("Auth/Contact Error:", error);
      setModalStatus('error');
      // Briefly show error then reset to idle to let them try again
      setTimeout(() => setModalStatus('idle'), 3000);
    }
  };

  useEffect(() => {
    setMounted(true);

    const APP_VERSION = "2.9.1";
    const storedVersion = localStorage.getItem("zrai_version");
    if (storedVersion !== APP_VERSION) {
      localStorage.setItem("zrai_version", APP_VERSION);
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        setShowNav(true);
      } else {
        if (currentScrollY > lastScrollY) {
          setShowNav(false);
          setIsMenuOpen(false);
        } else {
          setShowNav(true);
        }
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [lastScrollY]);

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top, active: true });
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('loading');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          metadata: {
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          }
        })
      });

      if (response.ok) {
        setContactStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
        setTimeout(() => setContactStatus('idle'), 5000);
      } else {
        setContactStatus('error');
      }
    } catch (error) {
      setContactStatus('error');
    }
  };

  if (!mounted) return <div style={{ background: '#020617', minHeight: '100vh' }} />;

  return (
    <div className={styles.page}>
      <nav className={`${styles.nav} ${!showNav ? styles.navHidden : ""} ${isMenuOpen ? styles.navExpanded : ""}`}>
        <ZraiBrand />

        <div className={styles.navDesktop}>
          <div className={styles.languageSwitcher}>
            <span onClick={() => setLocale("es")} style={{ cursor: 'pointer', opacity: locale === "es" ? 1 : 0.4, transition: '0.3s', color: locale === "es" ? 'var(--primary)' : '#94a3b8', fontWeight: 800 }}>ESP</span>
            <span onClick={() => setLocale("en")} style={{ cursor: 'pointer', opacity: locale === "en" ? 1 : 0.4, transition: '0.3s', color: locale === "en" ? 'var(--primary)' : '#94a3b8', fontWeight: 800 }}>ENG</span>
          </div>

          <div className={styles.navActions}>
            <div className={styles.userMenuContainer} ref={userMenuRef}>
              <button 
                className={styles.userIconBtn} 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-label="User Menu"
              >
                <UserCircle size={28} className={isUserMenuOpen ? styles.activeIcon : ""} />
              </button>

              {isUserMenuOpen && (
                <div className={styles.userDropdown}>
                  {!user ? (
                    <>
                      <button className={styles.dropdownItem} onClick={() => { setIsUserMenuOpen(false); openModal('login'); }}>
                        <User size={16} />
                        {t.nav.login}
                      </button>
                      <button className={styles.dropdownItem} onClick={() => { setIsUserMenuOpen(false); openModal('register'); }}>
                        <CheckCircle size={16} />
                        {t.nav.register}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className={styles.userProfileInfo}>
                        <span className={styles.userName}>{user.email?.split('@')[0]}</span>
                        <span className={styles.userStatus}>Status: Active</span>
                      </div>
                      <div className={styles.dropdownDivider} />
                      <button className={styles.dropdownItem} onClick={async () => { 
                        if (supabase) await supabase.auth.signOut();
                        setIsUserMenuOpen(false); 
                      }}>
                        <LogOut size={16} />
                        {locale === 'es' ? 'Cerrar Sesión' : 'Log Out'}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <button className={styles.menuToggle} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen : ""}`}>
            <span></span>
            <span></span>
          </div>
        </button>

        <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuVisible : ""}`}>
          <div className={styles.mobileNavLinks}>
            <button className={styles.loginBtn} onClick={() => { setIsMenuOpen(false); openModal('register'); }}>{t.nav.login}</button>
            <button className={styles.registerBtn} onClick={() => { setIsMenuOpen(false); openModal('register'); }}>{t.nav.register}</button>
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
              <button className="btn-primary" onClick={() => openModal('consultation')}>{locale === "es" ? "Obtener Consulta" : "Get Consultation"}</button>
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
              <div 
                key={project.id} 
                className={`${styles.projectCard} ${styles.reveal}`} 
                style={{ animationDelay: (0.1 + idx * 0.1) + 's', textDecoration: 'none', cursor: 'pointer' }}
                onClick={() => handleProjectAction(project.link)}
              >
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
              </div>
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
          <button className="btn-primary" style={{ padding: '1rem 3rem' }} onClick={() => openModal('consultation')}>
            {locale === 'es' ? 'Consultar' : 'Consult Now'}
          </button>
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
            <a href="#" onClick={() => window.open('/api/whatsapp', '_blank')}>{locale === 'es' ? 'Consultoría' : 'Consulting'}</a>
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

      {/* --- REGISTRATION MODAL --- */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()} style={{ background: '#0a0f1d', border: '1px solid rgba(0, 242, 255, 0.2)', padding: '3rem', borderRadius: '24px', width: '90%', maxWidth: '500px', position: 'relative', boxShadow: '0 20px 60px rgba(0, 242, 255, 0.1)' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={24} /></button>
            
            {modalStatus === 'success' ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle size={60} color="#00f2ff" style={{ margin: '0 auto 1.5rem' }} />
                <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1rem' }}>{locale === 'es' ? 'Acceso Concedido' : 'Access Granted'}</h3>
                <p style={{ color: '#94a3b8', lineHeight: '1.8' }}>{locale === 'es' ? 'Tu solicitud ha sido encriptada y enviada a nuestro nodo principal. Nos comunicaremos a la brevedad.' : 'Your request has been encrypted and sent to our main node. We will be in touch shortly.'}</p>
                <button onClick={closeModal} className="btn-primary" style={{ marginTop: '2.5rem', width: '100%' }}>{locale === 'es' ? 'Continuar' : 'Continue'}</button>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.5rem' }}>
                  {modalType === 'consultation' ? (locale === 'es' ? 'Protocolo de Consulta' : 'Consultation Protocol') : 
                   modalType === 'register' ? (locale === 'es' ? 'Crea tu Cuenta' : 'Create Account') :
                   modalType === 'project' ? (locale === 'es' ? 'Desbloquear Proyecto' : 'Unlock Project') :
                   (locale === 'es' ? 'Iniciar Sesión' : 'Log In')}
                </h3>
                <p style={{ color: modalStatus === 'error' ? '#ff3e3e' : '#94a3b8', marginBottom: '2rem', fontSize: '0.9rem', transition: '0.3s' }}>
                  {modalStatus === 'error' 
                    ? (locale === 'es' ? 'Error: Credenciales inválidas o datos mal formados.' : 'Error: Invalid credentials or malformed data.')
                    : (locale === 'es' ? 'Ingresa tus credenciales para establecer la conexión con nuestro equipo técnico.' : 'Enter your credentials to establish a connection with our technical team.')}
                </p>
                
                <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <User size={18} color="#64748b" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input type="text" required placeholder={t.contact.form.firstName} value={modalForm.firstName} onChange={e => setModalForm({...modalForm, firstName: e.target.value})} style={{ width: '100%', padding: '12px 15px 12px 45px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none' }} />
                    </div>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <User size={18} color="#64748b" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input type="text" required placeholder={t.contact.form.lastName} value={modalForm.lastName} onChange={e => setModalForm({...modalForm, lastName: e.target.value})} style={{ width: '100%', padding: '12px 15px 12px 45px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none' }} />
                    </div>
                  </div>
                  
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input type="email" required placeholder={t.contact.form.email} value={modalForm.email} onChange={e => setModalForm({...modalForm, email: e.target.value})} style={{ width: '100%', padding: '12px 15px 12px 45px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none' }} />
                  </div>

                  <div style={{ position: 'relative' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    <input type="tel" required placeholder={t.contact.form.phone} value={modalForm.phone} onChange={e => setModalForm({...modalForm, phone: e.target.value})} style={{ width: '100%', padding: '12px 15px 12px 45px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none' }} />
                  </div>

                    {(modalType === 'register' || modalType === 'login') && (
                      <div style={{ position: 'relative' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        <input type="password" required placeholder={locale === 'es' ? 'Contraseña' : 'Password'} value={modalForm.password} onChange={e => setModalForm({...modalForm, password: e.target.value})} style={{ width: '100%', padding: '12px 15px 12px 45px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none' }} />
                      </div>
                    )}

                    {modalType !== 'login' && (
                      <div style={{ position: 'relative' }}>
                        <Building size={18} color="#64748b" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input type="text" placeholder={locale === 'es' ? 'Empresa (Opcional)' : 'Company (Optional)'} value={modalForm.company} onChange={e => setModalForm({...modalForm, company: e.target.value})} style={{ width: '100%', padding: '12px 15px 12px 45px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none' }} />
                      </div>
                    )}
                        
                    {modalType !== 'login' && modalType !== 'register' && (
                      <textarea 
                        required
                        placeholder={t.contact.form.message} 
                        value={modalForm.message} 
                        onChange={e => setModalForm({...modalForm, message: e.target.value})} 
                        style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none', minHeight: '100px', resize: 'vertical' }} 
                      />
                    )}

                  <button type="submit" className="btn-primary" disabled={modalStatus === 'loading'} style={{ width: '100%', marginTop: '0.5rem', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                    {modalStatus === 'loading' ? t.contact.form.sending : 
                     (modalType === 'register' ? (locale === 'es' ? 'Crear Cuenta' : 'Create Account') :
                      modalType === 'login' ? (locale === 'es' ? 'Entrar' : 'Sign In') :
                      (locale === 'es' ? 'Consultar' : 'Consult Now'))}
                    {modalStatus !== 'loading' && <ChevronRight size={18} />}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
