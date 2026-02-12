'use server'

import { createClient } from "@/utils/supabase/client";

export async function sendWhastappInvoice({ 
  customer_phone, 
  id, 
  total_price, 
  technician_id 
}: { 
  customer_phone: string, 
  id: string, 
  total_price: number, 
  technician_id: string 
}) {

    if (!customer_phone || typeof customer_phone !== 'string') {
        console.error("Gagal kirim WA: Nomor HP tidak valid atau undefined");
        return { success: false, error: "Nomor HP tidak valid" };
    }

    try {
        const fonnteToken = process.env.FONNTE_TOKEN;
  
        const message = 
        `*NOTA SERVICE AC - KLIQ HOME* ✅

        Terima kasih telah menggunakan jasa kami!
        Berikut rincian orderan Anda:

        ID Order: ${id}
        Total Bayar: Rp ${total_price?.toLocaleString('id-ID') || '0'}

        Mohon bantu kami meningkatkan kualitas layanan dengan memberikan rating untuk teknisi kami melalui link berikut:
        👉 https://kliqhome.vercel.app/rating/${technician_id}

        Simpan nota digital ini sebagai bukti garansi. 
        KLIQ Home - Solusi Dingin Tanpa Ribet! ❄️`;


        const formattedPhone = customer_phone.startsWith('0') 
        ? '62' + customer_phone.slice(1) 
        : customer_phone;

        await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
            'Authorization': fonnteToken || '',
            },
            body: new URLSearchParams({
            'target': formattedPhone,
            'message': message,
            }),
        });
    } catch (waError) {
    console.error('Fonnte Error:', waError);
    }
    return { success: true }
}

export async function submitRatingAction({
  id,
  rating,
  review
}: {
  id: string;
  rating: number;
  review: string;
}) {
  const supabase = createClient();

  const { error } = await supabase
    .from('bookings')
    .update({
      rating_score: rating,
      customer_review: review,
    })
    .eq('id', id);

  if (error) {
    console.error('Error saving rating:', error.message);
    throw new Error('Gagal menyimpan rating');
  }

  return { success: true };
}

export async function getTechnicianByBooking(bookingId: string) {
  const supabase = createClient();

  console.log("Mencari teknisi untuk Booking ID:", bookingId);

  const { data: booking, error: bError } = await supabase
    .from('bookings')
    .select('technician_id')
    .eq('id', bookingId)
    .maybeSingle();

  if (bError) {
    console.error("Database Error:", bError.message);
    return null;
  }

  if (!booking) {
    console.error("Gagal: ID Booking tidak terdaftar di database.");
    return null;
  }

  if (!booking.technician_id) {
    console.error("Gagal: Kolom technician_id di baris ini masih KOSONG (NULL).");
    return null;
  }

    const { data: tech, error: tError } = await supabase
    .from('technicians')
    .select('id, name')
    .eq('id', booking.technician_id)
    .maybeSingle();

    if (tError || !tech) {
    console.error('Data teknisi tidak ditemukan di tabel technicians');
    return { id: booking.technician_id, name: "Teknisi KLIQ" };
  }

  return {
    id: tech.id,
    name: tech.name
  };
}