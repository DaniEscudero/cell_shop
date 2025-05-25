'use client';

import type React from 'react';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { verifySession } from '@/lib/api/users';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Si no está autenticado, redirigir al login
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Si se requiere ser admin y el usuario no lo es, redirigir a la página principal
    if (requireAdmin && session?.user?.role.name !== 'admin') {
      router.push('/');
    }

    const fetchSession = async () => {
      console.log('Verify session...');
      try {
        if (!session?.user.token) throw new Error('No session, login out');
        const vs = await verifySession(session.user.token);
      } catch (err) {
        console.log(err);
        signOut();
      }
    };

    fetchSession();
  }, [
    status === 'authenticated',
    requireAdmin,
    router,
    session?.user?.role.name,
  ]);

  // No mostrar nada mientras se verifica la autenticación
  if (status === 'unauthenticated') {
    return null;
  }

  // Si se requiere ser admin y el usuario no lo es, no mostrar nada
  if (requireAdmin && session?.user?.role.name !== 'admin') {
    return null;
  }

  // Si pasa todas las verificaciones, mostrar el contenido
  return <>{children}</>;
}
