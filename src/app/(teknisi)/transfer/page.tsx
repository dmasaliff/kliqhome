'use client'
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {createClient} from "@/utils/supabase/client";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useEffect, useState } from "react";

export default function TransferPage() {
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

    return (
        <div className="min-h-screen bg-[#D1E0F0] flex flex-col items-center p-6 font-sans">
            {/* Logo Section */}
            <div className="mb-12 flex items-center gap-1">
                <span className="text-blue-600 font-extrabold text-xl tracking-tighter">KLIQ</span>
                <span className="text-gray-800 text-sm pt-2 font-medium">Home</span>
            </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
        <div className="mb-8">
          <div className="bg-green-500 rounded-full p-1 shadow-inner animate-bounce">
            <CheckCircle2 size={160} className="text-white stroke-[1.5]" />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-[32px] font-black leading-tight">
            Kirim Bukti<br />Transfer Berhasil!
          </h1>
        </div>

        <p className="text-sm text-center text-black leading-relaxed font-medium">
          Pastikan anda mengirim bukti transfer yang sesuai!
        </p>
      </div>

      {/* Button Section */}
      <div className="w-full max-w-[320px] pb-10 mt-8">
        <button 
          onClick={() => router.push(`/profile/${user?.id}`)}
          className="w-full bg-[#007AFF] hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-md transition-all active:scale-95"
        >
          Kembali Ke Profile Saya
        </button>
      </div>
    </div>
    )
}