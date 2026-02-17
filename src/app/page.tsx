'use client'

import {useState, useEffect} from 'react';
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Snowflake, Droplets, Wrench, ArrowsUpFromLine, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {createClient} from "@/utils/supabase/client";
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

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        <ServiceCard 
          title="CUCI AC" 
          price="Mulai Rp85Rb" 
          Icon={Snowflake} 
        />
        <ServiceCard 
          title="TAMBAH FREON" 
          price="Mulai Rp150Rb" 
          Icon={Droplets} 
        />
        <ServiceCard 
          title="PERBAIKAN" 
          price="Diagnosa Awal" 
          Icon={Wrench} 
        />
        <ServiceCard 
          title="BONGKAR PASANG" 
          price="Mulai Rp350Rb" 
          Icon={ArrowsUpFromLine} 
        />
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