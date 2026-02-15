"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { TimeSlot } from "@/components/TimeSlot";
import { SuccessSection } from "@/components/SuccessSection";
import { ChevronLeft, MapPin, Sun, CloudSun, Moon } from "lucide-react";
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

  const handleLayananChange = (item: string) => {
    setService((prev) =>
      prev.includes(item) 
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
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
        <div className="border border-blue-300 rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-bold uppercase">Pilih Layanan</h3>
          {["Cuci AC Rutin", "Tambah Freon", "Perbaikan", "Bongkar Pasang"].map((item) => (
            <div key={item} className="flex items-center space-x-3">
              <Checkbox 
                onCheckedChange={() => handleLayananChange(item)}
                id={item} 
                className="border-blue-300 data-[state=checked]:bg-blue-500" 
              />
              <label htmlFor={item} className="text-sm font-medium">{item}</label>
            </div>
          ))}
          <div className="pt-2">
            <label className="text-[10px] font-bold">KELUHAN :</label>
            <Textarea 
              value={keluhan}
              onChange={(e) => setKeluhan(e.target.value)}
              className="mt-1 border-blue-300 rounded-lg min-h-15"
              placeholder="Ceritakan masalah AC anda..." />
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