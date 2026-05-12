import { redirect } from "next/navigation";
import { getCookie } from "@/lib/server.helper";
import { COOKIES_KEYS } from "@/constants/cookies-keys";
import { ROUTES } from "@/constants/routes";

type Props = {
  children: React.ReactNode;
};

export default async function UnprotectedLayout({ children }: Props) {
  const access_token = await getCookie(COOKIES_KEYS.ACCESS_TOKEN);
  if (access_token) redirect(ROUTES.DASHBOARD);

  return children;
}
