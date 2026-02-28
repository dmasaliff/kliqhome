"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { TimeSlot } from "@/components/TimeSlot";
import { SuccessSection } from "@/components/SuccessSection";
import { ChevronLeft, Sun, CloudSun, Moon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { submitOrder } from "@/app/actions/orderActions";

export default function PesanPage() {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [customer_name, setCustomer_name] = useState("");
  const [customer_phone, setCustomer_phone] = useState("");
  const [address, setAddress] = useState("");
  const [keluhan, setKeluhan] = useState("");
  const [service, setService] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async () => {
    if (!isFormValid || isLoading) return;
    setIsLoading(true);
    try {
      await submitOrder({
        customer_name,
        customer_phone,
        address,
        service,
        keluhan,
        time_slot: selectedSlot || "Belum dipilih",
      });
      
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    alert("Terjadi kesalahan sistem: " + (err as Error).message);
  } finally {
    setIsLoading(false);
  }
};

  const handleLayananChange = (idBaru: string) => {
    setService((prev) => {
      if (prev.includes(idBaru)) return prev.filter((id) => id !== idBaru);
      let tempService = [...prev];

      if (["cuci_05_1", "cuci_15", "cuci_2"].includes(idBaru)) {
        tempService = tempService.filter(id => !["cuci_05_1", "cuci_15", "cuci_2"].includes(id));
      }

      if (["tambah_freon", "isi_freon_05_1", "isi_freon_15_2"].includes(idBaru)) {
        tempService = tempService.filter(id => 
          !["tambah_freon", "isi_freon_05_1", "isi_freon_15_2"].includes(id)
        );
      }

      if (["bongkar", "bongkar_pasang_05_1", "bongkar_pasang_15_2"].includes(idBaru)) {
        tempService = tempService.filter(id => 
          !["bongkar", "bongkar_pasang_05_1", "bongkar_pasang_15_2"].includes(id)
        );
      }

      if (idBaru === "pengecekan") {
        // Jika pilih pengecekan, hapus ID perbaikan
        tempService = tempService.filter(id => id !== "perbaikan");
      }
      if (idBaru === "perbaikan") {
        // Jika pilih perbaikan, hapus ID pengecekan (karena sudah otomatis dicek)
        tempService = tempService.filter(id => id !== "pengecekan");
      }

    const newState = [...tempService, idBaru];
    console.log("Daftar Layanan Saat Ini:", newState); // Tambahkan ini!
    return newState;
    });
  };

  const isFormValid = 
    customer_name.trim() !== "" && 
    customer_phone.length >= 10 && 
    address.trim().length >= 5 && 
    selectedSlot !== null && 
    service.length > 0;

  const slots = [
    { id: '08.00-11.00', label: 'Pagi', time: '08.00-11.00', icon: CloudSun },
    { id: '13.00-14.00', label: 'Siang', time: '13.00-14.00', icon: Sun },
    { id: '15.00-17.00', label: 'Sore', time: '15.00-17.00', icon: Moon },
  ];

  return (
    <main className="min-h-screen bg-[#D9E3F0] p-4 pb-24">
      {isSuccess ? (
        <div className="pt-30 mt-10">
          <SuccessSection />
        </div>
      ) : (
      
      <>
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link href="/">
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </Link>
        <div className="flex-1 text-center pr-6">
          <h1 className="text-xl font-bold text-gray-900">Pesan Servis AC</h1>
          <p className="text-xs font-medium text-gray-600">Isi data diri & lokasi anda</p>
        </div>
      </div>

      {/* Container Form Putih */}
      <div className="bg-white rounded-[24px] p-5 shadow-sm space-y-6">
        {/* Input Nama & WhatsApp */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold ml-1">Nama Lengkap</label>
            <input 
              value={customer_name}
              onChange={(e) => setCustomer_name(e.target.value)}
              className="w-full p-3 rounded-xl border border-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan nama..." />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold ml-1">Nomor WhatsApp Aktif</label>
            <input 
              value={customer_phone}
              onChange={(e) => setCustomer_phone(e.target.value)}
              className="w-full p-3 rounded-xl border border-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="0812..." />
          </div>
        </div>

        {/* Pilih Layanan */}
        <div className="border border-blue-300 rounded-xl p-4 space-y-4 bg-white shadow-sm">
          <h3 className="text-xs font-bold uppercase text-black tracking-wider">Pilih Layanan & Detail PK</h3>
          <div className="space-y-4">
    
            {/* 1. CUCI AC */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="cat_cuci" 
                  onCheckedChange={(checked) => {
                    if(checked) {
                      handleLayananChange("cuci_05_1"); // Default ID saat dicentang
                    } else {
                      setService((prev) => prev.filter(id => !id.startsWith("cuci_")));
                    }
                  }}
                  // Checkbox menyala jika salah satu ID cuci ada di state
                  checked={service.some(id => id.startsWith("cuci_"))}
                  className="border-blue-300 data-[state=checked]:bg-blue-500" 
                />
                <label htmlFor="cat_cuci" className="text-sm font-semibold">Cuci AC Rutin</label>
              </div>
              <select 
                disabled={!service.some(id => id.startsWith("cuci_"))}
                onChange={(e) => handleLayananChange(e.target.value)} 
                value={service.find(id => id.startsWith("cuci_")) || "cuci_05_1"}
                className="ml-8 w-full max-w-50 text-xs p-2 border border-blue-200 rounded-md bg-blue-50 outline-none disabled:opacity-50"
              >
                <option value="cuci_05_1">0.5 - 1 PK (Rp85.000)</option>
                <option value="cuci_15">1.5 PK (Rp90.000)</option>
                <option value="cuci_2">2 PK (Rp100.000)</option>
              </select>
            </div>

            {/* 2. FREON */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="cat_freon" 
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleLayananChange("tambah_freon"); 
                    } else {
                      setService((prev) => prev.filter(id => 
                        id !== "tambah_freon" && id !== "isi_freon_05_1" && id !== "isi_freon_15_2"
                      ));
                    }
                  }}
                  checked={service.some(id => id.includes("freon"))}
                  className="border-blue-300 data-[state=checked]:bg-blue-500" 
                />
                <label htmlFor="cat_freon" className="text-sm font-semibold">Freon (Tambah/Isi)</label>
              </div>
              <select 
                disabled={!service.some(id => id.includes("freon"))}
                onChange={(e) => handleLayananChange(e.target.value)}
                value={service.find(id => id.includes("freon")) || "tambah_freon"}
                className="ml-8 w-full max-w-50 text-xs p-2 border border-blue-200 rounded-md bg-blue-50 outline-none disabled:opacity-50"
              >
                <option value="tambah_freon">Tambah Freon (Rp250.000)</option>
                <option value="isi_freon_05_1">Isi Full 0.5 - 1 PK (Rp350.000)</option>
                <option value="isi_freon_15_2">Isi Full 1.5 - 2 PK (Rp450.000)</option>
              </select>
            </div>

            {/* 3. BONGKAR PASANG */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="cat_bp" 
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleLayananChange("bongkar"); 
                    } else {
                      setService((prev) => prev.filter(id => 
                        !id.includes("bongkar")
                      ));
                    }
                  }}
                  checked={service.some(id => id.includes("bongkar"))}
                  className="border-blue-300 data-[state=checked]:bg-blue-500" 
                />
                <label htmlFor="cat_bp" className="text-sm font-semibold">Bongkar Pasang</label>
              </div>
              <select 
                disabled={!service.some(id => id.includes("bongkar"))}
                onChange={(e) => handleLayananChange(e.target.value)}
                value={service.find(id => id.includes("bongkar")) || "bongkar"}
                className="ml-8 w-full max-w-50 text-xs p-2 border border-blue-200 rounded-md bg-blue-50 outline-none disabled:opacity-50"
              >
                <option value="bongkar">Bongkar Saja (Rp185.000)</option>
                <option value="bongkar_pasang_05_1">Pasang Baru 0.5 - 1 PK (Rp450.000)</option>
                <option value="bongkar_pasang_15_2">Pasang Baru 1.5 - 2 PK (Rp550.000)</option>
              </select>
            </div>

            {/* 4. PERBAIKAN & PENGECEKAN (ID: pengecekan / perbaikan) */}
            <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="pengecekan" 
                    onCheckedChange={() => handleLayananChange("pengecekan")}
                    checked={service.includes("pengecekan")} // Pastikan state sync
                    className="border-blue-300 data-[state=checked]:bg-blue-500" 
                  />
                  <div className="flex flex-col">
                    <label htmlFor="pengecekan" className="text-sm font-semibold">Pengecekan AC</label>
                    <span className="text-[10px] text-red-500 italic">
                      Rp75.000 (Gratis jika lanjut tindakan perbaikan/cuci)
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="perbaikan" 
                    checked={service.includes("perbaikan")} // Pastikan state sync
                    onCheckedChange={() => handleLayananChange("perbaikan")}
                    className="border-blue-300 data-[state=checked]:bg-blue-500" 
                  />
                  <div className="flex flex-col">
                    <label htmlFor="perbaikan" className="text-sm font-semibold">Perbaikan (Troubleshoot)</label>
                    <span className="text-[10px] text-gray-500 italic">Harga estimasi teknisi di lokasi</span>
                  </div>
                </div>
            </div>
          </div>

          <div className="pt-4 border-t border-blue-100">
            <label className="text-[10px] font-bold text-gray-800 uppercase tracking-widest">Keluhan Tambahan :</label>
            <Textarea 
              value={keluhan}
              onChange={(e) => setKeluhan(e.target.value)}
              className="mt-1 border-blue-200 rounded-lg min-h-20 text-sm focus:ring-blue-500"
              placeholder="Contoh: AC berisik, air menetes, atau kode error..." 
            />
          </div>
        </div>

        {/* Alamat & Map */}
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold ml-1">Alamat Lengkap</label>
            <div className="relative">
              <Textarea 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border-blue-300 rounded-xl min-h-20" placeholder="Nama jalan, nomor rumah..." />
            </div>
          </div>
        </div>

        {/* Slot Waktu */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-900">Pilih Slot Waktu</h3>
          <div className="flex gap-3">
            {slots.map((slot) => (
              <TimeSlot 
                key={slot.id}
                icon={slot.icon}
                label={slot.label}
                time={slot.time}
                isActive={selectedSlot === slot.id}
                onSelect={() => setSelectedSlot(slot.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <div className="bottom-6 left-0 right-0 mt-6">
        <Button 
          onClick={handleSuccess}
          disabled={!isFormValid || isLoading}
          className={`w-full py-6 rounded-xl font-bold text-lg shadow-lg
          ${isFormValid ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 text-gray-300 cursor-not-allowed'}`}
        >
          {isLoading ? "Mengirim..." : (isFormValid ? "Pesan Sekarang" : "Lengkapi Data Diatas")}
        </Button>
      </div>
      </>
      
      )}
    </main>
  );
}