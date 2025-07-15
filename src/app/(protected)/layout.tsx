import { SideBar } from "@/components/sidebar";
import styles from "./styles.module.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import NavBar from "@/components/navbar";

export default async function ProtectedPagesLayout({ children }: { children: React.ReactNode }) {
  const lang = "fr";
  return (
    <div className={styles.container}>
      <div className={styles.sideBar}>
        <SidebarProvider>
          <SideBar />
        </SidebarProvider>
      </div>
      <div className={styles.header}>
        <NavBar />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
