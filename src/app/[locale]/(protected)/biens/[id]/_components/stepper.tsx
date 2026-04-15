"use client";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface StepperStep {
  id: number;
  title: string;
}

interface VerticalStepperProps {
  steps: StepperStep[];
  className?: string;
  activeStep: number;
}

export function Stepper({ steps, className, activeStep }: VerticalStepperProps) {
  return (
    <div className={cn("flex justify-start relative", className, activeStep !== steps.length && "h-full")}>
      <div className="flex flex-col items-center gap-5">
        <div className={cn("bg-border absolute h-full border-2")} />

        {steps.map((step, index) => {
          const isCurrent = step.id === activeStep;

          return (
            <div key={step.id} className={cn("relative flex items-start", isCurrent && "flex-1")}>
              {/* Step Circle */}
              <div className="relative flex items-center justify-center z-10">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium bg-background",
                    step.id < activeStep && "bg-primary border-primary text-primary-foreground",
                    step.id === activeStep && "border-primary text-primary",
                    step.id > activeStep && "border-border text-muted-foreground"
                  )}
                >
                  {step.id < activeStep ? <Check className="h-4 w-4" /> : <span>{index + 1}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
