"use client";
import {
  Briefcase,
  Building2,
  CalendarDays,
  FileText,
  FolderArchive,
  Home,
  Mails,
  Settings,
  User2,
} from "lucide-react";

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
import Link from "next/link";
import Logout from "./_components/logout";
import { ROUTES } from "@/constants/routes";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { getMainColorOfGraphicItem } from "recharts/types/util/ChartUtils";

export function SideBar() {
  const translation = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";

  const items = useMemo(
    () => [
      {
        title: translation(TRANSLATIONS_KEYS_2.SIDEMENU.DASHBOARD),
        url: ROUTES.DASHBOARD,
        icon: Home,
      },
      {
        title: translation(TRANSLATIONS_KEYS_2.SIDEMENU.PROPERTIES),
        url: ROUTES.BIENS.ROOT,
        icon: Building2,
      },
      {
        title: translation(TRANSLATIONS_KEYS_2.SIDEMENU.CALENDAR),
        url: ROUTES.EVENTS.ROOT,
        icon: CalendarDays,
      },
      {
        title: translation(TRANSLATIONS_KEYS_2.SIDEMENU.OFFERS),
        url: ROUTES.OFFERS.ROOT,
        icon: Mails,
      },
      {
        title: translation(TRANSLATIONS_KEYS_2.SIDEMENU.CLIENTS),
        url: ROUTES.CLIENTS.ROOT,
        icon: User2,
      },
      {
        title: translation(TRANSLATIONS_KEYS_2.SIDEMENU.DEMANDS),
        url: ROUTES.DEMANDS.ROOT,
        icon: FileText,
      },
      {
        title: translation(TRANSLATIONS_KEYS_2.SIDEMENU.BILLS),
        url: ROUTES.DEMANDS.ROOT,
        icon: Briefcase,
      },
      {
        title: translation(TRANSLATIONS_KEYS_2.SIDEMENU.DOCUMENTS),
        url: ROUTES.DOCUMENTS.ROOT,
        icon: FolderArchive,
      },
    ],
    [],
  );

  return (
    <Sidebar className="items-center" collapsible="icon" side={isRTL ? "right" : "left"}>
      <SidebarTrigger
        className={`absolute top-1/5 ${isRTL ? "-left-2" : "-right-2"} transform -translate-y-1/2 px-4 py- rounded`}
        style={{ background: "#C8AB68" }}
      />
      <SidebarHeader className="py-[5rem]">
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
                <Link href={item.url}>
                  <item.icon size={25} />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="py-7">
        <SidebarMenuItem className="list-none">
          <SidebarMenuButton asChild>
            <Link href={ROUTES.SETTINGS.ROOT}>
              <Settings />
              <span>{translation(TRANSLATIONS_KEYS_2.SIDEMENU.SETTINGS)}</span>
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

