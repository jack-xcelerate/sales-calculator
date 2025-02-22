/* eslint-disable react/no-unescaped-entities */
"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Tooltip } from './ui/tooltip';
import { Info } from 'lucide-react';
import Image from 'next/image';
import "../globals.css";

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

interface ValidationError {
  isError: boolean;
  message: string;
}

// Initial States
const initialInputState: Inputs = {
  avgCustomerValue: 3000,
  monthlyMarketingBudget: 3000,
  costPerClick: 4,
  managementFee: 0,
  landingPageConversion: 5,
  discoveryCallRate: 50,
  salesCallRate: 50,
  clientWonRate: 50,
  targetNewClients: 2,
  clientSpend: 3000 / 3,
};

const initialMetricsState: Metrics = {
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
};

// Input Field Configurations
const adSpendFields = [
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
    label: "Landing Page Conversion Rate (%)", 
    key: "landingPageConversion" as keyof Inputs, 
    suffix: "%",
    tooltipContent: "The % of people who click to the page, and become a lead. AKA our page conversion rate",
    description: "XDS Standard: 5-15% conversion rate" 
  }
];

const conversionFields = [
  { 
    label: "How Many Leads Show Up/Contactable? (%)", 
    key: "discoveryCallRate" as keyof Inputs, 
    suffix: "%",
    tooltipContent: "The % of leads who you can successfully contact or who show up",
    description: "XDS Standard: 70%+ show up rate"
  },
  { 
    label: "How Many Leads Are Qualified? (%)", 
    key: "salesCallRate" as keyof Inputs, 
    suffix: "%",
    tooltipContent: "The % of contacted leads who are qualified for your services",
    description: "XDS Standard: 40-80% qualification rate"
  },
  { 
    label: "How Many Closed? (%)", 
    key: "clientWonRate" as keyof Inputs, 
    suffix: "%",
    tooltipContent: "The % deals you close",
    description: "XDS Standard: 30%+ close rate"
  }
];

const revenueFields = [
  { 
    label: "Average Customer Value ($)", 
    key: "avgCustomerValue" as keyof Inputs, 
    prefix: "$",
    tooltipContent: "The total revenue you expect to earn from a client over the entire time they remain your customer." 
  },
  { 
    label: "Monthly Management Fee ($)", 
    key: "managementFee" as keyof Inputs, 
    prefix: "$",
    tooltipContent: "Monthly fee for managing your advertising campaigns",
    description: "Add XDS management fee to see total ROI from investment" 
  }
];

// Utility Functions
const formatNumber = (value: number, decimals: number = 0): string => {
  if (!Number.isFinite(value)) return '0';
  const fixedValue = value.toFixed(decimals);
  const parts = fixedValue.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (decimals > 0 && !parts[1]) {
    parts[1] = '0'.repeat(decimals);
  }
  return parts.join('.');
};

const formatCurrency = (value: number, decimals: number = 0): string => {
  if (!Number.isFinite(value)) return '$0.00';
  const actualDecimals = Math.max(decimals, 2);
  return '$' + formatNumber(value, actualDecimals);
};

const formatPercentage = (value: number, decimals: number = 1): string => {
  if (!Number.isFinite(value)) return '0.0%';
  return formatNumber(value, Math.max(decimals, 1)) + '%';
};

const validateInput = (value: number, label: string): ValidationError => {
  if (value < 0) return { isError: true, message: `${label} cannot be negative` };
  if (label.includes('%') && value > 100) return { isError: true, message: `${label} cannot exceed 100%` };
  return { isError: false, message: '' };
};

const calculateMetricsForRate = (rate: number, inputs: Inputs) => {
  const safeInputs = {
    ...inputs,
    monthlyMarketingBudget: Math.max(0, inputs.monthlyMarketingBudget),
    costPerClick: Math.max(0.01, inputs.costPerClick),
    avgCustomerValue: Math.max(0, inputs.avgCustomerValue)
  };

  const clicks = safeInputs.costPerClick > 0 ? safeInputs.monthlyMarketingBudget / safeInputs.costPerClick : 0;
  const leads = clicks * (rate / 100);
  const discoveryCalls = leads * (safeInputs.discoveryCallRate / 100);
  const salesCalls = discoveryCalls * (safeInputs.salesCallRate / 100);
  const newClients = salesCalls * (safeInputs.clientWonRate / 100);
  const revenue = (newClients * safeInputs.avgCustomerValue) - (safeInputs.monthlyMarketingBudget + safeInputs.managementFee);
  const leadToClientRate = leads > 0 ? (newClients / leads) * 100 : 0;
  
  return {
    clicks,
    exactLeads: leads,
    leads: Math.round(leads),
    exactNewClients: newClients,
    newClients: Math.round(newClients),
    revenue,
    avgClientValue: safeInputs.avgCustomerValue,
    leadToClientRate
  };
};

// Supporting Components
const MetricCard = ({ 
  label, 
  value, 
  subtitle, 
  tooltipContent 
}: {
  label: string;
  value: string | number;
  subtitle?: string;
  tooltipContent: string;
}) => (
  <div className="bg-[#00142a] border border-white rounded-xl rounded-lg p-6 hover:border-white transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
    <div className="flex items-center space-x-2 mb-4">
      <span className="text-primary text-white text-sm font-staatliches">{label}</span>
      <Tooltip content={tooltipContent}>
        <Info className="h-4 w-4 text-white/50 cursor-help hover:text-primary transition-colors" />
      </Tooltip>
    </div>
    <div className="text-4xl font-staatliches text-white mb-2">
      {typeof value === 'string' ? value : formatNumber(Number(value))}
    </div>
    {subtitle && <div className="text-sm font-alata text-white/60">{subtitle}</div>}
  </div>
);

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
  const [localValue, setLocalValue] = useState((value ?? 0).toString());
  const [error, setError] = useState<ValidationError>({ isError: false, message: '' });

  useEffect(() => {
    setLocalValue((value ?? 0).toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const cleanValue = newValue.replace(/[^\d.]/g, '');
    const parts = cleanValue.split('.');
    const sanitizedValue = parts[0] + (parts.length > 1 ? '.' + parts[1] : '');
    
    setLocalValue(sanitizedValue);
    
    const numericValue = Number(sanitizedValue);
    const validation = validateInput(numericValue, label);
    setError(validation);
    
    if (!validation.isError) {
      if (sanitizedValue === '') {
        onChange({ ...e, target: { ...e.target, value: '0' } });
      } else {
        onChange({ ...e, target: { ...e.target, value: sanitizedValue } });
      }
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-2">
        <label className="font-alata text-white text-sm font-medium block">{label}</label>
        {tooltipContent && (
          <Tooltip content={tooltipContent}>
            <Info className="h-4 w-4 text-white/50 cursor-help hover:text-primary transition-colors" />
          </Tooltip>
        )}
      </div>
      <div className="relative">
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-background/50 border rounded-lg text-white 
                     focus:outline-none focus:ring-1 transition-colors
                     ${error.isError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-white/30 focus:border-primary focus:ring-primary'}
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
      {error.isError && (
        <p className="mt-2 text-sm text-red-500">
          {error.message}
        </p>
      )}
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

const FunnelStage = ({ 
  value, 
  exactValue, 
  label, 
  tooltipContent 
}: {
  value: number;
  exactValue?: number;
  label: string;
  tooltipContent: string;
}) => (
  <div className="flex flex-col items-center p-4">
    <Tooltip content={tooltipContent}>
      <div className="w-24 h-24 rounded-full bg-background/50 border-2 border-primary flex flex-col items-center justify-center hover:border-white transition-all transform hover:-translate-y-1">
        <div className="text-xl font-staatliches text-white">{Math.round(value).toLocaleString()}</div>
        {exactValue && Math.round(exactValue) !== exactValue && (
          <div className="text-xs text-primary">({exactValue.toFixed(1)})</div>
        )}
      </div>
    </Tooltip>
    <div className="mt-4 text-sm font-alata text-white text-center">{label}</div>
  </div>
);

const SectionHeader = ({ title }: { title: string }) => (
  <div className="mb-8 mt-8">
    <h2 className="text-3xl font-staatliches text-white mb-4">{title}</h2>
    <div className="h-px bg-primary/80" />
  </div>
);

const FunnelVisualization = ({ metrics, inputs }: { metrics: Metrics; inputs: Inputs }) => {
  const stages = [
    { label: "Leads", value: metrics.leads, icon: "👤" },
    { label: "Show up/Contacted Leads", value: metrics.discoveryCalls, icon: "📞" },
    { label: "Qualified Leads", value: metrics.salesCalls, icon: "🗣️" },
    { label: "Clients Won", value: metrics.newClients, icon: "✅" },
  ];

  const maxStageValue = Math.max(...stages.map((stage) => stage.value));

  return (
    <div className="p-6">
      <div className="space-y-6">
        {stages.map((stage, index) => {
          const percentage =
            index === 0
              ? null
              : ((stage.value / stages[index - 1].value) * 100);

          return (
            <div key={index} className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-lg text-white flex items-center space-x-2">
                  <span>{stage.icon}</span>
                  <span>{stage.label}</span>
                </span>
                <span className="text-sm text-white">
                  {formatNumber(stage.value)}
                </span>
              </div>
              <div className="relative h-6 bg-background/30 rounded">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-primary/70 rounded transition-all transform hover:from-white hover:to-white/70 hover:-translate-y-1 hover:shadow-lg"                  style={{
                    width: `${(stage.value / maxStageValue) * 100}%`,
                  }}
                />
              </div>
              {index === 0 ? (
                <span className="text-xs text-white/70">
                  ${formatNumber(inputs.costPerClick, 2)} CPC | {inputs.landingPageConversion}% Landing Page Conversion
                </span>
              ) : (
                <span className="text-xs text-white/70">{percentage ? formatNumber(percentage, 1) : 0}% conversion</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main Component
const SalesCalculator = ({ inputs: initialInputs }: { inputs: Inputs }) => {
  const [inputs, setInputs] = useState<Inputs>(initialInputs);
  const [metrics, setMetrics] = useState<Metrics>(initialMetricsState);

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
    if (savedInputs) {
      try {
        setInputs(JSON.parse(savedInputs));
      } catch (error) {
        console.error('Error loading saved inputs:', error);
      }
    }
  }, []);

  // Calculate metrics function with improved error handling
  const doCalculateMetrics = useCallback(() => {
    // Ensure positive values for calculations
    const safeInputs = {
      ...inputs,
      monthlyMarketingBudget: Math.max(0, inputs.monthlyMarketingBudget),
      costPerClick: Math.max(0.01, inputs.costPerClick), // Prevent division by zero
      landingPageConversion: Math.min(100, Math.max(0, inputs.landingPageConversion)),
      discoveryCallRate: Math.min(100, Math.max(0, inputs.discoveryCallRate)),
      salesCallRate: Math.min(100, Math.max(0, inputs.salesCallRate)),
      clientWonRate: Math.min(100, Math.max(0, inputs.clientWonRate)),
    };

    // Safe calculations with null checks
    const clicks = safeInputs.costPerClick > 0 ? safeInputs.monthlyMarketingBudget / safeInputs.costPerClick : 0;
    const leads = clicks * (safeInputs.landingPageConversion / 100);
    const discoveryCalls = leads * (safeInputs.discoveryCallRate / 100);
    const salesCalls = discoveryCalls * (safeInputs.salesCallRate / 100);
    const newClients = salesCalls * (safeInputs.clientWonRate / 100);
    const estimatedRevenue = (newClients * safeInputs.avgCustomerValue) - (safeInputs.monthlyMarketingBudget + safeInputs.managementFee);
    const totalSpend = safeInputs.monthlyMarketingBudget + (safeInputs.managementFee || 0);
    const roas = totalSpend > 0 ? estimatedRevenue / totalSpend : 0;
    const estSalesCalls = safeInputs.clientWonRate > 0 ? Math.ceil(safeInputs.targetNewClients / (safeInputs.clientWonRate / 100)) : 0;
    const estDiscoveryCalls = safeInputs.salesCallRate > 0 ? Math.ceil(estSalesCalls / (safeInputs.salesCallRate / 100)) : 0;
    const estLeads = safeInputs.discoveryCallRate > 0 ? Math.ceil(estDiscoveryCalls / (safeInputs.discoveryCallRate / 100)) : 0;
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
      estRevenue: safeInputs.targetNewClients * safeInputs.avgCustomerValue,
      leadToSale,
    });
  }, [inputs]);
  // Save inputs and recalculate metrics when inputs change
  useEffect(() => {
    localStorage.setItem('calculatorInputs', JSON.stringify(inputs));
    doCalculateMetrics();
  }, [inputs, doCalculateMetrics]);

  // Handle URL state loading
  useEffect(() => {
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

  const shareCalculator = () => {
    const state = {
      inputs,
      metrics
    };
    const stateStr = btoa(JSON.stringify(state));
    const shareableUrl = `${window.location.origin}${window.location.pathname}?state=${stateStr}`;
    
    navigator.clipboard.writeText(shareableUrl)
      .then(() => alert('Calculator link copied to clipboard!'))
      .catch(err => console.error('Error copying to clipboard:', err));
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
            onClick={shareCalculator}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-staatliches 
                      text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            🔗 Share Calculator
          </button>
        </div>
      </div>

      <SectionHeader title="Xcelerate Growth Engine" />
      
      <div className="max-w-8xl mx-auto">
        <div id="report">
          {/* Ad Spend Configuration Section */}
          <div className="bg-[#00142a] border border-white rounded-xl p-6 shadow-lg mb-8">
            <h4 className="text-2xl text-white mb-6">Lead Generation Pipeline - Step 1: Fuel</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {adSpendFields.map((field) => (
                <InputField
                  key={field.key}
                  label={field.label}
                  value={inputs[field.key]}
                  onChange={(e) => setInputs({ ...inputs, [field.key]: Number(e.target.value) })}
                  prefix={field.prefix}
                  tooltipContent={field.tooltipContent}
                  min={0}
                />
              ))}
            </div>
          </div>

          {/* Main Content Split */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Conversion Rates */}
            <div className="lg:w-1/3 bg-[#00142a] border border-white rounded-xl p-6 shadow-lg mb-8">
              <h4 className="text-2xl text-white mb-6">Sales Pipeline - Step 2: Ignition</h4>
              <div className="space-y-6">
                {conversionFields.map((field) => (
                  <InputField
                    key={field.key}
                    label={field.label}
                    value={inputs[field.key]}
                    onChange={(e) => setInputs({ ...inputs, [field.key]: Number(e.target.value) })}
                    suffix={field.suffix}
                    tooltipContent={field.tooltipContent}
                    description={field.description}
                    min={0}
                    max={field.suffix === "%" ? 100 : undefined}
                  />
                ))}
              </div>
            </div>

            {/* Right Column - Funnel Visualization */}
            <div className="lg:w-2/3">
              {/* Funnel Stages */}
              <div className="bg-[#00142a] border border-white rounded-xl p-6 shadow-lg mb-8">
                <h4 className="text-2xl text-white mb-6">The Client Journey</h4>
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <FunnelStage value={metrics.clicks} exactValue={metrics.clicks} label="# of Clicks" tooltipContent="Total clicks from ads" />
                  <FunnelStage value={metrics.leads} exactValue={metrics.leads} label="# of Leads" tooltipContent="Total leads generated" />
                  <FunnelStage value={metrics.discoveryCalls} exactValue={metrics.discoveryCalls} label="Leads Shown Up/Contacted" tooltipContent="Leads successfully contacted or who showed up" />
                  <FunnelStage value={metrics.salesCalls} exactValue={metrics.salesCalls} label="Qualified Leads" tooltipContent="Leads who are qualified for your services" />
                  <FunnelStage value={metrics.newClients} exactValue={metrics.newClients} label="Clients Won" tooltipContent="New Clients Won" />
                </div>
                <FunnelVisualization metrics={metrics} inputs={inputs} />
              </div>

              {/* Revenue Fields below funnel */}
              <div className="bg-[#00142a] border border-white rounded-xl p-6 mb-10">
                <h4 className="text-2xl text-white mb-6">Revenue Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {revenueFields.map((field) => (
                    <InputField
                      key={field.key}
                      label={field.label}
                      value={inputs[field.key]}
                      onChange={(e) => setInputs({ ...inputs, [field.key]: Number(e.target.value) })}
                      prefix={field.prefix}
                      tooltipContent={field.tooltipContent}
                      description={field.description}
                      min={0}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <SectionHeader title="Step 3: Xcelerate" />


          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <MetricCard
              label="Cost Per Lead (CPL)"
              value={metrics.leads > 0 ? formatCurrency((inputs.monthlyMarketingBudget + inputs.managementFee) / metrics.leads, 2) : '$0.00'}
              subtitle={`Based on ${Math.round(metrics.leads)} leads and ${formatCurrency(inputs.monthlyMarketingBudget + inputs.managementFee)} total spend`}
              tooltipContent="Your actual cost to acquire one lead based on current performance"
            />
            <MetricCard
              label="Cost Per Client (CPA)"
              value={metrics.newClients > 0 ? formatCurrency((inputs.monthlyMarketingBudget + inputs.managementFee) / metrics.newClients, 2) : '$0.00'}
              subtitle={`Based on ${Math.round(metrics.newClients)} new clients and ${formatCurrency(inputs.monthlyMarketingBudget + inputs.managementFee)} total spend`}
              tooltipContent="Your actual cost to acquire one new client based on current performance"
            />
            <MetricCard
              label="Breakeven Cost Win a Client"
              value={formatCurrency(inputs.clientSpend, 2)}
              subtitle={`Your cost to win a client should be no more than ⅓ of their total value (${formatCurrency(inputs.avgCustomerValue)})`}
              tooltipContent="Maximum amount you're willing to spend to acquire one new client"
            />
            <MetricCard
              label="Leads To Client Rate"
              value={formatPercentage(metrics.leadToSale, 1)}
              subtitle={`${Math.round(metrics.newClients)} clients from ${Math.round(metrics.leads)} leads`}
              tooltipContent="Percentage of total leads that convert into paying clients"
            />
            <MetricCard
              label="Estimated Monthly Net Revenue"
              value={formatCurrency(metrics.estimatedRevenue)}
              subtitle={`After marketing costs of ${formatCurrency(inputs.monthlyMarketingBudget + inputs.managementFee)}`}
              tooltipContent="Projected monthly revenue minus marketing costs (ad spend + management fee)"
            />
            <MetricCard
              label="Return on Investment (ROI)"
              value={`${formatNumber(metrics.roas, 2)}x`}
              subtitle={`For every $1 spent you get ${formatNumber(metrics.roas, 2)} back`}
              tooltipContent="Return on total investment including ad spend and management fees"
            />
          </div>

          {/* Conversion Impact Table */}
          <div className="mt-12">
            <div className="bg-[#00142a] border border-white rounded-xl p-6">
              <h4 className="text-2xl font-staatliches text-white mb-1">Impact of A Strong Offer</h4>
              <h5 className="text-white mb-6">without Spending Another $ On Ad Spend</h5>
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-primary/20">
                      <th className="text-center p-3">Traffic</th>
                      <th className="text-center bg-white/10 p-3">Landing Page % Rate</th>
                      <th className="text-center p-3">Leads</th>
                      <th className="text-center p-3">Avg Client Value</th>
                      <th className="text-center p-3">Close Rate</th>
                      <th className="text-center p-3">Sales #</th>
                      <th className="text-center p-3">Revenue $</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 4, 8, 16].map((rate) => {
                      const metrics = calculateMetricsForRate(rate, inputs);
                      return (
                        <tr key={rate} className="border-b border-primary/20 hover:bg-primary/5">
                          <td className="text-center p-3">{formatNumber(metrics.clicks)}</td>
                          <td className="text-center bg-white/10 p-3">{formatNumber(rate, 1)}%</td>
                          <td className="text-center p-3">
                            <div>{formatNumber(metrics.leads)}</div>
                            {Math.round(metrics.exactLeads) !== metrics.exactLeads && (
                              <div className="text-xs text-primary">({metrics.exactLeads.toFixed(1)})</div>
                            )}
                          </td>
                          <td className="text-center p-3">{formatCurrency(metrics.avgClientValue)}</td>
                          <td className="text-center p-3">{formatNumber(metrics.leadToClientRate, 1)}%</td>
                          <td className="text-center p-3">
                            <div>{formatNumber(metrics.newClients)}</div>
                            {Math.round(metrics.exactNewClients) !== metrics.exactNewClients && (
                              <div className="text-xs text-primary">({metrics.exactNewClients.toFixed(1)})</div>
                            )}
                          </td>
                          <td className="text-center p-3">{formatCurrency(metrics.revenue)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-[#00142a] border border-white rounded-xl p-16 mt-16">
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
                  <div className="text-3xl font-staatliches text-white">
                    {formatCurrency(metrics.estimatedRevenue)}
                  </div>
                  <div className="text-sm text-white/60">Net Monthly Revenue</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-staatliches text-white">
                    {formatNumber(metrics.newClients)}
                    {Math.round(metrics.newClients) !== metrics.newClients && (
                      <span className="text-lg text-white ml-2">({metrics.newClients.toFixed(1)})</span>
                    )}
                  </div>
                  <div className="text-sm text-white/60">New Clients Per Month</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-staatliches text-white">
                    {formatNumber(metrics.roas, 2)}x
                  </div>
                  <div className="text-sm text-white/60">Estimated Return/ROAS</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-staatliches text-white">
                    {formatNumber(metrics.leadToSale, 1)}%
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
                  onClick={() => {
                    const resultsToSave = {
                      monthlyRevenue: Math.round(metrics.estimatedRevenue),
                      newClients: Math.round(metrics.newClients),
                      roas: Number(metrics.roas.toFixed(1)),
                      leadsNeeded: Math.round(metrics.estLeads)
                    };
                    localStorage.setItem('calculatorResults', JSON.stringify(resultsToSave));
                    window.location.href = 'https://xceleratedigitalsystems.com.au/xds-game-plan';
                  }}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-staatliches 
                            text-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span>Get Your Free 30-Min XGE Game Plan→</span>
                </button>
                <div className="flex items-center justify-center gap-4 text-sm text-white/80 w-full">
                  <span className="flex flex-col items-center text-center">
                    <span className="flex items-center">
                      <span className="text-primary mr-1">✓</span> Tailored Strategy
                    </span>
                    <span className="flex items-center">
                      <span className="text-primary mr-1">✓</span> Implementation Timeline
                    </span>
                    <span className="flex items-center">
                      <span className="text-primary mr-1">✓</span> Growth Projection
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export const App = () => {
  return (
    <div className="min-h-screen">
      <SalesCalculator inputs={initialInputState} />
    </div>
  );
};

export default App;
