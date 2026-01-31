"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import useTypingText from "@/hooks/use-typing-text";
import { aboutService } from "@/services/about-service";
import { About as AboutType } from "@/types/about";
import { LocaleType } from "@/i18n/types";

const About = () => {
  const locale = useLocale() as LocaleType;

  const { data: about, isLoading } = useQuery({
    queryKey: ["about"],
    queryFn: aboutService.getPublishedAbout,
  });

  // Get localized content helper
  const getLocalized = (fieldBase: string): string => {
    if (!about) return "";
    const key = `${fieldBase}_${locale}` as keyof AboutType;
    const fallbackKey = `${fieldBase}_en` as keyof AboutType;
    return (about[key] as string) || (about[fallbackKey] as string) || "";
  };

  const fullText = getLocalized("description");
  const typingText = useTypingText(fullText);

  const data = [
    { icon: "📍", text: getLocalized("location") },
    { icon: "💼", text: getLocalized("availability") },
    { icon: "🎓", text: getLocalized("education") },
  ];

  const services = [
    getLocalized("service_1"),
    getLocalized("service_2"),
    getLocalized("service_3"),
    getLocalized("service_4"),
  ];

  if (isLoading) {
    return (
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse text-center mb-16">
            <div className="h-12 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="w-80 h-80 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto" />
            <div className="space-y-4">
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!about) {
    return null;
  }

  return (
    <section id="about" className="py-20">
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
              {getLocalized("title")}
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
                className="relative size-80 mx-auto"
              >
                <Image
                  src={about.image_url || "/my-photo.png"}
                  alt="Profile Photo"
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
              {typingText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                className="inline-block w-0.5 h-6 bg-blue-500 ml-1"
              />
            </div>

            <div className="space-y-4">
              {data.map((item, index) => (
                <div
                  key={`aboutData-${index}`}
                  className="flex items-center space-x-3"
                >
                  <span className="text-blue-500 font-semibold">
                    {item.icon}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {getLocalized("what_i_do")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((item, index) => (
                  <motion.div
                    key={`service-${index}`}
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
