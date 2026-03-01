import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function AppHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      <Button asChild size="sm" variant="outline">
        <Link href="/auth/signout">Sair</Link>
      </Button>
    </header>
  );
}
