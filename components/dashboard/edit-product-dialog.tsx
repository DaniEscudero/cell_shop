'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { X, Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/ui/image-upload';
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
import { availableTags, type Product } from '@/lib/interface-products';
import { signOut, useSession } from 'next-auth/react';
import { toast } from '../ui/use-toast';
import { updateProduct, uploadImage } from '@/lib/api/products';

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onExit: () => void;
}

const brands = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Samsung', value: 'Samsung' },
  { label: 'Google', value: 'Google' },
  { label: 'Xiaomi', value: 'Xiaomi' },
  { label: 'OnePlus', value: 'OnePlus' },
  { label: 'Motorola', value: 'Motorola' },
  { label: 'Sony', value: 'Sony' },
  { label: 'Nothing', value: 'Nothing' },
];

export const EditProductDialog = ({
  open,
  onOpenChange,
  product,
  onExit,
}: EditProductDialogProps) => {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState<Product>(product);
  const [openBrandCombobox, setOpenBrandCombobox] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  // Cargar datos del producto cuando se abre el modal
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

  const handleImageChange = (value: string | File) => {
    if (typeof value === 'string') {
      setFormData({
        ...formData,
        image: value || '/placeholder.svg?height=300&width=300',
      });
      setImageFile(null);
    } else {
      setImageFile(value);
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
      setIsSubmitting(false);
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
      setIsSubmitting(false);
      return;
    }

    if (formData.discountPrice && !decimalRegex.test(String(formData.price))) {
      toast({
        title: 'Error',
        description:
          'Por favor el precio con descuento tiene que tener solo 2 decimales.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
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

    onExit();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  //if (!open || !product) return null;

  return (
    <div
      className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm'
      onClick={handleBackdropClick}
    >
      <div className='bg-background border rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto relative z-[10000]'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b'>
          <div>
            <h2 className='text-lg font-semibold'>Editar Producto</h2>
            <p className='text-sm text-muted-foreground'>
              Modifica los detalles del producto. Haz clic en guardar cuando
              hayas terminado.
            </p>
          </div>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => onOpenChange(false)}
            className='h-6 w-6'
          >
            <X className='h-4 w-4' />
          </Button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className='p-6'>
          <div className='grid gap-4'>
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

          {/* Footer */}
          <div className='flex justify-end gap-2 pt-6 border-t mt-6'>
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                onOpenChange(false);
                onExit();
              }}
            >
              Cancelar
            </Button>
            <Button type='submit'>Guardar cambios</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
