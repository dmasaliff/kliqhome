import { GoogleGenerativeAI } from "@google/generative-ai";
import services from "@/data/services.json";
import { NextResponse } from "next/server";

// 1. Inisialisasi API Key & Model di LUAR fungsi POST agar lebih stabil (Singleton)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: {
    role: "system",
    parts: [{
      text: `
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
      `
    }]
  }
}, { apiVersion: 'v1' });

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Pesan kosong" }, { status: 400 });
    }

    // 2. Langsung panggil generateContent karena model sudah punya instruksi di atas
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("DEBUG ERROR KLIQ AI:", error);

    // Handler khusus untuk server sibuk (503)
    if (error.status === 503 || error.message?.includes("503")) {
      return NextResponse.json({
        text: "Maaf Kak, asisten AI lagi ramai banget nih 🙏. Langsung chat admin via WA ya di 085726129692!"
      });
    }

    return NextResponse.json({ error: "Gagal memproses chat", details: error.message }, { status: 500 });
  }
}