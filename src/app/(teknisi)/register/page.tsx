"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { PendingVerification } from "@/components/PendingVerification";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { UploadFoto } from "@/components/UploadFoto";
import {createClient} from "@/utils/supabase/client"
import {uploadTechniciansDocs} from "@/app/actions/uploadTechniciansDocs"

export default function RegisterPage() {
    const [nama, setNama] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [alamat, setAlamat] = useState("");
    const [sandi, setSandi] = useState("");
    const [keahlian, setKeahlian] = useState<string[]>([]);

    const supabase = createClient();

    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [fileKtp, setFileKtp] = useState<File | null>(null);
    const [fileSelfie, setFileSelfie] = useState<File | null>(null);
    const [fileCert, setFileCert] = useState<File | null>(null);

    const [previewKtp, setPreviewKtp] = useState<string | null>(null);
    const [previewSelfie, setPreviewSelfie] = useState<string | null>(null);
    const [previewCert, setPreviewCert] = useState<string | null>(null);

    const handleSuccess = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setIsSuccess(true);

        try {
            const [urlKtp, urlSelfie, urlCert] = await Promise.all([
                fileKtp ? uploadTechniciansDocs(fileKtp, 'ktp') : Promise.resolve(null),
                fileSelfie ? uploadTechniciansDocs(fileSelfie, 'selfie') : Promise.resolve(null),
                fileCert ? uploadTechniciansDocs(fileCert, 'certificates') : Promise.resolve(null)
            ]);

            const email = `kliq.${whatsapp.trim()}@gmail.com`;

            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email,
                password: sandi,
            });

            if (authError) throw authError;

            const userId = authData.user?.id;

            if (userId) {
                const { error: dbError } = await supabase
                    .from('technicians')
                    .upsert([
                        {
                            id: userId,
                            name: nama,
                            phone: whatsapp,
                            address: alamat,
                            specialization: keahlian,
                            url_ktp: urlKtp,
                            url_selfie: urlSelfie,
                            url_cert: urlCert,
                            avatar_url: null,
                            is_active: true,
                            average_rating: 0,
                            total_jobs: 0
                        }
                    ]);

                if (dbError) throw dbError;
            }

            setIsSuccess(true);

        } catch (err) {
            console.error("LOG ERROR LENGKAP:", err);
            alert("Gagal: " + (err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleLayananChange = (item: string) => {
        setKeahlian((prev) =>
            prev.includes(item) 
            ? prev.filter((i) => i !== item)
            : [...prev, item]
         );
    };

    const isFormValid = 
        nama.trim() !== "" && 
        whatsapp.length >= 10 && 
        alamat.trim().length >= 5 && 
        sandi.length > 0;

    return(
        <main className="min-h-screen bg-[#D9E3F0] p-4 pb-24">
              {isSuccess ? (
                <div className="mt-3">
                  <PendingVerification />
                </div>
              ) : (
              <>

              {/* Header */}
              <div className="flex items-center mb-6">
                <Link href="/">
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                </Link>
                <div className="flex-1 text-center pr-6">
                  <h1 className="text-xl font-bold text-gray-900">GABUNG JADI MITRA</h1>
                  <p className="text-xs font-medium text-gray-600">Ayo tingkatkan pendapatan bersama kami!</p>
                </div>
              </div>

                <div className="bg-white rounded-[24px] p-5 shadow-sm space-y-6">
                    {/* Input Nama & WhatsApp */}
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold ml-1">Nama Lengkap</label>
                            <input 
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            className="w-full p-3 rounded-xl border border-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukkan nama..." />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold ml-1">Nomor WhatsApp Aktif</label>
                            <input 
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            className="w-full p-3 rounded-xl border border-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            placeholder="0812..." />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold ml-1">Alamat Lengkap</label>
                            <input 
                            value={alamat}
                            onChange={(e) => setAlamat(e.target.value)}
                            className="w-full p-3 rounded-xl border border-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            placeholder="Nama jalan, nomor rumah..." />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold ml-1">Masukkan kata sandi</label>
                            <input 
                            value={sandi}
                            onChange={(e) => setSandi(e.target.value)}
                            className="w-full p-3 rounded-xl border border-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            placeholder="" />
                        </div>
                    </div>
                </div>

                {/* Pilih Keahlian */}
                <div className="bg-white rounded-4xl my-5 p-5 shadow-sm space-y-4">
                    <h3 className="text-xs font-bold uppercase text-black">Pilih Keahlian Utama Anda</h3>
                    {["Cuci AC Rutin", "Isi/Tambah Freon", "Perbaikan Kebocoran(las pipa)", "Perbaikan modul kelistrikan(senior only)", "Bongkar Pasang"].map((item) => (
                        <div key={item} className="flex items-center space-x-3">
                        <Checkbox 
                            onCheckedChange={() => handleLayananChange(item)}
                            id={item} 
                            className="border-blue-300 data-[state=checked]:bg-blue-500" 
                        />
                        <label htmlFor={item} className="text-sm font-medium">{item}</label>
                        </div>
                    ))}
                </div>

                {/* 3. Dokumentasi Foto*/}
                <div className="space-y-3">
                    <h3 className="text-[14px] font-bold uppercase tracking-wider text-black">Verifikasi Dokumen</h3>

                    {/* BAGIAN KTP */}
                    <UploadFoto 
                    id="foto-ktp" 
                    label="Foto KTP" 
                    previewUrl={previewKtp} 
                    onUpload={(preview, file) => {
                        setPreviewKtp(preview);
                        setFileKtp(file);
                    }}
                    onRemove={() => { setPreviewKtp(null); setFileKtp(null); }}
                    />

                    {/* BAGIAN SELFIE */}
                    <UploadFoto 
                    id="foto-selfie" 
                    label="Foto Selfie" 
                    previewUrl={previewSelfie} 
                    onUpload={(preview, file) => {
                        setPreviewSelfie(preview);
                        setFileSelfie(file);
                    }}
                    onRemove={() => { setPreviewSelfie(null); setFileSelfie(null); }}
                    />

                    {/* BAGIAN SERTIFIKAT */}
                    <UploadFoto 
                    id="foto-sertifikat" 
                    label="Foto Sertifikat / Bukti Hasil Kerja Sebelumnya" 
                    previewUrl={previewCert} 
                    onUpload={(preview, file) => {
                        setPreviewCert(preview);
                        setFileCert(file);
                    }}
                    onRemove={() => { setPreviewCert(null); setFileCert(null); }}
                    />

                    <div className="flex items-center space-x-3">
                        <Checkbox 
                            className="border-gray-500 rounded mr-2" 
                        />
                        <label className="text-[12px] font-medium">
                            Saya menyetujui <span className="text-blue-600"> Syarat & Ketentuan Mitra KLIQ HOME </span> 
                        </label>
                    </div>
                    
                </div>

                {/* Button */}
                <div className="bottom-6 left-0 right-0 mt-6">
                    <Button 
                    onClick={handleSuccess}
                    disabled={!isFormValid || loading}
                    className={`w-full py-6 rounded-xl font-bold text-lg shadow-lg
                    ${isFormValid ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 text-gray-300 cursor-not-allowed'}`}
                    >
                    {loading ? "Mendaftar..." : "Daftar Sekarang"}
                    </Button>
                </div>
              </>
              )}
        </main>
    )
}