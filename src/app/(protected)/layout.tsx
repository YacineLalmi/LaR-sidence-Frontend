import { SideBar } from "@/components/sidebar";
import styles from "./styles.module.css";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import NavBar from "@/components/navbar";

export default async function ProtectedPagesLayout({ children }: { children: React.ReactNode }) {
  const lang = "fr";
  return (
    <div>
      <SidebarProvider>
        <SideBar />
        <SidebarInset className="bg-transparent">
          <NavBar />
          <main className="p-5">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
