"use client";

import type React from "react";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  const t = useTranslations("contact");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted");
  };

  const contacts = [
    {
      icon: <Mail size={20} />,
      label: t("social.email"),
      value: "asadbekme2002@gmail.com",
      href: "mailto:asadbekme2002@gmail.com",
    },
    {
      icon: <Github size={20} />,
      label: t("social.github"),
      value: "github.com/asadbekme",
      href: "https://github.com/asadbekme",
    },
    {
      icon: <Linkedin size={20} />,
      label: t("social.linkedin"),
      value: "linkedin.com/in/asadbek-rakhimov",
      href: "https://linkedin.com/in/asadbek-rakhimov",
    },
  ];

  return (
    <section id="contact" className="py-20 bg-white dark:bg-gray-900">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {t("letsConnect")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {t("intro")}
              </p>
            </div>

            <div className="space-y-4">
              {contacts.map((contact) => (
                <motion.a
                  key={contact.label}
                  href={contact.href}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-all duration-200"
                  target="_blank"
                >
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white mr-4">
                    {contact.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {contact.label}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {contact.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div whileFocus={{ scale: 1.02 }} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("form.firstName")}
                  </label>
                  <Input
                    type="text"
                    placeholder={t("form.firstNamePlaceholder")}
                    className="w-full"
                    required
                  />
                </motion.div>
                <motion.div whileFocus={{ scale: 1.02 }} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("form.lastName")}
                  </label>
                  <Input
                    type="text"
                    placeholder={t("form.lastNamePlaceholder")}
                    className="w-full"
                    required
                  />
                </motion.div>
              </div>

              <motion.div whileFocus={{ scale: 1.02 }} className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("form.email")}
                </label>
                <Input
                  type="email"
                  placeholder={t("form.emailPlaceholder")}
                  className="w-full"
                  required
                />
              </motion.div>

              <motion.div whileFocus={{ scale: 1.02 }} className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("form.subject")}
                </label>
                <Input
                  type="text"
                  placeholder={t("form.subjectPlaceholder")}
                  className="w-full"
                  required
                />
              </motion.div>

              <motion.div whileFocus={{ scale: 1.02 }} className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("form.message")}
                </label>
                <Textarea
                  placeholder={t("form.messagePlaceholder")}
                  className="w-full h-32 resize-none"
                  required
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Send size={20} className="mr-2" />
                  {t("form.send")}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
