'use server'

import { createClient } from '@/utils/supabase/server'

export async function takeOrder(orderId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("Anda harus login!");

  const { data, error } = await supabase
    .from('bookings')
    .update({ 
      technician_id: user.id,
      status: 'taken'
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
    
    // Pastikan nomor HP customer dalam format internasional
    const formattedPhone = data.customer_phone.startsWith('0') 
      ? '62' + data.customer_phone.slice(1) 
      : data.customer_phone;

    const technicianName = data.technicians?.name || "Teknisi KLIQ Home";
    const technicianWA = data.technicians?.phone || "";

    const msgToCustomer = 
      `Kabar baik Kak *${data.customer_name}*! 👋\n\n` +
      `Pesanan Anda sudah dikonfirmasi oleh teknisi kami:\n\n` +
      `👤 *Nama Teknisi:* ${technicianName}\n` +
      `📞 *Nomor WA:* wa.me/${technicianWA}\n\n` +
      `Teknisi akan segera meluncur ke lokasi Kakak.` +
      `Terima kasih sudah memilih *KLIQ Home*! 😊`;

    try {
      const response =await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: { 'Authorization': process.env.FONNTE_TOKEN || '' },
        body: new URLSearchParams({
          target: formattedPhone,
          message: msgToCustomer,
        }),
      });
      const result = await response.json();
      console.log("Respon Fonnte:", result);
    } catch (err) {
      console.error("Gagal mengirim notifikasi Fonnte:", err);
      // Tetap kembalikan success true karena update database sudah berhasil
    }

    return { 
      success: true, 
      result: 'winner',
      technicianName 
    };
  }

  return { success: true, result: 'taken' };
}