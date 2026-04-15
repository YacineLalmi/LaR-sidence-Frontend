import { getRequestConfig } from "next-intl/server";
import fs from "fs";
import path from "path";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
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


// import {hasLocale} from 'next-intl';
// import {routing} from './routing';
 
// export default getRequestConfig(async ({requestLocale}) => {
//   // Typically corresponds to the `[locale]` segment
//   const requested = await requestLocale;
//   const locale = hasLocale(routing.locales, requested)
//     ? requested
//     : routing.defaultLocale;
 
//   return {
//     locale
//     // ...
//   };
// });