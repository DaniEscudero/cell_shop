export interface Product {
  _id?: string;
  name: string;
  brand: string;
  price: number;
  discountPrice?: number;
  image: string;
  description: string;
  tags?: string[];
  numSales?: number;
}

export const availableTags = [
  'Premium',
  'Gama media',
  'Económico',
  'Nuevo',
  'Oferta',
  'Fotografía',
  'Rendimiento',
  'Batería',
  'Diseño',
  'Profesional',
  'Gaming',
  'Resistente',
  'Destacados',
  'Lanzamientos',
  'Más Vendidos',
];

export const products: Product[] = [
  {
    _id: '1',
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    price: 999,
    image: '/placeholder.svg?height=300&width=300',
    description: 'The latest iPhone with A17 Pro chip and titanium design.',
    tags: ['Apple', 'Premium', 'Nuevo'],
  },
  {
    _id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    price: 1199,
    discountPrice: 1299,
    image: '/placeholder.svg?height=300&width=300',
    description: 'Flagship Android phone with S Pen and advanced AI features.',
    tags: ['Samsung', 'Premium', 'Oferta'],
  },
  {
    _id: '3',
    name: 'Google Pixel 8',
    brand: 'Google',
    price: 799,
    image: '/placeholder.svg?height=300&width=300',
    description: "Google's latest phone with advanced camera system and AI.",
    tags: ['Google', 'Gama media', 'Fotografía'],
  },
  {
    _id: '4',
    name: 'OnePlus 12',
    brand: 'OnePlus',
    price: 899,
    image: '/placeholder.svg?height=300&width=300',
    description: 'Powerful Android phone with Hasselblad camera system.',
    tags: ['OnePlus', 'Premium', 'Rendimiento'],
  },
  {
    _id: '5',
    name: 'Xiaomi 14 Pro',
    brand: 'Xiaomi',
    price: 899,
    discountPrice: 999,
    image: '/placeholder.svg?height=300&width=300',
    description: 'Feature-packed phone with Leica optics.',
    tags: ['Xiaomi', 'Premium', 'Oferta', 'Fotografía'],
  },
  {
    _id: '6',
    name: 'Nothing Phone (2)',
    brand: 'Nothing',
    price: 699,
    image: '/placeholder.svg?height=300&width=300',
    description:
      'Unique design with Glyph interface and clean Android experience.',
    tags: ['Nothing', 'Gama media', 'Diseño'],
  },
  {
    _id: '7',
    name: 'Motorola Edge 40 Pro',
    brand: 'Motorola',
    price: 799,
    image: '/placeholder.svg?height=300&width=300',
    description: 'Sleek Android phone with curved display and fast charging.',
    tags: ['Motorola', 'Gama media', 'Batería'],
  },
  {
    _id: '8',
    name: 'Sony Xperia 1 V',
    brand: 'Sony',
    price: 1099,
    image: '/placeholder.svg?height=300&width=300',
    description: 'Professional-grade camera features in a premium smartphone.',
    tags: ['Sony', 'Premium', 'Fotografía', 'Profesional'],
  },
];
