"use client";

import * as React from "react";
import { Navigation } from "./_components/navigation";

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: Promise<{ locale?: string }>;
}) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Statistiques Générales & Rapports</h1>
      <Navigation />
      <main>{children}</main>
    </div>
  );
}
