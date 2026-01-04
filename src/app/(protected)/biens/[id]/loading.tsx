import HourglassLoader from "@/components/hourglass-loader";
import React from "react";

export default function Loading() {
  return (
    <div className="w-full h-96 flex justify-center items-center">
      <HourglassLoader />
    </div>
  );
}
