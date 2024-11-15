"use client"

import React, { useState, useEffect } from 'react';
import { Tooltip } from './ui/tooltip';
import { Info } from 'lucide-react';

// Interfaces
interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  tooltipContent: string;
}

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  type?: string;
  prefix?: string;
  suffix?: string;
  tooltipContent?: string;
}

interface FunnelStageProps {
  value: number;
  exactValue?: number;
  label: string;
  tooltipContent: string;
}

interface SectionHeaderProps {
  title: string;
}

interface Metrics {
  clicks: number;
  leads: number;
  discoveryCalls: number;
  salesCalls: number;
  proposalsSent: number;
  newClients: number;
  estimatedRevenue: number;
  roas: number;
  estProposals: number;
  estSalesCalls: number;
  estDiscoveryCalls: number;
  estLeads: number;
  estRevenue: number;
}

interface Inputs {
  avgLifetimeValue: number;
  monthlyMarketingBudget: number;
  costPerClick: number;
  landingPageConversion: number;
  discoveryCallRate: number;
  salesCallRate: number;
  proposalRate: number;
  clientWonRate: number;
  targetNewClients: number;
  clientSpend: number;
}

interface SalesCalculatorProps {
  inputs: Inputs;
}

// MetricCard component
const MetricCard: React.FC<MetricCardProps> = ({ label, value, subtitle, tooltipContent }) => (
  <div className="p-6 rounded-lg border border-orange-600/50 hover:border-orange-600 transition-colors bg-blue-950/30">
    <div className="flex items-center space-x-2 mb-4">
      <span className="text-orange-500 text-sm font-medium">{label}</span>
      <Tooltip content={tooltipContent}>
        <Info className="h-4 w-4 text-orange-500/50 cursor-help" />
      </Tooltip>
    </div>
    <div className="text-4xl font-semibold text-white mb-2">{value}</div>
    {subtitle && <div className="text-sm text-white/60">{subtitle}</div>}
  </div>
);

// InputField component
const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  type = 'number', 
  prefix, 
  suffix 
}) => (
  <div className="mb-8">
    <label className="text-white/90 text-sm mb-2 block">{label}</label>
    <div className="relative">
      <input
        type={type}
        value={value}
        min={min}
        max={max}
        onChange={onChange}
        className={`w-full px-4 py-3 bg-blue-950/30 border border-orange-600/50 rounded-lg text-white focus:outline-none focus:border-orange-500 ${
          prefix ? 'pl-8' : ''
        } ${suffix ? 'pr-8' : ''}`}
      />
      {prefix && (
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 pointer-events-none">
          {prefix}
        </span>
      )}
      {suffix && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
    {suffix === "%" && (
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className="w-full mt-4 accent-orange-600"
      />
    )}
  </div>
);

// FunnelStage component
const FunnelStage: React.FC<FunnelStageProps> = ({ value, exactValue, label, tooltipContent }) => (
  <div className="flex flex-col items-center text-center w-24 px-2">
    <Tooltip content={tooltipContent}>
      <div className="w-20 h-20 rounded-full border border-orange-600/50 hover:border-orange-600 flex flex-col items-center justify-center bg-blue-950/30">
        <div className="text-xl font-semibold text-white">{Math.round(value).toLocaleString()}</div>
        {exactValue && Math.round(exactValue) !== exactValue && (
          <div className="text-xs text-orange-500">({exactValue.toFixed(1)})</div>
        )}
      </div>
    </Tooltip>
    <div className="mt-4 text-sm text-white/70">{label}</div>
  </div>
);

// SectionHeader component
const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
  <div className="mb-12 mt-16 first:mt-0">
    <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>
    <div className="h-px bg-white/10" />
  </div>
);

const SalesCalculator: React.FC<SalesCalculatorProps> = ({ inputs: initialInputs }) => {
  const [inputs, setInputs] = useState<Inputs>(initialInputs);
  const [metrics, setMetrics] = useState<Metrics>({
    clicks: 0,
    leads: 0,
    discoveryCalls: 0,
    salesCalls: 0,
    proposalsSent: 0,
    newClients: 0,
    estimatedRevenue: 0,
    roas: 0,
    estProposals: 0,
    estSalesCalls: 0,
    estDiscoveryCalls: 0,
    estLeads: 0,
    estRevenue: 0,
  });

  useEffect(() => {
    const savedInputs = localStorage.getItem('calculatorInputs');
    if (savedInputs) setInputs(JSON.parse(savedInputs));
  }, []);

  useEffect(() => {
    localStorage.setItem('calculatorInputs', JSON.stringify(inputs));
    calculateMetrics();
  }, [inputs]);

  const calculateMetrics = () => {
    const clicks = inputs.monthlyMarketingBudget / inputs.costPerClick;
    const leads = clicks * (inputs.landingPageConversion / 100);
    const discoveryCalls = leads * (inputs.discoveryCallRate / 100);
    const salesCalls = discoveryCalls * (inputs.salesCallRate / 100);
    const proposalsSent = salesCalls * (inputs.proposalRate / 100);
    const newClients = proposalsSent * (inputs.clientWonRate / 100);
    const estimatedRevenue = newClients * inputs.avgLifetimeValue;
    const roas = estimatedRevenue / inputs.monthlyMarketingBudget;

    setMetrics({
      clicks,
      leads,
      discoveryCalls,
      salesCalls,
      proposalsSent,
      newClients,
      estimatedRevenue,
      roas,
      estProposals: Math.ceil(inputs.targetNewClients / (inputs.clientWonRate / 100)),
      estSalesCalls: Math.ceil((inputs.targetNewClients / inputs.clientWonRate) * inputs.proposalRate),
      estDiscoveryCalls: Math.ceil((inputs.targetNewClients / inputs.clientWonRate) * inputs.salesCallRate),
      estLeads: Math.ceil((inputs.targetNewClients / inputs.clientWonRate) * inputs.discoveryCallRate),
      estRevenue: inputs.targetNewClients * inputs.avgLifetimeValue,
    });
  };

  const inputFields: Array<{
    label: string;
    key: keyof Inputs;
    prefix?: string;
    suffix?: string;
  }> = [
    { label: "Average Lifetime Value", key: "avgLifetimeValue", prefix: "$" },
    { label: "Monthly Marketing Budget", key: "monthlyMarketingBudget", prefix: "$" },
    { label: "Cost Per Click", key: "costPerClick", prefix: "$" },
    { label: "Landing Page Conversion Rate", key: "landingPageConversion", suffix: "%" },
    { label: "Discovery Call Rate", key: "discoveryCallRate", suffix: "%" },
    { label: "Sales Call Rate", key: "salesCallRate", suffix: "%" },
    { label: "Proposal Rate", key: "proposalRate", suffix: "%" },
    { label: "Client Won Rate", key: "clientWonRate", suffix: "%" },
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div id="report" className="space-y-16">
          {/* Current/Estimated Sales Section */}
          <div className="space-y-8">
            <SectionHeader title="Current/Estimated Sales" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {inputFields.map((field) => (
                <InputField
                  key={field.key}
                  label={field.label}
                  value={inputs[field.key]}
                  onChange={(e) => setInputs({ ...inputs, [field.key]: Number(e.target.value) })}
                  prefix={field.prefix}
                  suffix={field.suffix}
                  min={0}
                  max={field.suffix === "%" ? 100 : undefined}
                  type="number"
                />
              ))}
            </div>
            <div className="flex justify-between items-center mt-12 overflow-x-auto py-4">
              <FunnelStage value={metrics.clicks} exactValue={metrics.clicks} label="Clicks" tooltipContent="Total clicks from ads" />
              <FunnelStage value={metrics.leads} exactValue={metrics.leads} label="Leads" tooltipContent="Total leads generated" />
              <FunnelStage value={metrics.discoveryCalls} exactValue={metrics.discoveryCalls} label="Discovery Calls" tooltipContent="Discovery calls scheduled" />
              <FunnelStage value={metrics.salesCalls} exactValue={metrics.salesCalls} label="Sales Calls" tooltipContent="Total sales calls" />
              <FunnelStage value={metrics.proposalsSent} exactValue={metrics.proposalsSent} label="Proposals" tooltipContent="Proposals sent to clients" />
              <FunnelStage value={metrics.newClients} exactValue={metrics.newClients} label="New Clients" tooltipContent="New clients won" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <MetricCard
                label="Estimated Monthly Revenue"
                value={`$${metrics.estimatedRevenue.toLocaleString()}`}
                subtitle={`Based on ${Math.round(metrics.newClients)} new clients per month`}
                tooltipContent="Projected monthly revenue"
              />
              <MetricCard
                label="Return on Ad Spend (ROAS)"
                value={`${metrics.roas.toFixed(1)}x`}
                subtitle="Revenue for each dollar spent"
                tooltipContent="Return on Ad Spend"
              />
            </div>
          </div>

          {/* Client Goals Section */}
          <div className="space-y-8">
            <SectionHeader title="Client Goals" />
            <div className="max-w-lg mb-8">
              <InputField
                label="Target New Clients per Month"
                value={inputs.targetNewClients}
                onChange={(e) => setInputs(prev => ({
                  ...prev,
                  targetNewClients: Number(e.target.value)
                }))}
                tooltipContent="Your monthly goal for new clients"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <MetricCard label="Required Leads" value={metrics.estLeads} subtitle="Total leads needed" tooltipContent="Leads to reach client goal" />
              <MetricCard label="Required Discovery Calls" value={metrics.estDiscoveryCalls} subtitle={`Based on ${inputs.discoveryCallRate}% call rate`} tooltipContent="Discovery calls needed" />
              <MetricCard label="Required Sales Calls" value={metrics.estSalesCalls} subtitle={`Based on ${inputs.salesCallRate}% rate`} tooltipContent="Sales calls needed" />
              <MetricCard label="Required Proposals" value={metrics.estProposals} subtitle={`Based on ${inputs.proposalRate}% rate`} tooltipContent="Proposals needed" />
            </div>
            <div className="mt-8">
              <MetricCard label="Projected Revenue Impact" value={`$${metrics.estRevenue.toLocaleString()}`} subtitle="Lifetime value for clients" tooltipContent="Total revenue from new clients" />
            </div>
          </div>

          {/* Budget Planner Section */}
          <div className="space-y-8">
            <SectionHeader title="Budget Planner" />
            <div className="max-w-lg mb-8">
              <InputField
                label="Client Acquisition Cost"
                value={inputs.clientSpend}
                onChange={(e) => setInputs(prev => ({
                  ...prev,
                  clientSpend: Number(e.target.value)
                }))}
                prefix="$"
                tooltipContent="Max budget per client"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <MetricCard label="Expected Daily Leads" value={Math.ceil(metrics.leads / 30)} subtitle="Avg leads per day" tooltipContent="Daily leads needed" />
              <MetricCard label="Cost Per Lead Target" value={`$${(inputs.clientSpend / Math.ceil(metrics.leads)).toFixed(2)}`} subtitle="Target cost per lead" tooltipContent="Cost per lead" />
              <MetricCard label="Daily Spend" value={`$${((inputs.clientSpend / Math.ceil(metrics.leads)) * Math.ceil(metrics.leads / 30)).toFixed(2)}`} subtitle="Budget per day" tooltipContent="Daily budget" />
              <MetricCard label="Monthly Spend" value={`$${(inputs.clientSpend * Math.ceil(metrics.leads / 30)).toFixed(2)}`} subtitle="Budget per month" tooltipContent="Monthly budget" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ... (previous code remains the same until initialInputState)

// Complete the initialInputState
const initialInputState: Inputs = {
  avgLifetimeValue: 4500,
  monthlyMarketingBudget: 2000,
  costPerClick: 2,
  landingPageConversion: 5,
  discoveryCallRate: 60,
  salesCallRate: 60,
  proposalRate: 60,
  clientWonRate: 60,
  targetNewClients: 10,
  clientSpend: 500
};

// App component
const App = () => {
  const [scenarios, setScenarios] = useState<Inputs[]>([initialInputState]);

  const addScenario = () => setScenarios([...scenarios, { ...initialInputState }]);

  return (
    <div>
      {scenarios.map((scenario, index) => (
        <SalesCalculator key={index} inputs={scenario} />
      ))}
      <button 
        onClick={addScenario} 
        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded mt-4 transition-colors"
      >
        Add Scenario
      </button>
    </div>
  );
};

export default App;