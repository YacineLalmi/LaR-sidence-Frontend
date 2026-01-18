import React from "react";
import CustomCarousel from "../../_components/carousel";
import { ResetPasswordForm } from "./_components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="flex gap-1 h-screen items-center p-2">
      <div className="w-2/5">
        <ResetPasswordForm />
      </div>
      <div className="w-3/5 h-full">
        <CustomCarousel />
      </div>
    </div>
  );
}
