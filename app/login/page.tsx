'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [errors, setErrors] = useState<string[]>([]);
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const responseNextAuth = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (responseNextAuth?.error) {
      setErrors([responseNextAuth.error]);
      return;
    }

    router.push('/');
  };

  return (
    <div className='container mx-auto flex items-center justify-center py-16 md:py-24 max-w-7xl"'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold'>Iniciar sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {errors.length > 0 && (
              <Alert variant='destructive' className='mb-4'>
                {errors.map((err) => (
                  <AlertDescription>{err}</AlertDescription>
                ))}
              </Alert>
            )}
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='tu@email.com'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
              />
            </div>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='password'>Contraseña</Label>
                <Link
                  href='/forgot-password'
                  className='text-sm text-muted-foreground hover:text-primary'
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    //clearError();
                  }}
                  required
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4 text-muted-foreground' />
                  ) : (
                    <Eye className='h-4 w-4 text-muted-foreground' />
                  )}
                  <span className='sr-only'>
                    {showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  </span>
                </Button>
              </div>
            </div>
            <Button
              type='submit'
              className='w-full'
              disabled={status === 'loading'}
            >
              {status == 'loading' ? (
                <span className='flex items-center gap-2'>
                  <span className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                  Iniciando sesión...
                </span>
              ) : (
                <span className='flex items-center gap-2'>
                  <LogIn className='h-4 w-4' />
                  Iniciar sesión
                </span>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className='flex flex-col space-y-4'>
          <div className='text-center text-sm text-muted-foreground'>
            <span>Credenciales de prueba:</span>
            <div className='mt-1 grid grid-cols-2 gap-2 text-xs'>
              <div className='rounded-md border p-2'>
                <p className='font-medium'>Admin</p>
                <p>admin@example.com</p>
                <p>admin123</p>
              </div>
              <div className='rounded-md border p-2'>
                <p className='font-medium'>Usuario</p>
                <p>user@example.com</p>
                <p>user123</p>
              </div>
            </div>
          </div>
          <div className='text-center text-sm'>
            ¿No tienes una cuenta?{' '}
            <Link
              href='/register'
              className='font-medium text-primary hover:underline'
            >
              Regístrate
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
