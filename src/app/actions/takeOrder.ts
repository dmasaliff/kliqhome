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
    .select();

  if (error) {
    return { success: false, message: error.message }
  }

  if (data && data.length > 0) {
    return { success: true, result: 'winner' };
  } else {
    return { success: true, result: 'taken' };
  }
}