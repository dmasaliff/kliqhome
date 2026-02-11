'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import {createClient} from '@/utils/supabase/client'

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formattedEmail = `kliq.${formData.phone.trim()}@gmail.com`;

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: formattedEmail,
      password: formData.password,
    })

    if (authError) {
      alert("Login Gagal: " + authError.message)
      setLoading(false);
      return;
    }
    
    const { data: profile, error: profileError } = await supabase
      .from('technicians')
      .select('is_verified')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
        await supabase.auth.signOut();
        alert("Terjadi kesalahan sistem. Akun tidak ditemukan.");
        setLoading(false);
        return;
    }

    if (!profile.is_verified) {
        await supabase.auth.signOut();
        alert("Akun Anda sedang ditinjau. Harap tunggu verifikasi admin.");
        setLoading(false);
        return;
    }

    router.push('/');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#CDD9EB] flex justify-center p-5 font-sans">
      <div className="w-full max-w-md rounded-lg text-center">
        {/* Logo */}
        <div className="flex justify-center items-center gap-1 mb-37">
          <span className="text-[#007AFF] font-black text-xl tracking-tighter">KLIQ</span>
          <span className="text-slate-700 text-xs mt-1 pt-2">Home</span>
        </div>

        <h1 className="text-2xl font-black text-[#1A1A1A] mb-1 uppercase tracking-tight">
          MASUK MITRA KLIQ
        </h1>
        <p className="text-slate-700 text-sm mb-10">
          Akses orderan & penghasilan anda!
        </p>

        <div className="bg-white rounded-xl p-5 shadow-sm space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
            <input
                type="text"
                placeholder="Nomor Handphone (WA Aktif)"
                className="w-full p-4 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 text-sm"
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
            
            <div className="relative">
                <input
                type={showPassword ? "text" : "password"}
                placeholder="Kata Sandi"
                className="w-full p-4 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 text-sm"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
            </div>

            <div className="text-right">
                <a href="#" className="text-[#007AFF] text-xs font-bold hover:underline">Lupa Sandi?</a>
            </div>

            <button 
                type="submit"
                className="w-full bg-[#007AFF] text-white font-bold py-4 rounded-lg shadow-md hover:bg-blue-600 transition-colors uppercase text-sm"
            >
              {loading ? "Masuk..." : "MASUK SEKARANG"}
            </button>
            </form>
        </div>

        <div className="mt-8">
          <p className="text-slate-600 text-xs">
            Belum punya akun? <a href="/register" className="text-[#007AFF] font-bold hover:underline">Daftar di sini</a>
          </p>
        </div>
      </div>
    </div>
  );
}