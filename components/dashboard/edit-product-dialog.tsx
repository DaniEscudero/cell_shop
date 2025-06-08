'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { availableTags, brands, type Product } from '@/lib/interface-products';
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/ui/image-upload';
import { toast } from '../ui/use-toast';
import { signOut, useSession } from 'next-auth/react';
import { updateProduct, uploadImage } from '@/lib/api/products';

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onProductEdited: () => void;
}

export function EditProductDialog({
  open,
  onOpenChange,
  product,
  onProductEdited: onProductAdded,
}: EditProductDialogProps) {
  const [formData, setFormData] = useState<Product>(product);
  const [openBrandCombobox, setOpenBrandCombobox] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { data: session } = useSession();

  // Resetear el estado cuando cambia el producto o se abre/cierra el diálogo
  useEffect(() => {
    if (product && open) {
      setFormData(product);
      setImageFile(null);
      setTagInput('');
      setOpenBrandCombobox(false);
    }
  }, [product, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'price' || name === 'discountPrice') {
      setFormData({
        ...formData,
        [name]: Number.parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() === '') return;

    setFormData({
      ...formData,
      tags: [...(formData.tags || []), tagInput.trim()],
    });
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter((tag) => tag !== tagToRemove),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleAddPredefinedTag = (tag: string) => {
    if (!(formData.tags || []).includes(tag)) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tag],
      });
    }
  };

  const handleImageChange = (value: string | File) => {
    if (typeof value === 'string') {
      setFormData({
        ...formData,
        image: value || '/placeholder.svg?height=300&width=300',
      });
      setImageFile(null);
    } else {
      // Aquí solo guardamos el archivo para subirlo después a Firebase
      setImageFile(value);
      // La URL de la imagen se actualizará después de subirla a Firebase
    }
  };

  const handleClose = () => {
    setImageFile(null);
    setTagInput('');
    setOpenBrandCombobox(false);
    onProductAdded();
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      signOut();
      return;
    }

    // Validar campos requeridos
    if (
      !formData.name ||
      !formData.brand ||
      !formData.price ||
      !formData.description ||
      !formData.image
    ) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los campos requeridos.',
        variant: 'destructive',
      });
      console.log(formData, imageFile);
      return;
    }

    const decimalRegex = /^\d+(\.\d{1,2})?$/;
    if (!decimalRegex.test(String(formData.price))) {
      toast({
        title: 'Error',
        description: 'Por favor el precio tiene que tener solo 2 decimales.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.discountPrice && !decimalRegex.test(String(formData.price))) {
      toast({
        title: 'Error',
        description:
          'Por favor el precio con descuento tiene que tener solo 2 decimales.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (imageFile) {
        const formDataImage = new FormData();
        formDataImage.append('image', imageFile);

        const response = await uploadImage(formDataImage, session.user.token);
        const imgUrl = response.data.url;
        setFormData({ ...formData, image: imgUrl });
      }

      const newProduct: Product = {
        ...formData,
        price: formData.price,
        discountPrice: formData.price,
      };

      console.log('LLEGA');

      const updateProductResponse = await updateProduct(
        newProduct,
        session.user.token
      );
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: 'Error',
          description: err.message,
          variant: 'destructive',
        });
      }
      onOpenChange(false);
      return;
    }

    // Mostrar mensaje de éxito
    toast({
      title: 'Producto añadido',
      description: `El producto ${formData.name} ha sido añadido correctamente.`,
    });

    handleClose();
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>
              Modifica los detalles del producto. Haz clic en guardar cuando
              hayas terminado.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='id' className='text-right'>
                ID
              </Label>
              <Input
                id='id'
                name='id'
                value={formData._id || ''}
                onChange={handleChange}
                className='col-span-3'
                disabled
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Nombre
              </Label>
              <Input
                id='name'
                name='name'
                value={formData.name || ''}
                onChange={handleChange}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='brand' className='text-right'>
                Marca
              </Label>
              <div className='col-span-3'>
                <Popover
                  open={openBrandCombobox}
                  onOpenChange={setOpenBrandCombobox}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      role='combobox'
                      aria-expanded={openBrandCombobox}
                      className='w-full justify-between'
                    >
                      {formData.brand || 'Seleccionar marca...'}
                      <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-full p-0'>
                    <Command>
                      <CommandInput placeholder='Buscar marca...' />
                      <CommandList>
                        <CommandEmpty>
                          No se encontraron resultados.
                        </CommandEmpty>
                        <CommandGroup>
                          {brands.map((brand) => (
                            <CommandItem
                              key={brand.value}
                              value={brand.value}
                              onSelect={(currentValue) => {
                                setFormData({
                                  ...formData,
                                  brand: currentValue,
                                });
                                setOpenBrandCombobox(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  formData.brand === brand.value
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {brand.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='price' className='text-right'>
                Precio ($)
              </Label>
              <Input
                id='price'
                name='price'
                type='number'
                step='0.01'
                value={formData.price || ''}
                onChange={handleChange}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='discountPrice' className='text-right'>
                Precio con descuento ($)
              </Label>
              <Input
                id='discountPrice'
                name='discountPrice'
                type='number'
                step='0.01'
                value={formData.discountPrice || ''}
                onChange={handleChange}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-start gap-4'>
              <Label className='text-right pt-2'>Imagen</Label>
              <div className='col-span-3'>
                <ImageUpload
                  value={formData.image}
                  onChange={handleImageChange}
                  maxSizeMB={2}
                />
                <p className='mt-1 text-xs text-muted-foreground'>
                  Arrastra y suelta una nueva imagen o haz clic para
                  seleccionarla. Recomendado: 600x600px, formato JPG o PNG.
                </p>
              </div>
            </div>
            <div className='grid grid-cols-4 gap-4'>
              <Label htmlFor='description' className='text-right'>
                Descripción
              </Label>
              <Textarea
                id='description'
                name='description'
                value={formData.description || ''}
                onChange={handleChange}
                className='col-span-3'
                rows={4}
              />
            </div>
            <div className='grid grid-cols-4 items-start gap-4'>
              <Label className='text-right pt-2'>Etiquetas</Label>
              <div className='col-span-3 space-y-4'>
                <div className='flex flex-wrap gap-2'>
                  {(formData.tags || []).map((tag) => (
                    <Badge
                      key={tag}
                      variant='secondary'
                      className='flex items-center gap-1'
                    >
                      {tag}
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='h-4 w-4 p-0 hover:bg-transparent'
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className='h-3 w-3' />
                        <span className='sr-only'>Eliminar etiqueta {tag}</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className='flex gap-2'>
                  <Input
                    placeholder='Añadir etiqueta...'
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className='flex-1'
                  />
                  <Button type='button' onClick={handleAddTag} size='sm'>
                    Añadir
                  </Button>
                </div>
                <div>
                  <Label className='text-sm mb-2 block'>
                    Etiquetas predefinidas:
                  </Label>
                  <div className='flex flex-wrap gap-2'>
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant='outline'
                        className={cn(
                          'cursor-pointer hover:bg-secondary',
                          (formData.tags || []).includes(tag) && 'bg-secondary'
                        )}
                        onClick={() => handleAddPredefinedTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type='submit'>Guardar cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
