"use client";

import { useEffect, useState } from "react";

const useTypingText = (fullText: string) => {
  const [typingText, setTypingText] = useState("");

  useEffect(() => {
    // Reset typing text when fullText changes
    setTypingText("");

    if (!fullText) return;

    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypingText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [fullText]);

  return typingText;
};

export default useTypingText;
