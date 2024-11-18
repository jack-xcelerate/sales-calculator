"use client"

import React, { useState, useEffect } from 'react';
import { Tooltip } from './components/ui/tooltip';
import { Info } from 'lucide-react';
import { QuickStartGuide } from './components/QuickStartGuide';
import { FunnelVisualization } from './components/FunnelVisualization';
import { ROIAnalysis } from './components/ROIAnalysis';

// Interfaces
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
  breakEvenPoint: number;
  profitMargin: number;
  paybackPeriod: number;
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
  scenarioName?: string;
}
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
  type = 'number', 
  prefix, 
  suffix,
  tooltipContent,
  helperText 
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
  helperText?: string;
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
                   ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-8' : ''}`}
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
    {helperText && (
      <p className="mt-2 text-sm text-primary/70">{helperText}</p>
    )}
    {suffix === "%" && (
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className="range-slider w-full mt-4"
      />
    )}
  </div>
);

// FunnelStage component
const FunnelStage = ({ value, exactValue, label, tooltipContent }: {
  value: number;
  exactValue?: number;
  label: string;
  tooltipContent: string;
}) => (
  <div className="funnel-stage">
    <Tooltip content={tooltipContent}>
      <div className="funnel-stage-circle">
        <div className="text-xl font-staatliches text-white">{Math.round(value).toLocaleString()}</div>
        {exactValue && Math.round(exactValue) !== exactValue && (
          <div className="text-xs text-primary">({exactValue.toFixed(1)})</div>
        )}
      </div>
    </Tooltip>
    <div className="mt-4 text-sm font-alata text-white/70">{label}</div>
  </div>
);

// SectionHeader component
const SectionHeader = ({ title }: { title: string }) => (
  <div className="mb-12 mt-16 first:mt-0">
    <h2 className="text-3xl font-staatliches text-white mb-4">{title}</h2>
    <div className="h-px bg-primary/20" />
  </div>
);
// Initial state definition
const initialInputState: Inputs = {
  avgLifetimeValue: 2000,
  monthlyMarketingBudget: 2000,
  costPerClick: 4,
  landingPageConversion: 5,
  discoveryCallRate: 50,
  salesCallRate: 50,
  proposalRate: 50,
  clientWonRate: 50,
  targetNewClients: 2,
  clientSpend: 500,
};

// SalesCalculator Component
const SalesCalculator = ({ inputs: initialInputs, onUpdateScenario, scenarioIndex }: { 
  inputs: Inputs;
  onUpdateScenario?: (inputs: Inputs) => void;
  scenarioIndex: number;
}) => {
  const [inputs, setInputs] = useState<Inputs>({
    ...initialInputs,
    clientSpend: Math.min(initialInputs.avgLifetimeValue / 3, initialInputs.clientSpend)
  });
  const [showQuickStart, setShowQuickStart] = useState(false);
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
    breakEvenPoint: 0,
    profitMargin: 0,
    paybackPeriod: 0
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

    // Reverse calculations
    const estProposals = inputs.clientWonRate > 0 ? Math.ceil(inputs.targetNewClients / (inputs.clientWonRate / 100)) : 0;
    const estSalesCalls = inputs.proposalRate > 0 ? Math.ceil(estProposals / (inputs.proposalRate / 100)) : 0;
    const estDiscoveryCalls = inputs.salesCallRate > 0 ? Math.ceil(estSalesCalls / (inputs.salesCallRate / 100)) : 0;
    const estLeads = inputs.discoveryCallRate > 0 ? Math.ceil(estDiscoveryCalls / (inputs.discoveryCallRate / 100)) : 0;
    const leadToSale = leads > 0 ? newClients / leads : 0;

    // ROI and break-even calculations
    const monthlyProfit = estimatedRevenue - inputs.monthlyMarketingBudget;
    const profitMargin = estimatedRevenue > 0 ? (monthlyProfit / estimatedRevenue) * 100 : 0;
    const breakEvenPoint = monthlyProfit > 0 ? inputs.monthlyMarketingBudget / monthlyProfit : 0;
    const paybackPeriod = estimatedRevenue > 0 ? inputs.monthlyMarketingBudget / (estimatedRevenue / 12) : 0;

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
      breakEvenPoint,
      profitMargin,
      paybackPeriod
    });
  };
  const handleInputChange = (key: keyof Inputs, value: number | string) => {
    let updatedInputs = { ...inputs };

    if (key === 'avgLifetimeValue') {
      const numValue = Number(value);
      const recommendedClientSpend = numValue / 3;
      updatedInputs = {
        ...updatedInputs,
        [key]: numValue,
        clientSpend: Math.min(inputs.clientSpend, recommendedClientSpend)
      };
    } else if (key === 'clientSpend') {
      updatedInputs[key] = Math.min(Number(value), inputs.avgLifetimeValue / 3);
    } else if (key === 'scenarioName') {
      updatedInputs[key] = value as string;
    } else {
      updatedInputs[key] = Number(value);
    }

    setInputs(updatedInputs);
    onUpdateScenario?.(updatedInputs);
  };

  const resetToDefaults = () => {
    const defaultInputs = {
      ...initialInputState,
      scenarioName: `Scenario ${scenarioIndex + 1}`,
      clientSpend: initialInputState.avgLifetimeValue / 3
    };
    setInputs(defaultInputs);
    onUpdateScenario?.(defaultInputs);
  };

  const inputFields = [
    { 
      label: "Average Lifetime Value", 
      key: "avgLifetimeValue" as keyof Inputs, 
      prefix: "$",
      tooltipContent: "The total revenue you expect from a client throughout your entire relationship",
    },
    {
      label: "Client Acquisition Cost",
      key: "clientSpend" as keyof Inputs,
      prefix: "$",
      tooltipContent: "Maximum amount to spend acquiring one client",
      helperText: `Recommended: Up to $${(inputs.avgLifetimeValue / 3).toFixed(2)} (1/3 of lifetime value)`
    },
    { 
      label: "Monthly Marketing Budget", 
      key: "monthlyMarketingBudget" as keyof Inputs, 
      prefix: "$",
      tooltipContent: "How much you plan to spend on advertising each month" 
    },
    { 
      label: "Cost Per Click", 
      key: "costPerClick" as keyof Inputs, 
      prefix: "$",
      tooltipContent: "Average amount you pay for each click on your ads" 
    },
    { 
      label: "Landing Page Conversion Rate", 
      key: "landingPageConversion" as keyof Inputs, 
      suffix: "%",
      tooltipContent: "Percentage of visitors who become leads by filling out your form" 
    },
    { 
      label: "Discovery Call Rate", 
      key: "discoveryCallRate" as keyof Inputs, 
      suffix: "%",
      tooltipContent: "Percentage of leads who schedule a discovery call" 
    },
    { 
      label: "Sales Call Rate", 
      key: "salesCallRate" as keyof Inputs, 
      suffix: "%",
      tooltipContent: "Percentage of discovery calls that progress to sales calls" 
    },
    { 
      label: "Proposal Rate", 
      key: "proposalRate" as keyof Inputs, 
      suffix: "%",
      tooltipContent: "Percentage of sales calls that result in sending a proposal" 
    },
    { 
      label: "Client Won Rate", 
      key: "clientWonRate" as keyof Inputs, 
      suffix: "%",
      tooltipContent: "Percentage of proposals that convert into paying clients" 
    },
  ];
  return (
    <div className="min-h-screen p-8">
      {/* Logo Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <img 
          src="https://storage.googleapis.com/msgsndr/bXNFllgFgIK3oXo6R21q/media/66fe2aafed66474c1bb44c1f.png" 
          alt="Xcelerate Digital Systems Logo" 
          className="h-8 object-contain"
        />
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <input
            type="text"
            value={inputs.scenarioName}
            onChange={(e) => handleInputChange('scenarioName', e.target.value)}
            className="bg-transparent border-b border-primary/20 px-2 py-1 text-white font-staatliches text-xl focus:outline-none focus:border-primary"
          />
          <div className="flex gap-4">
            <button
              onClick={() => setShowQuickStart(true)}
              className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-white rounded-lg transition-colors"
            >
              Quick Start Guide
            </button>
            <button
              onClick={resetToDefaults}
              className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-white rounded-lg transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
        </div>

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
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  prefix={field.prefix}
                  suffix={field.suffix}
                  tooltipContent={field.tooltipContent}
                  helperText={field.helperText}
                  min={0}
                  max={field.suffix === "%" ? 100 : undefined}
                  type="number"
                />
              ))}
            </div>

            {/* Funnel Visualization */}
            <div className="flex justify-between items-center mt-12 overflow-x-auto py-4">
              <FunnelStage value={metrics.clicks} exactValue={metrics.clicks} label="Clicks" tooltipContent="Total clicks from ads" />
              <FunnelStage value={metrics.leads} exactValue={metrics.leads} label="Leads" tooltipContent="Total leads generated" />
              <FunnelStage value={metrics.discoveryCalls} exactValue={metrics.discoveryCalls} label="Discovery Calls" tooltipContent="Discovery calls scheduled" />
              <FunnelStage value={metrics.salesCalls} exactValue={metrics.salesCalls} label="Sales Calls" tooltipContent="Total sales calls" />
              <FunnelStage value={metrics.proposalsSent} exactValue={metrics.proposalsSent} label="Proposals" tooltipContent="Proposals sent to clients" />
              <FunnelStage value={metrics.newClients} exactValue={metrics.newClients} label="New Clients" tooltipContent="New clients won" />
            </div>
            <FunnelVisualization metrics={metrics} />

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <MetricCard
                label="Estimated Monthly Revenue"
                value={`$${metrics.estimatedRevenue.toLocaleString()}`}
                subtitle={`Based on ${Math.round(metrics.newClients)} new clients per month`}
                tooltipContent="Projected monthly revenue based on your current conversion rates"
              />
              <MetricCard
                label="Return on Ad Spend (ROAS)"
                value={`${metrics.roas.toFixed(1)}x`}
                subtitle={`For every $1 spent you get $${metrics.roas.toFixed(2)} back`}
                tooltipContent="Return on advertising investment"
              />
            </div>
          </div>

          {/* ROI Analysis Section */}
          <ROIAnalysis metrics={metrics} inputs={inputs} />

          {/* Client Goals Section */}
          <div className="space-y-8">
            <SectionHeader title="Client Goals" />
            <div className="max-w-lg mb-8">
              <InputField
                label="Target New Clients per Month"
                value={inputs.targetNewClients}
                onChange={(e) => handleInputChange('targetNewClients', e.target.value)}
                tooltipContent="How many new clients you want to acquire each month"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <MetricCard 
                label="Required Leads" 
                value={metrics.estLeads} 
                subtitle="Total leads needed" 
                tooltipContent="Number of leads required to reach your client goal" 
              />
              <MetricCard 
                label="Required Discovery Calls" 
                value={metrics.estDiscoveryCalls} 
                subtitle={`Based on ${inputs.discoveryCallRate}% call rate`} 
                tooltipContent="Number of discovery calls needed" 
              />
              <MetricCard 
                label="Required Sales Calls" 
                value={metrics.estSalesCalls} 
                subtitle={`Based on ${inputs.salesCallRate}% rate`} 
                tooltipContent="Number of sales calls needed" 
              />
              <MetricCard 
                label="Required Proposals" 
                value={metrics.estProposals} 
                subtitle={`Based on ${inputs.proposalRate}% rate`} 
                tooltipContent="Number of proposals needed" 
              />
            </div>
          </div>

          {/* Budget Planner Section */}
          <div className="space-y-8">
            <SectionHeader title="Budget Planner" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <MetricCard 
                label="Daily Budget" 
                value={metrics.leadToSale > 0 && metrics.estLeads > 0 ? 
                  `$${((Math.ceil(metrics.estLeads / 30)) * (inputs.clientSpend * metrics.leadToSale)).toFixed(2)}` : 
                  "$0.00"} 
                subtitle="Recommended daily spend" 
                tooltipContent="Suggested daily advertising budget" 
              />
              <MetricCard 
                label="Monthly Budget" 
                value={metrics.leadToSale > 0 && metrics.estLeads > 0 ? 
                  `$${(((Math.ceil(metrics.estLeads / 30)) * (inputs.clientSpend * metrics.leadToSale)) * 30).toFixed(2)}` : 
                  "$0.00"} 
                subtitle="Recommended monthly spend" 
                tooltipContent="Total monthly budget needed" 
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-primary/20 pt-8">
          <p className="text-center text-white/60 font-alata">
            App Built by Xcelerate Digital Systems
          </p>
        </div>
      </div>

      {/* Quick Start Guide Dialog */}
      <QuickStartGuide
        isOpen={showQuickStart}
        onClose={() => setShowQuickStart(false)}
      />
    </div>
  );
};
// App component
const App = () => {
  const [scenarios, setScenarios] = useState<Inputs[]>([{
    ...initialInputState,
    scenarioName: "Scenario 1"
  }]);

  const updateScenario = (index: number, updatedScenario: Inputs) => {
    const newScenarios = [...scenarios];
    newScenarios[index] = updatedScenario;
    setScenarios(newScenarios);
  };

  const addScenario = () => setScenarios([
    ...scenarios, 
    { 
      ...initialInputState,
      scenarioName: `Scenario ${scenarios.length + 1}`
    }
  ]);

  return (
    <div className="bg-background min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
        {scenarios.map((scenario, index) => (
          <SalesCalculator 
            key={index} 
            inputs={scenario}
            onUpdateScenario={(updated) => updateScenario(index, updated)}
            scenarioIndex={index}
          />
        ))}
      </div>
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
