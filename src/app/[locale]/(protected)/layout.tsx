import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { UserService } from "@/services/user.service";
import { User } from "@/schemas/users/user.schema";
import { SideBar } from "./_components/sidebar";
import NavBar from "./_components/navbar/navbar";

export default async function ProtectedPagesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: Promise<{ locale?: string }>;
}) {
  const locale = (await params)?.locale || "fr";
  const isRTL = locale === "ar";
  let user: User | null = null;
  try {
    user = await UserService.profile();
  } catch {}

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={isRTL ? "rtl" : "ltr"}>
      <SidebarProvider>
        <SideBar />
        <SidebarInset className="bg-transparent">
          <NavBar user={user} locale={locale} />
          <main className="px-5 pb-6 pt-0">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
