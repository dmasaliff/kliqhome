"use client";

import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DataPelanggan } from "@/components/DataPelanggan";
import { UploadFotoBeforeAfter } from "@/components/UploadFotoBeforeAfter";
import {uploadPhoto} from "@/app/actions/uploadActions";
import {useRouter, useParams} from "next/navigation";
import {createClient} from "@/utils/supabase/client"
import { sendWhastappInvoice } from "@/app/actions/notaratingActions";

interface Order {
  id: string;
  technician_id: string;
  customer_name: string;
  customer_phone: string;
  address: string;
  service: string[];
  time_slot: string;
  status: 'available' | 'taken';
  total_price: number;
}

const DAFTAR_LAYANAN = [
  { id: "cuci", label: "Cuci AC Rutin", harga: 85000 },
  { id: "freon", label: "Tambah Freon", harga: 150000 },
  { id: "bongkar", label: "Bongkar Pasang", harga: 350000 },
];

export default function DetailPekerjaan() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [previewBefore, setPreviewBefore] = useState<string | null>(null);
  const [previewAfter, setPreviewAfter] = useState<string | null>(null);
  const [hargaPerbaikan, setHargaPerbaikan] = useState<number>(0);
  const [isPerbaikanChecked, setIsPerbaikanChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileBefore, setFileBefore] = useState<File | null>(null);
  const [fileAfter, setFileAfter] = useState<File | null>(null);
  const [namaPerbaikan, setNamaPerbaikan] = useState('');
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [fetching, setFetching] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const hitungTotal = () => {
    const totalTetap = selectedServices.reduce((total, serviceId) => {
      const service = DAFTAR_LAYANAN.find((s) => s.id === serviceId);
      return total + (service ? service.harga : 0);
    }, 0);
    
    return totalTetap + (isPerbaikanChecked ? hargaPerbaikan : 0);
  };
  const totalBiaya = hitungTotal();

  const handleCheckboxChange = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const layananText = Array.isArray(orderData?.service) ? orderData.service.join(", ") : (orderData?.service || "Layanan tidak tersedia");

  useEffect(() => {
    async function getOrderDetail() {
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", params.id)
        .single();

      if (data) {
        setOrderData(data);
      }
      setFetching(false);
    }

    if (params.id) getOrderDetail();
  }, [params.id, supabase]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert("Anda harus login sebagai mitra untuk melihat detail orderan!");
        router.push('/login');
      } else {
        setCheckingAuth(false);
      }
    };
    checkUser();
  }, [router, supabase.auth]);

  const handleCompleteOrder = async () => {
    if (!fileBefore || !fileAfter) {
      alert("Wajib upload foto Sebelum & Sesudah!");
      return;
    }

    const orderId = params.id;
    
    if (!orderId || typeof orderId !== 'string') {
      alert("ID Order tidak valid!");
      return;
    }

    setIsLoading(true);

    try {
      const urlBefore = await uploadPhoto(fileBefore, 'before');
      const urlAfter = await uploadPhoto(fileAfter, 'after');
      const totalPrice = totalBiaya;
      const technicianShare = totalPrice * 0.9;

      console.log("Mencoba update booking dengan ID:", params.id);
      console.log("URL Before:", urlBefore);
      console.log("URL After:", urlAfter);

      const res = await supabase
        .from('bookings')
        .update({
          photo_before: urlBefore,
          photo_after: urlAfter,
          status: 'completed',
          total_price : totalPrice,
          technician_share: technicianShare,
        })
        .eq('id', params.id)
        .select();

      console.log("Full Respon Supabase:", res);
      if (res.error) throw res.error;
      
      const total = hitungTotal(); 
      router.push(`/success?amount=${total}&id=${orderId}`);

    } catch (err) {
      alert("Gagal menyelesaikan order: " + (err as Error).message);
    } finally {
      setIsLoading(false);
    }

    try {

      const perbaikanData = isPerbaikanChecked 
      ? [{ name: namaPerbaikan, price: hargaPerbaikan }] 
      : [];

      const { data: bookingData } = await supabase
        .from('bookings')
        .select('customer_phone')
        .eq('id', params.id)
        .single();

      if (!orderData) {
        alert("Data order tidak ditemukan!");
        return;
      }

      const phone = bookingData?.customer_phone;

      if (phone) {
        await sendWhastappInvoice({
          customer_phone: orderData.customer_phone,
          total_price: totalBiaya, 
          id: orderId, 
          technician_id: orderData.technician_id,
          additional_repairs: perbaikanData,
          service: layananText,
        });
      } else {
        console.error("Nomor HP tidak ditemukan di database!");
      }

    } catch (err) {
      console.error("Gagal mengirim WhatsApp:", err);
    }
};

  if (fetching || !orderData) {
    return (
      <main className="min-h-screen bg-[#CDD9EB] flex items-center justify-center">
        <p className="text-[#007AFF] font-bold animate-pulse">Menyiapkan Orderan...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#D9E3F0] p-4 pb-10 font-sans space-y-4">
        {/* Header */}
        <div className="flex items-center mb-4">
        <Link href="/order"><ChevronLeft className="w-6 h-6 text-gray-700" /></Link>
        <h1 className="flex-1 text-center font-black text-lg pr-6 uppercase">Detail Pekerjaan</h1>
        </div>

        {/* 1. Data Pelanggan */}
        <DataPelanggan
            service={layananText} 
            address={orderData.address ? orderData.address.split(",")[0] : "Lokasi tidak tersedia"}
            time_slot={orderData?.time_slot}
            customer_name={orderData?.customer_name}
            customer_phone={orderData?.customer_phone}
        />

        {/* 2. Input Hasil Kerja (Dinamis) */}
        <div className="bg-white rounded-4xl p-5 shadow-sm space-y-4">
            <h3 className="text-[14px] font-bold uppercase tracking-wider text-black">Input Hasil Kerja</h3>
            <div className="space-y-3">
                {DAFTAR_LAYANAN.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                        <Checkbox 
                        id={item.id} 
                        onCheckedChange={() => handleCheckboxChange(item.id)}
                        className="border-gray-300 rounded" 
                    />
                    <label htmlFor={item.id} className="text-[12px] font-medium">
                        {item.label} <span className="text-gray-500 text-[10px]">(Rp {item.harga.toLocaleString()})</span>
                    </label>
                    </div>
                ))}

                <div className="pt-2 space-y-2 border-t border-gray-50 mt-2">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="perbaikan" 
                      onCheckedChange={(checked) => {
                        setIsPerbaikanChecked(!!checked);
                        if (!checked) {
                          setNamaPerbaikan('');
                          setHargaPerbaikan(0);
                        }
                      }}
                      className="border-gray-300"
                    />
                    <label htmlFor="perbaikan" className="text-[12px] font-medium text-black">
                      Perbaikan Lainnya (Custom)
                    </label>
                  </div>
                  
                  {isPerbaikanChecked && (
                    <div className="pl-8 space-y-3 animate-in slide-in-from-top-1 duration-200">
                      {/* Input Nama Perbaikan */}
                      <div>
                        <p className="text-[10px] font-bold text-black mb-1">Nama Perbaikan :</p>
                        <input 
                          type="text"
                          value={namaPerbaikan}
                          onChange={(e) => setNamaPerbaikan(e.target.value)}
                          className="w-full border border-blue-200 rounded-lg p-2 h-10 text-sm focus:border-blue-500 outline-none"
                          placeholder="Contoh: Ganti Kapasitor / Las Pipa"
                        />
                      </div>

                      {/* Input Harga Perbaikan */}
                      <div>
                        <p className="text-[10px] font-bold text-black mb-1">Harga Perbaikan :</p>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-sm font-bold text-black">Rp</span>
                          <input 
                            type="number"
                            value={hargaPerbaikan === 0 ? "" : hargaPerbaikan}
                            onChange={(e) => setHargaPerbaikan(Number(e.target.value))}
                            className="w-full border border-blue-200 rounded-lg p-2 pl-10 h-10 text-sm focus:border-blue-500 outline-none"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
            </div>
        </div>

        {/* 3. Dokumentasi Foto*/}
        <div className="space-y-3">

            {/* BAGIAN SEBELUM */}
            <UploadFotoBeforeAfter 
            id="foto-sebelum" 
            label="Foto Sebelum Kerja" 
            previewUrl={previewBefore} 
            onUpload={(preview, file) => {
              setPreviewBefore(preview);
              setFileBefore(file);
            }}
            onRemove={() => { setPreviewBefore(null); setFileBefore(null); }}
            />

            {/* BAGIAN SESUDAH */}
            <UploadFotoBeforeAfter 
            id="foto-sesudah" 
            label="Foto Sesudah Kerja" 
            previewUrl={previewAfter} 
            onUpload={(preview, file) => {
              setPreviewAfter(preview);
              setFileAfter(file);
            }}
            onRemove={() => { setPreviewAfter(null); setFileAfter(null); }}
            />

        </div>
        

        {/* 4. Finalisasi (Update Otomatis) */}
        <div className="bg-white rounded-4xl p-5 shadow-sm space-y-4">
            <h3 className="text-[14px] font-bold uppercase tracking-wider text-black">Finalisasi & Pembayaran</h3>
            <div className="flex justify-between items-center">
            <span className="text-[12px] font-bold">Total Biaya :</span>
            <span className={`text-[20px] font-black transition-all ${totalBiaya > 0 ? 'text-[#007AFF]' : 'text-gray-300'}`}>
                Rp {totalBiaya.toLocaleString()}
            </span>
            </div>
            <Button 
            disabled={totalBiaya === 0 || isLoading}
            onClick={handleCompleteOrder}
            className={`w-full py-6 rounded-xl font-bold text-sm uppercase shadow-lg transition-all
                ${totalBiaya > 0 ? 'bg-[#007AFF] hover:bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-gray-300'}`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span> Mengirim Laporan...
                </span>
              ) : (
                "Selesai & kirim nota"
              )}
            </Button>
        </div>
    </main>
  );
}