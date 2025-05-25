'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, X, Plus } from 'lucide-react';

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
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ui/image-upload';
import { useSession, signOut } from 'next-auth/react';
import { createProduct, getProducts, uploadImage } from '@/lib/api/products';
import { error } from 'console';
import { availableTags, Product } from '@/lib/interface-products';

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductAdded: () => void;
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

export function AddProductDialog({
  open,
  onOpenChange,
  onProductAdded,
}: AddProductDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    discountPrice: '',
    image: '/placeholder.svg?height=300&width=300',
    description: '',
    tags: [] as string[],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [openBrandCombobox, setOpenBrandCombobox] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
      tags: [...formData.tags, tagInput.trim()],
    });
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleAddPredefinedTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag],
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      price: '',
      discountPrice: '',
      image: '/placeholder.svg?height=300&width=300',
      description: '',
      tags: [],
    });
    setImageFile(null);
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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
      !imageFile
    ) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los campos requeridos.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    const decimalRegex = /^\d+(\.\d{1,2})?$/;
    if (!decimalRegex.test(formData.price)) {
      toast({
        title: 'Error',
        description: 'Por favor el precio tiene que tener solo 2 decimales.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    if (formData.discountPrice && !decimalRegex.test(formData.price)) {
      toast({
        title: 'Error',
        description:
          'Por favor el precio con descuento tiene que tener solo 2 decimales.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    const formDataImage = new FormData();
    formDataImage.append('image', imageFile);

    try {
      const response = await uploadImage(formDataImage, session.user.token);
      console.log(response);
      const imgUrl = response.data.url;

      const newProduct: Product = {
        ...formData,
        price: parseFloat(formData.price),
        discountPrice: parseFloat(formData.price),
        image: imgUrl,
      };

      const createProductResponse = await createProduct(
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
      setIsSubmitting(false);
      return;
    }

    // Llamar a la función de callback con el nuevo producto
    onProductAdded();

    // Mostrar mensaje de éxito
    toast({
      title: 'Producto añadido',
      description: `El producto ${formData.name} ha sido añadido correctamente.`,
    });

    // Resetear el formulario y cerrar el diálogo
    setIsSubmitting(false);
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Añadir Nuevo Producto</DialogTitle>
            <DialogDescription>
              Completa los detalles del nuevo producto. Los campos marcados con
              * son obligatorios.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Nombre *
              </Label>
              <Input
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                className='col-span-3'
                required
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='brand' className='text-right'>
                Marca *
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
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid grid-cols-2 items-center gap-4'>
                <Label htmlFor='price' className='text-right'>
                  Precio ($) *
                </Label>
                <Input
                  id='price'
                  name='price'
                  type='number'
                  step='0.01'
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='grid grid-cols-2 items-center gap-4'>
                <Label htmlFor='discountPrice' className='text-right'>
                  Precio anterior ($)
                </Label>
                <Input
                  id='discountPrice'
                  name='discountPrice'
                  type='number'
                  step='0.01'
                  value={formData.discountPrice}
                  onChange={handleChange}
                  placeholder='Opcional'
                />
              </div>
            </div>
            <div className='grid grid-cols-4 items-start gap-4'>
              <Label className='text-right pt-2'>Imagen *</Label>
              <div className='col-span-3'>
                <ImageUpload
                  value={formData.image}
                  onChange={handleImageChange}
                  maxSizeMB={2}
                />
                <p className='mt-1 text-xs text-muted-foreground'>
                  Sube una imagen del producto. Recomendado: 600x600px, formato
                  JPG o PNG.
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
                value={formData.description}
                onChange={handleChange}
                className='col-span-3'
                rows={3}
                placeholder='Describe las características del producto...'
              />
            </div>
            <div className='grid grid-cols-4 items-start gap-4'>
              <Label className='text-right pt-2'>Etiquetas</Label>
              <div className='col-span-3 space-y-4'>
                <div className='flex flex-wrap gap-2'>
                  {formData.tags.map((tag) => (
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
                          formData.tags.includes(tag) && 'bg-secondary'
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
              onClick={() => {
                onOpenChange(false);
                //resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                  Guardando...
                </>
              ) : (
                <>
                  <Plus className='mr-2 h-4 w-4' />
                  Añadir Producto
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
