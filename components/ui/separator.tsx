'use client'

import * as React from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'

import { cn } from '@/lib/utils'

function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  weight = 'thin',
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root> & {
  weight?: 'hairline' | 'thin' | 'medium' | 'thick' | 'ultra'
}) {
  const weights = {
    hairline: 'bg-border-light',
    thin: 'bg-foreground',
    medium: 'bg-foreground',
    thick: 'bg-foreground',
    ultra: 'bg-foreground',
  }

  const sizes = {
    hairline: orientation === 'horizontal' ? 'h-px' : 'w-px',
    thin: orientation === 'horizontal' ? 'h-px' : 'w-px',
    medium: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
    thick: orientation === 'horizontal' ? 'h-1' : 'w-1',
    ultra: orientation === 'horizontal' ? 'h-2' : 'w-2',
  }

  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 w-full',
        weights[weight],
        sizes[weight],
        className,
      )}
      {...props}
    />
  )
}

export { Separator }
