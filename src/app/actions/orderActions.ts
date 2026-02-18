'use server'

import { createClient } from '@/utils/supabase/server'

const DAFTAR_LAYANAN = [
  { id: "cuci", label: "Cuci AC Rutin", harga: 85000 },
  { id: "freon", label: "Tambah Freon", harga: 150000 },
  { id: "bongkar", label: "Bongkar Pasang", harga: 350000 },
  { id: "perbaikan", label: "Perbaikan", harga: 0 },
];

export async function submitOrder(data: {
  customer_name: string,
  customer_phone: string,
  address: string,
  service: string[],
  time_slot: string,
  keluhan: string,
}) {
  const supabase = await createClient();
  
  const totalPrice = data.service.reduce((total, labelLayanan) => {
    const ditemukan = DAFTAR_LAYANAN.find(item => item.label === labelLayanan);
    return total + (ditemukan ? ditemukan.harga : 0);
  }, 0);

  const technicianShare = totalPrice * 0.9;

  const { data: newOrder, error } = await supabase.from('bookings').insert([
    {
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        address: data.address,
        service: data.service,
        booking_date: new Date().toISOString().split('T')[0],
        time_slot: data.time_slot,
        total_price: totalPrice,
        technician_share: technicianShare,
        status: 'available',
        keluhan: data.keluhan,
    }
  ])
  .select() 
  .single();

  if (error) {
    console.error('Database Error:', error.message)
    throw new Error('Gagal menyimpan pesanan')
  }

  try {
    const orderUrl = `https://kliqhome.vercel.app/order/${newOrder.id}`;
    const msgTeknisi = 
      `🚨 *ORDER BARU KLIQ HOME* 🚨

      *Layanan:* ${data.service.join(', ')}
      *Jadwal:* ${data.time_slot}
      *Alamat:* ${data.address}

      *Total Bayar:* Rp ${totalPrice.toLocaleString('id-ID')}
      *Jatah Teknisi (90%): Rp ${technicianShare.toLocaleString('id-ID')}*

      ----------------------------------
      Segera ambil orderan!
      ${orderUrl}
      ----------------------------------`;

    const msgCustomer = `Halo Kak *${data.customer_name}*! 👋\n\n` +
      `Terima kasih sudah memesan di *KLIQ Home*. Pesanan Kakak sudah kami terima:\n\n` +
      `🛠 *Layanan:* ${data.service.join(', ')}\n` +
      `⏰ *Jadwal:* ${data.time_slot}\n` +
      `📍 *Alamat:* ${data.address}\n\n` +
      `Teknisi kami akan segera menghubungi Kakak dalam beberapa menit untuk konfirmasi kedatangan. Mohon ditunggu ya! 😊`;

    await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': process.env.FONNTE_TOKEN || '',
      },
      body: new URLSearchParams({
        target: process.env.WA_GROUP_ID || '',
        message: msgTeknisi,
        countryCode: '62',
      }),
    });
    
    const formattedPhone = data.customer_phone.startsWith('0') 
      ? '62' + data.customer_phone.slice(1) 
      : data.customer_phone;
      
    await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: { 'Authorization': process.env.FONNTE_TOKEN || '', },
      body: new URLSearchParams({
        target: formattedPhone,
        message: msgCustomer,
      }),
    });

  } catch (waError) {
    console.error('Fonnte Error:', waError);
    
  }

  return { success: true }
}