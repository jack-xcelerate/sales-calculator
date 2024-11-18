// app/components/ROIAnalysis.tsx
import React from 'react';
import { Metrics, Inputs } from '../types';
import { MetricCard } from './MetricCard';
import { SectionHeader } from './SectionHeader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const ROIAnalysis: React.FC<{ metrics: Metrics; inputs: Inputs }> = ({ metrics, inputs }) => {
  // Calculate ROI projection data for the chart
  const generateProjectionData = () => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const monthlyRevenue = metrics.estimatedRevenue;
    const monthlySpend = inputs.monthlyMarketingBudget;
    
    return months.map(month => ({
      month: `Month ${month}`,
      revenue: monthlyRevenue * month,
      cost: monthlySpend * month,
      profit: (monthlyRevenue - monthlySpend) * month
    }));
  };

  const projectionData = generateProjectionData();
  const monthlyProfit = metrics.estimatedRevenue - inputs.monthlyMarketingBudget;
  const annualROI = ((monthlyProfit * 12) / (inputs.monthlyMarketingBudget * 12) * 100);

  return (
    <div className="space-y-8">
      <SectionHeader title="ROI Analysis" />
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <MetricCard
          label="Break-even Point"
          value={`${metrics.breakEvenPoint.toFixed(1)} months`}
          subtitle="Time to recover investment"
          tooltipContent="Time needed to recover your marketing investment based on current conversion rates"
        />
        <MetricCard
          label="Monthly Profit"
          value={`$${monthlyProfit.toLocaleString()}`}
          subtitle="Revenue minus expenses"
          tooltipContent="Monthly revenue after subtracting marketing costs"
        />
        <MetricCard
          label="Annual ROI"
          value={`${annualROI.toFixed(1)}%`}
          subtitle="Return on investment"
          tooltipContent="Percentage return on your marketing investment over a year"
        />
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <MetricCard
          label="Cost Per Acquisition"
          value={`$${(inputs.monthlyMarketingBudget / metrics.newClients).toFixed(2)}`}
          subtitle="Cost per new client"
          tooltipContent="Average cost to acquire each new client"
        />
        <MetricCard
          label="Revenue Per Client"
          value={`$${inputs.avgLifetimeValue.toLocaleString()}`}
          subtitle="Lifetime value"
          tooltipContent="Average revenue generated per client over their lifetime"
        />
      </div>

      {/* ROI Projection Chart */}
      <div className="h-[400px] mt-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-primary/20" />
            <XAxis dataKey="month" className="text-white/60" />
            <YAxis className="text-white/60" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid rgba(255, 103, 0, 0.2)',
                borderRadius: '8px'
              }}
              itemStyle={{ color: '#ffffff' }}
              labelStyle={{ color: '#ffffff' }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4ade80"
              strokeWidth={2}
              name="Revenue"
            />
            <Line
              type="monotone"
              dataKey="cost"
              stroke="#ef4444"
              strokeWidth={2}
              name="Cost"
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#ff6700"
              strokeWidth={2}
              name="Profit"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Break-even Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <MetricCard
          label="Payback Period"
          value={`${metrics.paybackPeriod.toFixed(1)} months`}
          subtitle="Investment recovery"
          tooltipContent="Time needed to recover initial investment"
        />
        <MetricCard
          label="Profit Margin"
          value={`${metrics.profitMargin.toFixed(1)}%`}
          subtitle="Net margin"
          tooltipContent="Percentage of revenue that becomes profit"
        />
        <MetricCard
          label="ROAS"
          value={`${metrics.roas.toFixed(1)}x`}
          subtitle="Return on ad spend"
          tooltipContent="Revenue generated per dollar spent on marketing"
        />
      </div>
    </div>
  );
};