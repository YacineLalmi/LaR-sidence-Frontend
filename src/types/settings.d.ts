import { LucideIcon } from "lucide-react"

export type SettingsItem = {
    id: string,
    title: string,
    description: string,
    icon: LucideIcon,
    subs: LinkSettingsItem[],
}

export type LinkSettingsItem = {
    id: string,
    title: string,
    link: string
}