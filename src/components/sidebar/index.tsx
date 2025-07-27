import { Building2, ChevronLeft, Home, LogOut, Mails, Shield, User2, Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import Image from "next/image";
import logo from "@/assests/images/logo-black.png";
import Settings from "../navbar/components/settings";

const items = [
  {
    title: "Tableau de bord",
    url: "/",
    icon: Home,
  },
  {
    title: "Utilisateurs",
    url: "/utilisateurs",
    icon: Users,
  },
  {
    title: "Rôles et Autorisations",
    url: "/roles",
    icon: Shield,
  },
  {
    title: "Biens",
    url: "/biens",
    icon: Building2,
  },
  {
    title: "Demandes",
    url: "/demandes",
    icon: Mails,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: User2,
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
          <SidebarMenuButton>
            <Image src={logo} alt="Logo" width={15} />
            La Résidence
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="gap-5">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon size={25} />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className=" py-7">
        <SidebarMenuItem className="list-none">
          <SidebarMenuButton asChild>
            <a href="/settings">
              <Settings />
              <span>Settings</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem className="list-none">
          <SidebarMenuButton asChild>
            <a href="/settings">
              <LogOut />
              <span>Se déconnecter</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
