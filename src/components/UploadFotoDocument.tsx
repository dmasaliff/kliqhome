import { Camera, X } from "lucide-react";
import Image from 'next/image'

interface UploadProps {
  id: string;
  label: string;
  previewUrl: string | null;
  onUpload: (preview: string, file: File) => void;
  onRemove: () => void;
}

export function UploadFotoDocument({ id, label, previewUrl, onUpload, onRemove }: UploadProps) {
  return (
    <div className="bg-white rounded-4xl p-4 shadow-ms border space-y-3">
              <div className="bg-gray-100 p-2 rounded-lg flex items-center gap-2">
                <Camera size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
              </div>
              <div className="relative">
                <input
                    type="file"
                    accept="image/*"
                    id={id}
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                        const preview = URL.createObjectURL(file);
                        onUpload(preview, file);
                        }
                    }}
                />
                {/* Tombol yang diklik teknisi */}
                <label 
                    htmlFor={id}
                    className="w-full border-2 border-dashed border-blue-200 rounded-xl h-24 flex flex-col items-center justify-center text-[10px] text-blue-500 bg-blue-50/50 cursor-pointer hover:bg-blue-50 active:scale-95 transition-all"
                >
                <Camera size={24} className="mb-1" />
                KLIK UNTUK AMBIL FOTO
                </label>
    
                {previewUrl && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-white shadow-md animate-in zoom-in duration-300">
                        <Image 
                            src={previewUrl} 
                            alt="Hasil Foto Pekerjaan" 
                            fill
                            unoptimized
                            className="object-cover" 
                        />
                        {/* Tombol Hapus Foto */}
                        <button 
                            type="button"
                            onClick={onRemove}
                            className="absolute top-1 right-1 bg-red-500/90 text-white p-1 rounded-full shadow-md z-10"
                        >
                            <X size={14} strokeWidth={3} />
                        </button>
                        </div>
                    </div>
                    )}
                </div>
            </div>
  );
}