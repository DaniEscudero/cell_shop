'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

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
import { useAuth } from '@/hooks/use-auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { signIn, useSession } from 'next-auth/react';

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [errors, setErrors] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Redirigir si ya está autenticado
  // Redirigir si ya está autenticado
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    try {
      const registerResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
        {
          method: 'POST',
          body: JSON.stringify({
            name: name,
            email: email,
            password: password,
          }),
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (registerResponse.status != 201) {
        const data = await registerResponse.json();
        setErrors(data.errors);
        return;
      }
    } catch (error) {
      console.log(error);
      setErrors(['Error al conectar con el servidor']);
      return;
    }

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
    <div className='container mx-auto flex items-center justify-center py-16 md:py-24 max-w-7xl'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold'>Crear cuenta</CardTitle>
          <CardDescription>
            Ingresa tus datos para registrarte en la plataforma
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
              <Label htmlFor='name'>Nombre completo</Label>
              <Input
                id='name'
                placeholder='Tu nombre completo'
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                required
              />
            </div>
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
              <Label htmlFor='password'>Contraseña</Label>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
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
              {status === 'loading' ? (
                <span className='flex items-center gap-2'>
                  <span className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                  Registrando...
                </span>
              ) : (
                <span className='flex items-center gap-2'>
                  <UserPlus className='h-4 w-4' />
                  Crear cuenta
                </span>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className='text-center text-sm gap-2'>
          ¿Ya tienes una cuenta?{' '}
          <Link
            href='/login'
            className='font-medium text-primary hover:underline'
          >
            Inicia sesión
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
