import PagesBanner from "../components/PagesBanner";
import Navbar from "../components/Navbar";
import BudgetLimitManager from "../components/budgetLimitManager/BudgetLimitManager";

export default function Budget() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <PagesBanner title="Budżet">
        Na tej stronie możesz ustawić swój miesięczny budżet, śledzić wydatki
        oraz analizować, ile zostało Ci do wykorzystania w danym okresie.
        <br />W przyszłości pojawią się tu narzędzia do planowania i kontroli
        domowych finansów.
      </PagesBanner>
      <BudgetLimitManager />
    </div>
  );
}
