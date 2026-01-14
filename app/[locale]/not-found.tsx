"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Header, Footer } from "./_components";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      {/* Light Mode - White Sphere Grid Background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-100 dark:opacity-0 transition-opacity duration-300"
        style={{
          background: "white",
          backgroundImage: `
            linear-gradient(to right, rgba(71,85,105,0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(71,85,105,0.3) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(139,92,246,0.25) 0%, rgba(139,92,246,0.1) 40%, transparent 80%)
          `,
          backgroundSize: "32px 32px, 32px 32px, 100% 100%",
        }}
      />

      {/* Dark Mode - Sphere Grid Background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"
        style={{
          background: "#111827",
          backgroundImage: `
            linear-gradient(to right, rgba(75,85,99,0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(75,85,99,0.4) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(139,92,246,0.3) 0%, rgba(139,92,246,0.15) 40%, transparent 80%)
          `,
          backgroundSize: "32px 32px, 32px 32px, 100% 100%",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-9xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4"
            >
              {t("title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl text-gray-700 dark:text-gray-300 mb-8"
            >
              {t("description")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link
                href="/"
                className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                {t("homeButton")}
              </Link>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
