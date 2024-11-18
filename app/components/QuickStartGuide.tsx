import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export const QuickStartGuide: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const steps = [
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
      title: "Compare Scenarios",
      description: "Create multiple scenarios to compare different strategies and budgets."
    },
    {
      title: "Analyze ROI",
      description: "Review the break-even analysis, profit projections, and ROI metrics to optimize your strategy."
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-staatliches text-white">Quick Start Guide</DialogTitle>
          <DialogDescription className="text-white/70">
            Follow these steps to get the most out of your sales calculator
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {steps.map((step, index) => (
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
      </DialogContent>
    </Dialog>
  );
};
