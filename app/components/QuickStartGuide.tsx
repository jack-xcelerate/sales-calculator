// app/components/QuickStartGuide.tsx
import React from 'react';

export const QuickStartGuide: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background border border-primary/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-staatliches text-white">Quick Start Guide</h2>
            <button 
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="space-y-6">
            {[
              {
                title: "Set Your Lifetime Value",
                description: "Enter the average revenue you expect from each client throughout your entire relationship. This will automatically calculate a recommended client acquisition cost (1/3 of lifetime value)."
              },
              {
                title: "Review Acquisition Cost",
                description: "The client acquisition cost is pre-set to 1/3 of your lifetime value as a benchmark. You can adjust this based on your business model and margins."
              },
              {
                title: "Enter Marketing Budget",
                description: "Input your monthly marketing spend to calculate potential returns and ROI."
              },
              {
                title: "Adjust Conversion Rates",
                description: "Fine-tune your funnel conversion rates based on historical data or industry benchmarks."
              },
              {
                title: "Analyze Results",
                description: "Review the metrics, ROI analysis, and funnel visualization to optimize your strategy."
              }
            ].map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-staatliches">{index + 1}</span>
                </div>
                <div>
                  <h3 className="font-staatliches text-white text-lg">{step.title}</h3>
                  <p className="text-white/70 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};