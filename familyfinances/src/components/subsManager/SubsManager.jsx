import React, { useContext } from "react";
import SubsContext from "../../contexts/SubsContext";
import SubsForm from "./SubsForm";
import SubsList from "./SubsList";

export default function SubsManager() {
  const { subs, addSubs, deleteSub } = useContext(SubsContext);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8 border border-orange-300">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-orange-700">
        Zarządzanie subskrypcjami
      </h1>
      <section className="mb-10 p-5 border border-gray-300 rounded-lg bg-orange-50 shadow-inner">
        <h3 className="text-xl font-semibold mb-4 text-orange-800">
          Dodaj subskrypcję
        </h3>
        <SubsForm onAdd={addSubs} />
      </section>
      <section>
        <h2 className="text-2xl font-extrabold mb-6 text-orange-700">
          Lista płatności subskrypcyjnych
        </h2>
        <SubsList subs={subs} onDelete={deleteSub} />
      </section>
    </div>
  );
}
