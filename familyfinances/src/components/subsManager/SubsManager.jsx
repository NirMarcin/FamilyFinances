import React from "react";
import SubsForm from "./SubsForm";
import SubsList from "./SubsList";

export default function SubsManager() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg mt-8 border border-orange-200 dark:border-gray-800 transition-colors duration-300">
      <div>
        <h1 className="text-3xl font-extrabold mb-6 text-center text-orange-700 dark:text-orange-400">
          Dodaj/Usuń subskrypcję
        </h1>
        <SubsForm />
      </div>
      <SubsList />
    </div>
  );
}
