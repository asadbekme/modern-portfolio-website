"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

const About = () => {
  const [displayText, setDisplayText] = useState("");
  const fullText =
    "I'm a passionate Frontend Developer with 5+ years of experience creating beautiful, functional, and user-centered digital experiences. I love turning complex problems into simple, beautiful, and intuitive solutions.";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              About Me
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                className="relative w-80 h-80 mx-auto lg:mx-0"
              >
                <Image
                  src="/placeholder.svg?height=320&width=320"
                  alt="John Doe"
                  fill
                  className="rounded-full object-cover shadow-2xl"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed min-h-[120px]">
              {displayText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                className="inline-block w-0.5 h-6 bg-blue-500 ml-1"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-blue-500 font-semibold mr-2">📍</span>
                <span className="text-gray-700 dark:text-gray-300">
                  San Francisco, CA
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-500 font-semibold mr-2">💼</span>
                <span className="text-gray-700 dark:text-gray-300">
                  Available for freelance work
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-500 font-semibold mr-2">🎓</span>
                <span className="text-gray-700 dark:text-gray-300">
                  Computer Science, Stanford University
                </span>
              </div>
            </div>

            <div className="pt-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                What I Do
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Web Development",
                  "UI/UX Design",
                  "Mobile Apps",
                  "Performance Optimization",
                ].map((item) => (
                  <motion.div
                    key={item}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
