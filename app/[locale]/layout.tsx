import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { LocaleType } from "@/i18n/types";
import { ThemeProvider } from "./components/ThemeProvider";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Asadbek Rakhimov - Frontend Developer",
  description:
    "Passionate Frontend Developer creating beautiful, responsive, and user-friendly web experiences with modern technologies.",
  keywords:
    "frontend developer, web developer, react, next.js, typescript, javascript",
  authors: [{ name: "Asadbek Rakhimov" }],
  creator: "Asadbek Rakhimov",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://johndoe.dev",
    title: "Asadbek Rakhimov - Frontend Developer",
    description:
      "Passionate Frontend Developer creating beautiful, responsive, and user-friendly web experiences.",
    siteName: "Asadbek Rakhimov Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Asadbek Rakhimov - Frontend Developer",
    description:
      "Passionate Frontend Developer creating beautiful, responsive, and user-friendly web experiences.",
    creator: "@asadbekrakhimov",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as LocaleType)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={poppins.className}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
