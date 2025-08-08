import { Link } from "react-router-dom";
import Button from "../components/buttons/Button";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent dark:bg-black px-4 transition-colors duration-300">
      <div className="w-full max-w-3xl bg-white bg-opacity-90 dark:bg-gray-900 dark:bg-opacity-95 shadow-xl rounded-xl p-6 sm:p-8 lg:p-10 text-center border border-orange-200 dark:border-gray-800 transition-colors duration-300">
        <h1 className="text-3xl sm:text-4xl font-bold text-orange-600 dark:text-orange-400 mb-4">
          Family Finances
        </h1>

        <p className="text-base sm:text-lg text-orange-700 dark:text-orange-300 mb-6 leading-relaxed">
          Zadbaj o finanse swojej rodziny w jednym miejscu.{" "}
          <br className="hidden sm:block" />
          Twórz budżet, śledź wydatki i oszczędzaj mądrze 💰
        </p>

        <ul className="text-left text-orange-800 dark:text-orange-300 mb-8 space-y-2 list-disc list-inside text-sm sm:text-base">
          <li>🔍 Monitoruj przychody i wydatki</li>
          <li>📊 Generuj miesięczne i roczne raporty</li>
          <li>👨‍👩‍👧‍👦 Zarządzaj finansami całej rodziny z jednego konta</li>
          <li>🔔 Ustawiaj przypomnienia o płatnościach</li>
          <li>🔐 Bezpieczne logowanie i pełna prywatność danych</li>
        </ul>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/login">
            <Button variant="primary">Zaloguj się</Button>
          </Link>
          <Link to="/register">
            <Button variant="secondary">Zarejestruj się</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
