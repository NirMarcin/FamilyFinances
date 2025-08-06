import React, { useState } from "react";
import PagesBanner from "../components/PagesBanner";
import Navbar from "../components/Navbar";
import ChartsMenu from "../components/ChartsMenu";
import ReceiptsChartsSummary from "../components/chartsManager/ReceiptsChartsSummary";
import InvoiceChartsSummary from "../components/chartsManager/InvoiceChartsSummary";
import IncomeChartsSummary from "../components/chartsManager/IncomeChartsSummary";
// import SubsChartsSummary from "../components/chartsManager/SubsChartsSummary";
// import AllSummary from "../components/chartsManager/AllSummary";

export default function Charts() {
  const [activeTab, setActiveTab] = useState("ReceiptsChartsSummary");

  return (
    <>
      <Navbar />
      <PagesBanner title="Wykresy i statystyki">
        Przeglądaj swoje wydatki i przychody w formie wykresów. Możesz filtrować
        dane według kategorii, sklepu i zakresu dat.
      </PagesBanner>
      {/* MENU POZIOME */}
      <ChartsMenu activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="max-w-7xl mx-auto px-4 sm:px-10 py-8 bg-transparent">
        {activeTab === "ReceiptsChartsSummary" && <ReceiptsChartsSummary />}
        {activeTab === "InvoiceChartsSummary" && <InvoiceChartsSummary />}
        {activeTab === "IncomeChartsSummary" && <IncomeChartsSummary />}
        {/* {activeTab === "SubsChartsSummary" && <SubsChartsSummary />} */}
        {/* {activeTab === "AllSummary" && <AllSummary />} */}
      </div>
    </>
  );
}
