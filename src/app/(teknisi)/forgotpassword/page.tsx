'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { resetPasswordTanpaOTP } from '@/app/actions/resetPassword';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const [phone, setPhone] = useState('');
  const [newSandi, setNewSandi] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{msg: string, type: 'error' | 'success' | null}>({msg: '', type: null});
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({msg: '', type: null});

    try {
      await resetPasswordTanpaOTP(phone, newSandi);
      setStatus({msg: "Sandi berhasil diubah! Mengalihkan ke login...", type: 'success'});
      
      // Tunggu 2 detik baru pindah ke login
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: unknown) {
      setStatus({msg: (err as Error).message || "Terjadi kesalahan saat mengubah sandi.", type: 'error'});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#CDD9EB] flex justify-center p-5 items-center font-sans">
      <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-black text-center mb-2">RESET KATA SANDI</h2>
        <p className="text-center text-slate-500 text-xs mb-6">Masukkan nomor HP terdaftar untuk ganti sandi baru.</p>
        
        <form onSubmit={handleReset} className="space-y-4">
          <input 
            type="text" 
            placeholder="Nomor WhatsApp (08xxxx)" 
            className="w-full p-4 border rounded-lg text-sm text-black"
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Kata Sandi Baru" 
            className="w-full p-4 border rounded-lg text-sm text-black"
            onChange={(e) => setNewSandi(e.target.value)}
            required
          />
          
          <button 
            disabled={loading}
            className="w-full bg-[#007AFF] text-white font-bold py-4 rounded-lg"
          >
            {loading ? "Memproses..." : "UPDATE SANDI SEKARANG"}
          </button>

          {status.msg && (
            <div className={`flex items-center gap-2 p-3 rounded-lg border ${status.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
              {status.type === 'success' ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}
              <p className="text-[12px] font-bold">{status.msg}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}