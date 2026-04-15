// import type { Metadata } from "next";

// import "./globals.css";
// import { Toaster } from "sonner";
// import { getLocale } from "next-intl/server";
// import { NextIntlClientProvider } from "next-intl";

// export const metadata: Metadata = {
//   title: "La Résidence",
//   description: "La Résidence: Agence immobilieres",
// };

// export default async function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const locale = await getLocale();
//   // return (
//     <html lang={locale}>
//       <body className={`antialiased`}>
//         <NextIntlClientProvider>{children}</NextIntlClientProvider>
//         <Toaster richColors />
//       </body>
//     </html>
//   );
// }
