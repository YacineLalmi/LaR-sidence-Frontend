"use client";

import * as React from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { TransactionsChart } from "./charts/transactions-chart";
import { cn } from "@/lib/utils";
import { BienDistributionChart } from "./charts/bien-distribution-chart";

export function CarouselCard({ isLoading }: { isLoading?: boolean }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const slides = [
    { id: "biens", title: ["Biens", "totaux"], value: "142", trend: "8.23" },
    { id: "ventes", title: ["Ventes", "mensuelles"], value: "24", trend: "12.5" },
    { id: "locations", title: ["Locations", "actives"], value: "89", trend: "4.10" },
  ];

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="w-full flex flex-col items-center">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent className="p-1">
          <CarouselItem className="basis-full">
            <TransactionsChart />
          </CarouselItem>
          <CarouselItem className="basis-full">
            <BienDistributionChart />
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      {/* Navigation Dots */}
      {!isLoading && (
        <div className="flex gap-2 mt-4">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-300",
                current === index
                  ? "bg-black w-6" // Active state (optional: make it wider for better UX)
                  : "bg-gray-300",
              )}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
