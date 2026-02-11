import { createClient } from "@/utils/supabase/client";

export const uploadTechniciansDocs = async (file: File, folder: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;
  const supabase = createClient();

  const { error } = await supabase.storage
    .from('technicians_docs')
    .upload(filePath, file);

  if (error) {
    console.error("Gagal Upload ke Storage:", error.message);
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from('technicians_docs')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
};