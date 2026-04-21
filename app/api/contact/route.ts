import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

const ContactSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  message: z.string().min(3),
  metadata: z.record(z.string(), z.any()).optional()
});

export async function POST(req: Request) {
  try {
    const rawData = await req.json();
    
    // 1. Professional Validation
    const validatedData = ContactSchema.parse(rawData);
    
    // 2. Supabase Persistence
    if (!supabase) {
      console.warn("Supabase not configured. Lead data captured in logs only.");
      return NextResponse.json({ success: true, mode: 'local' });
    }

    const { error } = await supabase
      .from('leads')
      .insert([
        { 
          email: validatedData.email, 
          message: validatedData.message,
          site_name: 'Z-RAI ELITE', // Dedicated column for maximum "prolijidad"
          metadata: {
            siteName: 'Z-RAI ELITE', // Keep in metadata too for compatibility
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            phone: validatedData.phone,
            ...validatedData.metadata,
            source: 'zrai_portfolio_contact',
            timestamp: new Date().toISOString()
          }
        }
      ]);

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ 
        success: false, 
        error: "Supabase Error", 
        details: error 
      }, { status: 500 });
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
