"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { skillService } from "@/services/skill-service";
import { statService } from "@/services/stat-service";
import { iconMap } from "@/lib/icon-map";
import { Stat } from "@/types/stat";
import { LocaleType } from "@/i18n/types";

const Skills = () => {
  const t = useTranslations("skills");
  const locale = useLocale() as LocaleType;

  const { data: skills = [], isLoading: isLoadingSkills } = useQuery({
    queryKey: ["published-skills"],
    queryFn: skillService.getPublishedSkills,
  });

  const { data: stats = [], isLoading: isLoadingStats } = useQuery({
    queryKey: ["published-stats"],
    queryFn: statService.getPublishedStats,
  });

  const getLocalizedLabel = (stat: Stat) => {
    const key = `label_${locale}` as keyof Stat;
    return stat[key] as string;
  };

  const duplicatedSkills = [...skills, ...skills];
  const reversedSkills = [...skills].reverse();
  const duplicatedReversed = [...reversedSkills, ...reversedSkills];

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

        {isLoadingSkills ? (
          <div className="flex justify-center py-12">
            <div className="flex space-x-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex-shrink-0 flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 px-6 py-4 rounded-full animate-pulse"
                >
                  <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : skills.length > 0 ? (
          <div className="relative">
            {/* Gradient overlays for smooth fade effect */}
            <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10" />
            <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10" />

            {/* First row - moving right */}
            <motion.div
              className="flex space-x-8 mb-8"
              animate={{
                x: [0, -50 * skills.length],
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
              {duplicatedSkills.map((skill, index) => {
                const Icon = iconMap[skill.icon_key];
                return (
                  <motion.div
                    key={`${skill.id}-${index}`}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="flex-shrink-0 flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div
                      className="size-10 rounded-full flex items-center justify-center text-white text-lg font-bold"
                      style={{
                        background: `linear-gradient(to right, ${skill.color_from}, ${skill.color_to})`,
                      }}
                    >
                      {Icon && <Icon />}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">
                      {skill.name}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Second row - moving left */}
            <motion.div
              className="flex space-x-8"
              animate={{
                x: [-50 * skills.length, 0],
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
              {duplicatedReversed.map((skill, index) => {
                const Icon = iconMap[skill.icon_key];
                return (
                  <motion.div
                    key={`${skill.id}-reverse-${index}`}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="flex-shrink-0 flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold"
                      style={{
                        background: `linear-gradient(to right, ${skill.color_from}, ${skill.color_to})`,
                      }}
                    >
                      {Icon && <Icon />}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">
                      {skill.name}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        ) : null}

        {/* Stats section */}
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 lg:gap-8 mt-16"
          >
            {isLoadingStats
              ? [1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="text-center p-3 md:p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl animate-pulse"
                  >
                    <div className="h-10 w-16 mx-auto bg-gray-200 dark:bg-gray-600 rounded mb-2" />
                    <div className="h-4 w-24 mx-auto bg-gray-200 dark:bg-gray-600 rounded" />
                  </div>
                ))
              : stats.length > 0
                ? stats.map((stat) => (
                    <motion.div
                      key={stat.id}
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-3 md:p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl"
                    >
                      <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
                        {stat.number}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 font-medium line-clamp-2">
                        {getLocalizedLabel(stat)}
                      </p>
                    </motion.div>
                  ))
                : null}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
