import { useState } from "react";

export default function AccountSettings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [preferences, setPreferences] = useState({
    darkMode: false,
    notifications: true,
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // Tutaj dodaj logikę aktualizacji profilu użytkownika
    alert("Dane osobowe zapisane!");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    // Tutaj dodaj logikę zmiany hasła
    alert("Hasło zostało zmienione!");
  };

  const handlePreferencesChange = (e) => {
    const { name, checked } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <div className="max-w-xl mx-auto mt-8 space-y-8">
      {/* Dane osobowe */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-white p-6 rounded-lg shadow space-y-4 border"
      >
        <h2 className="text-xl font-bold text-orange-700 mb-2">Dane osobowe</h2>
        <div>
          <label className="block mb-1 font-semibold">Imię i nazwisko</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Imię i nazwisko"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">E-mail</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
          />
        </div>
        <button
          type="submit"
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded"
        >
          Zapisz dane
        </button>
      </form>

      {/* Zmiana hasła */}
      <form
        onSubmit={handleChangePassword}
        className="bg-white p-6 rounded-lg shadow space-y-4 border"
      >
        <h2 className="text-xl font-bold text-orange-700 mb-2">Zmiana hasła</h2>
        <div>
          <label className="block mb-1 font-semibold">Aktualne hasło</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Aktualne hasło"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Nowe hasło</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nowe hasło"
          />
        </div>
        <button
          type="submit"
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded"
        >
          Zmień hasło
        </button>
      </form>

      {/* Preferencje */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4 border">
        <h2 className="text-xl font-bold text-orange-700 mb-2">Preferencje</h2>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="darkMode"
            name="darkMode"
            checked={preferences.darkMode}
            onChange={handlePreferencesChange}
          />
          <label htmlFor="darkMode" className="font-semibold">
            Tryb ciemny
          </label>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="notifications"
            name="notifications"
            checked={preferences.notifications}
            onChange={handlePreferencesChange}
          />
          <label htmlFor="notifications" className="font-semibold">
            Powiadomienia e-mail
          </label>
        </div>
      </div>
    </div>
  );
}
