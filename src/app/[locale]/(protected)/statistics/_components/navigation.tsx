"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Users, ChevronDown, Download, DollarSign, Building2, Database, PieChart, Clock, Calendar } from "lucide-react";
import { usePathname } from "next/navigation";

// Navigation config with icon mapping
const navItems = [
  { disabled: false, id: "biens", label: "Biens immobiliers", icon: Building2 },
  { disabled: true, id: "offers", label: "Offres", icon: Database },
  { disabled: false, id: "clients", label: "Clients", icon: Users },
  { disabled: true, id: "demands", label: "Demandes", icon: PieChart },
  { disabled: true, id: "agents", label: "Agents", icon: Clock },
  { disabled: true, id: "bills", label: "Facturation", icon: DollarSign }, // Note: Adjust lucide-react name if needed
  { disabled: true, id: "events", label: "Calendrier", icon: Calendar },
];

export function Navigation() {
  const [activeTab, setActiveTab] = React.useState("Biens immobiliers");
  const pathName = usePathname();
  const currentPage = pathName.split("/").pop();

  return (
    <header className="w-full bg-transparent">
      <div className="container mx-auto flex items-center justify-between">
        {/* Main Navigation Menu */}
        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <Button
                key={item.label}
                variant="ghost"
                onClick={() => setActiveTab(item.label)}
                className={cn(
                  "flex items-center gap-2.5 rounded-full px-6 py-2 text-base font-medium transition-colors border-black border-2 cursor-pointer",
                  isActive ? "bg-black text-white hover:bg-slate-800" : "text-slate-800 hover:bg-amber-200",
                )}
                disabled={item.disabled}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-black")} />
                {item.label}
              </Button>
            );
          })}
        </nav>

        {/* Export Button */}
        <Button
          variant="outline"
          className="rounded-full bg-black text-white h-11 px-8 text-base font-semibold gap-2.5 hover:bg-slate-800"
        >
          <Download className="h-5 w-5" />
          Exporter
          <ChevronDown className="h-4 w-4 text-slate-300" />
        </Button>
      </div>
    </header>
  );
}
