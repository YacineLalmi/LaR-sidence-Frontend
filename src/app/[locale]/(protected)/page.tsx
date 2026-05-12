import { ROUTES } from "@/constants/routes";
import { redirect } from "next/navigation";

export default function page() {
  return redirect(ROUTES.DASHBOARD);
}
