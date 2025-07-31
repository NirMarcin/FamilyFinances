import Navbar from "../components/Navbar";
import PagesBanner from "../components/PagesBanner";
import AccountSettings from "../components/settings/AccountSettings";

export default function Settings() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <PagesBanner title="Ustawienia">
        Na tej stronie możesz zarządzać ustawieniami swojego konta, zmieniać dane osobowe, hasło oraz dostosować preferencje aplikacji do własnych potrzeb.
        <br />
        W przyszłości pojawią się tu dodatkowe opcje personalizacji i bezpieczeństwa.
      </PagesBanner>
      <AccountSettings />
    </div>
  );
}