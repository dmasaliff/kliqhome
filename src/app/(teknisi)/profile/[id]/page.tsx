'use client'

import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { TechnicianRating } from "@/components/TechnicianRating"
import { TechnicianAvatar } from "@/components/TechnicianAvatar"
import { useEffect, useState } from "react"
import { UploadFotoDocument } from "@/components/UploadFotoDocument"
import { useParams, useRouter } from "next/navigation"
import {createClient} from "@/utils/supabase/client"
import { uploadTransferProof } from "@/app/actions/uploadTransfer"
import { getTechnicianFinance, getTechnicianHistory, getTechnicianProfile } from "@/app/actions/technicianProfile"

export default function TechnicianProfile() {
    const router = useRouter();
    const supabase = createClient();
    const params = useParams();
    const [previewTransfer, setPreviewTransfer] = useState<string | null>(null);
    const [fileTransfer, setFileTransfer] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [finance, setFinance] = useState({ gross: 0, mitra: 0, obligation: 0 });
    const [history, setHistory] = useState<Array<{
        id: string;
        booking_date: string;
        service: string[];
        address: string;
        total_price: number;
    }>>([]);
    const [profile, setProfile] = useState<{
        id: string;
        name: string;
        specialization: string;
        average_rating: number;
        total_jobs: number;
        phone: string;
    } | null>(null);

    useEffect(() => {
        const checkUser = async () => {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!session) {
            alert("Anda harus login sebagai mitra untuk melihat detail orderan!");
            router.push('/login');
          } else {
            setCheckingAuth(false);
          }
        };
        checkUser();
      }, [router, supabase.auth]);

    const techId = params.id;

    useEffect(() => {
        async function loadHistory() {
        const data = await getTechnicianHistory(techId as string);
            setHistory(data);
        }
        loadHistory();
    }, [techId]);

    useEffect(() => {
        async function loadFinance() {
            const data = await getTechnicianFinance(techId as string);
            setFinance(data);
        }
        loadFinance();
    }, [techId]);

    const formatIDR = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    useEffect(() => {
        async function loadData() {
        const data = await getTechnicianProfile(techId as string);
        setProfile(data);
        setIsLoading(false);
        }
        loadData();
    }, [techId]);

    const handleTransfer = async () => {
        if (!fileTransfer) return;
        setIsLoading(true);
        try {
            const url = await uploadTransferProof(fileTransfer, "transfer-proof");
            console.log("URL Bukti Transfer:", url);

            const res = await supabase
                .from('technicians')
                .update({
                    url_transfer: url
                })
                .eq('id', params.id)
                .select();

            router.push('/transfer')
            console.log("Full Respon Supabase:", res);
            if (res.error) throw res.error;

        } catch (error) {
            console.error("Error uploading transfer proof:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push('/');
    }

    if (isLoading) return <div className="p-6 text-center">Memuat Profil...</div>;
    if (!profile) return <div className="p-6 text-center">Profil tidak ditemukan</div>;

    return(
        <main className="min-h-screen bg-[#D9E3F0] p-4 pb-10 font-sans space-y-4">
            <div className="flex items-center mb-4">
                <Link href="/"><ChevronLeft className="w-6 h-6 text-gray-700" /></Link>
                <h1 className="flex-1 text-center font-black text-lg pr-6 uppercase">Profile Saya</h1>
            </div>

            <div className="bg-white rounded-xl p-3 shadow-sm space-y-4">
                <h3 className="text-[14px] font-bold mb-5 uppercase tracking-wider text-black">IDENTITAS MITRA</h3>
                <div className="text-[12px] space-y-1 text-gray-800 font-bold">
                    <div className="flex flex-col items-center gap-4">
                        <TechnicianAvatar 
                            src="" 
                            alt="Foto Budi Santoso"
                            size={120}
                        />
                    </div>
                    <p>Nama : <span className="font-medium">{profile.name}</span></p>
                    <p>ID Mitra : <span className="font-medium">{profile.id}</span></p>
                    <p>No. HP : <span className="font-medium">{profile.phone}</span></p>
                    <p>Spesialisasi : 
                        <span className="font-medium">
                            {Array.isArray(profile.specialization) 
                                ? profile.specialization.join(', ') 
                                : profile.specialization}
                        </span>
                    </p>
                    <div className="flex items-center gap-2">
                        <TechnicianRating rating={Number(profile.average_rating)} size={16} />
                        <p className="mx-2">|</p>
                        <p>{profile.total_jobs} Pesanan Selesai</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-3 shadow-sm">
                <h3 className="text-[14px] mb-1 font-bold uppercase tracking-wider text-black">DOMPET KLIQ</h3>
                <div className="text-[12px] space-y-1 text-gray-800 font-bold">
                    <span className='text-[24px] font-bold transition-all text-[#007AFF]'>
                        {formatIDR(finance.gross)}
                    </span>
                    <p>Total Pendapatan Kotor Bulan Ini</p>
                    <p>Jatah Mitra (90%) : <span className="font-medium text-[#007AFF]">{formatIDR(finance.mitra)}</span></p>
                    <p>Kewajiban Setor (10%) : <span className="font-medium text-red-500">{formatIDR(finance.obligation)}</span></p>

                    <UploadFotoDocument 
                        id="foto-bukti-transfer" 
                        label="Foto Bukti Transfer Kewajiban Setor" 
                        previewUrl={previewTransfer} 
                        onUpload={(preview, file) => {
                            setPreviewTransfer(preview);
                            setFileTransfer(file);
                        }}
                        onRemove={() => { setPreviewTransfer(null); setFileTransfer(null); }}
                    />

                        <button 
                        disabled={isLoading || !fileTransfer}
                        onClick={handleTransfer}
                        className="w-full bg-[#007AFF] hover:bg-blue-600 text-white font-bold my-3 py-3 rounded-xl shadow-md transition-all active:scale-95"
                        >
                        {isLoading ? 'Mengirim...' : 'Kirim Bukti Transfer'}
                        </button>
                </div>
            </div>

            <div className="bg-white rounded-xl p-3 shadow-sm">
                <h3 className="text-[14px] mb-2 font-bold uppercase tracking-wider text-black">HISTORY PESANAN</h3>
                
                <div className="space-y-3">
                {history.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                        <p className="text-md text-gray-600 font-medium">
                            {new Date(item.booking_date).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'short', year: 'numeric'
                            })}
                        </p>
                        <h4 className="font-bold text-lg mt-2 text-gray-800">{item.service}</h4>
                        </div>
                        <span className="text-xl font-black text-blue-600">
                        {formatIDR(item.total_price)}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-gray-600">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-md truncate w-full">{item.address}</p>
                    </div>
                    </div>
                ))}

                {history.length === 0 && (
                    <p className="text-center text-gray-600 py-10 text-sm italic">Belum ada pesanan selesai.</p>
                )}
                </div>
            </div>

             <button 
                onClick={handleLogout}
                className="w-full bg-red-500 text-white font-bold py-4 rounded-lg shadow-md hover:bg-red-600 transition-colors uppercase text-sm"
            >
                LOGOUT
            </button>
        </main>
    )
}