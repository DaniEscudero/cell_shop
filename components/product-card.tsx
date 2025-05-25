'use client';

import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { Product } from '@/lib/interface-products';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);

    // Simular un pequeño retraso para mostrar el estado de carga
    setTimeout(() => {
      addItem({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });

      toast({
        title: 'Producto añadido',
        description: `${product.name} ha sido añadido a tu carrito.`,
      });

      setIsAdding(false);
    }, 500);
  };

  return (
    <Card className='overflow-hidden h-full w-full'>
      <div className='relative w-full aspect-square'>
        <Image
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          fill
          className='object-cover transition-transform hover:scale-105'
        />
        {product.tags &&
          product.tags.some((tag) => tag === 'Oferta' || tag === 'Nuevo') && (
            <div className='absolute top-2 left-2 z-10'>
              {product.tags.includes('Oferta') && (
                <Badge className='bg-red-500 hover:bg-red-600 mb-1'>
                  Oferta
                </Badge>
              )}
              {product.tags.includes('Nuevo') && (
                <Badge className='bg-green-500 hover:bg-green-600'>Nuevo</Badge>
              )}
            </div>
          )}
      </div>
      <CardContent className='p-4'>
        <div className='space-y-1'>
          <h3 className='font-medium'>{product.name}</h3>
          <p className='text-sm text-muted-foreground'>{product.brand}</p>
        </div>
        <div className='mt-2 flex items-center justify-between'>
          <span className='font-medium'>${product.price.toFixed(2)}</span>
          {product.discountPrice && (
            <span className='text-sm line-through text-muted-foreground'>
              ${product.discountPrice.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className='p-4 pt-0'>
        <Button
          className='w-full'
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          <ShoppingCart className='mr-2 h-4 w-4' />
          {isAdding ? 'Añadiendo...' : 'Añadir al carrito'}
        </Button>
      </CardFooter>
    </Card>
  );
}
