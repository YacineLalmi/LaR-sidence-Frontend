import React from "react";
import CustomCarousel from "../../_components/carousel";
import { ResetPasswordForm } from "./_components/reset-password-form";
import { Link } from "@/i18n/navigation";
import CustomButton from "@/components/ui/custom-button";
import { ArrowLeft } from "lucide-react";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";

export default function ResetPasswordPage() {
  return (
    /* - flex-col for mobile, xl:flex-row for desktop 
       - h-screen to maintain the layout height
    */
    <div className="flex flex-col xl:flex-row gap-1 h-screen items-center p-2">
      {/* Form Container: 
          - Full width on mobile (w-full)
          - 40% width on Desktop (xl:w-2/5)
      */}
      <div className="w-full max-w-2xl xl:w-2/5 relative flex items-center justify-center h-full p-4">
        <Link href={NAVIGATION_KEYS.AUTH.LOGIN} className="absolute top-8 left-8 z-10">
          <CustomButton Icon={ArrowLeft} size="icon" />
        </Link>
        <ResetPasswordForm />
      </div>

      {/* Carousel Container:
          - Hidden on mobile/tablet (hidden)
          - Visible and 60% width on Desktop (xl:flex xl:w-3/5)
      */}
      <div className="hidden xl:flex xl:w-3/5 h-full items-center justify-center">
        <CustomCarousel />
      </div>
    </div>
  );
}
