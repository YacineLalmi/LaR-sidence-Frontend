import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ROUTES } from "@/constants/routes";
import { Link } from "@/i18n/navigation";
import { getUserFullName, getUserInitials, getUserRoleLabel } from "@/lib/user-display";
import { User } from "@/schemas/users/user.schema";

const ROLE_ACCENT = "#C5A36F";

type Props = {
  user: User | null;
};

export default function Profile({ user }: Props) {
  if (!user) {
    return (
      <div className="flex items-center gap-3 pr-1">
        <Avatar className="h-10 w-10 border border-black/10">
          <AvatarFallback className="bg-black text-sm font-medium text-white">?</AvatarFallback>
        </Avatar>
        <div className="hidden min-w-0 text-left sm:block">
          <div className="text-sm font-medium text-muted-foreground">—</div>
          <div className="text-xs text-muted-foreground">—</div>
        </div>
      </div>
    );
  }

  const name = getUserFullName(user);
  const role = getUserRoleLabel(user);
  const initials = getUserInitials(user);

  return (
    <Link
      href={ROUTES.PROFILE.ROOT}
      className="group flex max-w-[min(100%,20rem)] items-center gap-3 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-black/[0.04]"
    >
      <Avatar className="h-10 w-10 shrink-0 border border-black/10 shadow-sm">
        <AvatarFallback className="bg-black text-sm font-medium text-white">{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1 text-left">
        <div className="truncate text-sm font-semibold text-foreground">{name}</div>
        <div className="truncate text-xs font-medium" style={{ color: ROLE_ACCENT }}>
          {role}
        </div>
      </div>
    </Link>
  );
}
