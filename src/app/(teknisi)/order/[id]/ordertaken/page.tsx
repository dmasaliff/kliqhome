'use client'

import { Clock, ArrowLeft } from 'lucide-react';
import { useParams } from 'next/navigation';

const OrderTakenPage = () => {
  const params = useParams();
  const orderId = params.id;

  const handleBack = () => {
    if (window.opener || window.history.length === 1) {
      window.close();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-[#CDD9EB] flex flex-col items-center justify-center p-6 text-center">
      {/* Ikon Utama */}
      <div className="bg-orange-100 p-4 rounded-full mb-6">
        <Clock className="w-12 h-12 text-orange-600" />
      </div>

      {/* Pesan Utama */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Orderan Sudah Diambil
      </h1>
      {/* Kamu bisa pamer ID-nya tipis-tipis biar mereka tahu orderan mana yang 'lepas' */}
      <p className="text-[12px] text-gray-800 mb-2 tracking-widest">
        Order ID: {orderId}
      </p>
      <p className="text-gray-800 mb-8 max-w-xs">
        Wah, teknisi lain sudah lebih cepat mengambil orderan ini. Tetap pantau grup WA ya!
      </p>

      {/* Tombol Aksi */}
      <button 
        onClick={handleBack}
        className="w-full max-w-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Grup WA
      </button>
    
    </div>
  );
};

export default OrderTakenPage;