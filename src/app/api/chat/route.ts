import { GoogleGenerativeAI } from "@google/generative-ai";
import services from "@/data/services.json";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Inisialisasi model di dalam POST dengan format string sederhana untuk systemInstruction
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" 
    });

    // Kita masukkan instruksi sebagai bagian dari pesan (Prompt Engineering) 
    // agar menghindari error JSON payload "systemInstruction" di Vercel.
    const fullPrompt = `
       Kamu adalah KLIQ AI, asisten servis AC jujur dari Jabodetabek.
        DATA REFERENSI: ${JSON.stringify(services)}
        
        PROTOKOL KOMUNIKASI:
        1. Identifikasi Gejala: Cocokkan keluhan user dengan bagian "diagnostics".
        2. Cek PK: Jika user BELUM menyebutkan PK (0.5-1 atau 1.5-2), kamu WAJIB tanya dulu sebelum kasih harga.
        3. Berikan Estimasi: Ambil harga spesifik dari "services". JANGAN mengarang harga.
        4. Closing: Jika estimasi sudah diberikan, langsung arahkan ke WhatsApp 085726129692.

        GAYA BAHASA:
        - Maksimal 2-3 kalimat. 
        - Ramah (Halo Kak/Pak/Bu) + Emoji 🛠️❄️.
    `;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("DEBUG ERROR:", error);

    if (error.status === 503) {
      return NextResponse.json({ 
        text: "Waduh, asisten AI lagi ramai banget Kak. 🙏 Langsung WA saja ya ke 085726129692!" 
      });
    }

    return NextResponse.json({ error: "Gagal chat", details: error.message }, { status: 500 });
  }
}