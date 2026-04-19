import { NextResponse } from "next/server";

export async function GET() {
  const phoneNumber = process.env.WHATSAPP_NUMBER;
  const message = encodeURIComponent("Hola Z-RAI, me gustaría obtener una consulta técnica sobre mis proyectos.");

  if (!phoneNumber) {
    return NextResponse.json({ error: "Configuration not found" }, { status: 500 });
  }

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  
  return NextResponse.redirect(whatsappUrl);
}
