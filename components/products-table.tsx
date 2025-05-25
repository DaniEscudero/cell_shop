'use client';

import { useState } from 'react';
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
import type { Product } from '@/lib/interface-products';

export function ProductsTable() {
  const [sorting, setSorting] = useState<'asc' | 'desc' | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const sortedProducts = [...products]
    .sort((a, b) => {
      if (!sorting || !sortBy) return 0;

      const aValue = a[sortBy as keyof typeof a];
      const bValue = b[sortBy as keyof typeof b];

      if (sorting === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    })
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

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
          <Button>
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
                            <DropdownMenuItem className='text-destructive'>
                              <Trash2 className='mr-2 h-4 w-4' />
                              <span>Eliminar</span>
                            </DropdownMenuItem>
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

      <EditProductDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        product={selectedProduct}
      />
    </>
  );
}
