import React from "react";
import SubsForm from "./SubsForm";
import SubsList from "./SubsList";

export default function SubsManager() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <div>
        <h1 className="text-3xl font-extrabold mb-6 text-center text-orange-700">
          Dodaj subskrypcję
        </h1>
        <SubsForm />
      </div>
      <SubsList />
    </div>
  );
}
