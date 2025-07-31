import Navbar from "../components/Navbar";
import PagesBanner from "../components/PagesBanner";

export default function Settings() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <PagesBanner title="Ustawienia">
        Na tej stronie możesz zarządzać ustawieniami swojego konta, zmieniać dane osobowe, hasło oraz dostosować preferencje aplikacji do własnych potrzeb.
        <br />
        W przyszłości pojawią się tu dodatkowe opcje personalizacji i bezpieczeństwa.
      </PagesBanner>
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Strona ustawień</h2>
        <p>Wkrótce dostępne!</p>
      </div>
    </div>
  );
}