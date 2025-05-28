// src/components/ProfileIntro.tsx
import React from "react";

type ProfileIntroProps = {
  variant?: "initial" | "inPhone"; // שני מצבי תצוגה אפשריים
};

const ProfileIntro = ({ variant = "initial" }: ProfileIntroProps) => {
  const isInitialVariant = variant === "initial";

  // הגדרת קלאסים של Tailwind משתנים בהתאם ל-variant
  const containerClasses = isInitialVariant
    ? "scale-100"
    : "scale-100 sm:scale-105"; // הקטנה של כל הקומפוננטה בתוך הטלפון
  const imageSize = isInitialVariant
    ? "w-40 h-40 md:w-56 md:h-56"
    : "w-20 h-20"; // תמונה גדולה יותר בהתחלה
  const nameTextSize = isInitialVariant ? "text-3xl md:text-4xl" : "text-lg";
  const subtitleTextSize = isInitialVariant ? "text-md md:text-lg" : "text-xs";
  const nameMarginTop = isInitialVariant ? "mt-6" : "mt-2";
  const subtitleMarginTop = isInitialVariant ? "mt-2" : "mt-1";
  const sectionPadding = isInitialVariant ? "py-8" : "py-2 px-1"; // פחות פדינג בתוך הטלפון

  return (
    <div
      className={`flex flex-col items-center text-center transition-transform duration-300 ease-in-out ${containerClasses} ${sectionPadding}`}
    >
      <img
        src="/assets/ofek.jpg"
        alt="Ofek Amirav"
        className={`${imageSize} rounded-full object-cover shadow-xl border-2 border-white dark:border-gray-700`}
      />
      {variant === "inPhone" && (
        <>
          <h2
            className={`${nameTextSize} ${nameMarginTop} font-semibold text-gray-800 dark:text-gray-100`}
          >
            Ofek Amirav
          </h2>
          <p
            className={`${subtitleTextSize} ${subtitleMarginTop} text-gray-600 dark:text-gray-400 max-w-xs`}
          >
            Android Developer | Full-Stack | UI Lover
          </p>

          <div className="mt-4 flex flex-wrap justify-center items-center gap-3">
            <img
              src="/assets/kotlin.svg"
              alt="Kotlin"
              title="Kotlin"
              className="w-6 h-6"
            />
            <img
              src="/assets/android_developer.svg"
              alt="Android Developer"
              title="Android Developer"
              className="w-7 h-7"
            />
            <img
              src="/assets/jetpackcompose-original.svg"
              alt="Jetpack Compose"
              title="Jetpack Compose"
              className="w-7 h-7"
            />
            <img
              src="/assets/react.svg"
              alt="React"
              title="React"
              className="w-5 h-5"
            />
            <img
              src="/assets/Typescript_logo.svg"
              alt="TypeScript"
              title="TypeScript"
              className="w-6 h-6"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileIntro;
