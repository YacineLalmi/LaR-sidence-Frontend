"use client";

import { useState } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { useEffect } from "react";
import carousel1 from "@/assests/images/carousel-1.jpg";
import carousel2 from "@/assests/images/carousel-2.jpg";
import carousel3 from "@/assests/images/carousel.jpg";
import carousel4 from "@/assests/images/carousel-3.jpg";
import carousel5 from "@/assests/images/carousel-4.jpg";
import carousel6 from "@/assests/images/carousel-5.jpg";
import Image from "next/image";

const carouselData = [
  {
    id: 1,
    image: carousel1,
    title: "Pilotez votre portefeuille immobilier avec précision.",
    description: "Discover stunning modern architectural designs that blend form and function seamlessly.",
  },
  {
    id: 2,
    image: carousel2,
    title: "Garden Paradise",
    description: "Explore breathtaking garden landscapes that bring nature's beauty to your doorstep.",
  },
  {
    id: 3,
    image: carousel3,
    title: "Luxury Interiors",
    description: "Experience elegant interior designs that transform spaces into luxurious sanctuaries.",
  },
  {
    id: 4,
    image: carousel4,
    title: "Luxury Interiors",
    description: "Experience elegant interior designs that transform spaces into luxurious sanctuaries.",
  },
  {
    id: 5,
    image: carousel5,
    title: "Luxury Interiors",
    description: "Experience elegant interior designs that transform spaces into luxurious sanctuaries.",
  },
  {
    id: 6,
    image: carousel6,
    title: "Luxury Interiors",
    description: "Experience elegant interior designs that transform spaces into luxurious sanctuaries.",
  },
];

export default function CustomCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    const interval = setInterval(() => {
      api.scrollNext();
    }, 50000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [api]);

  const goToSlide = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <Carousel setApi={setApi} opts={{ loop: false }} className="p-5 h-full">
      <div className="relative rounded-3xl overflow-hidden h-full">
        <CarouselContent className="rounded-3xl h-full">
          {carouselData.map((item, index) => (
            <CarouselItem className="h-full" key={item.id}>
              <Image src={item.image || carousel1} alt={item.title} height={2000} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Black Description Banner - Outside carousel content */}
        <div className="absolute bottom-0 left-0 right-0 h-50 bg-black/80 text-white p-6 rounded-b-lg">
          <div className="flex h-full">
            <div className="flex-1">
              <h3 className="text-3xl mb-2">{carouselData[current]?.title}</h3>
              <p className="text-gray-200 text-sm">{carouselData[current]?.description}</p>
            </div>
            {/* Pagination Dots */}
            <div className="flex space-x-2 ml-6 self-end w-3/12 justify-end">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-1 rounded-full transition-all duration-200 cursor-pointer ${
                    index === current ? "bg-white w-8" : "bg-white/40 hover:bg-white/60 w-3"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Carousel>
  );
}
