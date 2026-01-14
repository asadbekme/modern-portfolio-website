"use client";

import { useEffect, useState } from "react";

function useTypingText(fullText: string) {
  const [typingText, setTypingText] = useState("");

  useEffect(() => {
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
  }, []);

  return typingText;
}

export default useTypingText;
