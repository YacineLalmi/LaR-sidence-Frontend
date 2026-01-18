import React from "react";
import CustomCarousel from "../../_components/carousel";
import { ResetPasswordForm } from "./_components/reset-password-form";
import Link from "next/link";
import CustomButton from "@/components/ui/custom-button";
import { ArrowLeft } from "lucide-react";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";

export default function ResetPasswordPage() {
  return (
    <div className="flex gap-1 h-screen items-center p-2">
      <div className="w-2/5 relative  flex items-center h-full">
        <Link href={NAVIGATION_KEYS.AUTH.LOGIN}>
          <CustomButton Icon={ArrowLeft} size="icon" className="absolute top-4 left-4" />
        </Link>
        <ResetPasswordForm />
      </div>
      <div className="w-3/5 h-full">
        <CustomCarousel />
      </div>
    </div>
  );
}
