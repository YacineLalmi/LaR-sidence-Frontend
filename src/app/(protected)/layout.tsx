import { SideBar } from "@/components/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import NavBar from "@/components/navbar";

export default async function ProtectedPagesLayout({ children }: { children: React.ReactNode }) {
  const lang = "fr";
  return (
    <div>
      <SidebarProvider>
        <SideBar />
        <SidebarInset className="bg-transparent">
          <NavBar />
          <main className="px-5">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
