import { getCookie } from "@/lib/utils";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = (await getCookie("lang")) ?? "fr";

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
