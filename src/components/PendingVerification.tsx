'use client'

import { Clock, ShieldCheck, FileSearch, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export function PendingVerification() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [isAccepted, setIsAccepted] = useState(false); // State baru untuk trigger UI diterima

  useEffect(() => {
    const checkStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data } = await supabase
          .from('technicians')
          .select('is_verified')
          .eq('id', user.id)
          .single();

        if (data?.is_verified) {
          handleSuccess();
        }
      }
      setLoading(false);
    };

    // Fungsi untuk animasi transisi sebelum pindah halaman
    const handleSuccess = () => {
      setIsAccepted(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000); // Beri jeda 3 detik agar teknisi bisa baca pesan "Diterima"
    };

    checkStatus();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'technicians' },
        (payload) => {
          console.log('Ada perubahan data masuk!', payload);
          if (payload.new.is_verified === true) {
            handleSuccess();
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
        <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${isAccepted ? 'bg-green-100 scale-110' : 'bg-blue-100 animate-pulse'}`}>
          {isAccepted ? (
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          ) : (
            <Clock className="w-12 h-12 text-blue-600" />
          )}
        </div>
        {!isAccepted && (
          <div className="absolute -bottom-2 -right-2 bg-yellow-400 p-2 rounded-lg shadow-lg">
            <FileSearch className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      {/* Text Section */}
      <h1 className={`text-2xl font-bold mb-3 transition-colors duration-500 ${isAccepted ? 'text-green-600' : 'text-slate-800'}`}>
        {isAccepted ? 'Selamat! Akun Anda Aktif' : 'Pendaftaran Sedang Ditinjau'}
      </h1>
      <p className="max-w-sm mb-8 leading-relaxed text-slate-600">
        {isAccepted 
          ? 'Verifikasi berhasil. Anda sekarang adalah bagian dari Mitra KLIQ Home. Mengalihkan ke halaman utama...' 
          : 'Tim kami sedang memverifikasi dokumen dan keahlianmu dalam 1x24 jam.'
        }
      </p>

      {/* Progress Steps */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8 transition-all">
        <h3 className="text-left text-sm font-semibold uppercase tracking-wider mb-4">
          Status Verifikasi
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 text-left opacity-50">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-slate-800 text-sm">Formulir Terkirim</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 text-left">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${isAccepted ? 'bg-green-500' : 'bg-blue-100 border-2 border-blue-600'}`}>
              {isAccepted ? (
                <ShieldCheck className="w-4 h-4 text-white" />
              ) : (
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></div>
              )}
            </div>
            <div>
              <p className={`font-medium text-sm ${isAccepted ? 'text-green-600' : 'text-blue-600 italic underline decoration-wavy'}`}>
                {isAccepted ? 'Verifikasi Diterima' : 'Sedang Direview'}
              </p>
              <p className="text-xs text-gray-600">
                {isAccepted ? 'Selamat bergabung di tim!' : 'Kami sedang mengecek kecocokan data Anda.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {!isAccepted && (
        <button 
          onClick={() => window.location.reload()}
          className="text-blue-600 font-semibold text-sm hover:underline"
        >
          Cek Status Terkini
        </button>
      )}
      
      <p className="mt-12 text-xs text-slate-700">
        Butuh bantuan cepat? Hubungi <span className="underline cursor-pointer">Admin KLIQ</span>
      </p>
    </div>
  );
}