"use client";

import { useEffect, useState } from "react";
import { RatingStars } from "@/components/RatingStars";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import { submitRatingAction, getTechnicianByBooking } from "@/app/actions/notaratingActions";

export default function RatingPage() {
  const params = useParams();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [technician, setTechnician] = useState<{name: string, id: string} | null>(null);

  useEffect(() => {
    async function loadTech() {
      if (params.id) {
        const data = await getTechnicianByBooking(params.id as string);
        setTechnician(data);
      }
    }
    loadTech();
  }, [params.id]);

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setLoading(true);
    try {
      const bookingId = params.id as string;
      await submitRatingAction({
        id: bookingId,
        rating,
        review
      });
      setIsSubmitted(true);
    } catch (err) {
      alert("Gagal mengirim rating, coba lagi ya kak." + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-[#D9E3F0] p-6 flex flex-col items-center justify-center text-center">
        <div className="bg-white p-8 rounded-[32px] shadow-sm space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Terima Kasih!</h1>
          <p className="text-gray-900">Rating kamu sangat membantu kami menjaga kualitas teknisi KLIQ Home.</p>
          <Button 
            variant="outline" 
            className="mt-4 rounded-xl border-blue-500 text-blue-500"
            onClick={() => window.location.href = '/'}
          >
            Kembali ke Beranda
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#D9E3F0] p-6 flex flex-col items-center font-sans">
      {/* Logo Header */}
      <div className="mb-12 flex items-center gap-1 ml-2">
        <span className="text-[#007AFF] font-black text-2xl tracking-tighter uppercase">Kliq</span>
        <span className="text-gray-700 font-medium text-[12px] pt-3">Home</span>
      </div>

      <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Teks Utama */}
        <h2 className="text-2xl font-extrabold leading-tight text-gray-900 px-2">
          AC sudah <span className="text-[#007AFF]">dingin</span> kembali kak, bantu kami jaga kualitas ya
        </h2>
        
        {/* Card Rating */}
        <div className="bg-white w-full max-w-sm rounded-[32px] p-4 mt-2 shadow-sm space-y-6 flex flex-col items-center">
          <div className="space-y-2">
            <p className="text-[12px] font-black uppercase tracking-[0.2em]">
              BERIKAN RATING UNTUK TEKNISI
            </p>
            <div className="flex items-center justify-center gap-3 mt-5">
               <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">D</div>
               <div className="text-left">
                  <p className="font-bold text-sm leading-none">
                    {technician ? technician.name : "Memuat..."}
                  </p>
                  <p className="text-[10px] text-gray-600">
                    {technician ? `ID : ${technician.id}` : "KLIQ-TECH"}
                  </p>
               </div>
            </div>
          </div>

          {/* Bintang (Komponen yang sudah kita buat) */}
          <RatingStars onRatingChange={(val) => setRating(val)} />

          {/* Input Review Tambahan */}
          <div className="w-full space-y-2">
            <p className="text-[10px] font-bold text-left uppercase">Review (Opsional)</p>
            <Textarea 
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Ceritakan pengalamanmu..." 
              className="border-blue-100 rounded-xl min-h-25 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Tombol Kirim */}
        <div className="w-full max-w-sm pt-4">
          <Button 
            onClick={handleSubmit}
            disabled={rating === 0 || loading}
            className={`w-full py-7 rounded-2xl font-bold text-lg shadow-lg transition-all
              ${rating > 0 ? 'bg-[#007AFF] text-white' : 'bg-blue-600 text-gray-300 cursor-not-allowed'}`}
          >
            {loading ? "Mengirim..." : rating > 0 ? "Kirim Rating" : "Pilih Bintang Dulu"}
          </Button>
        </div>
      </div>
    </main>
  );
}