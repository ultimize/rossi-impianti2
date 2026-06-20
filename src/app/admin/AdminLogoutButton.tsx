'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function AdminLogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-btn font-saira font-semibold tracking-[0.5px] uppercase text-sm text-muted hover:text-white hover:bg-surface border border-transparent hover:border-border transition-all cursor-pointer"
    >
      <LogOut size={16} className="text-rosso" />
      <span>Disconnetti</span>
    </button>
  );
}
