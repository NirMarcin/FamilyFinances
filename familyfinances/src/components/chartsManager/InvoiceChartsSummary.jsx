// import React, { useContext, useMemo, useState } from "react";
// import InvoicesContext from "../../contexts/InvoicesContext";
// import ChartsPie from "./ChartsPie";
// import UniversalTable from "../common/UniversalTable";
// import ModalDetails from "../modals/ModalDetails";

// export default function InvoiceChartsSummary() {
//   const { invoices } = useContext(InvoicesContext);

//   // Przykładowe filtry
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");
//   const [selectedContractors, setSelectedContractors] = useState([]);
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [selectedInvoice, setSelectedInvoice] = useState(null);

//   // Filtrowanie, sumy, wykresy itd. – analogicznie jak w ReceiptsChartsSummary
//   // ...tutaj analogiczna logika...

//   return (
//     <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 mb-10">
//       <h3 className="text-2xl font-bold text-orange-700 mb-6 text-center">
//         Podsumowanie faktur
//       </h3>
//       {/* ...analogiczny układ: filtry, wykresy, listy, tabela, modal... */}
//     </div>
//   );
// }
