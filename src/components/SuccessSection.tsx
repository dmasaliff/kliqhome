import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function SuccessSection() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Icon Centang Besar */}
      <div className="bg-[#22C55E] rounded-full p-1 w-48 h-48 flex items-center justify-center shadow-xl shadow-green-100">
        <CheckCircle2 className="text-white w-32 h-32 stroke-[1.5]" />
      </div>

      {/* Teks Konfirmasi */}
      <div className="space-y-4 px-6">
        <h1 className="text-3xl font-extrabold text-[#1A1A1A] leading-tight">
          Pesananmu <br /> berhasil dibuat!
        </h1>
        <p className="text-sm text-black leading-relaxed font-medium">
          Cek WhatsApp kamu untuk detail pesanan. CS kami akan segera menghubungi.
        </p>
      </div>

      {/* Button Chat CS */}
      <Link href="https://wa.me/6285726129692" target="_blank" className="inline-block">
        <Button className="bg-[#007AFF] hover:bg-blue-600 text-white rounded-2xl py-7 px-10 text-lg font-bold shadow-lg flex items-center gap-3 w-full max-w-xs">
          Chat CS Sekarang
          <div className="bg-white rounded-full p-1">
            <Image src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" width={20} height={20} />
          </div>
        </Button>
      </Link>
    </div>
  );
}