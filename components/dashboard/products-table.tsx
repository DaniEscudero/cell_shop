'use client';

import { useEffect, useState } from 'react';
import {
  MoreHorizontal,
  ArrowUpDown,
  ChevronDown,
  Smartphone,
  Edit,
  Eye,
  Trash2,
  Plus,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { products } from '@/lib/interface-products';
import { EditProductDialog } from '@/components/dashboard/edit-product-dialog';
import { AddProductDialog } from '@/components/dashboard/add-product-dialog';
import type { Product } from '@/lib/interface-products';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteProduct, getProducts } from '@/lib/api/products';
import { useSession } from 'next-auth/react';

export function ProductsTable() {
  const { data: session, status } = useSession();

  const { toast } = useToast();
  const [sorting, setSorting] = useState<'asc' | 'desc' | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const responseGetProducts = await getProducts();
      setSortedProducts(responseGetProducts);
      console.log('Buscando productos...');
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Error accediendo a los productos.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [editDialogOpen, addDialogOpen]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSorting(
        sorting === 'asc' ? 'desc' : sorting === 'desc' ? null : 'asc'
      );
      if (sorting === 'desc') setSortBy(null);
    } else {
      setSortBy(column);
      setSorting('asc');
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditDialogOpen(true);
  };

  const handleAddProduct = () => {
    fetchProducts();
  };

  const handleEditExit = () => {
    fetchProducts();
    setSelectedProduct(null);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!product._id || !session?.user.token) {
      toast({
        title: 'Error al eliminar',
        description: `El producto no se ha sido eliminado correctamente.`,
      });
      return;
    }
    deleteProduct(product._id, session?.user.token);

    toast({
      title: 'Producto eliminado',
      description: `El producto ha sido eliminado correctamente.`,
    });
    setTimeout(() => {
      console.log('Eliminando producto...');
    }, 2000);
    await fetchProducts();
  };

  return (
    <>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div>
            <CardTitle>Productos</CardTitle>
            <CardDescription>
              Gestiona el catálogo de productos de la tienda.
            </CardDescription>
          </div>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className='mr-2 h-4 w-4' />
            Añadir Producto
          </Button>
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-4 mb-4'>
            <div className='relative flex-1'>
              <Smartphone className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Buscar por nombre, marca o etiqueta...'
                className='pl-8'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                  Filtros
                  <ChevronDown className='ml-2 h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Filtrar por marca</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Apple
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>
                  Samsung
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>
                  Google
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>
                  Xiaomi
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>
                  OnePlus
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[50px]'>ID</TableHead>
                  <TableHead>
                    <Button
                      variant='ghost'
                      className='p-0 hover:bg-transparent'
                      onClick={() => handleSort('name')}
                    >
                      <span>Producto</span>
                      <ArrowUpDown className='ml-2 h-4 w-4' />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant='ghost'
                      className='p-0 hover:bg-transparent'
                      onClick={() => handleSort('brand')}
                    >
                      <span>Marca</span>
                      <ArrowUpDown className='ml-2 h-4 w-4' />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant='ghost'
                      className='p-0 hover:bg-transparent'
                      onClick={() => handleSort('price')}
                    >
                      <span>Precio</span>
                      <ArrowUpDown className='ml-2 h-4 w-4' />
                    </Button>
                  </TableHead>
                  <TableHead>Etiquetas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className='text-right'>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProducts.length > 0 ? (
                  sortedProducts.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>{product._id}</TableCell>
                      <TableCell>
                        <div className='font-medium'>{product.name}</div>
                      </TableCell>
                      <TableCell>{product.brand}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className='flex flex-wrap gap-1'>
                          {product.tags?.map((tag) => (
                            <Badge
                              key={tag}
                              variant='outline'
                              className='text-xs'
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline'>En stock</Badge>
                      </TableCell>
                      <TableCell className='text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='icon'>
                              <MoreHorizontal className='h-4 w-4' />
                              <span className='sr-only'>Abrir menú</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className='mr-2 h-4 w-4' />
                              <span>Ver detalles</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className='mr-2 h-4 w-4' />
                              <span>Editar producto</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className='text-destructive'
                                >
                                  <Trash2 className='mr-2 h-4 w-4' />
                                  <span>Eliminar</span>
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    ¿Estás seguro?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Esto
                                    eliminará permanentemente el producto{' '}
                                    {product.name} y no podrá ser recuperado.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteProduct(product)}
                                    className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className='h-24 text-center'>
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedProduct && (
        <EditProductDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          product={selectedProduct}
          onExit={handleEditExit}
        />
      )}
      <AddProductDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onProductAdded={handleAddProduct}
      />
    </>
  );
}
