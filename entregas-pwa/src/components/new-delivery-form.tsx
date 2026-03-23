'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Profile } from '@/types';

export function NewDeliveryForm({ couriers }: { couriers: Profile[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    date: '',
    time: '',
    location: '',
    customer_name: '',
    customer_phone: '',
    notes: '',
    assigned_to: ''
  });

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!form.assigned_to) {
      toast.error('Selecione um entregador.');
      return;
    }

    setLoading(true);

    const response = await fetch('/api/deliveries/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      const data = await response.json();
      toast.error(data.error || 'Erro ao criar entrega');
      setLoading(false);
      return;
    }

    toast.success('Entrega criada com sucesso!');
    router.push('/painel');
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <Input id="date" required type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Hora</Label>
          <Input id="time" required type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Local</Label>
        <Input id="location" required value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="customer_name">Cliente</Label>
          <Input id="customer_name" required value={form.customer_name} onChange={(e) => setForm((f) => ({ ...f, customer_name: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customer_phone">Telefone</Label>
          <Input id="customer_phone" required value={form.customer_phone} onChange={(e) => setForm((f) => ({ ...f, customer_phone: e.target.value }))} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Entregador</Label>
        <Select onValueChange={(value) => setForm((f) => ({ ...f, assigned_to: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {couriers.map((courier) => (
              <SelectItem key={courier.id} value={courier.id}>
                {courier.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea id="notes" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
      </div>

      <Button className="w-full sm:w-auto" disabled={loading} type="submit">
        {loading ? 'Salvando...' : 'Salvar entrega'}
      </Button>
    </form>
  );
}
