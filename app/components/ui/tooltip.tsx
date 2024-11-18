// app/components/ui/tooltip.tsx
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import React from 'react'

export interface TooltipProps {
  content: string
  children: React.ReactNode
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => (
  <TooltipPrimitive.Provider>
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>
        {children}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Content
        className="px-3 py-1.5 text-sm bg-background/90 text-white rounded-lg shadow-lg border border-primary/20"
        sideOffset={5}
      >
        {content}
        <TooltipPrimitive.Arrow className="fill-background/90" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  </TooltipPrimitive.Provider>
)