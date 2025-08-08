import React, { useState } from "react";
import PagesBanner from "../components/PagesBanner";
import Navbar from "../components/Navbar";
import ChartsMenu from "../components/ChartsMenu";
import ReceiptsChartsSummary from "../components/chartsManager/ReceiptsChartsSummary";
import InvoiceChartsSummary from "../components/chartsManager/InvoiceChartsSummary";
import IncomeChartsSummary from "../components/chartsManager/IncomeChartsSummary";
import SubsChartsSummary from "../components/chartsManager/SubsChartsSummary";
import AllSummary from "../components/chartsManager/AllSummary";

export default function Charts() {
  const [activeTab, setActiveTab] = useState("AllSummary");

  return (
    <>
      <Navbar />
      <PagesBanner title="Wykresy i statystyki">
        Przeglądaj swoje wydatki i przychody w formie wykresów. Możesz filtrować
        dane według kategorii, sklepu i zakresu dat.
      </PagesBanner>
      <div className="max-w-7xl mx-auto px-4 sm:px-10 py-8 bg-transparent">
        <div className="flex flex-col md:flex-row gap-10 min-h-[300px] items-stretch">
          {/* LEWA KOLUMNA */}
          <div className="flex-grow max-w-full md:max-w-[80%] min-w-0 h-full">
            {activeTab === "AllSummary" && <AllSummary />}
            {activeTab === "ReceiptsChartsSummary" && <ReceiptsChartsSummary />}
            {activeTab === "InvoiceChartsSummary" && <InvoiceChartsSummary />}
            {activeTab === "IncomeChartsSummary" && <IncomeChartsSummary />}
            {activeTab === "SubsChartsSummary" && <SubsChartsSummary />}
          </div>
          {/* PRAWA KOLUMNA */}
          <div className="w-full md:w-[220px] min-w-0 h-full">
            <div className="w-full h-full flex flex-col">
              <ChartsMenu activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
