/**
 * Z-RAI ELITE RULE-BASED CONSULTANT
 * Sistema de inteligencia local infalible para máxima conversión.
 */

export const getNeuralResponse = async (history: any[], currentMessage: string) => {
  const msg = currentMessage.toLowerCase();

  // Diccionario de Respuestas de Élite
  const KNOWLEDGE_BASE: Record<string, string> = {
    greeting: "Señal recibida. Soy el Consultor Neural de Z-RAI. Desplegando capacidades de análisis técnico. ¿Cuál es su requerimiento de arquitectura para hoy?",
    projects: "Nuestras infraestructuras (Rubi, LuxeBite, Aura-Fit) están diseñadas bajo estándares de escalabilidad elástica y rendimiento crítico. [Ver Detalles Técnicos](/api/whatsapp)",
    pricing: "Cada arquitectura es única. Para un desglose de inversión basado en sus requerimientos de latencia y volumen, le habilito mi línea prioritaria. [Solicitar Cotización](/api/whatsapp)",
    tech: "Operamos con un stack de vanguardia: Next.js 15, arquitecturas serverless, optimización de Core Web Vitals y capas de IA adaptativa. [Analizar Stack](/api/whatsapp)",
    contact: "Entendido. Iniciando protocolo de enlace directo. Acceda a mi línea de arquitectura prioritaria aquí: [Conectar con Experto](/api/whatsapp)",
    rubi: "Proyecto Rubi es una arquitectura de E-commerce distribuida diseñada para el segmento de lujo, con optimización total de conversión. [Consultar por Rubi](/api/whatsapp)",
  };

  // Lógica de Detección (Pattern Matching)
  if (msg.includes("hola") || msg.includes("quien") || msg.includes("eres")) return KNOWLEDGE_BASE.greeting;
  if (msg.includes("proyecto") || msg.includes("trabajos") || msg.includes("haces")) return KNOWLEDGE_BASE.projects;
  if (msg.includes("precio") || msg.includes("cuanto") || msg.includes("costo") || msg.includes("presupuesto")) return KNOWLEDGE_BASE.pricing;
  if (msg.includes("tecnologia") || msg.includes("stack") || msg.includes("usas")) return KNOWLEDGE_BASE.tech;
  if (msg.includes("contacto") || msg.includes("hablar") || msg.includes("mensaje") || msg.includes("escribir")) return KNOWLEDGE_BASE.contact;
  if (msg.includes("rubi")) return KNOWLEDGE_BASE.rubi;

  // Respuesta de Cierre Agresivo (Fallback)
  return `Ese es un punto crítico de arquitectura. Requiere un análisis de profundidad que prefiero manejar por mi línea segura para garantizar la integridad técnica. [Conectar vía WhatsApp](/api/whatsapp)`;
};
