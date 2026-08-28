import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-700',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-indigo-200/80 dark:border-indigo-900 bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/80 shadow-sm',
        secondary:
          'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60',
        ghost:
          'text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60',
        link: 'text-indigo-600 underline-offset-4 hover:underline',
        gradient:
          'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700',
        soft:
          'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-200/80 dark:border-indigo-800 font-medium',
      },
      size: {
        default: 'h-10 px-5 py-2.5',
        sm: 'h-9 px-3.5 py-1.5 text-xs',
        lg: 'h-11 px-6 py-2.5 text-sm',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
