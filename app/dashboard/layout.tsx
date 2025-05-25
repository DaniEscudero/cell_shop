'use client';

import type React from 'react';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { Menu, ShoppingBag, Users, Package } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AuthGuard } from '@/components/auth-guard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAdmin>
      <div className='flex min-h-screen flex-col'>
        {/* Mobile header */}
        <header className='sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static md:hidden'>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='outline' size='icon' className='md:hidden'>
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='w-64 p-0'>
              <MobileSidebar />
            </SheetContent>
          </Sheet>
          <Link
            href='/dashboard'
            className='flex items-center gap-2 font-semibold'
          >
            <span>Admin Dashboard</span>
          </Link>
        </header>

        <div className='flex flex-1'>
          <DashboardSidebar />
          <main className='flex-1 overflow-y-auto p-6'>{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}

function MobileSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: ShoppingBag,
      isActive:
        isActive('/dashboard') &&
        !isActive('/dashboard/usuarios') &&
        !isActive('/dashboard/pedidos') &&
        !isActive('/dashboard/productos'),
    },
    {
      name: 'Usuarios',
      href: '/dashboard/usuarios',
      icon: Users,
      isActive: isActive('/dashboard/usuarios'),
    },
    {
      name: 'Pedidos',
      href: '/dashboard/pedidos',
      icon: Package,
      isActive: isActive('/dashboard/pedidos'),
    },
    {
      name: 'Productos',
      href: '/dashboard/productos',
      icon: ShoppingBag,
      isActive: isActive('/dashboard/productos'),
    },
  ];

  return (
    <div className='flex h-full flex-col border-r bg-background'>
      <div className='flex h-14 items-center border-b px-4'>
        <Link
          href='/dashboard'
          className='flex items-center gap-2 font-semibold'
        >
          <ShoppingBag className='h-6 w-6' />
          <span>Admin Dashboard</span>
        </Link>
      </div>
      <div className='flex-1 overflow-auto py-2'>
        <nav className='grid gap-1 px-2'>
          {navItems.map((item) => (
            <Button
              key={item.href}
              asChild
              variant={item.isActive ? 'secondary' : 'ghost'}
              className='justify-start'
            >
              <Link href={item.href}>
                <item.icon className='mr-2 h-4 w-4' />
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
      <div className='border-t p-4'>
        <p className='text-xs text-muted-foreground'>
          © {new Date().getFullYear()} CellShop Admin
        </p>
      </div>
    </div>
  );
}
