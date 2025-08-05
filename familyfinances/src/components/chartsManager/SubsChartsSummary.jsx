// import React, { useContext, useMemo, useState } from "react";
// import SubsContext from "../../contexts/SubsContext";
// import ChartsPie from "./ChartsPie";
// import UniversalTable from "../common/UniversalTable";
// import ModalDetails from "../modals/ModalDetails";

// export default function SubsChartsSummary() {
//   const { subs } = useContext(SubsContext);

//   // Przykładowe filtry
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");
//   const [selectedTypes, setSelectedTypes] = useState([]);
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [selectedSub, setSelectedSub] = useState(null);

//   // Filtrowanie, sumy, wykresy itd. – analogicznie jak w ReceiptsChartsSummary
//   // ...tutaj analogiczna logika...

//   return (
//     <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 mb-10">
//       <h3 className="text-2xl font-bold text-orange-700 mb-6 text-center">
//         Podsumowanie subskrypcji
//       </h3>
//       {/* ...analogiczny układ: filtry, wykresy, listy, tabela, modal... */}
//     </div>
//   );
// }
