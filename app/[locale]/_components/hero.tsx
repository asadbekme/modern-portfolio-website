"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import useTypingText from "@/hooks/use-typing-text";
import { heroService } from "@/services/hero-service";
import { Hero as HeroType } from "@/types/hero";
import { LocaleType } from "@/i18n/types";

const Hero = () => {
  const locale = useLocale() as LocaleType;

  const { data: hero, isLoading } = useQuery({
    queryKey: ["hero"],
    queryFn: heroService.getPublishedHero,
  });

  // Get localized content
  const getProfession = (hero: HeroType | null | undefined) => {
    if (!hero) return "";
    const key = `profession_${locale}` as keyof HeroType;
    return (hero[key] as string) || hero.profession_en;
  };

  const getDescription = (hero: HeroType | null | undefined) => {
    if (!hero) return "";
    const key = `description_${locale}` as keyof HeroType;
    return (hero[key] as string) || hero.description_en;
  };

  const getViewProjectsText = (hero: HeroType | null | undefined) => {
    if (!hero) return "View My Work";
    const key = `view_projects_text_${locale}` as keyof HeroType;
    return (hero[key] as string) || hero.view_projects_text_en;
  };

  const getResumeText = (hero: HeroType | null | undefined) => {
    if (!hero) return "Resume";
    const key = `resume_text_${locale}` as keyof HeroType;
    return (hero[key] as string) || hero.resume_text_en;
  };

  const fullText = getProfession(hero);
  const typingText = useTypingText(fullText);

  const scrollToProjects = () => {
    document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="animate-pulse text-center">
          <div className="h-16 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-6 mx-auto" />
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6 mx-auto" />
          <div className="h-24 w-96 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
        </div>
      </section>
    );
  }

  if (!hero) {
    return null;
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {hero.name}
              </span>
            </motion.h1>

            <motion.h2
              className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {typingText}
              <span className="animate-pulse ml-1 text-blue-500">|</span>
            </motion.h2>

            <motion.p
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {getDescription(hero)}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button
                onClick={scrollToProjects}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {getViewProjectsText(hero)}
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 bg-transparent"
              >
                <Link href={hero.resume_url} download={true} target="_blank">
                  {getResumeText(hero)}
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <ArrowDown className="text-gray-400 dark:text-gray-600" size={24} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
