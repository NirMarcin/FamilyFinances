import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-xl p-10 mx-4 text-center">
        <h1 className="text-4xl font-bold text-orange-600 mb-4">
          Family Finances
        </h1>

        <p className="text-orange-700 text-lg mb-6">
          Zadbaj o finanse swojej rodziny w jednym miejscu.
          Twórz budżet, śledź wydatki i oszczędzaj mądrze 💰
        </p>

        <ul className="text-left text-orange-800 mb-8 space-y-2 list-disc list-inside">
          <li>🔍 Monitoruj przychody i wydatki w czasie rzeczywistym</li>
          <li>📊 Generuj miesięczne i roczne raporty</li>
          <li>👨‍👩‍👧‍👦 Zarządzaj finansami całej rodziny z jednego konta</li>
          <li>🔔 Ustawiaj przypomnienia o płatnościach</li>
          <li>🔐 Bezpieczne logowanie i pełna prywatność danych</li>
        </ul>

         <div className="flex justify-center gap-4">
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
