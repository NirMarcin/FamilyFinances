import React from "react";

export default function PagesBanner({
  title = "Wykresy i statystyki",
  children,
}) {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white mt-32 dark:bg-black rounded-lg shadow-lg mb-8 transition-colors duration-300">
      <h1 className="text-3xl  font-extrabold text-center text-orange-700 dark:text-orange-400 mb-4">
        {title}
      </h1>
      {children && (
        <div className="text-center text-orange-900 dark:text-orange-300 text-lg bg-orange-50 dark:bg-gray-900 border border-orange-300 dark:border-gray-800 rounded-md px-6 py-4 shadow-inner transition-colors duration-300">
          {children}
        </div>
      )}
    </div>
  );
}
