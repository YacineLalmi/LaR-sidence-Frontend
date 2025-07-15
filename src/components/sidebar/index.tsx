import {
  Building2,
  Calendar,
  Home,
  Inbox,
  LetterText,
  Mails,
  Search,
  Settings,
  Shield,
  User2,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Tableau de bord",
    url: "/",
    icon: Home,
  },
  {
    title: "Gestion des utilisateurs",
    url: "/utilisateurs",
    icon: Users,
  },
  {
    title: "Gestion des rôles et autorisations",
    url: "/roles",
    icon: Shield,
  },
  {
    title: "Gestion des biens",
    url: "/biens",
    icon: Building2,
  },
  {
    title: "Gestion des demandes",
    url: "/demandes",
    icon: Mails,
  },
  {
    title: "Gestion des clients",
    url: "/clients",
    icon: User2,
  },
];

export function SideBar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>La Résidence</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
