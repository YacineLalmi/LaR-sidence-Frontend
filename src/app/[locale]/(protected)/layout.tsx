import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { UserService } from "@/services/user.service";
import { User } from "@/schemas/users/user.schema";
import { SideBar } from "./_components/sidebar";
import NavBar from "./_components/navbar/navbar";
import { getCookie } from "@/lib/server.helper";
import { COOKIES_KEYS } from "@/constants/cookies-keys";
import { ROUTES } from "@/constants/routes";
import { redirect } from "next/navigation";

export default async function ProtectedPagesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: Promise<{ locale?: string }>;
}) {
  const access_token = await getCookie(COOKIES_KEYS.ACCESS_TOKEN);
  if (!access_token) redirect(ROUTES.SESSION.EXPIRED);

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
