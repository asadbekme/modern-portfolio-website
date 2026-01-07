"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  SiJavascript,
  SiTailwindcss,
  SiReact,
  SiTypescript,
  SiFirebase,
  SiNextdotjs,
  SiGit,
  SiReacthookform,
  SiRedux,
  SiReactquery,
  SiFigma,
  SiAntdesign,
  SiShadcnui,
  SiVercel,
  SiSupabase,
} from "react-icons/si";

const Skills = () => {
  const t = useTranslations("skills");

  const technologies = [
    {
      name: "JavaScript",
      icon: <SiJavascript />,
      color: "from-[#F7DF1E] to-[#FFD600]",
    }, // JS Yellow
    {
      name: "Tailwind CSS",
      icon: <SiTailwindcss />,
      color: "from-[#06B6D4] to-[#0E7490]",
    }, // Tailwind Cyan
    { name: "React", icon: <SiReact />, color: "from-[#61DAFB] to-[#1E90FF]" }, // React Blue
    {
      name: "TypeScript",
      icon: <SiTypescript />,
      color: "from-[#3178C6] to-[#1E40AF]",
    }, // TS Blue
    {
      name: "Supabase",
      icon: <SiSupabase />,
      color: "from-[#2D6A4F] to-[#95D5B2]",
    }, // Supabase green
    { name: "Next.js", icon: <SiNextdotjs />, color: "from-gray-800 to-black" }, // Next Black
    { name: "Git", icon: <SiGit />, color: "from-[#F05033] to-[#B91C1C]" }, // Git Orange-Red
    {
      name: "React Hook Form",
      icon: <SiReacthookform />,
      color: "from-[#EC5990] to-[#BE185D]",
    }, // RHF Pink
    {
      name: "Redux Toolkit",
      icon: <SiRedux />,
      color: "from-[#764ABC] to-[#4B0082]",
    }, // Redux Purple
    {
      name: "React Query",
      icon: <SiReactquery />,
      color: "from-[#FF4154] to-[#C81E1E]",
    }, // React Query Red
    { name: "Figma", icon: <SiFigma />, color: "from-[#F24E1E] to-[#A259FF]" }, // Figma Gradient
    {
      name: "Ant Design",
      icon: <SiAntdesign />,
      color: "from-[#1890FF] to-[#0050B3]",
    }, // Ant Blue
    {
      name: "Shadcn UI",
      icon: <SiShadcnui />,
      color: "from-[#8B5CF6] to-[#6D28D9]",
    }, // Shadcn Purple
    { name: "Vercel", icon: <SiVercel />, color: "from-gray-700 to-black" }, // Vercel Black
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
    <section id="skills" className="py-20 overflow-hidden">
      <div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 text-center mb-16"
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
                  className={`size-10 rounded-full bg-gradient-to-r ${tech.color} flex items-center justify-center text-white text-lg font-bold`}
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
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 lg:gap-8 mt-16"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                className="text-center p-3 md:p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl"
              >
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium line-clamp-2">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
