import { useState } from "react";
import Navbar from "../components/Navbar";
import ReceiptManager from "../components/receiptsManager/ReceiptsManager";
import InvoiceManager from "../components/invoiceManager/InvoiceManager";
import SubsManager from "../components/subsManager/SubsManager";
import PagesBanner from "../components/PagesBanner";
import IncomeManager from "../components/incomeManager/IncomeManager";

const tabLabels = {
  income: "Przychody",
  expenses: "Rachunki",
  receipts: "Paragony",
  subs: "Subskrypcje",
};

export default function Expenses() {
  const [activeTab, setActiveTab] = useState("income");

  return (
    <>
      <Navbar />
      <PagesBanner title="Zarządzanie finansami">
        <span className="block mb-2 font-semibold text-orange-900 dark:text-orange-400">
          W tej zakładce możesz dodawać, edytować i usuwać swoje rachunki,
          paragony, przychody oraz subskrypcje.
        </span>
        <span className="block mb-2 text-gray-700 dark:text-orange-300">
          Wybierz odpowiednią kategorię z menu, aby zarządzać danymi. Wszystkie
          operacje są szybkie i wygodne – kliknij, aby dodać lub edytować
          wybraną pozycję.
        </span>
      </PagesBanner>
      <div className="max-w-7xl mx-auto px-4 sm:px-10 py-8 bg-transparent dark:bg-black transition-colors duration-300">
        <div className="flex flex-col min-h-[300px] items-stretch">
          {/* PRZYCISKI NAD MENEDŻERAMI */}
          <div className="mb-6">
            <div className="flex gap-2 flex-wrap justify-between">
              {Object.entries(tabLabels).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 min-w-[80px] px-4 py-2 rounded font-semibold transition text-sm text-center
                    ${
                      activeTab === key
                        ? "bg-orange-600 text-white shadow dark:bg-orange-700 dark:text-orange-200"
                        : "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-gray-900 dark:text-orange-300 dark:hover:bg-gray-800"
                    }
                  `}
                  style={{ marginLeft: 0, marginRight: 0 }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {/* MENEDŻERY */}
          <div className="bg-white rounded-lg shadow p-4 border border-orange-200 min-h-[320px] dark:bg-gray-900 dark:border-gray-800 transition-colors duration-300">
            {activeTab === "subs" && <SubsManager />}
            {activeTab === "expenses" && <InvoiceManager />}
            {activeTab === "receipts" && <ReceiptManager />}
            {activeTab === "income" && <IncomeManager />}
          </div>
        </div>
      </div>
    </>
  );
}
