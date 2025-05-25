'use client';

import type React from 'react';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string | File) => void;
  className?: string;
  maxSizeMB?: number;
  accept?: string;
}

export function ImageUpload({
  value,
  onChange,
  className,
  maxSizeMB = 5,
  accept = 'image/jpeg, image/png, image/webp',
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateFile = useCallback(
    (file: File): boolean => {
      // Validar tipo de archivo
      if (!file.type.match(accept.replace(/\s/g, '').split(',').join('|'))) {
        setError(`Tipo de archivo no soportado. Por favor, sube ${accept}.`);
        return false;
      }

      // Validar tamaño de archivo
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(
          `El archivo es demasiado grande. El tamaño máximo es ${maxSizeMB}MB.`
        );
        return false;
      }

      setError(null);
      return true;
    },
    [accept, maxSizeMB]
  );

  const handleChange = useCallback(
    (file: File) => {
      if (validateFile(file)) {
        // Limpiar URL anterior si existe
        if (previewUrl && previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(previewUrl);
        }

        // Crear URL para vista previa
        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);
        onChange(file);
      }
    },
    [onChange, validateFile, previewUrl]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleChange(e.dataTransfer.files[0]);
      }
    },
    [handleChange]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleChange(e.target.files[0]);
      }
    },
    [handleChange]
  );

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleRemoveImage = () => {
    // Limpiar URL de objeto si existe
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    onChange('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  // Limpiar URLs de objeto cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className={cn('flex flex-col space-y-2', className)}>
      <div
        className={cn(
          'relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed transition-colors',
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5',
          previewUrl ? 'bg-muted/30' : ''
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!previewUrl ? handleButtonClick : undefined}
      >
        <input
          ref={inputRef}
          type='file'
          accept={accept}
          onChange={handleFileSelect}
          className='hidden'
          data-testid='file-input'
        />

        {previewUrl ? (
          <div className='relative h-full w-full'>
            <img
              src={previewUrl || '/placeholder.svg'}
              alt='Vista previa'
              className='h-full w-full rounded-md object-contain p-2'
            />
            <Button
              type='button'
              variant='destructive'
              size='icon'
              className='absolute right-2 top-2 h-6 w-6'
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
            >
              <X className='h-4 w-4' />
              <span className='sr-only'>Eliminar imagen</span>
            </Button>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center space-y-2 p-4 text-center'>
            <div className='rounded-full bg-primary/10 p-3'>
              <Upload className='h-6 w-6 text-primary' />
            </div>
            <div className='space-y-1'>
              <p className='text-sm font-medium'>
                Arrastra y suelta una imagen o haz clic aquí
              </p>
              <p className='text-xs text-muted-foreground'>
                Soporta: {accept} (Máx. {maxSizeMB}MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {error && <p className='text-sm text-destructive'>{error}</p>}

      {!previewUrl && (
        <Button
          type='button'
          variant='outline'
          onClick={handleButtonClick}
          className='w-full'
        >
          <ImageIcon className='mr-2 h-4 w-4' />
          Seleccionar imagen
        </Button>
      )}
    </div>
  );
}
