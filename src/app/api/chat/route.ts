import { GoogleGenerativeAI } from "@google/generative-ai";
import services from "@/data/services.json";
import { NextResponse } from "next/server";

// 1. Inisialisasi API Key dari .env
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      
     systemInstruction: `
        Kamu adalah KLIQ AI, asisten servis AC jujur dari Jabodetabek.
        DATA REFERENSI: ${JSON.stringify(services)}
        
        PROTOKOL KOMUNIKASI:
        1. Identifikasi Gejala: Cocokkan keluhan user dengan bagian "diagnostics".
        2. Cek PK: Jika user BELUM menyebutkan PK (0.5-1 atau 1.5-2), kamu WAJIB tanya dulu sebelum kasih harga.
        3. Berikan Estimasi: Ambil harga spesifik dari "services". JANGAN mengarang harga.
        4. Closing: Jika estimasi sudah diberikan, langsung arahkan ke WhatsApp 085726129692 atau klik tombol pesan di web. JANGAN tanya PK lagi jika sudah dijawab sebelumnya.

        GAYA BAHASA:
        - Maksimal 2-3 kalimat. 
        - Ramah (Halo Kak/Pak/Bu) + Emoji 🛠️❄️.
        - Jujur & Transparan: Sebutkan bahwa harga final akan dicek kembali oleh teknisi di lokasi.

        CONTOH LOGIKA:
        User: "AC netes air" -> AI: "Wah, itu kemungkinan saluran pembuangan tersumbat Kak. Kalau boleh tahu, AC-nya ukuran berapa PK ya?"
        User: "1 PK" -> AI: "Untuk 1 PK, biayanya Rp70.000 (Cuci AC Rutin). Kakak bisa langsung pesan di website atau WA ke 085726129692 ya! ❄️"
        `,
    });

    // 4. Jalankan AI
    const result = await model.generateContent(message);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ text });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);

    if (error.status === 503) {
    return NextResponse.json({ 
      text: "Maaf Kak, asisten AI sedang ramai banget. 🙏 Langsung hubungi kami di WA 085726129692 untuk tanya harga & booking ya! ❄️" 
    });
  }

    return NextResponse.json({ error: "Gagal memproses chat" }, { status: 500 });
  }
}