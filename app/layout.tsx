import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
