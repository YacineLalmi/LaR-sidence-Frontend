import { getCookie } from "@/lib/server.helper";
import { getRequestConfig } from "next-intl/server";
import fs from "fs";
import path from "path";

export default getRequestConfig(async () => {
  const locale = (await getCookie("lang")) ?? "fr";
  const messagesDir = path.join(process.cwd(), "src/i18n/messages");
  const messages = await loadMessagesRecursively(messagesDir, locale);

  return {
    locale,
    messages,
    timeZone: "UTC",
    now: new Date(),
  };
});

async function loadMessagesRecursively(baseDir: string, locale: string): Promise<Record<string, any>> {
  const entries = fs.readdirSync(baseDir, { withFileTypes: true });

  const messages: Record<string, any> = {};

  for (const entry of entries) {
    const fullPath = path.join(baseDir, entry.name);

    if (entry.isDirectory()) {
      // Recursively load messages from subdirectory
      messages[entry.name] = await loadMessagesRecursively(fullPath, locale);
    } else if (entry.isFile() && entry.name === `${locale}.json`) {
      // Load the locale file and merge its contents into the current level
      const fileContent = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
      Object.assign(messages, fileContent);
    }
  }

  return messages;
}
