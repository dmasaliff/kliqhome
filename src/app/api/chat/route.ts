import services from "@/data/services.json";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    // Gabungkan instruksi dan pesan jadi satu prompt string
    const prompt = `
      Kamu adalah KLIQ AI, asisten servis AC dari Jabodetabek.
      DATA HARGA: ${JSON.stringify(services)}
      Aturan: Sapa ramah, tanya PK (0.5-1 atau 1.5-2) jika belum ada, kasih harga dari data, arahkan ke WA 085726129692. Maksimal 2-3 kalimat.
      
      User: "${message}"
    `;

    // TEMBAK LANGSUNG KE API V1 (Menghindari masalah SDK/v1beta)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Gagal fetch API Google");
    }

    const aiText = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ text: aiText });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("DEBUG ERROR FINAL:", error);
    return NextResponse.json(
      { text: "Maaf Kak, ada kendala koneksi AI. 🙏 Langsung WA ke 085726129692 ya!" },
      { status: 200 } // Kembalikan 200 agar UI tidak crash
    );
  }
}