import React from "react";
import CustomCarousel from "../../_components/carousel";
import { ForgetPasswordForm } from "./_components/forgot-password-form";
import CustomButton from "@/components/ui/custom-button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";

export default function ForgetPasswordPage() {
  return (
    <div className="flex gap-1 h-screen items-center p-2">
      <div className="w-2/5 relative  flex items-center h-full">
        <Link href={NAVIGATION_KEYS.AUTH.LOGIN}>
          <CustomButton Icon={ArrowLeft} size="icon" className="absolute top-4 left-4" />
        </Link>
        <ForgetPasswordForm />
      </div>
      <div className="w-3/5 h-full">
        <CustomCarousel />
      </div>
    </div>
  );
}
