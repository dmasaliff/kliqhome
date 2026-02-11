import { createClient } from '@/utils/supabase/client' 

export const uploadPhoto = async (file: File, folderName: string) => {
  const supabase = createClient();
  
  // Buat nama file unik: timestamp + nama asli (dibersihkan dari spasi)
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`
  const filePath = `${folderName}/${fileName}`

  // Upload ke bucket 'kliq-photos'
  const { data, error } = await supabase.storage
    .from('kliq_photos')
    .upload(filePath, file)

  if (error) throw error

  // Ambil URL publiknya
  const { data: { publicUrl } } = supabase.storage
    .from('kliq_photos')
    .getPublicUrl(filePath)

  return publicUrl 
}