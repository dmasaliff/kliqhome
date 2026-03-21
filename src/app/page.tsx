'use client'

import { useState, useEffect } from 'react';
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Snowflake, Droplets, Wrench, ArrowsUpFromLine, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User as SupabaseUser } from '@supabase/supabase-js';

export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Sesi saat ini:", session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogin = () => {
    router.push('/login')
  }

  return (
    <main className="min-h-screen bg-[#CDD9EB] flex flex-col items-center p-6 pb-24 relative">

      <nav className="w-full flex justify-between items-center mb-12">
        <div className="flex items-center gap-1">
          <span className="text-[#007AFF] font-black text-2xl tracking-tighter">KLIQ</span>
          <span className="text-gray-700 font-medium text-[12px] pt-3">Home</span>
        </div>

        {/* 4. LOGIKA TOMBOL DINAMIS */}
        {!loading && (
          user ? (
            <Button
              onClick={() => router.push(`/profile/${user.id}`)}
              className="rounded-full bg-white text-[#007AFF] border border-[#007AFF] hover:bg-blue-50 h-8 text-xs px-4 flex gap-2"
            >
              <User size={14} />
              Profil Saya
            </Button>
          ) : (
            <Button
              onClick={handleLogin}
              className="rounded-full bg-[#007AFF] text-white border-none hover:bg-blue-600 h-8 text-xs px-4"
            >
              Masuk Mitra
            </Button>
          )
        )}
      </nav>

      <section className="text-center mb-10">
        <h1 className="text-[28px] mb-5 leading-tight font-extrabold text-[#1A1A1A]">
          Cukup Sekali <span className="text-[#007AFF]">KLIQ</span>,
        </h1>
        <h1 className="text-[28px] leading-tight font-extrabold text-[#1A1A1A]">
          AC <span className="text-[#007AFF]">Dingin</span> Kembali.
        </h1>
      </section>

      <div className="grid grid-cols-1 gap-4 w-full max-w-sm mx-auto p-2">
        {/* 1. CUCI AC - Grid 2 Kolom agar Simetris */}
        <div className="p-4 border rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center gap-3 mb-4 border-b pb-2">
            <Snowflake className="text-blue-500 w-5 h-5" />
            <span className="font-bold text-sm tracking-wide">CUCI AC RUTIN</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col border-r pr-2">
              <span className="text-[12px] text-blue-600 uppercase font-semibold">0.5 - 1 PK</span>
              <span className="font-bold text-black text-lg">Rp70rb</span>
            </div>
            <div className="flex flex-col pl-2 text-right">
              <span className="text-[12px] text-blue-600 uppercase font-semibold">1.5 - 2 PK</span>
              <span className="font-bold text-black text-lg">Rp80rb</span>
            </div>
          </div>
        </div>

        {/* 2. FREON & REPAIR - Grid 2 Kolom Berdampingan */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 border rounded-2xl bg-white shadow-sm text-center">
            <Droplets className="text-blue-400 w-5 h-5 mx-auto mb-2" />
            <p className="text-[12px] font-bold text-black uppercase">Freon</p>
            <p className="text-sm font-black text-black">Mulai Rp220rb</p>
            <p className="text-[10px] text-blue-600 leading-tight mt-1">Tambah/Isi Full</p>
          </div>
          <div className="p-3 border rounded-2xl bg-white shadow-sm text-center">
            <Wrench className="text-orange-400 w-5 h-5 mx-auto mb-2" />
            <p className="text-[12px] font-bold text-black uppercase">Cek / Repair</p>
            <p className="text-sm font-black text-black">Rp60rb</p>
            <p className="text-[10px] text-blue-600 leading-tight mt-1">Biaya Kunjungan</p>
          </div>
        </div>

        {/* 3. BONGKAR PASANG - Layout List agar tidak berantakan di Mobile */}
        <div className="p-4 border rounded-2xl bg-white shadow-sm">
          <div className="flex items-center justify-center gap-3 mb-4 border-b pb-2">
            <ArrowsUpFromLine className="text-blue-600 w-5 h-5" />
            <span className="font-bold text-sm tracking-wide uppercase">Bongkar Pasang</span>
          </div>
          
          <div className="space-y-3">
            {/* Baris 1: Pasang Saja */}
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
              <span className="text-[12px] font-medium text-black">Pasang Baru</span>
              <div className="text-right">
                <span className="block text-[12px] text-blue-600">0.5-1 PK : <b className="text-black">Rp300rb</b></span>
                <span className="block text-[12px] text-blue-600">1.5-2 PK : <b className="text-black">Rp400rb</b></span>
              </div>
            </div>

            {/* Baris 2: Bongkar Pasang */}
            <div className="flex justify-between items-center bg-blue-50/50 p-2 rounded-lg border border-blue-100">
              <span className="text-[12px] font-bold text-black">Full (Bongkar+Pasang)</span>
              <div className="text-right">
                <span className="block text-[12px] text-black font-bold">Rp550rb <small className="font-normal text-blue-600">(0.5-1PK)</small></span>
                <span className="block text-[12px] text-black font-bold">Rp600rb <small className="font-normal text-blue-600">(1.5-2PK)</small></span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex justify-between items-center pt-2 border-t border-dashed">
            <span className="text-[12px] text-red-500 italic font-medium">*Bongkar saja: Rp185rb</span>
          </div>
        </div>
      </div>

      <div className="bottom-8 w-full max-w-sm py-6">
        <Link href="/pemesanan" className="w-full">
          <Button
            className="w-full bg-[#007AFF] hover:bg-blue-600 text-white rounded-xl py-7 text-lg font-bold shadow-lg shadow-blue-200"
          >
            Pesan Sekarang
          </Button>
        </Link>
      </div>

    </main>
  );
}