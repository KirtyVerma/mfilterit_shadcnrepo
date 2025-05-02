'use client';

import { useToast } from '@/hooks/use-toast';
<<<<<<< HEAD
=======
import React, { useEffect } from 'react';
>>>>>>> d1452b7 (Initial commit)
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
<<<<<<< HEAD
} from '@/components/ui/toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className='grid gap-1'>
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
=======
  ToastActionElement,
} from '@/components/ui/toast';

interface ToasterProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
  onClose?: () => void;
}

export function Toaster({ 
  title, 
  description, 
  variant = 'default',
  duration = 5000,
  onClose 
}: ToasterProps) {
  const { toast, toasts } = useToast();

  useEffect(() => {
    if (title) {
      toast({
        title,
        description,
        variant,
        duration,
        onOpenChange: (open) => {
          if (!open && onClose) {
            onClose();
          }
        },
      });
    }
  }, [title, description, variant, duration, onClose]);

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className='grid gap-1'>
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && (
              <ToastDescription className='text-small-font'>{description}</ToastDescription>
            )}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
>>>>>>> d1452b7 (Initial commit)
      <ToastViewport />
    </ToastProvider>
  );
}
