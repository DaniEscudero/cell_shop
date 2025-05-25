import Link from 'next/link';
import { Smartphone } from 'lucide-react';

export function Footer() {
  return (
    <footer className='border-t bg-background w-full'>
      <div className='container mx-auto px-4 py-8 md:py-12 max-w-7xl'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
          <div>
            <Link href='/' className='flex items-center gap-2'>
              <Smartphone className='h-6 w-6' />
              <span className='font-bold text-xl'>CellShop</span>
            </Link>
            <p className='mt-2 text-sm text-muted-foreground'>
              Your one-stop shop for premium mobile phones and accessories.
            </p>
          </div>
          <div>
            <h3 className='mb-4 text-sm font-medium'>Shop</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/categories'
                  className='text-muted-foreground hover:text-foreground'
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href='/brands'
                  className='text-muted-foreground hover:text-foreground'
                >
                  Brands
                </Link>
              </li>
              <li>
                <Link
                  href='/deals'
                  className='text-muted-foreground hover:text-foreground'
                >
                  Deals
                </Link>
              </li>
              <li>
                <Link
                  href='/new-arrivals'
                  className='text-muted-foreground hover:text-foreground'
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='mb-4 text-sm font-medium'>Account</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/profile'
                  className='text-muted-foreground hover:text-foreground'
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  href='/orders'
                  className='text-muted-foreground hover:text-foreground'
                >
                  Orders
                </Link>
              </li>
              <li>
                <Link
                  href='/wishlist'
                  className='text-muted-foreground hover:text-foreground'
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link
                  href='/settings'
                  className='text-muted-foreground hover:text-foreground'
                >
                  Settings
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='mb-4 text-sm font-medium'>Support</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/contact'
                  className='text-muted-foreground hover:text-foreground'
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href='/faq'
                  className='text-muted-foreground hover:text-foreground'
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href='/shipping'
                  className='text-muted-foreground hover:text-foreground'
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href='/privacy'
                  className='text-muted-foreground hover:text-foreground'
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className='mt-8 border-t pt-8 text-center text-sm text-muted-foreground'>
          <p>© {new Date().getFullYear()} CellShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
