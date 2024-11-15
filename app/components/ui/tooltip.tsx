import * as React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 translate-y-0 px-2 py-1 bg-gray-900 text-white text-sm rounded">
        {content}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-full border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
}