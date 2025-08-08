# FamilyFinances

Aplikacja webowa do zarządzania budżetem domowym, wydatkami, przychodami, paragonami oraz subskrypcjami.  
Projekt stworzony w React z wykorzystaniem Tailwind CSS.

## Funkcje

- Dodawanie, edycja i usuwanie wydatków, przychodów, paragonów i subskrypcji
- Przeglądanie statystyk i wykresów finansowych
- Zarządzanie budżetem miesięcznym
- Tryb jasny/ciemny (Dark Mode Toggle)
- Responsywny interfejs (działa na desktopie i mobile)
- Bezpieczne wylogowywanie użytkownika

## Instalacja

1. Sklonuj repozytorium:

   ```bash
   git clone <adres_repozytorium>
   cd FamilyFinances/familyfinances
   ```

2. Zainstaluj zależności:

   ```bash
   npm install
   ```

3. Uruchom aplikację developerską:

   ```bash
   npm run dev
   ```

4. Otwórz [http://localhost:5173] w przeglądarce.

## Technologie

- React
- Tailwind CSS
- Vite
- React Router

## Struktura projektu

```
familyfinances/
├── src/
│   ├── components/
│   │   ├── buttons/
│   │   ├── common/
│   │   ├── incomeManager/
│   │   ├── modals/
│   │   ├── receiptsManager/
│   │   ├── readOnlyTable/
│   │   └── settings/
│   ├── contexts/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── tailwind.config.js
└── package.json
```

## Konfiguracja Tailwind

W pliku `tailwind.config.js`:

```js
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
```

## Autor

Twórcą projektu jest Marcin Nir.

---

**Uwaga:**  
Aplikacja jest w fazie rozwoju. Wszelkie uwagi i sugestie są mile widziane!
