// app/components/FunnelVisualization.tsx
import React from 'react';
import { Metrics } from '../types';

export const FunnelVisualization: React.FC<{ metrics: Metrics }> = ({ metrics }) => {
  const maxWidth = 800;
  const height = 400;
  const maxValue = Math.max(metrics.clicks || 1, 1);

  const calculateWidth = (value: number) => {
    const minWidth = maxWidth * 0.3;
    const width = Math.max((value / maxValue) * maxWidth, minWidth);
    return width;
  };

  const sections = [
    { value: metrics.clicks, label: 'Clicks', y: 0 },
    { value: metrics.leads, label: 'Leads', y: 80 },
    { value: metrics.discoveryCalls, label: 'Discovery Calls', y: 160 },
    { value: metrics.salesCalls, label: 'Sales Calls', y: 240 },
    { value: metrics.proposalsSent, label: 'Proposals', y: 320 },
    { value: metrics.newClients, label: 'New Clients', y: 400 }
  ];

  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      <svg viewBox={`0 0 ${maxWidth} ${height}`} className="w-full h-full">
        <defs>
          <linearGradient id="funnelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff6700" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ff6700" stopOpacity="0.1" />
          </linearGradient>
          {/* Add highlight gradient */}
          <linearGradient id="highlightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {sections.map((section, index) => {
          const nextSection = sections[index + 1];
          if (!nextSection) return null;

          const currentWidth = calculateWidth(section.value);
          const nextWidth = calculateWidth(nextSection.value);
          const conversionRate = ((nextSection.value / section.value) * 100).toFixed(1);

          return (
            <g key={section.label}>
              {/* Funnel section */}
              <path
                d={`
                  M${(maxWidth - currentWidth) / 2} ${section.y}
                  L${(maxWidth + currentWidth) / 2} ${section.y}
                  L${(maxWidth + nextWidth) / 2} ${nextSection.y}
                  L${(maxWidth - nextWidth) / 2} ${nextSection.y}
                  Z
                `}
                fill="url(#funnelGradient)"
                stroke="#ff6700"
                strokeWidth="1"
                className="transition-all duration-500"
              />
              
              {/* Highlight overlay */}
              <path
                d={`
                  M${(maxWidth - currentWidth) / 2} ${section.y}
                  L${(maxWidth + currentWidth) / 2} ${section.y}
                  L${(maxWidth + nextWidth) / 2} ${nextSection.y}
                  L${(maxWidth - nextWidth) / 2} ${nextSection.y}
                  Z
                `}
                fill="url(#highlightGradient)"
                className="transition-all duration-500"
              />

              {/* Labels and values */}
              <text
                x={maxWidth / 2}
                y={section.y + 24}
                textAnchor="middle"
                className="fill-white text-sm font-alata"
              >
                {`${section.label}: ${Math.round(section.value).toLocaleString()}`}
              </text>

              {/* Conversion rate labels */}
              <text
                x={maxWidth / 2}
                y={(section.y + nextSection.y) / 2}
                textAnchor="middle"
                className="fill-primary text-xs font-alata"
              >
                {`${conversionRate}% →`}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};