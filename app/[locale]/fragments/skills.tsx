"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const Skills = () => {
  const t = useTranslations("skills");

  const technologies = [
    { name: "React", icon: "⚛️", color: "from-blue-400 to-blue-600" },
    { name: "TypeScript", icon: "📘", color: "from-blue-500 to-blue-700" },
    { name: "Tailwind CSS", icon: "🎨", color: "from-cyan-400 to-cyan-600" },
    { name: "Next.js", icon: "▲", color: "from-gray-700 to-gray-900" },
    // { name: "Node.js", icon: "🟢", color: "from-green-500 to-green-700" },
    { name: "JavaScript", icon: "💛", color: "from-yellow-400 to-yellow-600" },
    // { name: "Vue.js", icon: "💚", color: "from-green-400 to-green-600" },
    // { name: "MongoDB", icon: "🍃", color: "from-green-600 to-green-800" },
    // { name: "PostgreSQL", icon: "🐘", color: "from-blue-600 to-blue-800" },
    { name: "Firebase", icon: "🔥", color: "from-orange-400 to-orange-600" },
    // { name: "Docker", icon: "🐳", color: "from-blue-500 to-blue-700" },
    // { name: "AWS", icon: "☁️", color: "from-orange-500 to-orange-700" },
    { name: "Git", icon: "📝", color: "from-red-500 to-red-700" },
    { name: "Figma", icon: "🎨", color: "from-purple-500 to-purple-700" },
    { name: "Vercel", icon: "▲", color: "from-gray-800 to-black" },
    // { name: "Supabase", icon: "⚡", color: "from-green-500 to-green-700" },
  ];

  const stats = [
    { number: "2+", label: t("stats.experience") },
    { number: "20+", label: t("stats.projects") },
    { number: "15+", label: t("stats.technologies") },
    { number: "100%", label: t("stats.satisfaction") },
  ];

  // Duplicate the array to create seamless infinite scroll
  const duplicatedTechnologies = [...technologies, ...technologies];

  return (
    <section
      id="skills"
      className="py-20 bg-white dark:bg-gray-900 overflow-hidden"
    >
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
              {t("title")}
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("description")}
          </p>
        </motion.div>

        {/* Infinite Scrolling Carousel */}
        <div className="relative">
          {/* Gradient overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10" />
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10" />

          {/* First row - moving right */}
          <motion.div
            className="flex space-x-8 mb-8"
            animate={{
              x: [0, -50 * technologies.length],
            }}
            transition={{
              x: {
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {duplicatedTechnologies.map((tech, index) => (
              <motion.div
                key={`${tech.name}-${index}`}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex-shrink-0 flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-r ${tech.color} flex items-center justify-center text-white text-lg font-bold`}
                >
                  {tech.icon}
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Second row - moving left */}
          <motion.div
            className="flex space-x-8"
            animate={{
              x: [-50 * technologies.length, 0],
            }}
            transition={{
              x: {
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                duration: 25,
                ease: "linear",
              },
            }}
          >
            {duplicatedTechnologies.reverse().map((tech, index) => (
              <motion.div
                key={`${tech.name}-reverse-${index}`}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex-shrink-0 flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-r ${tech.color} flex items-center justify-center text-white text-lg font-bold`}
                >
                  {tech.icon}
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl"
            >
              <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
