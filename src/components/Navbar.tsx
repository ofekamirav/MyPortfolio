import { useState, useEffect } from "react";
import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";
import { Sun, Moon, Menu, X } from "lucide-react"; // הוספתי אייקונים לתפריט מובייל

const Navbar = () => {
  const [theme, setTheme] = useState("light");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "system";
    const isSystemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (storedTheme === "dark" || (storedTheme === "system" && isSystemDark)) {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);
  };

  const scrollToTop = () => {
    scroll.scrollToTop({
      duration: 800, 
      smooth: "easeInOutCubic", 
    });
    setIsMobileMenuOpen(false); 
  };

  const navLinks = [
    { to: "home", label: "Home" },
    { to: "about", label: "About" },
    { to: "projects", label: "Projects" },
    { to: "contact", label: "Contact" },
  ];

  const navLinkProps = {
    spy: true,
    smooth: true,
    offset: -90, 
    duration: 500,
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm px-4 sm:px-6 lg:px-8 py-3 sticky top-0 z-50 transition-colors duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14">
        {/* שמאל: לוגו/שם */}

        <h1
          className="text-2xl md:text-3xl font-bold cursor-pointer bg-gradient-to-r from-green-600 via-blue-500 to-purple-500 bg-clip-text text-transparent"
          onClick={scrollToTop}
          title="Scroll to top"
        >
          OA
        </h1>

        {/* מרכז: קישורי ניווט (מוסתרים במובייל, מופיעים במסכים גדולים) */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => (
            <ScrollLink
              key={link.to}
              to={link.to}
              {...navLinkProps}
              className="px-3 lg:px-4 py-2 rounded-md text-sm font-medium cursor-pointer text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all duration-200 ease-in-out"
              activeClass="font-semibold text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-gray-800 shadow-sm"
            >
              {link.label}
            </ScrollLink>
          ))}
        </div>

        {/* ימין: כפתור Theme וכפתור תפריט מובייל */}
        <div className="flex items-center">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>

          {/* כפתור תפריט מובייל (מופיע רק במסכים קטנים) */}
          <div className="md:hidden ml-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors"
              aria-label="Open menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* תפריט מובייל נפתח (מופיע רק כשהוא פתוח ובמסכים קטנים) */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg py-2 z-40">
          <div className="flex flex-col items-center space-y-2">
            {navLinks.map((link) => (
              <ScrollLink
                key={link.to}
                to={link.to}
                {...navLinkProps}
                className="block w-full text-center px-4 py-3 text-md font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                activeClass="font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-800"
                onClick={() => setIsMobileMenuOpen(false)} // סגור תפריט בלחיצה
              >
                {link.label}
              </ScrollLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
