import { User } from "@/schemas/users/user.schema";

export function getUserFullName(user: User): string {
  const parts = [user.first_name, user.last_name].filter(Boolean);
  const name = parts.join(" ").trim();
  return name.length > 0 ? name : user.username || user.email || "—";
}

export function getUserRoleLabel(user: User): string {
  const r = user.role;
  if (r && typeof r === "object" && r !== null) {
    const o = r as { display_name?: string; name?: string };
    if (typeof o.display_name === "string" && o.display_name.length > 0) return o.display_name;
    if (typeof o.name === "string" && o.name.length > 0) return o.name;
  }
  return "—";
}

export function getUserInitials(user: User): string {
  const a = (user.first_name?.[0] ?? "").toUpperCase();
  const b = (user.last_name?.[0] ?? "").toUpperCase();
  const s = `${a}${b}`.trim();
  return s.length > 0 ? s : (user.username?.[0] ?? user.email?.[0] ?? "?").toUpperCase();
}
