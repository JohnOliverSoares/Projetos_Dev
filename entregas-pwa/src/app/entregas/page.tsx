import { AppHeader } from '@/components/app-header';
import { DeliveryCard } from '@/components/delivery-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTodayTomorrow } from '@/lib/date';
import { requireAuth } from '@/lib/auth';
import type { Delivery } from '@/types';

export default async function EntregasPage() {
  const { profile, supabase } = await requireAuth(['entregador']);
  const { today, tomorrow } = getTodayTomorrow();

  const { data } = await supabase
    .from('deliveries')
    .select('*')
    .eq('assigned_to', profile.id)
    .in('date', [today, tomorrow])
    .order('date', { ascending: true })
    .order('time', { ascending: true });

  const deliveries = (data || []) as Delivery[];
  const todayDeliveries = deliveries.filter((d) => d.date === today);
  const tomorrowDeliveries = deliveries.filter((d) => d.date === tomorrow);

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl p-4">
      <AppHeader subtitle="Somente hoje e amanhã" title="Minhas entregas" />

      <Tabs defaultValue="hoje">
        <TabsList>
          <TabsTrigger value="hoje">Hoje</TabsTrigger>
          <TabsTrigger value="amanha">Amanhã</TabsTrigger>
        </TabsList>
        <TabsContent value="hoje" className="space-y-3">
          {todayDeliveries.length ? todayDeliveries.map((d) => <DeliveryCard delivery={d} key={d.id} />) : <p className="text-sm text-muted-foreground">Sem entregas hoje.</p>}
        </TabsContent>
        <TabsContent value="amanha" className="space-y-3">
          {tomorrowDeliveries.length ? tomorrowDeliveries.map((d) => <DeliveryCard delivery={d} key={d.id} />) : <p className="text-sm text-muted-foreground">Sem entregas amanhã.</p>}
        </TabsContent>
      </Tabs>
    </main>
  );
}
