import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SideBar } from "./_components/sidebar";
import NavBar from "./_components/navbar/navbar";

export default async function ProtectedPagesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: Promise<{ locale?: string }>;
}) {
  const locale = (await params)?.locale || "fr"; // default to French
  const isRTL = locale === "ar";

  console.log(" layout", isRTL);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={isRTL ? "rtl" : "ltr"}>
      <SidebarProvider>
        <SideBar />
        <SidebarInset className="bg-transparent">
          <NavBar locale={locale} />
          <main className={`px-5 my-3 ${isRTL ? "font-arabic" : ""}`}>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
