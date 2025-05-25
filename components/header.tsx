'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
  Menu,
  Search,
  ShoppingCart,
  User,
  Moon,
  Sun,
  LogOut,
  Settings,
  Heart,
  Package,
  Smartphone,
  LogIn,
  UserPlus,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/use-media-query';
import { CartItem } from '@/components/cart-item';
import { useCart } from '@/hooks/use-cart';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { verifySession } from '@/lib/api/users';

export function Header() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { items, totalPrice } = useCart();
  const { data: session, status } = useSession();

  const handleLogout = () => {
    signOut();
    router.push('/');
  };

  // Obtener las iniciales del nombre del usuario para el avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto flex h-16 items-center px-4'>
        {/* Mobile menu button */}
        <Button
          variant='ghost'
          size='icon'
          className='mr-2 md:hidden'
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className='h-5 w-5' />
          <span className='sr-only'>Open menu</span>
        </Button>

        {/* Logo */}
        <Link href='/' className='flex items-center gap-2 mr-4'>
          <Smartphone className='h-6 w-6' />
          <span className='font-bold text-xl hidden sm:inline-block'>
            CellShop
          </span>
        </Link>

        {/* Search bar */}
        <div className='relative flex-1 max-w-md mx-auto md:mx-0'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            type='search'
            placeholder='Search phones...'
            className='w-full pl-8 md:w-[300px] lg:w-[400px]'
          />
        </div>

        {/* Right side buttons */}
        <div className='flex items-center gap-2 ml-auto'>
          {/* Dashboard link (only for admin) */}
          {status === 'authenticated' &&
            session.user?.role.name === 'admin' && (
              <Link href='/dashboard'>
                <Button variant='outline' className='hidden md:flex'>
                  Dashboard
                </Button>
              </Link>
            )}

          <Button
            variant='ghost'
            size='icon'
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label='Toggle theme'
          >
            <Sun className='h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
            <Moon className='absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
            <span className='sr-only'>Toggle theme</span>
          </Button>

          {/* User menu */}
          {status === 'authenticated' ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='relative h-8 w-8 rounded-full'
                >
                  <Avatar className='h-8 w-8'>
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${session.user?.email}`}
                      alt={session.user?.name || ''}
                    />
                    <AvatarFallback>
                      {session.user?.name
                        ? getInitials(session.user.name)
                        : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuLabel className='font-normal text-xs text-muted-foreground'>
                  {session.user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href='/profile' className='cursor-pointer'>
                    <User className='mr-2 h-4 w-4' />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href='/orders' className='cursor-pointer'>
                    <Package className='mr-2 h-4 w-4' />
                    <span>Mis pedidos</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href='/wishlist' className='cursor-pointer'>
                    <Heart className='mr-2 h-4 w-4' />
                    <span>Lista de deseos</span>
                  </Link>
                </DropdownMenuItem>
                {session.user?.role.name === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href='/dashboard' className='cursor-pointer'>
                      <Settings className='mr-2 h-4 w-4' />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className='cursor-pointer'
                >
                  <LogOut className='mr-2 h-4 w-4' />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='sm'
                asChild
                className='hidden md:flex'
              >
                <Link href='/login'>
                  <LogIn className='mr-2 h-4 w-4' />
                  Iniciar sesión
                </Link>
              </Button>
              <Button size='sm' asChild className='hidden md:flex'>
                <Link href='/register'>
                  <UserPlus className='mr-2 h-4 w-4' />
                  Registrarse
                </Link>
              </Button>
              <Button variant='ghost' size='icon' asChild className='md:hidden'>
                <Link href='/login'>
                  <User className='h-5 w-5' />
                </Link>
              </Button>
            </div>
          )}

          {/* Cart */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon' aria-label='Shopping cart'>
                <div className='relative'>
                  <ShoppingCart className='h-5 w-5' />
                  {items.length > 0 && (
                    <Badge className='absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px] font-medium'>
                      {items.length}
                    </Badge>
                  )}
                </div>
              </Button>
            </SheetTrigger>
            <SheetContent side='right'>
              <SheetHeader>
                <SheetTitle>Shopping Cart ({items.length})</SheetTitle>
              </SheetHeader>
              <div className='flex flex-col gap-4 py-4'>
                {items.length > 0 ? (
                  <>
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
                    <div className='mt-4 space-y-4'>
                      <div className='flex items-center justify-between text-sm'>
                        <span>Subtotal</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                      <div className='flex items-center justify-between text-sm'>
                        <span>Shipping</span>
                        <span>Free</span>
                      </div>
                      <div className='flex items-center justify-between font-medium'>
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                      {status === 'authenticated' ? (
                        <Button className='w-full' asChild>
                          <Link href='/checkout'>Checkout</Link>
                        </Button>
                      ) : (
                        <div className='space-y-2'>
                          <Button className='w-full' asChild>
                            <Link href='/login?redirect=checkout'>
                              Iniciar sesión para comprar
                            </Link>
                          </Button>
                          <p className='text-xs text-center text-muted-foreground'>
                            Debes iniciar sesión para completar tu compra
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className='flex h-full flex-col items-center justify-center space-y-4'>
                    <ShoppingCart className='h-12 w-12 text-muted-foreground' />
                    <div className='text-center'>
                      <p className='text-lg font-medium'>Your cart is empty</p>
                      <p className='text-sm text-muted-foreground'>
                        Add items to your cart to see them here.
                      </p>
                    </div>
                    <Button asChild>
                      <Link href='/'>Continue Shopping</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side='left' className='w-[250px] sm:w-[300px]'>
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className='grid gap-4 py-4'>
            <Button variant='outline' className='justify-start' asChild>
              <Link href='/' onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
            </Button>

            {status === 'authenticated' ? (
              <>
                <Button variant='outline' className='justify-start' asChild>
                  <Link
                    href='/profile'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className='mr-2 h-4 w-4' />
                    Mi perfil
                  </Link>
                </Button>
                <Button variant='outline' className='justify-start' asChild>
                  <Link href='/orders' onClick={() => setMobileMenuOpen(false)}>
                    <Package className='mr-2 h-4 w-4' />
                    Mis pedidos
                  </Link>
                </Button>
                {session.user?.role.name === 'admin' && (
                  <Button variant='outline' className='justify-start' asChild>
                    <Link
                      href='/dashboard'
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className='mr-2 h-4 w-4' />
                      Dashboard
                    </Link>
                  </Button>
                )}
                <Button
                  variant='outline'
                  className='justify-start'
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className='mr-2 h-4 w-4' />
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Button variant='outline' className='justify-start' asChild>
                  <Link href='/login' onClick={() => setMobileMenuOpen(false)}>
                    <LogIn className='mr-2 h-4 w-4' />
                    Iniciar sesión
                  </Link>
                </Button>
                <Button variant='outline' className='justify-start' asChild>
                  <Link
                    href='/register'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserPlus className='mr-2 h-4 w-4' />
                    Registrarse
                  </Link>
                </Button>
              </>
            )}

            <Button variant='outline' className='justify-start' asChild>
              <Link href='/categories' onClick={() => setMobileMenuOpen(false)}>
                Categories
              </Link>
            </Button>
            <Button variant='outline' className='justify-start' asChild>
              <Link href='/deals' onClick={() => setMobileMenuOpen(false)}>
                Deals
              </Link>
            </Button>
            <Button variant='outline' className='justify-start' asChild>
              <Link href='/support' onClick={() => setMobileMenuOpen(false)}>
                Support
              </Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
