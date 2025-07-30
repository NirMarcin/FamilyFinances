import { useState } from "react";
import Navbar from "../components/Navbar";
import ReceiptManager from "../components/reciptManager/ReceiptManager";
import ExpansesMenu from "../components/ExpansesMenu";
import InvoiceManager from "../components/invoiceManager/InvoiceManager";
import IncomeManager from "../components/incomeManager/IncomeManager";
import SubsManager from "../components/subsManager/SubsManager";
import PagesBanner from "../components/PagesBanner";

export default function Expenses() {
  const [activeTab, setActiveTab] = useState("expenses");

  return (
    <>
      <Navbar />
      <PagesBanner title="Zarządzanie finansami">
        W tej zakładce możesz dodawać, edytować i usuwać swoje rachunki, paragony,
        przychody oraz subskrypcje.
        <br />
        Wybierz odpowiednią kategorię z menu po prawej, aby zarządzać danymi.
      </PagesBanner>
      <div className="max-w-7xl mx-auto px-4 sm:px-10 py-8 bg-transparent">
        <div className="flex flex-col md:flex-row gap-10 min-h-[300px] items-stretch">
          {/* LEWA KOLUMNA */}
          <div className="flex-grow max-w-full md:max-w-[80%] min-w-0 h-full">
            {activeTab === "subs" && <SubsManager />}
            {activeTab === "expenses" && <InvoiceManager />}
            {activeTab === "receipts" && <ReceiptManager />}
            {activeTab === "income" && <IncomeManager />}
          </div>

          {/* PRAWA KOLUMNA */}
          <div className="w-full md:w-[220px] min-w-0 h-full">
            <div className="w-full h-full flex flex-col">
              <ExpansesMenu activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
