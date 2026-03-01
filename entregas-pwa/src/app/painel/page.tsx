import { AppHeader } from '@/components/app-header';
import { PainelClient } from '@/components/painel-client';
import { getTodayTomorrow } from '@/lib/date';
import { requireAuth } from '@/lib/auth';
import type { Delivery, Profile } from '@/types';

export default async function PainelPage() {
  const { supabase } = await requireAuth(['admin', 'vendedor']);
  const { today, tomorrow } = getTodayTomorrow();

  const { data: deliveriesRaw } = await supabase
    .from('deliveries')
    .select('*, assigned_profile:profiles!deliveries_assigned_to_fkey(id,name)')
    .in('date', [today, tomorrow])
    .order('date', { ascending: true })
    .order('time', { ascending: true });

  const { data: couriersRaw } = await supabase
    .from('profiles')
    .select('id,name,role')
    .eq('role', 'entregador')
    .order('name', { ascending: true });

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl p-4">
      <AppHeader subtitle="Gestão de entregas de hoje e amanhã" title="Painel" />
      <PainelClient
        couriers={(couriersRaw || []) as Profile[]}
        deliveries={(deliveriesRaw || []) as Delivery[]}
        today={today}
        tomorrow={tomorrow}
      />
    </main>
  );
}
