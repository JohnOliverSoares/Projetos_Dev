'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Delivery, Profile } from '@/types';

interface Props {
  today: string;
  tomorrow: string;
  deliveries: Delivery[];
  couriers: Profile[];
}

export function PainelClient({ today, tomorrow, deliveries, couriers }: Props) {
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');
  const [courierFilter, setCourierFilter] = useState<string>('TODOS');

  const byDate = useMemo(() => {
    const filterList = (date: string) =>
      deliveries.filter((delivery) => {
        const statusPass = statusFilter === 'TODOS' || delivery.status === statusFilter;
        const courierPass = courierFilter === 'TODOS' || delivery.assigned_to === courierFilter;
        return delivery.date === date && statusPass && courierPass;
      });

    return {
      today: filterList(today),
      tomorrow: filterList(tomorrow)
    };
  }, [courierFilter, deliveries, statusFilter, today, tomorrow]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Select onValueChange={setStatusFilter} value={statusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos os status</SelectItem>
            <SelectItem value="AGENDADO">Agendado</SelectItem>
            <SelectItem value="FINALIZADO">Finalizado</SelectItem>
            <SelectItem value="CANCELADO">Cancelado</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setCourierFilter} value={courierFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Entregador" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos entregadores</SelectItem>
            {couriers.map((courier) => (
              <SelectItem key={courier.id} value={courier.id}>
                {courier.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button asChild>
          <Link href="/nova-entrega">Nova entrega</Link>
        </Button>
      </div>

      <Tabs defaultValue="hoje">
        <TabsList>
          <TabsTrigger value="hoje">Hoje</TabsTrigger>
          <TabsTrigger value="amanha">Amanhã</TabsTrigger>
        </TabsList>

        <TabsContent value="hoje">
          <DeliveryTable deliveries={byDate.today} />
        </TabsContent>
        <TabsContent value="amanha">
          <DeliveryTable deliveries={byDate.tomorrow} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DeliveryTable({ deliveries }: { deliveries: Delivery[] }) {
  if (!deliveries.length) {
    return <p className="text-sm text-muted-foreground">Nenhuma entrega encontrada.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead className="bg-muted/60">
          <tr>
            <th className="p-3">Hora</th>
            <th className="p-3">Cliente</th>
            <th className="p-3">Local</th>
            <th className="p-3">Entregador</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery) => (
            <tr className="border-t" key={delivery.id}>
              <td className="p-3">{delivery.time.slice(0, 5)}</td>
              <td className="p-3">{delivery.customer_name}</td>
              <td className="p-3">{delivery.location}</td>
              <td className="p-3">{delivery.assigned_profile?.name ?? '-'}</td>
              <td className="p-3">{delivery.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
