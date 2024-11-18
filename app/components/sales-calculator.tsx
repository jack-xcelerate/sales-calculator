"use client";

import React, { useState, useEffect } from "react";
import { Tooltip } from "./ui/tooltip";
import { Info } from "lucide-react";

// MetricCard component
const MetricCard = ({ label, value, subtitle, tooltipContent }: { 
  label: string; 
  value: string | number; 
  subtitle?: string; 
  tooltipContent: string; 
}) => (
  <div className="metric-card">
    <div className="flex items-center space-x-2 mb-4">
      <span className="text-primary text-sm font-staatliches">{label}</span>
      <Tooltip content={tooltipContent}>
        <Info className="h-4 w-4 text-primary/50 cursor-help hover:text-primary transition-colors" />
      </Tooltip>
    </div>
    <div className="text-4xl font-staatliches text-white mb-2">{value}</div>
    {subtitle && <div className="text-sm font-alata text-white/60">{subtitle}</div>}
  </div>
);

// InputField component
const InputField = ({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  type = "number", 
  prefix, 
  suffix, 
  tooltipContent 
}: {
  label: string; 
  value: number; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  min?: number; 
  max?: number; 
  type?: string; 
  prefix?: string; 
  suffix?: string; 
  tooltipContent?: string; 
}) => (
  <div className="mb-8">
    <div className="flex items-center space-x-2 mb-2">
      <label className="font-alata text-white/90 text-sm font-medium block">{label}</label>
      {tooltipContent && (
        <Tooltip content={tooltipContent}>
          <Info className="h-4 w-4 text-primary/50 cursor-help hover:text-primary transition-colors" />
        </Tooltip>
      )}
    </div>
    <div className="relative">
      <input
        type={type}
        value={value}
        min={min}
        max={max}
        onChange={onChange}
        className={`w-full px-4 py-3 bg-background/50 border border-primary/30 rounded-lg text-white 
                   focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors
                   ${prefix ? "pl-8" : ""} ${suffix ? "pr-8" : ""}`}
      />
      {prefix && (
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary font-medium">
          {prefix}
        </span>
      )}
      {suffix && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary font-medium">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

// SectionHeader component
const SectionHeader = ({ title }: { title: string }) => (
  <div className="mb-12 mt-16 first:mt-0">
    <h2 className="text-3xl font-staatliches text-white mb-4">{title}</h2>
    <div className="h-px bg-primary/20" />
  </div>
);
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
  leadToSale: number;
}

const SalesCalculator = ({ inputs: initialInputs }: { inputs: Inputs }) => {
  const [inputs, setInputs] = useState<Inputs>({
    ...initialInputs,
    clientSpend: initialInputs.clientSpend || initialInputs.avgLifetimeValue / 3, // Default CAC
  });

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
    leadToSale: 0,
  });

  useEffect(() => {
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

    const estProposals = inputs.clientWonRate > 0 ? Math.ceil(inputs.targetNewClients / (inputs.clientWonRate / 100)) : 0;
    const estSalesCalls = inputs.proposalRate > 0 ? Math.ceil(estProposals / (inputs.proposalRate / 100)) : 0;
    const estDiscoveryCalls = inputs.salesCallRate > 0 ? Math.ceil(estSalesCalls / (inputs.salesCallRate / 100)) : 0;
    const estLeads = inputs.discoveryCallRate > 0 ? Math.ceil(estDiscoveryCalls / (inputs.discoveryCallRate / 100)) : 0;
    const leadToSale = leads > 0 ? (newClients / leads) * 100 : 0;

    setMetrics({
      clicks,
      leads,
      discoveryCalls,
      salesCalls,
      proposalsSent,
      newClients,
      estimatedRevenue,
      roas,
      estProposals,
      estSalesCalls,
      estDiscoveryCalls,
      estLeads,
      estRevenue: inputs.targetNewClients * inputs.avgLifetimeValue,
      leadToSale,
    });
  };

  return (
    <div>
      <SectionHeader title="Budget Planner" />
      <InputField
        label="Client Acquisition Cost"
        value={inputs.clientSpend}
        onChange={(e) => setInputs({ ...inputs, clientSpend: Number(e.target.value) })}
        prefix="$"
        tooltipContent="Default is set to one-third of Lifetime Value (LTV) as a benchmark. This ensures profitability while leaving room for marketing adjustments."
      />
      {/* Add other fields and sections here */}
    </div>
  );
};
const initialInputState: Inputs = {
  avgLifetimeValue: 4500,
  monthlyMarketingBudget: 2000,
  costPerClick: 4,
  landingPageConversion: 5,
  discoveryCallRate: 50,
  salesCallRate: 50,
  proposalRate: 50,
  clientWonRate: 50,
  targetNewClients: 2,
  clientSpend: 0, // This will default to avgLifetimeValue / 3
};

const App = () => {
  const [scenarios, setScenarios] = useState<Inputs[]>([initialInputState]);

  const addScenario = () => setScenarios([...scenarios, { ...initialInputState }]);

  return (
    <div className="bg-background min-h-screen">
      {scenarios.map((scenario, index) => (
        <SalesCalculator key={index} inputs={scenario} />
      ))}
      <button
        onClick={addScenario}
        className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg mt-8 mx-auto block font-staatliches transition-colors text-xl"
      >
        Add Scenario
      </button>
    </div>
  );
};

export default App;
