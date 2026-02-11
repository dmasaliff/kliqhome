import { createClient } from "@/utils/supabase/client";

export async function getTechnicianProfile(techId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('technicians')
    .select('id, name, specialization, average_rating, total_jobs')
    .eq('id', techId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error.message);
    return null;
  }

  return data;
}

export async function getTechnicianFinance(techId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookings')
    .select('total_price, technician_share')
    .eq('technician_id', techId)
    .eq('status', 'completed');

  if (error) return { gross: 0, mitra: 0, obligation: 0 };

  // Hitung total menggunakan reduce
  const gross = data.reduce((acc, curr) => acc + (curr.total_price || 0), 0);
  const mitra = data.reduce((acc, curr) => acc + (curr.technician_share || 0), 0);
  
  // Kewajiban Setor = Pendapatan Kotor - Jatah Mitra
  const obligation = gross - mitra;

  return { gross, mitra, obligation };
}

export async function getTechnicianHistory(techId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookings')
    .select('id, booking_date, service, address, total_price')
    .eq('technician_id', techId)
    .eq('status', 'completed')
    .order('booking_date', { ascending: false })
    .limit(5);

  if (error) return [];
  return data;
}