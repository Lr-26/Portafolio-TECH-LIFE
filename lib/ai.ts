/**
 * Z-RAI ELITE RULE-BASED CONSULTANT
 * Sistema expandido de inteligencia local para máxima cobertura y conversión.
 */

export const getNeuralResponse = async (history: any[], currentMessage: string) => {
  const msg = currentMessage.toLowerCase();

  const KNOWLEDGE_BASE: Record<string, string> = {
    greeting: "Señal recibida. Soy el Consultor Neural de Z-RAI. Desplegando capacidades de análisis técnico. ¿Cuál es su requerimiento de arquitectura para hoy?",
    
    projects: "Z-RAI ha desarrollado infraestructuras de alto impacto como Proyecto Rubi (Lujo/Ecommerce), Vértice Extremo (SaaS) y LuxeBite (Gastronomía). Cada uno emplea arquitecturas de baja latencia. [Ver Portafolio Completo](/api/whatsapp)",
    
    ecommerce: "Nuestras soluciones de Ecommerce, lideradas por el estándar de Proyecto Rubi, se enfocan en la conversión extrema mediante Core Web Vitals optimizados y pagos seguros. [Consultar por Ecommerce](/api/whatsapp)",
    
    pricing: "Manejamos inversiones escalables. Para un desglose de presupuesto basado en requerimientos técnicos y objetivos comerciales, le habilito mi línea prioritaria. [Solicitar Presupuesto](/api/whatsapp)",
    
    tech: "Stack de vanguardia: Next.js 15, arquitecturas distribuidas, integración de LLMs, Supabase para persistencia de datos y despliegues atómicos. [Analizar Stack](/api/whatsapp)",
    
    time: "La implementación de una infraestructura de élite suele requerir ciclos de 4 a 8 semanas, dependiendo del nivel de integración de datos requerido. [Agendar Cronograma](/api/whatsapp)",
    
    support: "Z-RAI no solo construye; mantenemos la integridad operativa 24/7 con monitoreo de rendimiento y escalabilidad proactiva. [Consultar Mantenimiento](/api/whatsapp)",
    
    contact: "Protocolo de enlace prioritario activado. Puede conectar directamente con nuestro arquitecto principal aquí: [Conectar con Experto](/api/whatsapp)",
    
    rubi: "Proyecto Rubi: Nuestra infraestructura insignia para marcas de lujo. Incluye optimización de funnel de ventas y diseño de interfaces cinematográficas. [Detalles de Rubi](/api/whatsapp)",
    
    luxebite: "LuxeBite: Gestión inteligente de reservas y pedidos para alta gastronomía, optimizando la carga operativa mediante automatización. [Detalles de LuxeBite](/api/whatsapp)",
  };

  // Lógica de Detección Expandida (Pattern Matching)
  if (msg.includes("hola") || msg.includes("quien") || msg.includes("eres")) return KNOWLEDGE_BASE.greeting;
  if (msg.includes("proyecto") || msg.includes("trabajos") || msg.includes("hecho") || msg.includes("haces")) return KNOWLEDGE_BASE.projects;
  if (msg.includes("tienda") || msg.includes("vender") || msg.includes("ecommerce") || msg.includes("compras")) return KNOWLEDGE_BASE.ecommerce;
  if (msg.includes("precio") || msg.includes("cuanto") || msg.includes("costo") || msg.includes("presupuesto") || msg.includes("vale")) return KNOWLEDGE_BASE.pricing;
  if (msg.includes("tecnologia") || msg.includes("stack") || msg.includes("usas") || msg.includes("programacion")) return KNOWLEDGE_BASE.tech;
  if (msg.includes("tiempo") || msg.includes("tarda") || msg.includes("cuanto demora") || msg.includes("entrega")) return KNOWLEDGE_BASE.time;
  if (msg.includes("mantenimiento") || msg.includes("soporte") || msg.includes("ayuda") || msg.includes("despues")) return KNOWLEDGE_BASE.support;
  if (msg.includes("contacto") || msg.includes("hablar") || msg.includes("mensaje") || msg.includes("escribir") || msg.includes("whatsapp")) return KNOWLEDGE_BASE.contact;
  if (msg.includes("rubi")) return KNOWLEDGE_BASE.rubi;
  if (msg.includes("luxebite") || msg.includes("comida") || msg.includes("restaurante")) return KNOWLEDGE_BASE.luxebite;

  // Cierre Directo (Fallback)
  return `Esa es una variable arquitectónica crítica. Para asegurar la viabilidad técnica de su propuesta, prefiero manejar este análisis por mi línea de enlace segura. [Conectar vía WhatsApp](/api/whatsapp)`;
};
