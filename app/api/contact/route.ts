import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

const ContactSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).optional(),
  message: z.string().min(10),
  metadata: z.record(z.any()).optional()
});

export async function POST(req: Request) {
  try {
    const rawData = await req.json();
    
    // 1. Professional Validation
    const validatedData = ContactSchema.parse(rawData);
    
    // 2. Supabase Persistence
    const { error } = await supabase
      .from('leads')
      .insert([
        { 
          email: validatedData.email, 
          message: validatedData.message,
          metadata: {
            ...validatedData.metadata,
            source: 'zrai_portfolio_contact'
          }
        }
      ]);

    if (error) {
      console.error("Supabase Error:", error);
      // We don't fail the user interaction if DB is down, but we log it
    }

    return NextResponse.json({ 
      success: true, 
      message: "Neural routing complete. Your inquiry is being analyzed by our technical team." 
    }, { status: 200 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data structure", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Neural processing error" }, { status: 500 });
  }
}
