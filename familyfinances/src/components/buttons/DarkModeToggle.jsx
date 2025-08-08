import React, { useState, useEffect } from "react";

function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(!isDark);

  return (
    <div className="flex flex-col items-center">
      <span className="mb-2 text-sm font-semibold text-orange-700 dark:text-orange-400">
        Zmień motyw
      </span>
      <div
        className={`relative w-14 h-8 flex items-center bg-orange-200 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300 cursor-pointer`}
        onClick={toggleDarkMode}
      >
        <div
          className={`absolute left-1 top-1 w-6 h-6 rounded-full transition-transform duration-300 ${
            isDark
              ? "translate-x-6 bg-gray-900 border border-orange-400"
              : "translate-x-0 bg-orange-400 border border-gray-300"
          }`}
        />
      </div>
    </div>
  );
}

export default DarkModeToggle;
