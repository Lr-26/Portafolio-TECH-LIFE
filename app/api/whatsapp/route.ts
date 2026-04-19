import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phoneNumber = process.env.WHATSAPP_NUMBER;
  const defaultMessage = "Hola equipo de Z-RAI. He estado analizando su ecosistema técnico y me interesa agendar una consultoría de alto nivel para un proyecto de arquitectura digital escalable. ¿Podrían indicarme su disponibilidad técnica?";
  const message = encodeURIComponent(searchParams.get('text') || defaultMessage);

  if (!phoneNumber) {
    return NextResponse.json({ error: "Configuration not found" }, { status: 500 });
  }

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  
  return NextResponse.redirect(whatsappUrl);
}
