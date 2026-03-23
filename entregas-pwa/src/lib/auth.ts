import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Profile, UserRole } from '@/types';

export async function requireAuth(roles?: UserRole[]) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id,name,role')
    .eq('id', user.id)
    .single<Profile>();

  if (!profile) {
    redirect('/login');
  }

  if (roles && !roles.includes(profile.role)) {
    if (profile.role === 'entregador') {
      redirect('/entregas');
    }
    redirect('/painel');
  }

  return { user, profile, supabase };
}
