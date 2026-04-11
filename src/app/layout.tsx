import type { Metadata } from "next";
// import { Geist, Geist_Mono, Urbanist } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

// const urbanist = Urbanist({
//   subsets: ["latin"],
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
//   style: ["normal", "italic"],
//   display: "swap",
// });

export const metadata: Metadata = {
  title: "La Résidence",
  description: "La Résidence: Agence immobilieres",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale}>
      {/* <body className={`${urbanist.className} antialiased`}> */}
      <body className={`antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
