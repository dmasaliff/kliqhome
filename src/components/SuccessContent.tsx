"use client";

import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { SuccessCard } from '@/components/SuccessCard';
import { createClient } from '@/utils/supabase/client';


export function SuccessContent() {
    const supabase = createClient();
    const searchParams = useSearchParams();
    const amountStr = searchParams.get('amount');
    const totalPendapatan = amountStr ? parseInt(amountStr) : 0;

    const handleGoToProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
        window.location.href = `/profile/${user.id}`;
    } else {
        window.location.href = '/login';
    }
};

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
                Pekerjaan<br />Selesai!
            </h1>
            </div>

            {/* Sekarang menampilkan harga yang dikirim dari halaman detail */}
            <SuccessCard amount={totalPendapatan} />
        </div>

        {/* Button Section */}
        <div className="w-full max-w-[320px] pb-10 mt-8">
            <button 
            onClick={handleGoToProfile}
            className="w-full bg-[#007AFF] hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-md transition-all active:scale-95"
            >
            Lihat Riwayat Pendapatan
            </button>
        </div>
        </div>
    );
}