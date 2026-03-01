'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { Delivery } from '@/types';

export function DeliveryCard({ delivery }: { delivery: Delivery }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateDelivery(cancel = false) {
    setLoading(true);
    const response = await fetch(`/api/deliveries/${delivery.id}/finish`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cancel })
    });

    if (!response.ok) {
      const data = await response.json();
      toast.error(data.error || 'Erro ao atualizar entrega');
      setLoading(false);
      return;
    }

    toast.success(cancel ? 'Entrega cancelada.' : 'Entrega finalizada com sucesso.');
    setLoading(false);
    router.refresh();
  }

  const whatsapp = `https://wa.me/${delivery.customer_phone.replace(/\D/g, '')}`;
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(delivery.location)}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{delivery.time.slice(0, 5)} - {delivery.customer_name}</span>
          <span className="text-sm text-muted-foreground">{delivery.status}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm">{delivery.location}</p>
        {delivery.notes ? <p className="text-xs text-muted-foreground">Obs: {delivery.notes}</p> : null}

        <div className="grid grid-cols-2 gap-2">
          <Button asChild size="sm" variant="outline">
            <a href={whatsapp} rel="noreferrer" target="_blank">
              <MessageCircle className="mr-1 h-4 w-4" /> WhatsApp
            </a>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a href={maps} rel="noreferrer" target="_blank">
              <MapPin className="mr-1 h-4 w-4" /> Maps
            </a>
          </Button>
        </div>

        {delivery.status === 'AGENDADO' ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-12 w-full text-base">FINALIZAR</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar finalização</DialogTitle>
                <DialogDescription>Deseja marcar esta entrega como FINALIZADA?</DialogDescription>
              </DialogHeader>
              <div className="mt-4 flex gap-2">
                <Button className="flex-1" disabled={loading} onClick={() => updateDelivery(false)}>
                  Confirmar
                </Button>
                <Button className="flex-1" disabled={loading} onClick={() => updateDelivery(true)} variant="outline">
                  Cancelar entrega
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ) : null}
      </CardContent>
    </Card>
  );
}
