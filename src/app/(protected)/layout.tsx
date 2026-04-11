import { SideBar } from "@/components/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import NavBar from "@/components/navbar";
import { UserService } from "@/services/user.service";
import { User } from "@/schemas/users/user.schema";

export default async function ProtectedPagesLayout({ children }: { children: React.ReactNode }) {
  let user: User | null = null;
  try {
    user = await UserService.profile();
  } catch {}

  return (
    <div>
      <SidebarProvider>
        <SideBar />
        <SidebarInset className="bg-transparent">
          <NavBar user={user} />
          <main className="px-5 pb-6 pt-0">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
