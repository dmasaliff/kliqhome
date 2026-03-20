'use server'

import { createClient } from '@/utils/supabase/server'

const DAFTAR_LAYANAN = [
  { id: "cuci_05_1", label: "Cuci AC (0.5 - 1 PK)", harga: 85000 },
  { id: "cuci_15", label: "Cuci AC (1.5 PK)", harga: 90000 },
  { id: "cuci_2", label: "Cuci AC (2 PK)", harga: 100000 },
  { id: "tambah_freon", label: "Tambah Freon", harga: 250000 },
  { id: "isi_freon_05_1", label: "Isi Freon Full (0.5-1 PK)", harga: 350000 },
  { id: "isi_freon_15_2", label: "Isi Freon Full (1.5-2 PK)", harga: 450000 },
  { id: "bongkar", label: "Bongkar AC", harga: 185000 },
  { id: "bongkar_pasang_05_1", label: "Bongkar Pasang (0.5-1 PK)", harga: 450000 },
  { id: "bongkar_pasang_15_2", label: "Bongkar Pasang (1.5-2 PK)", harga: 550000 },
  { id: "perbaikan", label: "Perbaikan AC", harga: 0 },
  { id: "pengecekan", label: "Pengecekan AC", harga: 75000 },
];

export async function submitOrder(data: {
  customer_name: string,
  customer_phone: string,
  address: string,
  service: string[],
  time_slot: string,
  keluhan: string,
}) {

  const pureServiceIds = data.service.map(s => s.split(" (")[0]);

  const hasActionService = data.service.some(id => 
    id.startsWith("cuci_") || 
    id.startsWith("isi_freon_") || 
    id.startsWith("tambah_freon") ||
    id.startsWith("bongkar")
  );

  const namaLayananLengkap = data.service.map(s => {
    const pureId = s.split(" (")[0];
    const unitSuffix = s.includes(" (") ? " (" + s.split(" (")[1] : "";
    const item = DAFTAR_LAYANAN.find(layanan => layanan.id === pureId);
    return item ? `${item.label}${unitSuffix}` : s;
  }).join(", ");

  const supabase = await createClient();
  const totalPrice = data.service.reduce((total, s) => {
    const pureId = s.split(" (")[0];
    const layanan = DAFTAR_LAYANAN.find(item => item.id === pureId)
    
    if (layanan) {
      if (hasActionService && pureId === "pengecekan") {
        return total + 0;
      }
      return total + layanan.harga;
    }
    return total;
  }, 0);

  console.log("Service yang diterima:", data.service);
  console.log("Total Harga terhitung:", totalPrice);

  const technicianShare = totalPrice * 0.9;

  const { data: newOrder, error } = await supabase
    .from('bookings')
    .insert([
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

      *Layanan:* ${namaLayananLengkap}
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
      `🛠 *Layanan:* ${namaLayananLengkap}\n` +
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