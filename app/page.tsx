import { BannerSlider } from '@/components/banner-slider';
import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/interface-products';

export default function Home() {
  return (
    <div className='flex flex-col w-full'>
      {/* Banner Slider - Full width, no gap */}
      <section className='w-full'>
        <BannerSlider />
      </section>

      {/* Product sections con contenedor centrado */}
      <div className='container mx-auto max-w-5xl px-4 py-8 md:py-12'>
        <section className='mb-12'>
          <h1 className='mb-4 text-3xl font-bold tracking-tight'>
            Teléfonos Destacados
          </h1>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {products.map((product) => (
              <div key={product._id} className='flex justify-center'>
                <div className='w-full max-w-[280px]'>
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className='mb-12'>
          <h2 className='mb-4 text-2xl font-bold tracking-tight'>
            Nuevos Lanzamientos
          </h2>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {products.slice(4, 7).map((product) => (
              <div key={product._id} className='flex justify-center'>
                <div className='w-full max-w-[280px]'>
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className='mb-4 text-2xl font-bold tracking-tight'>
            Más Vendidos
          </h2>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {products.slice(2, 5).map((product) => (
              <div key={product._id} className='flex justify-center'>
                <div className='w-full max-w-[280px]'>
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
