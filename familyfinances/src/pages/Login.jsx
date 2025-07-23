import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // Tutaj wstaw logikę uwierzytelniania (np. Firebase, API)
      // Przykładowo po pomyślnym zalogowaniu:
      console.log("Zalogowano:", data);
      navigate("/dashboard"); // przekierowanie do dashboardu
    } catch (error) {
      console.error("Błąd logowania:", error);
      // obsłuż błąd np. pokaż komunikat
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">
          Zaloguj się
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-1 font-semibold text-orange-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Email jest wymagany",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Nieprawidłowy adres email",
                },
              })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="example@domain.com"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-1 font-semibold text-orange-700"
            >
              Hasło
            </label>
            <input
              id="password"
              type="password"
              {...register("password", { required: "Hasło jest wymagane" })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Twoje hasło"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Logowanie..." : "Zaloguj się"}
          </Button>
        </form>

        <p className="mt-6 text-center text-orange-700">
          Nie masz konta?{" "}
          <Link
            to="/register"
            className="font-semibold underline hover:text-orange-500"
          >
            Zarejestruj się
          </Link>
        </p>
      </div>
    </div>
  );
}
