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
        className="px-3 py-3 z-50 text-sm bg-white text-[#00142a] rounded-lg shadow-lg border border-primary"
        sideOffset={5}
      >
        {content}
        <TooltipPrimitive.Arrow className="fill-background/90" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  </TooltipPrimitive.Provider>
)