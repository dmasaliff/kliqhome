import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import { useState } from "react";

interface OrderDetailProps {
  customer_name: string;
  customer_phone: string;
  service: string;
  address: string;
  time_slot: string;
}

export function DataPelanggan({ customer_name, customer_phone, service, address, time_slot }: OrderDetailProps) {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const params = useParams();
  const handleCancelOrder = async () => {
    try {
      const res = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
      })
      .eq('id', params.id)
      .select();

      console.log("Full Respon Supabase:", res);
      if (res.error) throw res.error;

      alert("Pesanan berhasil dibatalkan.");
      window.location.href = '/';

    } catch (error) {
      console.error("Error uploading transfer proof:", error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="bg-white rounded-4xl p-5 shadow-sm space-y-4">
      <h3 className="text-[14px] font-bold uppercase tracking-wider text-black">Data Pelanggan</h3>
      <div className="text-[12px] space-y-1 text-gray-800 font-bold">
        <p>Nama : <span className="font-medium">{customer_name}</span></p>
        <p>Alamat : <span className="font-medium">{address}</span></p>
        <p>No WhatsApp : <span className="font-medium">{customer_phone}</span></p>
        <p>Layanan : <span className="font-medium">{service}</span></p>
        <p>Jadwal : <span className="font-medium">{time_slot}</span></p>
      </div>
      <div className="flex gap-2">
        <Link href={`https://wa.me/${customer_phone}`}>
          <Button className="flex-1 bg-[#007AFF] hover:bg-blue-600 text-[10px] h-9 font-bold rounded-lg uppercase">Hubungi via WA</Button>
        </Link>
        <Button 
          onClick={handleCancelOrder}
          disabled={isLoading}
          className="flex-1 bg-red-500 hover:bg-red-600 text-[10px] h-9 font-bold rounded-lg uppercase">
            {isLoading ? "Membatalkan..." : "Batalkan pesanan"}
        </Button>
      </div>
    </div>
  );
}