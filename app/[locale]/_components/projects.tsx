"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Projects = () => {
  const t = useTranslations("projects");

  const projects = [
    {
      id: 1,
      title: t("alifMarketGroup.title"),
      description: t("alifMarketGroup.description"),
      image: "/projects/project1.png",
      tech: [
        "React",
        "Next.js",
        "Tailwind CSS",
        "TypeScript",
        "Tanstack Query",
        "Headless UI",
      ],
      liveUrl: "https://aetestdomain.com",
      githubUrl: "https://github.com/asadbekme",
    },
    {
      id: 2,
      title: t("taskManager.title"),
      description: t("taskManager.description"),
      image: "/projects/project2.webp",
      tech: [
        "Next.js",
        "Shadcn UI",
        "Tailwind CSS",
        "TypeScript",
        "jsonstorage.net",
        "Tanstack Query",
      ],
      liveUrl: "https://task-management-app-by-asadbekjs.vercel.app",
      githubUrl: "https://github.com/asadbekme/task-management-app",
    },
    {
      id: 3,
      title: t("educationCrm.title"),
      description: t("educationCrm.description"),
      image: "/projects/project3.jpg",
      tech: [
        "React",
        "Next.js",
        "Shadcn UI",
        "Tailwind CSS",
        "TypeScript",
        "Recharts",
      ],
      liveUrl: "https://education-crm-flame.vercel.app",
      githubUrl: "https://github.com/asadbekme/education-crm",
    },
    {
      id: 4,
      title: t("glassesShop.title"),
      description: t("glassesShop.description"),
      image: "/projects/project4.png",
      tech: ["HTML", "SCSS", "JavaScript"],
      liveUrl: "https://glasses-website-design.netlify.app",
      githubUrl: "https://github.com/asadbekme/glasses-website-design",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section id="projects" className="py-20">
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

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="link"
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    <Link
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      {t("liveDemo")}
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="link"
                    className="flex-1 bg-transparent border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Link
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <Github size={16} className="mr-2" />
                      {t("code")}
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
