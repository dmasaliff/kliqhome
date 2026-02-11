'use client'

import { Clock, ShieldCheck, FileSearch } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export function PendingVerification() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fungsi untuk cek status saat ini
    const checkStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data } = await supabase
          .from('technicians')
          .select('is_verified')
          .eq('id', user.id)
          .single();

        if (data?.is_verified) {
          router.push('/login');
        }
      }
      setLoading(false);
    };

    checkStatus();

    // 2. FITUR MEWAH: Realtime Listener
    // Layar akan otomatis pindah saat Admin mengubah status di database
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'technicians' },
        (payload) => {
          if (payload.new.is_verified === true) {
            router.push('/login');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, supabase]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center rounded-xl p-6 text-center">
      {/* Icon Section */}
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
          <Clock className="w-12 h-12 text-blue-600" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-yellow-400 p-2 rounded-lg shadow-lg">
          <FileSearch className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Text Section */}
      <h1 className="text-2xl font-bold text-slate-800 mb-3">
        Pendaftaran Sedang Ditinjau
      </h1>
      <p className=" max-w-sm mb-8 leading-relaxed">
        Terima kasih sudah mendaftar di <span className="font-bold text-blue-600">KLIQ Home</span>. 
        Tim kami sedang memverifikasi dokumen dan keahlianmu dalam 1x24 jam.
      </p>

      {/* Progress Steps (Biar Teknisi nggak bingung) */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
        <h3 className="text-left text-sm font-semibold uppercase tracking-wider mb-4">
          Status Verifikasi
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 text-left">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-slate-800 text-sm">Formulir Terkirim</p>
              <p className="text-xs text-gray-600">Data pendaftaran berhasil kami terima.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 text-left">
            <div className="w-6 h-6 bg-blue-100 border-2 border-blue-600 rounded-full flex items-center justify-center shrink-0">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></div>
            </div>
            <div>
              <p className="font-medium text-blue-600 text-sm italic underline decoration-wavy">Sedang Direview</p>
              <p className="text-xs text-gray-600 italic">Kami sedang mengecek kecocokan data Anda.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Section */}
      <button 
        onClick={() => window.location.reload()}
        className="text-blue-600 font-semibold text-sm hover:underline"
      >
        Cek Status Terkini
      </button>
      
      <p className="mt-12 text-xs text-slate-700">
        Butuh bantuan cepat? Hubungi <span className="underline cursor-pointer">Admin KLIQ</span>
      </p>
    </div>
  );
};
