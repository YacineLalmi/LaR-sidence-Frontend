"use client";

import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Image from "next/image";
import carousel3 from "@/assests/images/carousel.jpg";
import carousel5 from "@/assests/images/carousel-4.jpg";
import carousel6 from "@/assests/images/carousel-5.jpg";

const carouselData = [
  { id: 3, image: carousel3, title: "Luxury Interiors", description: "Experience elegant interior designs." },
  { id: 5, image: carousel5, title: "Modern Living", description: "Sleek and functional spaces." },
  { id: 6, image: carousel6, title: "Urban Comfort", description: "Refined aesthetics for city life." },
];

export default function CustomCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000); // Set to 5s for better UX

    return () => {
      api.off("select", onSelect);
      clearInterval(interval);
    };
  }, [api]);

  return (
    <div className="w-full px-5 py-5">
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
        <div className="relative rounded-3xl overflow-hidden shadow-xl">
          <CarouselContent>
            {carouselData.map((item) => (
              // Use aspect-video or a fixed height like h-[500px] to prevent shifting
              <CarouselItem key={item.id} className="relative aspect-video min-h-[400px] w-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  priority={item.id === 3} // Priority for the first image
                  className="object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Overlay Banner */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent text-white p-8">
            <div className="flex items-end justify-between">
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-semibold mb-2">{carouselData[current]?.title}</h3>
                <p className="text-gray-200 text-sm max-w-xl">{carouselData[current]?.description}</p>
              </div>

              {/* Pagination Dots */}
              <div className="flex space-x-2 pb-2">
                {Array.from({ length: count }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={`h-1.5 transition-all duration-300 rounded-full ${
                      index === current ? "bg-white w-8" : "bg-white/30 w-3"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Carousel>
    </div>
  );
}
