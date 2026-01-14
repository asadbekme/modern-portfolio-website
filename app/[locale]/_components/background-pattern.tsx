"use client";

import { ReactNode } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const BackgroundPattern = ({ children }: { children: ReactNode }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
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

      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 transform-origin-0 z-50"
        style={{ scaleX }}
      />

      {/* Content */}
      <>{children}</>
    </div>
  );
};

export default BackgroundPattern;
