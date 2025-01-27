/* eslint-disable react/no-unescaped-entities */
"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Tooltip } from './ui/tooltip';
import { Info } from 'lucide-react';
import Image from 'next/image';
import html2canvas from 'html2canvas';

// Component Types
interface Metrics {
  clicks: number;
  leads: number;
  discoveryCalls: number;
  salesCalls: number;
  newClients: number;
  estimatedRevenue: number;
  roas: number;
  estSalesCalls: number;
  estDiscoveryCalls: number;
  estLeads: number;
  estRevenue: number;
  leadToSale: number;
}

interface Inputs {
  avgCustomerValue: number;
  monthlyMarketingBudget: number;
  costPerClick: number;
  managementFee: number;
  landingPageConversion: number;
  discoveryCallRate: number;
  salesCallRate: number;
  clientWonRate: number;
  targetNewClients: number;
  clientSpend: number;
}

// Initial state
const initialInputState: Inputs = {
  avgCustomerValue: 3000,
  monthlyMarketingBudget: 3000,
  costPerClick: 5,
  managementFee: 0,
  landingPageConversion: 5,
  discoveryCallRate: 50,
  salesCallRate: 40,
  clientWonRate: 60,
  targetNewClients: 2,
  clientSpend: 3000 / 3,
};

const App = () => {
  return (
    <div className="min-h-screen">
      <SalesCalculator inputs={initialInputState} />
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
    newClients: 0,
    estimatedRevenue: 0,
    roas: 0,
    estSalesCalls: 0,
    estDiscoveryCalls: 0,
    estLeads: 0,
    estRevenue: 0,
    leadToSale: 0,
  });

  // Effect to automatically update clientSpend when avgLifetimeValue changes
  useEffect(() => {
    const newCAC = Number((inputs.avgCustomerValue / 3).toFixed(2));
    if (Math.abs(inputs.clientSpend - (inputs.avgCustomerValue / 3)) > 0.01) {
      setInputs(prev => ({
        ...prev,
        clientSpend: newCAC
      }));
    }
  }, [inputs.avgCustomerValue, inputs.clientSpend]);


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
    const newClients = salesCalls * (inputs.clientWonRate / 100);
    const estimatedRevenue = newClients * inputs.avgCustomerValue;
    const totalSpend = inputs.monthlyMarketingBudget + (inputs.managementFee || 0);
    const roas = inputs.monthlyMarketingBudget > 0 ? estimatedRevenue / totalSpend : 0;
    const estSalesCalls = inputs.clientWonRate > 0 ? Math.ceil(inputs.targetNewClients / (inputs.clientWonRate / 100)) : 0;
    const estDiscoveryCalls = inputs.salesCallRate > 0 ? Math.ceil(estSalesCalls / (inputs.salesCallRate / 100)) : 0;
    const estLeads = inputs.discoveryCallRate > 0 ? Math.ceil(estDiscoveryCalls / (inputs.discoveryCallRate / 100)) : 0;
    const leadToSale = leads > 0 ? (newClients / leads) * 100 : 0;
  
    setMetrics({
      clicks,
      leads,
      discoveryCalls,
      salesCalls,
      newClients,
      estimatedRevenue,
      roas,
      estSalesCalls,
      estDiscoveryCalls,
      estLeads,
      estRevenue: inputs.targetNewClients * inputs.avgCustomerValue,
      leadToSale,
    });
  }, [inputs]);


  // Save inputs and recalculate metrics when inputs change
  useEffect(() => {
    localStorage.setItem('calculatorInputs', JSON.stringify(inputs));
    doCalculateMetrics();
  }, [inputs, doCalculateMetrics]);

  // Add this with your other useEffects
useEffect(() => {
  // Check for state in URL
  const params = new URLSearchParams(window.location.search);
  const stateParam = params.get('state');
  
  if (stateParam) {
    try {
      const decodedState = JSON.parse(atob(stateParam));
      setInputs(decodedState.inputs);
      setMetrics(decodedState.metrics);
    } catch (error) {
      console.error('Error loading shared state:', error);
    }
  }
}, []);

const captureCalculator = () => {
  html2canvas(document.body, {
    scale: 2,
    logging: true,
    removeContainer: true,
    allowTaint: true,
    foreignObjectRendering: true,
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
    onclone: (clonedDoc) => {
      // This ensures fonts are loaded before capture
      const styleSheets = Array.from(document.styleSheets);
      const fontFaces = styleSheets
        .map(sheet => {
          try {
            return Array.from(sheet.cssRules)
              .filter(rule => rule instanceof CSSFontFaceRule)
              .map(rule => rule.cssText);
          } catch (_) { // Changed from (e) to (_) to indicate unused parameter
            return [];
          }
        })
        .flat();
    
      const style = clonedDoc.createElement('style');
      style.textContent = fontFaces.join('\n');
      clonedDoc.head.appendChild(style);
    
      return clonedDoc;
    }
  }).then(canvas => {
    const image = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = 'xds-calculator-results.png';
    link.href = image;
    link.click();
  });
};


  const shareCalculator = () => {
    const state = {
      inputs,
      metrics
    };
    const stateStr = btoa(JSON.stringify(state));
    const shareableUrl = `${window.location.origin}${window.location.pathname}?state=${stateStr}`;
    
    navigator.clipboard.writeText(shareableUrl);
    // You could add a toast notification here
    alert('Calculator link copied to clipboard!');
  };

  return (
    <div className="min-h-screen">
      {/* Logo Header */}
      <div className="max-w-8xl mx-auto mb-12 flex justify-between items-center">
  <Image 
    src="https://storage.googleapis.com/msgsndr/bXNFllgFgIK3oXo6R21q/media/66fe2aafed66474c1bb44c1f.png" 
    alt="Xcelerate Digital Systems Logo" 
    width={300} 
    height={50} 
    className="h-8 object-contain" 
    priority
  />
  <div className="flex gap-4">
    <button 
      onClick={captureCalculator}
      className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-staatliches 
                text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
    >
      📸 Save as Image
    </button>
    <button 
      onClick={shareCalculator}
      className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-staatliches 
                text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
    >
      🔗 Share Calculator
    </button>
  </div>
</div>
      <SectionHeader title="Conversion Calculator" />
      <div className="max-w-8xl mx-auto">
        <div id="report">
          {/* Top Section with 1/3 - 2/3 Split */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Input Fields (1/3) */}
            <div className="lg:w-1/3">
              <h4 className="text-2xl font-staatliches mb-6">Campaign Figures</h4>
              <div className="space-y-6">
                {inputFields.map((field) => (
                  <InputField
                    key={field.key}
                    label={field.label}
                    value={inputs[field.key]}
                    onChange={(e) => setInputs({ ...inputs, [field.key]: Number(e.target.value) })}
                    prefix={field.prefix}
                    suffix={field.suffix}
                    tooltipContent={field.tooltipContent}
                    description={field.description}
                    min={0}
                    max={field.suffix === "%" ? 100 : undefined}
                  />
                ))}
              </div>
            </div>

            {/* Right Column - Visualizations (2/3) */}
            <div className="lg:w-2/3 space-y-8">
              {/* Funnel Stages */}
              <div className="bg-[#00142a] border border-primary/20 rounded-xl p-6 shadow-lg">
              <h4 className="text-2xl font-staatliches mb-6">Estimated Sales</h4>

                <div className="flex flex-wrap justify-center gap-4">
                  <FunnelStage value={metrics.clicks} exactValue={metrics.clicks} label="# of Clicks" tooltipContent="Total clicks from ads" />
                  <FunnelStage value={metrics.leads} exactValue={metrics.leads} label="# of Leads" tooltipContent="Total leads generated" />
                  <FunnelStage value={metrics.discoveryCalls} exactValue={metrics.discoveryCalls} label="Show up/Contacted" tooltipContent="Leads successfully contacted or who showed up" />
                  <FunnelStage value={metrics.salesCalls} exactValue={metrics.salesCalls} label="Qualified" tooltipContent="Leads who are qualified for your services" />
                  <FunnelStage value={metrics.newClients} exactValue={metrics.newClients} label="Clients Closed" tooltipContent="New clients Won" />
                </div>
              </div>
              {/* Funnel Visualization */}
              <FunnelVisualization metrics={metrics} inputs={inputs} />
              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                label="Leads To Deal Rate"
                value={`${((metrics.newClients / metrics.leads) * 100).toFixed(1)}%`}
                subtitle={`${Math.round(metrics.newClients)} clients from ${Math.round(metrics.leads)} leads`}
                tooltipContent="Percentage of total leads that convert into paying clients"
              />
                <MetricCard
                  label="Estimated Monthly Revenue"
                  value={`$${metrics.estimatedRevenue.toLocaleString()}`}
                  subtitle={`Based on ${Math.round(metrics.newClients)} new clients per month`}
                  tooltipContent="Projected monthly revenue based on your current conversion rates"
                />
                <MetricCard
                  label="Return on Investment (ROI)"
                  value={`${metrics.roas.toFixed(2)}x`}
                  subtitle={`For every $1 spent ($${inputs.monthlyMarketingBudget + inputs.managementFee} total) you get $${metrics.roas.toFixed(2)} back`}
                  tooltipContent="Return on total investment including ad spend and management fees"
                />
                <MetricCard
                  label="Current Cost Per Acquisition"
                  value={metrics.newClients > 0 ? `$${((inputs.monthlyMarketingBudget + inputs.managementFee) / metrics.newClients).toFixed(2)}` : '$0.00'}
                  subtitle={`Based on ${Math.round(metrics.newClients)} new clients and $${(inputs.monthlyMarketingBudget + inputs.managementFee).toFixed(2)} total spend`}
                  tooltipContent="Your actual cost to acquire one new client based on current performance"
                />
                <MetricCard
                  label="Max Cost to Win a Client"
                  value={`$${inputs.clientSpend.toFixed(2)}`}
                  subtitle={`Industry benchmark: Your cost to win a client should be no more than ⅓ of their total value ($${(inputs.avgCustomerValue).toFixed(2)})`}                
                  tooltipContent="Maximum amount you're willing to spend to acquire one new client"
                />
              </div>
            </div>
          </div>

        
          {/* CTA Section */}
          <CTASection metrics={metrics} />
        </div>
      </div>
    </div>
  );
};

// Utility Components
const MetricCard = ({ label, value, subtitle, tooltipContent }: {
  label: string;
  value: string | number;
  subtitle?: string;
  tooltipContent: string;
}) => (
  <div className="bg-[#00142a] border border-primary/20 rounded-xl rounded-lg p-6 hover:border-primary/40 transition-colors shadow-lg">
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
  tooltipContent,
  description 
}: {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  prefix?: string;
  suffix?: string;
  tooltipContent?: string;
  description?: string; 

}) => {
  // Add a default value of 0 if value is undefined
  const [localValue, setLocalValue] = useState((value ?? 0).toString());

  useEffect(() => {
    setLocalValue((value ?? 0).toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    if (newValue === '') {
      onChange({ ...e, target: { ...e.target, value: '0' } });
    } else {
      const cleanValue = newValue.replace(/^0+/, '') || '0';
      onChange({ ...e, target: { ...e.target, value: cleanValue } });
    }
  };

  return (
    <div className="mb-6">
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
      {description && (
        <p className="mt-2 text-sm text-white/60 italic">
          {description}
        </p>
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
};

// Funnel Stage Component
const FunnelStage = ({ value, exactValue, label, tooltipContent }: {
  value: number;
  exactValue?: number;
  label: string;
  tooltipContent: string;
}) => (
  <div className="flex flex-col items-center p-4">
    <Tooltip content={tooltipContent}>
      <div className="w-24 h-24 rounded-full bg-background/50 border-2 border-primary/30 flex flex-col items-center justify-center hover:border-primary transition-colors">
        <div className="text-xl font-staatliches text-white">{Math.round(value).toLocaleString()}</div>
        {exactValue && Math.round(exactValue) !== exactValue && (
          <div className="text-xs text-primary">({exactValue.toFixed(1)})</div>
        )}
      </div>
    </Tooltip>
    <div className="mt-4 text-sm font-alata text-white/70 text-center">{label}</div>
  </div>
);

// Section Header Component
const SectionHeader = ({ title }: { title: string }) => (
  <div className="mb-8">
    <h2 className="text-3xl font-staatliches text-white mb-4">{title}</h2>
    <div className="h-px bg-primary/20" />
  </div>
);

const inputFields = [
  { 
    label: "Average Customer Value ($)", 
    key: "avgCustomerValue" as keyof Inputs, 
    prefix: "$",
    tooltipContent: "The total revenue you expect to earn from a client over the entire time they remain your customer." 
  },
  { 
    label: "Monthly Ad Spend ($)", 
    key: "monthlyMarketingBudget" as keyof Inputs, 
    prefix: "$",
    tooltipContent: "The total amount you plan to invest in advertising and lead generation each month." 
  },
  { 
    label: "Average Cost Per Click (CPC) ($)", 
    key: "costPerClick" as keyof Inputs, 
    prefix: "$",
    tooltipContent: "The average cost you pay for each click on your ads (e.g., from Google or Facebook)." 
  },
  { 
    label: "Monthly Management Fee ($)", 
    key: "managementFee" as keyof Inputs, 
    prefix: "$",
    tooltipContent: "Monthly fee for managing your advertising campaigns",
    description: "Optional: Add management fee to see total ROI including service costs" 
  },
  { 
    label: "Landing Page Conversion Rate (%)", 
    key: "landingPageConversion" as keyof Inputs, 
    suffix: "%",
    tooltipContent: "The percentage of visitors to your landing page who fill out a form or take a desired action to become leads.",
    description: "XDS Standard: 5-15% conversion rate" 
  },
  { 
    label: "How Many Leads Show Up/Contactable? (%)", 
    key: "discoveryCallRate" as keyof Inputs, 
    suffix: "%",
    tooltipContent: "The percentage of leads who you can successfully contact or who show up for their consultation",
    description: "XDS Standard: 70%+ show up rate"
  },
  { 
    label: "How Many Leads Are Qualified? (%)", 
    key: "salesCallRate" as keyof Inputs, 
    suffix: "%",
    tooltipContent: "The percentage of contacted leads who are qualified for your services",
    description: "XDS Standard: 40-80% qualification rate"
  },
  { 
    label: "How Many Closed? (%)", 
    key: "clientWonRate" as keyof Inputs, 
    suffix: "%",
    tooltipContent: "The percentage of proposals that turn into paying clients.",
    description: "XDS Standard: 30%+ close rate"
  },
];

// Funnel Visualization Component
const FunnelVisualization = ({ metrics, inputs }: { metrics: Metrics; inputs: Inputs }) => {
  const stages = [
    { label: "Leads", value: metrics.leads, icon: "👤" },
    { label: "Show up/Contacted Leads", value: metrics.discoveryCalls, icon: "📞" },
    { label: "Qualified Leads", value: metrics.salesCalls, icon: "🗣️" },
    { label: "New Clients", value: metrics.newClients, icon: "✅" },
  ];

  const maxStageValue = Math.max(...stages.map((stage) => stage.value));

  return (
    <div className="bg-[#00142a] border border-primary/20 rounded-xl p-6 shadow-lg">
      <h3 className="text-2xl font-staatliches mb-6">
        Marketing Funnel
      </h3>
      <div className="space-y-6">
        {stages.map((stage, index) => {
          const percentage =
            index === 0
              ? null
              : ((stage.value / stages[index - 1].value) * 100).toFixed(1);


          return (
            <div key={index} className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white flex items-center space-x-2">
                  <span>{stage.icon}</span>
                  <span>{stage.label}</span>
                </span>
                <span className="text-sm text-primary">
                  {Math.round(stage.value).toLocaleString()}
                </span>
              </div>
              <div className="relative h-4 bg-background/30 rounded">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-primary/70 rounded"
                  style={{
                    width: `${(stage.value / maxStageValue) * 100}%`,
                  }}
                />
              </div>
              {index === 0 ? (
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

// CTA Section Component
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
    <div className="bg-[#00142a] border border-primary/20 rounded-xl p-8 mt-16">
      <div className="text-center space-y-8">
        <div className="space-y-2">
          <h3 className="text-3xl font-staatliches text-white">
            Your Current Growth Potential
          </h3>
          <p className="text-white/80">
            Based on your numbers, here's what you're on track to achieve:
          </p>
        </div>

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
            <div className="text-sm text-white/60">Lead To Deal Rate</div>
          </div>
        </div>

        <div>
          <p className="text-white/80">
            Unlock predictable growth for your business! Even a 2% improvement in your conversion rates can significantly 
            increase your revenue—all without spending more on marketing. Book a time with us and see how small changes 
            can drive consistent, measurable results.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGetGamePlan}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-staatliches text-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
            <span>Get Your Free 30-Min XDS Game Plan →</span>
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

export default App;