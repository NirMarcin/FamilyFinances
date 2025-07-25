import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ReadOnlyTable from "../components/ReadOnlyTable";
import ReceiptManager from "../components/ReceiptManager";

export default function Dashboard() {
  const columns = [
    { header: "Data", accessor: "date" },
    { header: "Nazwa wydatku", accessor: "title" },
    { header: "Kwota (zł)", accessor: "amount" },
    // dodaj inne kolumny, jeśli chcesz, np. data, kategoria...
  ];
  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto p-4">
        <ReadOnlyTable columns={columns} />
      </div>
    </>
  );
}
