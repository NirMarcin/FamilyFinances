import { Link } from "react-router-dom";
import Button from "../components/buttons/Button";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
      <div className="w-full max-w-3xl bg-white bg-opacity-90 shadow-xl rounded-xl p-6 sm:p-8 lg:p-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-orange-600 mb-4">
          Family Finances
        </h1>

        <p className="text-base sm:text-lg text-orange-700 mb-6 leading-relaxed">
          Zadbaj o finanse swojej rodziny w jednym miejscu.{" "}
          <br className="hidden sm:block" />
          Twórz budżet, śledź wydatki i oszczędzaj mądrze 💰
        </p>

        <ul className="text-left text-orange-800 mb-8 space-y-2 list-disc list-inside text-sm sm:text-base">
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
