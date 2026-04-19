import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phoneNumber = process.env.WHATSAPP_NUMBER;
  const defaultMessage = "Hola Z-RAI. Solicito una consultoría técnica para un proyecto de infraestructura. ¿Cómo podemos coordinar?";
  const message = encodeURIComponent(searchParams.get('text') || defaultMessage);

  if (!phoneNumber) {
    return NextResponse.json({ error: "Configuration not found" }, { status: 500 });
  }

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  
  return NextResponse.redirect(whatsappUrl);
}
