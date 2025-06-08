'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CreditCard } from 'lucide-react';

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
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { CartItem } from '@/components/cart-item';
import { useRouter } from 'next/navigation';
import { showErrorListToast, useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/hooks/use-auth';
import { AuthGuard } from '@/components/auth-guard';
import { createOrder } from '@/lib/api/orders';
import { Order } from '@/lib/interface-orders';
import { useSession } from 'next-auth/react';

export default function CheckoutPage() {
  return (
    <AuthGuard>
      <CheckoutContent />
    </AuthGuard>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const { toast } = useToast();
  const { items, totalPrice, clearCart } = useCart();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: session?.user.name || '',
    email: session?.user.email || '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'credit-card',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirigir si el carrito está vacío
  useEffect(() => {
    if (items.length === 0) {
      router.push('/');
    }
  }, [items, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      acceptTerms: checked,
    });
    if (errors.acceptTerms) {
      setErrors({
        ...errors,
        acceptTerms: '',
      });
    }
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData({
      ...formData,
      paymentMethod: value,
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.email.trim()) newErrors.email = 'El email es obligatorio';
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = 'Email inválido';
    if (!formData.street.trim())
      newErrors.street = 'La dirección es obligatoria';
    if (!formData.city.trim()) newErrors.city = 'La ciudad es obligatoria';
    if (!formData.postalCode.trim())
      newErrors.postalCode = 'El código postal es obligatorio';
    if (!formData.country.trim()) newErrors.country = 'El país es obligatorio';
    if (!formData.acceptTerms)
      newErrors.acceptTerms = 'Debes aceptar las condiciones';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const order: Order = {
        customerName: formData.name,
        date: new Date(),
        status: 'processing',
        products: items.map((item) => item.id),
        total: totalPrice,
      };

      try {
        const responseCreateOrder = await createOrder(
          order,
          session?.user.token || ''
        );
      } catch (err) {
        showErrorListToast(err as string[]);
        return;
      }

      console.log('Pedido realizado:', {
        items,
        shippingInfo: formData,
        total: totalPrice,
      });

      // Mostrar toast de confirmación
      toast({
        title: 'Pedido realizado con éxito',
        description: 'Recibirás un email con los detalles de tu compra.',
      });

      // Limpiar el carrito
      clearCart();

      // Redirigir a la página de confirmación
      router.push('/checkout/success');
    }
  };

  // Calcular totales
  const subtotal = totalPrice;
  const shipping = 0; // Envío gratuito
  const total = subtotal + shipping;

  if (items.length === 0) {
    return null; // No renderizar nada mientras redirige
  }

  return (
    <div className='container mx-auto max-w-6xl px-4 py-8'>
      <div className='mb-8 container mx-auto max-w-6xl px-4'>
        <Link
          href='/'
          className='flex items-center text-sm text-muted-foreground hover:text-foreground'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Volver a la tienda
        </Link>
      </div>

      <div className='grid gap-8 md:grid-cols-2'>
        {/* Formulario de envío */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Información de envío</CardTitle>
              <CardDescription>
                Introduce tus datos para completar el pedido
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                id='checkout-form'
                onSubmit={handleSubmit}
                className='space-y-4'
              >
                <div className='space-y-2'>
                  <Label htmlFor='name'>Nombre completo</Label>
                  <Input
                    id='name'
                    name='name'
                    placeholder='Tu nombre completo'
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <p className='text-sm text-destructive'>{errors.name}</p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    placeholder='tu@email.com'
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <p className='text-sm text-destructive'>{errors.email}</p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='street'>Dirección</Label>
                  <Input
                    id='street'
                    name='street'
                    placeholder='Calle y número'
                    value={formData.street}
                    onChange={handleChange}
                  />
                  {errors.street && (
                    <p className='text-sm text-destructive'>{errors.street}</p>
                  )}
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='city'>Ciudad</Label>
                    <Input
                      id='city'
                      name='city'
                      placeholder='Ciudad'
                      value={formData.city}
                      onChange={handleChange}
                    />
                    {errors.city && (
                      <p className='text-sm text-destructive'>{errors.city}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='postalCode'>Código postal</Label>
                    <Input
                      id='postalCode'
                      name='postalCode'
                      placeholder='Código postal'
                      value={formData.postalCode}
                      onChange={handleChange}
                    />
                    {errors.postalCode && (
                      <p className='text-sm text-destructive'>
                        {errors.postalCode}
                      </p>
                    )}
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='country'>País</Label>
                  <Input
                    id='country'
                    name='country'
                    placeholder='País'
                    value={formData.country}
                    onChange={handleChange}
                  />
                  {errors.country && (
                    <p className='text-sm text-destructive'>{errors.country}</p>
                  )}
                </div>

                <Separator className='my-4' />

                <div className='space-y-2'>
                  <Label>Método de pago</Label>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={handlePaymentMethodChange}
                    className='flex flex-col space-y-2'
                  >
                    <div className='flex items-center space-x-2 rounded-md border p-3'>
                      <RadioGroupItem
                        value='credit-card'
                        id='payment-credit-card'
                      />
                      <Label
                        htmlFor='payment-credit-card'
                        className='flex-1 cursor-pointer'
                      >
                        Tarjeta de crédito
                      </Label>
                      <div className='flex items-center gap-1'>
                        <div className='h-6 w-10 rounded bg-muted'></div>
                        <div className='h-6 w-10 rounded bg-muted'></div>
                      </div>
                    </div>
                    <div className='flex items-center space-x-2 rounded-md border p-3'>
                      <RadioGroupItem value='paypal' id='payment-paypal' />
                      <Label
                        htmlFor='payment-paypal'
                        className='flex-1 cursor-pointer'
                      >
                        PayPal
                      </Label>
                      <div className='h-6 w-10 rounded bg-muted'></div>
                    </div>
                    <div className='flex items-center space-x-2 rounded-md border p-3'>
                      <RadioGroupItem
                        value='bank-transfer'
                        id='payment-bank-transfer'
                      />
                      <Label
                        htmlFor='payment-bank-transfer'
                        className='flex-1 cursor-pointer'
                      >
                        Transferencia bancaria
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className='flex items-start space-x-2 pt-2'>
                  <Checkbox
                    id='terms'
                    checked={formData.acceptTerms}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <div className='grid gap-1.5 leading-none'>
                    <label
                      htmlFor='terms'
                      className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    >
                      Acepto las condiciones de devolución
                    </label>
                    <p className='text-sm text-muted-foreground'>
                      He leído y acepto las{' '}
                      <Link href='/terms' className='underline'>
                        condiciones de devolución
                      </Link>
                      .
                    </p>
                    {errors.acceptTerms && (
                      <p className='text-sm text-destructive'>
                        {errors.acceptTerms}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Resumen del pedido */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumen del pedido</CardTitle>
              <CardDescription>
                Revisa los artículos de tu carrito
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  quantity={item.quantity}
                  image={item.image}
                />
              ))}

              <Separator className='my-4' />

              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Envío</span>
                  <span>
                    {shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <Separator className='my-2' />
                <div className='flex justify-between font-medium'>
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type='submit' form='checkout-form' className='w-full'>
                <CreditCard className='mr-2 h-4 w-4' />
                Completar compra
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
