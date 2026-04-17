import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { UserService } from "@/services/user.service";
import { User } from "@/schemas/users/user.schema";
import { SideBar } from "./_components/sidebar";
import NavBar from "./_components/navbar/navbar";

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
