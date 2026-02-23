"use server"

// 1. Ganti import-nya ke admin client yang kita buat tadi
import { createAdminClient } from '@/utils/supabase/admin'

export async function resetPasswordTanpaOTP(phone: string, newPassword: string) {
  // 2. Gunakan admin client (tanpa await karena ini createClient biasa)
  const supabaseAdmin = createAdminClient();
  
  // 3. Cari teknisi berdasarkan nomor HP di tabel publik
  const { data: technician, error: techError } = await supabaseAdmin
    .from('technicians')
    .select('id, name')
    .eq('phone', phone)
    .single();

  if (techError || !technician) {
    throw new Error("Nomor HP tidak terdaftar.");
  }

  // 4. Update password di Auth menggunakan Kunci Master (Service Role)
  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
    technician.id,
    { password: newPassword }
  );

  if (authError) {
    throw new Error("Gagal update sandi: " + authError.message);
  }

  return { success: true, name: technician.name };
}