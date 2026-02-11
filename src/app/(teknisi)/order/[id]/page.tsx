"use client";

import { Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderCard } from "@/components/OrderCard";
import {useParams, useRouter} from "next/navigation"
import { useState, useEffect } from "react";
import { takeOrder } from "@/app/actions/takeOrder";
import {createClient} from "@/utils/supabase/client"

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  address: string;
  service: string[];
  time_slot: string;
  status: 'available' | 'taken';
  total_price: number;
}

export default function OrderPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [fetching, setFetching] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function getOrderDetail() {
      try {
        setFetching(true);
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("id", params.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setOrderData(data);
        }

      } catch(err) {
        console.error("Gagal ambil data:", err);
      } finally {
        setFetching(false);
      }
    }

    if (params.id && params.id !== "id") {
      getOrderDetail();
    } else {
      setFetching(false);
    }
  }, [params.id, supabase]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert("Anda harus login sebagai mitra untuk melihat orderan!");
        router.push('/login');
      } else {
        setCheckingAuth(false);
      }
    };
    checkUser();
  }, [router, supabase.auth]);


  const handleAmbilOrder = async () => {
    setLoading(true);
    const response = await takeOrder(params.id as string);

    if (response?.success) {
      if (response.result === 'winner') {
        router.push(`/detailorder/${params.id}`);
      } else {
        router.push(`/order/${params.id}/ordertaken`);
      }
    } else {
      alert("Terjadi kesalahan koneksi.");
    }
    setLoading(false);
  }

  const layananText = Array.isArray(orderData?.service) 
    ? orderData.service.join(", ") 
    : (orderData?.service || "Layanan tidak tersedia");

  if (fetching || !orderData) {
    return (
      <main className="min-h-screen bg-[#CDD9EB] flex items-center justify-center">
        <p className="text-[#007AFF] font-bold animate-pulse">Menyiapkan Orderan...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#CDD9EB] p-4 flex flex-col items-center font-sans">
      {/* Logo KLIQ Home */}
      <div className="mb-12  flex items-center gap-1 self-center">
        <span className="text-[#007AFF] font-black text-2xl tracking-tighter uppercase">Kliq</span>
        <span className="text-gray-700 font-medium text-sm pt-2 mt-1">Home</span>
      </div>

      <div className="flex flex-col items-center text-center space-y-8 w-full animate-in zoom-in duration-500">
        {/* Ikon Smile Hijau Besar */}
        <div className="bg-[#22C55E] rounded-full w-48 h-48 flex items-center justify-center shadow-xl shadow-green-100/50">
          <Smile className="text-white w-32 h-32 stroke-[1.5]" />
        </div>

        {/* Status Text */}
        <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">
          Order masuk <br/> diterima!
        </h1>

        {/* Detail Pesanan */}
        <OrderCard 
          service={layananText} 
          address={orderData.address ? orderData.address.split(",")[0] : "Lokasi tidak tersedia"}
          time_slot={orderData?.time_slot}
        />

        {/* Tombol Aksi */}
        <div className="w-full max-w-xs pt-4">
          <Button 
            onClick={handleAmbilOrder}
            disabled={loading}
            className="w-full bg-[#007AFF] hover:bg-blue-600 text-white py-8 rounded-2xl font-black text-lg shadow-lg uppercase tracking-wider"
          >
            {loading ? "Mengecek..." : "Saya Ambil Orderan Ini"}
          </Button>
        </div>
      </div>
    </main>
  );
}