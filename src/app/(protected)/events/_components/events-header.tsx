"use client";

import { Button } from "@/components/ui/button";
import CustomButton from "@/components/ui/custom-button";
import SearchField from "@/components/ui/search";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import { ListItem } from "@/schemas/global.schema";
import { ChevronDown, ChevronLeft, ChevronRight, Filter, Plus } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type ViewMode = "month" | "week" | "day";

export default function EventHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Initialize viewMode from URL on mount
  useEffect(() => {
    const viewParam = searchParams.get("view") as ViewMode;
    if (viewParam && ["month", "week", "day"].includes(viewParam)) {
      setViewMode(viewParam);
    }
  }, [searchParams]);

  const viewOptions: ListItem[] = [
    { id: "month", name: "Mois" },
    { id: "week", name: "Semaine" },
    { id: "day", name: "Jour" },
  ];

  const handleViewChange = (value: ViewMode) => {
    setViewMode(value);
    setIsDropdownOpen(false);

    // Update URL with new view parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">Janvier 2026</h1>
        <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <SearchField />

        <Button variant="outline" className="!py-6 rounded-xl !px-5">
          <Filter className="w-4 h-4" />
          Filtres
        </Button>

        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="!py-6 rounded-xl !px-5"
          >
            {viewOptions.find((opt) => opt.id === viewMode)?.name}
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
          </Button>

          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                {viewOptions.map((option: ListItem) => (
                  <button
                    key={option.id}
                    onClick={() => handleViewChange(option.id as ViewMode)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                      viewMode === option.id ? "bg-gray-50 text-gray-900 font-medium" : "text-gray-700"
                    }`}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <Link href={NAVIGATION_KEYS.EVENTS.ADD}>
          <CustomButton text="Créer un événement" Icon={Plus} className="!p-6" />
        </Link>
      </div>
    </div>
  );
}
