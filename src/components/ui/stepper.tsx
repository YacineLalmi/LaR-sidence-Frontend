"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  title: string;
  description: string;
  status: "completed" | "current" | "upcoming";
}

const steps: Step[] = [
  {
    id: "step-1",
    title: "Account Setup",
    description: "Create your account and verify your email",
    status: "completed",
  },
  {
    id: "step-2",
    title: "Profile Information",
    description: "Add your personal details and preferences",
    status: "completed",
  },
  {
    id: "step-3",
    title: "Payment Method",
    description: "Set up your billing and payment information",
    status: "current",
  },
  {
    id: "step-4",
    title: "Review & Confirm",
    description: "Review your information and complete setup",
    status: "upcoming",
  },
  {
    id: "step-5",
    title: "Welcome",
    description: "Get started with your new account",
    status: "upcoming",
  },
];

export default function Component() {
  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="relative flex items-start">
            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute left-4 top-8 w-0.5 h-16 -ml-px",
                  step.status === "completed" ? "bg-primary" : "bg-muted"
                )}
              />
            )}

            {/* Step indicator */}
            <div className="relative flex items-center justify-center">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 bg-background",
                  step.status === "completed" && "bg-primary border-primary text-primary-foreground",
                  step.status === "current" && "border-primary text-primary",
                  step.status === "upcoming" && "border-muted text-muted-foreground"
                )}
              >
                {step.status === "completed" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
            </div>

            {/* Step content */}
            <div className="ml-4 min-w-0 flex-1">
              <h3
                className={cn(
                  "text-sm font-medium",
                  step.status === "completed" && "text-foreground",
                  step.status === "current" && "text-primary",
                  step.status === "upcoming" && "text-muted-foreground"
                )}
              >
                {step.title}
              </h3>
              <p
                className={cn(
                  "text-sm mt-1",
                  step.status === "completed" && "text-muted-foreground",
                  step.status === "current" && "text-foreground",
                  step.status === "upcoming" && "text-muted-foreground"
                )}
              >
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
