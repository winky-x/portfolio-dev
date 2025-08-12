import * as React from 'react';

import {cn} from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';

const textareaVariants = cva(
    'flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
    {
        variants: {
            size: {
                default: 'min-h-[80px]',
                sm: 'min-h-[60px]',
                lg: 'min-h-[120px]',
            }
        },
        defaultVariants: {
            size: 'default'
        }
    }
)

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof textareaVariants> {}


const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({className, size, ...props}, ref) => {
    return (
      <textarea
        className={cn(
          textareaVariants({size, className})
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export {Textarea};
