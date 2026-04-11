import { BarChart3, Bell, Building2, CalendarDays, FileText, FolderOpen, Home, Mails, User2 } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import Image from "next/image";
import logo from "@/assests/images/logo-black.png";
import Settings from "../navbar/components/settings";
import Link from "next/link";
import Logout from "./_components/logout";
import { ROUTES } from "@/constants/routes";

const items = [
  {
    title: "Tableau de bord",
    url: ROUTES.DASHBOARD,
    icon: Home,
  },
  {
    title: "Statistiques",
    url: ROUTES.STATISTICS.SECTION("biens"),
    icon: BarChart3,
  },
  {
    title: "Biens",
    url: ROUTES.BIENS.ROOT,
    icon: Building2,
  },
  {
    title: "Calendrier",
    url: ROUTES.EVENTS.ROOT,
    icon: CalendarDays,
  },
  {
    title: "Offers",
    url: ROUTES.OFFERS.ROOT,
    icon: Mails,
  },
  {
    title: "Clients",
    url: ROUTES.CLIENTS.ROOT,
    icon: User2,
  },
  {
    title: "Demandes",
    url: ROUTES.DEMANDS.ROOT,
    icon: FileText,
  },
  {
    title: "Documents",
    url: ROUTES.DOCUMENTS.ROOT,
    icon: FolderOpen,
  },
  {
    title: "Notifications",
    url: ROUTES.NOTIFICATIONS.ROOT,
    icon: Bell,
  },
];

export function SideBar() {
  return (
    <Sidebar className="items-center" collapsible="icon">
      <SidebarTrigger
        className="absolute top-1/5 -right-2 transform  -translate-y-1/2 px-4 py- rounded"
        style={{ background: "#C8AB68" }}
      />
      <SidebarHeader className=" py-[5rem]">
        <SidebarMenuItem className="list-none">
          <SidebarMenuButton asChild>
            <Link href={ROUTES.PROFILE.ROOT} className="flex items-center gap-2">
              <Image src={logo} alt="Logo" width={15} />
              La Résidence
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="gap-5">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <item.icon size={25} />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className=" py-7">
        <SidebarMenuItem className="list-none">
          <SidebarMenuButton asChild>
            <Link href="/settings">
              <Settings />
              <span>Paramètres</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem className="list-none">
          <SidebarMenuButton asChild>
            <Logout />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
