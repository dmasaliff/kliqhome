import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessSectionProps {
  customerName: string;
  paymentMethod: "dp" | "full";
  totalHarga: number;
  nominalTransfer: number;
  isHanyaPerbaikan: boolean;
}

export function SuccessSection({ customerName, paymentMethod, totalHarga, nominalTransfer, isHanyaPerbaikan }: SuccessSectionProps) {
  const adminWhatsApp = "6285726129692"; 

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const waMessage = `Halo Admin KLIQ, saya ${customerName} mau konfirmasi pembayaran untuk pesanan servis AC saya.`;
  return (
  <div className="bg-white rounded-[24px] p-6 shadow-sm space-y-6 text-center">
      {/* Icon & Judul */}
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="bg-green-100 p-3 rounded-full">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Pesanan Berhasil!</h2>
        <p className="text-sm text-gray-600">Satu langkah lagi untuk amankan jadwal teknisi.</p>
      </div>

      {/* Kotak Rekening Pembayaran */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 space-y-3 text-left">
        <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
          Instruksi Bayar ({paymentMethod === "dp" ? "DP Saja" : "Full Payment"})
        </h3>

        {/* Menampilkan Total Belanjaan & Nominal yang Harus Ditransfer */}
        <div className="bg-white p-3 rounded-lg border border-blue-100 space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Total Tagihan:</span>
            <span>{isHanyaPerbaikan ? "Menunggu Cek Teknisi" : formatRupiah(totalHarga)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-gray-900 border-t pt-2 border-dashed border-gray-200">
            <span>Harus Ditransfer Sekarang:</span>
            <span className="text-blue-600">{formatRupiah(nominalTransfer)}</span>
          </div>
        </div>
        
        {/* Tambahkan Info Khusus Perbaikan */}
        {isHanyaPerbaikan && (
          <p className="text-[10px] text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200">
            ⚠️ Biaya di atas adalah tarif pengecekan awal. Jika nanti ada sparepart yang harus diganti, Admin akan mengonfirmasi total biaya tambahannya kepada Anda sebelum teknisi mengeksekusi.
          </p>
        )}
        
        <div className="bg-white p-3 rounded-lg border border-blue-100">
          <p className="text-xs text-gray-500">Transfer Bank</p>
          <p className="text-sm font-bold text-gray-900">SEABANK</p>
          <p className="text-lg font-bold text-blue-600 tracking-wider">9012 7079 0272</p>
          <p className="text-xs text-gray-700 font-medium">a.n. Dimas Alif Ferdiansyah</p>
        </div>

        <div className="text-xs text-gray-600 space-y-1">
          <p>1. Silakan transfer sesuai nominal layanan.</p>
          <p>2. Ambil tangkapan layar (screenshot) bukti transfer.</p>
          <p>3. Klik tombol di bawah untuk kirim bukti ke Admin.</p>
        </div>
      </div>

      {/* Tombol Aksi WhatsApp */}
      <Button 
        onClick={() => window.open(`https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(waMessage)}`, '_blank')}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-5 rounded-xl flex items-center justify-center gap-2"
      >
        Konfirmasi via WhatsApp
      </Button>

      <p className="text-[12px] font-bold text-red-600">
        Teknisi KLIQ dilarang keras menerima uang tunai di lokasi pengerjaan.
      </p>
    </div>
  );
}