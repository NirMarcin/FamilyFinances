import React, { useState } from "react";
import PagesBanner from "../components/PagesBanner";
import Navbar from "../components/Navbar";
import ReceiptsChartsSummary from "../components/chartsManager/ReceiptsChartsSummary";
import InvoiceChartsSummary from "../components/chartsManager/InvoiceChartsSummary";
import IncomeChartsSummary from "../components/chartsManager/IncomeChartsSummary";
import SubsChartsSummary from "../components/chartsManager/SubsChartsSummary";
import AllSummary from "../components/chartsManager/AllSummary";

const tabLabels = {
  AllSummary: "Podsumowanie",
  ReceiptsChartsSummary: "Paragony",
  InvoiceChartsSummary: "Rachunki",
  IncomeChartsSummary: "Przychody",
  SubsChartsSummary: "Subskrypcje",
};

export default function Charts() {
  const [activeTab, setActiveTab] = useState("AllSummary");

  return (
    <>
      <Navbar />
      <PagesBanner title="Wykresy i statystyki">
        <span className="block mb-2 font-semibold text-orange-900 dark:text-orange-400">
          Przeglądaj swoje wydatki i przychody w formie wykresów.
        </span>
        <span className="block mb-2 text-gray-700 dark:text-orange-300">
          Wybierz kategorię, aby zobaczyć szczegółowe statystyki. Możesz
          filtrować dane według kategorii, sklepu i zakresu dat.
        </span>
      </PagesBanner>
      <div className="max-w-7xl mx-auto px-4 sm:px-10 py-8 bg-transparent dark:bg-black transition-colors duration-300">
        <div className="flex flex-col min-h-[300px] items-stretch">
          {/* PRZYCISKI NAD WYKRESAMI */}
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
          {/* WYKRESY */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 border border-orange-200 dark:border-gray-800 min-h-[320px] transition-colors duration-300">
            {activeTab === "AllSummary" && <AllSummary />}
            {activeTab === "ReceiptsChartsSummary" && <ReceiptsChartsSummary />}
            {activeTab === "InvoiceChartsSummary" && <InvoiceChartsSummary />}
            {activeTab === "IncomeChartsSummary" && <IncomeChartsSummary />}
            {activeTab === "SubsChartsSummary" && <SubsChartsSummary />}
          </div>
        </div>
      </div>
    </>
  );
}
