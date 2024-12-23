/* eslint-disable react/no-unescaped-entities */
"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Tooltip } from './ui/tooltip';
import { Info } from 'lucide-react';
import Image from 'next/image';

// Component Types
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

// Utility Components
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

// Input Field Component
const InputField = ({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  prefix, 
  suffix,
  tooltipContent 
}: {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  prefix?: string;
  suffix?: string;
  tooltipContent?: string;
}) => {
  // Use local state to handle the input value as a string
  const [localValue, setLocalValue] = useState(value.toString());

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Update local state with the raw input
    setLocalValue(newValue);
    
    // Only call parent onChange with number value if it's a valid number
    if (newValue === '') {
      onChange({ ...e, target: { ...e.target, value: '0' } });
    } else {
      // Remove leading zeros
      const cleanValue = newValue.replace(/^0+/, '') || '0';
      onChange({ ...e, target: { ...e.target, value: cleanValue } });
    }
  };

  return (
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
          type="text"
          value={localValue}
          onChange={handleChange}
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
};
// Funnel Stage Component
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

// Section Header Component
const SectionHeader = ({ title }: { title: string }) => (
  <div className="mb-12 mt-16 first:mt-0">
    <h2 className="text-3xl font-staatliches text-white mb-4">{title}</h2>
    <div className="h-px bg-primary/20" />
  </div>
);

// Updated CTA Section Component
const CTASection = ({ metrics }: { metrics: Metrics }) => {
  const handleGetGamePlan = () => {
    const resultsToSave = {
      monthlyRevenue: Math.round(metrics.estimatedRevenue),
      newClients: Math.round(metrics.newClients),
      roas: metrics.roas.toFixed(1),
      leadsNeeded: Math.round(metrics.estLeads)
    };
    localStorage.setItem('calculatorResults', JSON.stringify(resultsToSave));
    window.location.href = 'https://xceleratedigitalsystems.com/xds-game-plan'; 
  };

  return (
    <div className="bg-primary/10 rounded-xl p-8 mt-16">
      <div className="text-center space-y-8">
        <div className="space-y-2">
          <h3 className="text-3xl font-staatliches text-white">
            Your Current Growth Potential
          </h3>
          <p className="text-white/80">
            Based on your numbers, here's what you're on track to achieve:
          </p>
        </div>

        {/* Current Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <div className="text-3xl font-staatliches text-primary">
              ${Math.round(metrics.estimatedRevenue).toLocaleString()}
            </div>
            <div className="text-sm text-white/60">Monthly Revenue</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-staatliches text-primary">
              {Math.round(metrics.newClients)}
            </div>
            <div className="text-sm text-white/60">New Clients Per Month</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-staatliches text-primary">
              {metrics.roas.toFixed(1)}x
            </div>
            <div className="text-sm text-white/60">Estimated Return/ROAS</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-staatliches text-primary">
              {metrics.leadToSale.toFixed(1)}%
            </div>
            <div className="text-sm text-white/60">Lead To Sale Ratio</div>
          </div>
        </div>
        <div>
        <p className="text-white/80">
          Unlock predictable growth for your business! Even a 10% improvement in your conversion rates can significantly increase your revenue—all without spending more on marketing. Book a time with us and see how small changes can drive consistent, measurable results.
          </p>
          </div>
        {/* CTA Button */}
        <div className="space-y-4">
          <button
            onClick={handleGetGamePlan}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg 
                     font-staatliches text-xl transition-all transform hover:scale-105
                     shadow-lg hover:shadow-xl"
          >
            Get Your Free 30-Min XDS Game Plan →
          </button>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/60">
            <span className="flex items-center">
              <span className="text-primary mr-1">✓</span> Tailored Strategy
            </span>
            <span className="flex items-center">
              <span className="text-primary mr-1">✓</span> Implementation Timeline
            </span>
            <span className="flex items-center">
              <span className="text-primary mr-1">✓</span> Growth Projection
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
const inputFields = [
  { 
    label: "Average Client Lifetime Value", 
    key: "avgLifetimeValue" as keyof Inputs, 
    prefix: "$",
    tooltipContent: "The total revenue you expect to earn from a client over the entire time they remain your customer." 
  },
  { 
    label: "Monthly Ad Spend", 
    key: "monthlyMarketingBudget" as keyof Inputs, 
    prefix: "$",
    tooltipContent: "The total amount you plan to invest in advertising and lead generation each month." 
  },
  { 
    label: "Average Cost Per Click (CPC)", 
    key: "costPerClick" as keyof Inputs, 
    prefix: "$",
    tooltipContent: "The average cost you pay for each click on your ads (e.g., from Google or Facebook)." 
  },
  { 
    label: "Landing Page Conversion Rate", 
    key: "landingPageConversion" as keyof Inputs, 
    suffix: "%",
    tooltipContent: "The percentage of visitors to your landing page who fill out a form or take a desired action to become leads." 
  },
  { 
    label: "Initial Consultation Booking Rate", 
    key: "discoveryCallRate" as keyof Inputs, 
    suffix: "%",
    tooltipContent: "The percentage of leads who schedule an initial consultation or pick up the call" 
  },
  { 
    label: "Sales Call Rate", 
    key: "salesCallRate" as keyof Inputs, 
    suffix: "%",
    tooltipContent: "The percentage of consultations that move forward to a follow-up sales or proposal meeting." 
  },
  { 
    label: "Quote/Proposal Rate", 
    key: "proposalRate" as keyof Inputs, 
    suffix: "%",
    tooltipContent: "The percentage of follow-up meetings that result in sending a proposal or quote." 
  },
  { 
    label: "Client Conversion Rate", 
    key: "clientWonRate" as keyof Inputs, 
    suffix: "%",
    tooltipContent: "The percentage of proposals that turn into paying clients." 
  },
];
const FunnelVisualization = ({ metrics, inputs }: { metrics: Metrics; inputs: Inputs }) => {
  const stages = [
    { label: "Leads", value: metrics.leads, icon: "👤" },
    { label: "Initial Consults", value: metrics.discoveryCalls, icon: "📞" },
    { label: "Sales Calls", value: metrics.salesCalls, icon: "🗣️" },
    { label: "Proposals", value: metrics.proposalsSent, icon: "📄" },
    { label: "New Clients", value: metrics.newClients, icon: "✅" },
  ];

  const maxStageValue = Math.max(...stages.map((stage) => stage.value)); // Normalize values by the highest stage value.

  return (
    <div className="funnel-visualization bg-gradient-to-b from-gray-900 to-gray-800 p-8 rounded-xl">
      <h3 className="text-2xl font-staatliches text-primary mb-6 underline decoration-orange-400">
        Marketing Funnel
      </h3>
      <div className="space-y-6">
        {stages.map((stage, index) => {
          const percentage =
            index === 0
              ? null // Leads are the starting point; instead, we'll show CPC and landing page conversion.
              : ((stage.value / stages[index - 1].value) * 100).toFixed(1); // Calculate conversion rate.

          return (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="flex items-center justify-between w-full">
                <span className="text-sm text-white flex items-center space-x-2">
                  <span>{stage.icon}</span>
                  <span>{stage.label}</span>
                </span>
                <span className="text-sm text-orange-400">
                  {Math.round(stage.value).toLocaleString()}
                </span>
              </div>
              <div
                className="h-6 bg-gradient-to-r from-orange-400 to-orange-600 rounded-md"
                style={{
                  width: `${(stage.value / maxStageValue) * 100}%`,
                }}
              />
              {index === 0 ? ( // Special case for "Leads"
                <span className="text-xs text-white/70">
                  ${inputs.costPerClick.toFixed(2)} CPC | {inputs.landingPageConversion}% Landing Page Conversion
                </span>
              ) : (
                <span className="text-xs text-white/70">{percentage}% conversion</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};



const SalesCalculator = ({ inputs: initialInputs }: { inputs: Inputs }) => {
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
    leadToSale: 0,
  });

  // Effect to automatically update clientSpend when avgLifetimeValue changes
useEffect(() => {
  const newCAC = Number((inputs.avgLifetimeValue / 3).toFixed(2));
  // Only update if the user hasn't manually changed the value
  if (Math.abs(inputs.clientSpend - (inputs.avgLifetimeValue / 3)) > 0.01) {
    setInputs(prev => ({
      ...prev,
      clientSpend: newCAC
    }));
  }
}, [inputs.avgLifetimeValue, inputs.clientSpend]); // Added inputs.clientSpend to dependencies

  // Load saved inputs on mount
  useEffect(() => {
    const savedInputs = localStorage.getItem('calculatorInputs');
    if (savedInputs) setInputs(JSON.parse(savedInputs));
  }, []);

  // Calculate metrics function
  const doCalculateMetrics = useCallback(() => {
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
  }, [inputs]);

  // Save inputs and recalculate metrics when inputs change
  useEffect(() => {
    localStorage.setItem('calculatorInputs', JSON.stringify(inputs));
    doCalculateMetrics();
  }, [inputs, doCalculateMetrics]);

  return (
    <div className="min-h-screen p-8">
      {/* Logo Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <Image 
          src="https://storage.googleapis.com/msgsndr/bXNFllgFgIK3oXo6R21q/media/66fe2aafed66474c1bb44c1f.png"
          alt="Xcelerate Digital Systems Logo" 
          width={200}
          height={50}
          className="h-8 object-contain"
          priority
        />
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        <div id="report" className="space-y-16">
          {/* Current/Estimated Sales Section */}
          <div className="space-y-8">
            <SectionHeader title="Your Current/Estimated Marketing" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {inputFields.map((field) => (
  <InputField
    key={field.key}
    label={field.label}
    value={inputs[field.key]}
    onChange={(e) => setInputs({ ...inputs, [field.key]: Number(e.target.value) })}
    prefix={field.prefix}
    suffix={field.suffix}
    tooltipContent={field.tooltipContent}
    min={0}
    max={field.suffix === "%" ? 100 : undefined}
  />
))}
            </div>
            <div className="flex flex-wrap items-center mt-12 py-4">
  <FunnelStage value={metrics.clicks} exactValue={metrics.clicks} label="Clicks" tooltipContent="Total clicks from ads" />
  <FunnelStage value={metrics.leads} exactValue={metrics.leads} label="Leads" tooltipContent="Total leads generated" />
  <FunnelStage value={metrics.discoveryCalls} exactValue={metrics.discoveryCalls} label="Initial Consults" tooltipContent="Initial consultations scheduled" />
  <FunnelStage value={metrics.salesCalls} exactValue={metrics.salesCalls} label="Follow-ups" tooltipContent="Follow-up meetings held" />
  <FunnelStage value={metrics.proposalsSent} exactValue={metrics.proposalsSent} label="Quotes" tooltipContent="Quotes sent to prospects" />
  <FunnelStage value={metrics.newClients} exactValue={metrics.newClients} label="New Clients" tooltipContent="New clients won" />
</div>


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
            {/* Funnel Visualization */}
            <FunnelVisualization metrics={metrics} inputs={inputs} />
          </div>

          {/* Client Goals Section */}
          <div className="space-y-8">
            <SectionHeader title="New Goals" />
            <div className="max-w-lg mb-8">
              <InputField
                label="Target New Clients per Month"
                value={inputs.targetNewClients}
                onChange={(e) => setInputs(prev => ({
                  ...prev,
                  targetNewClients: Number(e.target.value)
                }))}
                tooltipContent="How many new clients you want to acquire each month"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <MetricCard 
                label="Total Leads Required" 
                value={metrics.estLeads} 
                subtitle={`Leads required to hit ${inputs.targetNewClients} clients`}
                tooltipContent="The total number of leads needed to achieve your monthly new client goal, based on current conversion rates." 
              />
              <MetricCard 
                label="Consultations Needed" 
                value={metrics.estDiscoveryCalls} 
                subtitle={`Based on ${inputs.discoveryCallRate}% Consult rate`} 
                tooltipContent="The number of consultations you need to book to hit your monthly new client goal." 
              />
              <MetricCard 
                label="Sales Calls Needed" 
                value={metrics.estSalesCalls} 
                subtitle={`Based on ${inputs.salesCallRate}% sales call rate`} 
                tooltipContent="The number of sales calls or follow-ups required to move clients closer to a decision." 
              />
              <MetricCard 
                label="Quotes/Proposals Needed" 
                value={metrics.estProposals} 
                subtitle={`Based on ${inputs.proposalRate}% quote/proposal rate`} 
                tooltipContent="The number of proposals/quotes you need to send to convert prospects into paying clients." 
              />
              <MetricCard 
                label="Lead To Sale Ratio" 
                value={`${metrics.leadToSale.toFixed(1)}%`}
                subtitle="The estimated ratio of leads who'll become clients"
                tooltipContent="Aiming for around 20% is best" 
              />
            </div>
          </div>

          {/* Budget Planner Section */}
          <div className="space-y-8">
            <SectionHeader title="New Estimated Budget" />
            <div className="max-w-lg mb-8">
              <InputField
                label="Max Cost to Win a Client"
                value={inputs.clientSpend}
                onChange={(e) => setInputs(prev => ({
                  ...prev,
                  clientSpend: Number(e.target.value)
                }))}
                prefix="$"
                tooltipContent="Maximum amount you're willing to spend to acquire one new client"
              />
              <p className="mt-2 text-sm text-white/60">
                Industry benchmark: Your cost to win a client should be no more than ⅓ of their total value (${(inputs.avgLifetimeValue / 3).toFixed(2)})
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <MetricCard 
                label="Average Daily Leads Needed" 
                value={metrics.estLeads > 0 ? Math.ceil(metrics.estLeads / 30) : 0} 
                subtitle={`Average daily leads required to achieve ${inputs.targetNewClients} clients`}
                tooltipContent="The average number of leads you need to generate each day to meet your monthly new client goal." 
              />
              <MetricCard 
                label="Maximum Cost Per Lead" 
                value={metrics.leadToSale > 0 ? `$${(inputs.clientSpend * (metrics.leadToSale / 100)).toFixed(2)}` : "$0.00"} 
                subtitle="Maximum cost per lead to stay profitable" 
                tooltipContent="The highest amount you can spend per lead while staying profitable, based on your client lifetime value and goals." 
              />
              <MetricCard 
                label="Daily Ad Budget" 
                value={metrics.leadToSale > 0 && metrics.estLeads > 0 ? 
                `$${((Math.ceil(metrics.estLeads / 30)) * (inputs.clientSpend * (metrics.leadToSale / 100))).toFixed(2)}` : 
                "$0.00"} 
                subtitle={`Reccomended Daily budget needed to reach ${inputs.targetNewClients} clients`}
                tooltipContent="The suggested daily amount to spend on ads to achieve your monthly client acquisition goal." 
              />
              <MetricCard 
                label="Total Monthly Ad Budget" 
                value={metrics.leadToSale > 0 && metrics.estLeads > 0 ? 
                `$${(((Math.ceil(metrics.estLeads / 30)) * (inputs.clientSpend * (metrics.leadToSale / 100))) * 30).toFixed(2)}` : 
                "$0.00"} 
                subtitle={`Total monthly budget needed for ${inputs.targetNewClients} clients`}
                tooltipContent="The total monthly budget required to generate enough leads and achieve your monthly client goal." 
              />
            </div>
          </div>
          
          {/* CTA Section */}
          <CTASection metrics={metrics} />
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto mt-16 pt-8 border-t border-primary/20">
        <p className="text-center text-white/60 font-alata">
          App Built By Xcelerate Digital Systems
        </p>
      </div>
    </div>
  );
};
// Initial state
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
  clientSpend: 4500 / 3, // Set initial CAC to ⅓ of CLV
};

// App component
const App = () => {
  const [scenarios, setScenarios] = useState<Inputs[]>([initialInputState]);
  
  const addScenario = () => {
    setScenarios(prev => [...prev, { ...initialInputState }]);
  };
  
  return (
    <div className="bg-background min-h-screen">
      {scenarios.map((scenario, index) => (
        <SalesCalculator key={index} inputs={scenario} />
      ))}
      <button 
        onClick={addScenario} 
        className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg mt-8 mx-auto block 
                 font-staatliches transition-colors text-xl"
      >
        Add Scenario
      </button>
    </div>
  );
};

export default App;