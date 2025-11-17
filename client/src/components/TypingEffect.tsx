import { useState, useEffect } from "react";

const words = [
  "Inventors",
  "Creators",
  "Originators",
  "Developers",
  "Thought Leaders",
  "Forward Thinkers",
  "Futurists",
];

export default function TypingEffect() {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (deleting ? -1 : 1));

      if (!deleting && subIndex === words[index].length) {
        setTimeout(() => setDeleting(true), 800);
      } else if (deleting && subIndex === 0) {
        setDeleting(false);
        setIndex((prev) => (prev + 1) % words.length);
      }
    }, deleting ? 70 : 120);

    return () => clearTimeout(timeout);
  }, [subIndex, deleting, index]);

  useEffect(() => {
    const blinkTimeout = setInterval(() => setBlink((prev) => !prev), 500);
    return () => clearInterval(blinkTimeout);
  }, []);

  return (
    <span className="block relative">
      <span className="text-dreamxec font-extrabold">
        {words[index].substring(0, subIndex)}
        <span className={blink ? "inline-block" : "hidden"}>|</span>
      </span>
    </span>
  );
}
