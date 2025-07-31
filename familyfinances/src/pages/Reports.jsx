import Navbar from "../components/Navbar";
import PagesBanner from "../components/PagesBanner";

export default function Reports() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <PagesBanner title="Raporty">
        Na tej stronie możesz generować szczegółowe raporty dotyczące swoich
        finansów, analizować wydatki i przychody w różnych okresach oraz
        eksportować dane do pliku.
        <br />W przyszłości pojawią się tu dodatkowe narzędzia do analizy i
        porównywania danych finansowych.
      </PagesBanner>
    </div>
  );
}
