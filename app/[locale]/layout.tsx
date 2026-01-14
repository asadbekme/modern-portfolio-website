import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { LocaleType } from "@/i18n/types";
import { ThemeProvider } from "@/providers/theme-provider";
import { cn } from "@/lib/utils";
import { BackgroundPattern } from "./_components";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Asadbek Rakhimov - Frontend Developer & UI/UX Enthusiast",
  description:
    "Creative Frontend Developer crafting user-friendly, responsive, and visually engaging web experiences. Explore portfolio, projects, and achievements.",
  keywords:
    "asadbek rakhimov, asadbekjs, asadbekme, asadbek js, asadbek rakhimov's portfolio, js, developer, frontend developer, web developer, react, next.js, typescript, javascript, tailwind css, redux toolkit, portfolio, asadbek rakhimov, asadbek rakhimov's portfolio, Uzbekistan developer, asadbek rakhimov, Web Developer Portfolio, UI/UX, JavaScript Engineer, Frontend Engineer, React Developer, Next.js Specialist, TypeScript Expert, Tailwind CSS Designer, Responsive Web Design, Modern Web Applications, Creative Web Solutions",
  authors: [{ name: "Asadbek Rakhimov" }],
  creator: "Asadbek Rakhimov",
  openGraph: {
    type: "website",
    locale: "en_US",
    images: ["/opengraph.png"],
    title: "Asadbek Rakhimov - Frontend Developer & UI/UX Enthusiast",
    description:
      "Passionate Frontend Developer building modern, responsive, and user-centered web applications. Explore my portfolio, projects, and skills.",
    siteName: "Asadbek Rakhimov's Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Asadbek Rakhimov - Frontend Developer & UI/UX Enthusiast",
    description:
      "Passionate Frontend Developer building modern, responsive, and user-centered web applications. Explore my portfolio, projects, and skills.",
    creator: "@asadbekrakhimov",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/logo.webp",
    shortcut: "/logo.webp",
    apple: "/logo.webp",
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
    <html
      lang={locale}
      className="scroll-smooth overflow-x-hidden"
      suppressHydrationWarning
    >
      <body className={cn(poppins.className, "overflow-x-hidden")}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <BackgroundPattern>{children}</BackgroundPattern>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
