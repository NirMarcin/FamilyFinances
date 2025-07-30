import React from "react";

export default function PagesBanner({
  title = "Wykresy i statystyki",
  children,
}) {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8 mb-8">
      <h1 className="text-3xl font-extrabold text-center text-orange-700 mb-4">
        {title}
      </h1>
      {children && (
        <div className="text-center text-orange-900 text-lg bg-orange-50 border border-orange-300 rounded-md px-6 py-4 shadow-inner">
          {children}
        </div>
      )}
    </div>
  );
}
