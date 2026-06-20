import { createClient } from '@/lib/supabase/server';
import AdminOrdersClient from './AdminOrdersClient';
import type { Order } from '@/lib/types';

export const revalidate = 0; // Disable cache for admin panel

export default async function AdminOrdersPage() {
  const supabase = createClient();

  // Fetch all orders
  const { data: rawOrders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  const orders = (rawOrders || []) as Order[];

  return <AdminOrdersClient initialOrders={orders} />;
}
