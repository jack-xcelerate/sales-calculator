import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

export function Tooltip({ content, children }: { content: string; children: React.ReactNode }) {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          className="z-50 overflow-hidden rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white shadow-md"
          sideOffset={4}
        >
          <p>{content}</p>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
