// src/components/StickyPhone.tsx
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ProfileIntro from "./ProfileIntro"; // ודא שהנתיב נכון

// IntroTextContent נשאר כפי שהיה בתשובה הקודמת (הגרסה הקומפקטית)
const IntroTextContent = () => {
  return (
    <div
      className="w-full lg:w-[50%] flex flex-col justify-center 
                   px-6 sm:px-12 lg:px-20 text-center lg:text-left 
                   py-4 sm:py-6 md:py-8 lg:py-12
                   gap-2 sm:gap-3 md:gap-4 lg:gap-6"
    >
      <motion.h1
        className="inline-block 
                   text-3xl sm:text-4xl lg:text-5xl
                   font-bold 
                   mb-1 sm:mb-2 lg:mb-4
                   bg-gradient-to-r from-green-600 via-blue-500 to-purple-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        Hello,
      </motion.h1>

      <motion.h2
        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl
                   font-semibold 
                   mb-1 sm:mb-1 md:mb-1 lg:mb-2
                   text-gray-900 dark:text-gray-200"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        I'm Ofek Amirav
      </motion.h2>
      <motion.p
        className="text-sm sm:text-base lg:text-lg
                   text-gray-700 dark:text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        Junior Android & Full-Stack Developer passionate about building
        innovative applications. Skilled in Kotlin, Android, and various
        full-stack technologies, with a constant drive to learn and evolve.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-2 sm:mt-2 md:mt-3 lg:mt-4"
      >
        <button
          onClick={() =>
            document
              .getElementById("projects")
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
          className="bg-gradient-to-r from-green-700 to-blue-500 text-white hover:from-blue-500 hover:to-green-700 
                     font-semibold 
                     py-2 px-4 sm:py-2.5 sm:px-6 lg:py-3 lg:px-8
                     rounded-lg shadow-md transition duration-300 
                     text-xs sm:text-sm md:text-md lg:text-lg"
        >
          View My Projects
        </button>
      </motion.div>
    </div>
  );
};

const StickyPhone = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"],
  });

  const initialProfileTargetScale = 0.34;
  const initialProfileScale = useTransform(
    scrollYProgress,
    [0, 0.15, 0.22, 0.25],
    [1, initialProfileTargetScale, initialProfileTargetScale, 0]
  );
  const initialProfileY = useTransform(
    scrollYProgress,
    [0, 0.15, 0.22],
    ["0%", "40%", "55%"]
  );

  const initialProfileOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.25],
    [1, 0]
  );

  const phoneScale = useTransform(scrollYProgress, [0.05, 0.2], [0.7, 1]);
  const phoneOpacity = useTransform(scrollYProgress, [0.1, 0.2], [0, 1]);

  const phoneContentOpacity = useTransform(
    scrollYProgress,
    [0.22, 0.35],
    [0, 1]
  );

  return (
    <div ref={scrollRef} className="relative h-[200vh] md:h-[180vh]">
      <div className="sticky top-0 h-screen flex flex-col lg:flex-row items-center justify-start lg:justify-center overflow-hidden">
        <IntroTextContent />
        <div className="w-full lg:w-1/2 flex items-center justify-center relative p-4 flex-shrink-0">
          <motion.div
            className="absolute z-30 flex items-center justify-center transition-all duration-500 ease-in-out"
            style={{
              scale: initialProfileScale,
              translateY: initialProfileY,
              opacity: initialProfileOpacity,
            }}
          >
            <ProfileIntro variant="initial" />
          </motion.div>

          {/* --- השינוי כאן בגדלי הטלפון --- */}
          <motion.div
            className="relative 
                       w-[200px] h-[400px]          {/* ברירת מחדל (למסכים קטנים מאוד) */}
                       sm:w-[220px] sm:h-[440px]   {/* מסכים קטנים */}
                       md:w-[250px] md:h-[500px]   {/* מסכים בינוניים */}
                       lg:w-[300px] lg:h-[600px]   {/* מסכים גדולים (כשזה לצד הטקסט) */}
                       z-20"
            style={{
              opacity: phoneOpacity,
              scale: phoneScale,
            }}
          >
            {/* --- סוף השינוי בגדלי הטלפון --- */}
            <div className="absolute inset-0 rounded-[2rem] sm:rounded-[2.5rem] border-[10px] sm:border-[12px] border-gray-700 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-2xl z-10 flex flex-col items-center overflow-hidden pt-4 sm:pt-6">
              <div className="w-4 h-4 bg-gray-800 dark:bg-gray-700 rounded-full mb-3 opacity-80" />
              <motion.div
                style={{ opacity: phoneContentOpacity }}
                className="w-full h-full flex flex-col items-center justify-center"
              >
                <ProfileIntro variant="inPhone" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StickyPhone;
