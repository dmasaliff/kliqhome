'use server'

import { createClient } from '@/utils/supabase/server'

export async function takeOrder(orderId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Perbaikan: Server action tidak bisa alert(), kita kembalikan error
  if (!user) return { success: false, message: "Anda harus login!" };

  // 1. HITUNG JUMLAH ORDERAN TEKNISI (Cek apakah dapat promo 100%)
  const { count } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('technician_id', user.id)
    .eq('status', 'completed'); // Kita hitung yang sudah selesai saja

  const isPromoEligible = (count !== null && count < 3);

  // 2. AMBIL DATA BOOKING YANG MAU DIAMBIL
  const { data: currentBooking } = await supabase
    .from('bookings')
    .select('total_price')
    .eq('id', orderId)
    .single();

  // 3. UPDATE BOOKING DENGAN LOGIKA SHARE BARU
  const updatedShare = isPromoEligible ? currentBooking?.total_price : (currentBooking?.total_price * 0.9);

  const { data, error } = await supabase
    .from('bookings')
    .update({ 
      technician_id: user.id,
      status: 'taken',
      technician_share: updatedShare // REVISI SHARE DI SINI
    })
    .eq('id', orderId)
    .eq('status', 'available')
    .select(`
      *,
      technicians (
        name,
        phone
      )
    `)
    .single();

  if (error) {
    console.error("Error updating booking:", error);
    return { success: false, message: error.message }
  }

  if (data) {
    // --- LOGIKA NOTIFIKASI FONNTE ---
    const formattedPhone = data.customer_phone.startsWith('0') 
      ? '62' + data.customer_phone.slice(1) 
      : data.customer_phone;

    const technicianName = data.technicians?.name || "Teknisi KLIQ Home";
    const technicianWA = data.technicians?.phone || "";

    // Info tambahan buat teknisi (opsional, bisa lewat log)
    if (isPromoEligible) {
      console.log(`Teknisi ${technicianName} dapet promo 100% (Order ke-${(count || 0) + 1})`);
    }

    const msgToCustomer = 
      `Kabar baik Kak *${data.customer_name}*! 👋\n\n` +
      `Pesanan Anda sudah dikonfirmasi oleh teknisi kami:\n\n` +
      `👤 *Nama Teknisi:* ${technicianName}\n` +
      `📞 *Nomor WA:* https://wa.me/${technicianWA}\n\n` +
      `Teknisi akan segera meluncur ke lokasi Kakak.` +
      `Terima kasih sudah memilih *KLIQ Home*! 😊`;

    try {
      await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: { 'Authorization': process.env.FONNTE_TOKEN || '' },
        body: new URLSearchParams({
          target: formattedPhone,
          message: msgToCustomer,
        }),
      });
    } catch (err) {
      console.error("Gagal mengirim notifikasi Fonnte:", err);
    }

    return { 
      success: true, 
      result: 'winner',
      technicianName 
    };
  }

  return { success: true, result: 'taken' };
}