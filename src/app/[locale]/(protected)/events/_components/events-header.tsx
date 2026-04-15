"use client";

import { Button } from "@/components/ui/button";
import CustomButton from "@/components/ui/custom-button";
import SearchField from "@/components/ui/search";
import { ListItem } from "@/schemas/global.schema";
import { ChevronDown, ChevronLeft, ChevronRight, Filter, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/constants/routes";

type ViewMode = "month" | "week" | "day";

const MONTH_NAMES = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getStartDate(date: Date, view: ViewMode): Date {
  const d = new Date(date);
  if (view === "month") {
    d.setDate(1);
  } else if (view === "week") {
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Monday
    d.setDate(d.getDate() + diff);
  }
  return d;
}

function getDateLabel(date: Date, viewMode: ViewMode): string {
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();

  if (viewMode === "month") return `${month} ${year}`;

  if (viewMode === "week") {
    const start = getStartDate(date, "week");
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const startDay = start.getDate();
    const endDay = end.getDate();
    const startMonth = MONTH_NAMES[start.getMonth()];
    const endMonth = MONTH_NAMES[end.getMonth()];
    const endYear = end.getFullYear();

    if (start.getMonth() === end.getMonth()) {
      return `${startDay} – ${endDay} ${endMonth} ${year}`;
    }
    return `${startDay} ${startMonth} – ${endDay} ${endMonth} ${endYear}`;
  }

  return `${date.getDate()} ${month} ${year}`;
}

function navigateDate(date: Date, viewMode: ViewMode, direction: 1 | -1): Date {
  const next = new Date(date);
  if (viewMode === "month") {
    next.setMonth(next.getMonth() + direction);
  } else if (viewMode === "week") {
    next.setDate(next.getDate() + direction * 7);
  } else {
    next.setDate(next.getDate() + direction);
  }
  return next;
}

function buildParams(date: Date, view: ViewMode, existing: URLSearchParams): URLSearchParams {
  const params = new URLSearchParams(existing.toString());
  const startDate = getStartDate(date, view);

  params.delete("startDate");
  params.set("view", view);
  params.set("startDate", formatDate(startDate));

  return params;
}

export default function EventHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    const today = new Date();
    today.setDate(1);
    return today;
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const viewParam = searchParams.get("view") as ViewMode;
    const view = viewParam && ["month", "week", "day"].includes(viewParam) ? viewParam : "month";
    setViewMode(view);

    const startDateParam = searchParams.get("startDate");
    if (startDateParam) {
      const parsed = new Date(startDateParam);
      if (!isNaN(parsed.getTime())) setCurrentDate(parsed);
    }
  }, [searchParams]);

  const viewOptions: ListItem[] = [
    { id: "month", name: "Mois" },
    { id: "week", name: "Semaine" },
    { id: "day", name: "Jour" },
  ];

  const updateURL = (date: Date, view: ViewMode) => {
    const params = buildParams(date, view, searchParams);
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  const handleViewChange = (value: ViewMode) => {
    setViewMode(value);
    setIsDropdownOpen(false);
    updateURL(currentDate, value);
  };

  const handleNavigate = (direction: 1 | -1) => {
    const next = navigateDate(currentDate, viewMode, direction);
    setCurrentDate(next);
    updateURL(next, viewMode);
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-4">
        <button
          onClick={() => handleNavigate(-1)}
          disabled={isPending}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="relative min-w-48">
          <h1
            className={`text-2xl font-semibold text-gray-900 text-center transition-opacity duration-200 ${
              isPending ? "opacity-50" : "opacity-100"
            }`}
          >
            {getDateLabel(currentDate, viewMode)}
          </h1>
          {isPending && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
            </div>
          )}
        </div>
        <button
          onClick={() => handleNavigate(1)}
          disabled={isPending}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
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
            disabled={isPending}
            className="!py-6 rounded-xl !px-5 disabled:opacity-50"
          >
            {viewOptions.find((opt) => opt.id === viewMode)?.name}
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
          </Button>

          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
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

        <Link href={ROUTES.EVENTS.CREATE}>
          <CustomButton text="Créer un événement" Icon={Plus} className="!p-6" isPending={isPending} />
        </Link>
      </div>
    </div>
  );
}
