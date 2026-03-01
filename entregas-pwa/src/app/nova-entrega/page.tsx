import { AppHeader } from '@/components/app-header';
import { Card, CardContent } from '@/components/ui/card';
import { NewDeliveryForm } from '@/components/new-delivery-form';
import { requireAuth } from '@/lib/auth';
import type { Profile } from '@/types';

export default async function NovaEntregaPage() {
  const { supabase } = await requireAuth(['admin', 'vendedor']);

  const { data } = await supabase
    .from('profiles')
    .select('id,name,role')
    .eq('role', 'entregador')
    .order('name', { ascending: true });

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl p-4">
      <AppHeader subtitle="Preencha os dados para agendar" title="Nova entrega" />
      <Card>
        <CardContent className="pt-6">
          <NewDeliveryForm couriers={(data || []) as Profile[]} />
        </CardContent>
      </Card>
    </main>
  );
}
