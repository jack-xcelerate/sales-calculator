// app/components/SectionHeader.tsx
import React from 'react';

interface SectionHeaderProps {
  title: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
  <div className="mb-12 mt-16 first:mt-0">
    <h2 className="text-3xl font-staatliches text-white mb-4">{title}</h2>
    <div className="h-px bg-primary/20" />
  </div>
);