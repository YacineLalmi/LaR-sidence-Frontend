"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { refreshTokenAction } from "@/actions/authentication/refresh.action";
import { ROUTES } from "@/constants/routes";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default function SessionExpiredPage() {
  const router = useRouter();

  const searchParams = useSearchParams();

  // 1. Extract the 'returnTo' value, or fallback to Dashboard
  const returnTo = searchParams.get("returnTo") || ROUTES.DASHBOARD;
  useEffect(() => {
    const handleRefresh = async () => {
      try {
        const result = await refreshTokenAction();
        // Note: You might need to adjust your action to get the token
        // from cookies internally since 'use server' actions can access cookies()

        if (result.isOk) {
          router.push(returnTo); // Force refresh to update server components with new auth
        } else {
          router.push(ROUTES.AUTH.LOGIN);
        }
      } catch (err) {
        if (isRedirectError(err)) {
          throw err;
        }
        router.push(ROUTES.AUTH.LOGIN);
      }
    };

    handleRefresh();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      Actualisation de la session... Veuillez patienter un instant.
    </div>
  );
}
