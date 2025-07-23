import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import FormWrapper from "../components/FormWrapper";
import InputField from "../components/fields/ InputField";
import PasswordField from "../components/fields/PasswordField";

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
    <FormWrapper title="Zaloguj się">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <InputField
          id="email"
          label="Email"
          type="email"
          placeholder="example@domain.com"
          register={register("email", {
            required: "Email jest wymagany",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Nieprawidłowy adres email",
            },
          })}
          error={errors.email}
        />
        <PasswordField
          id="password"
          label="Hasło"
          placeholder="Twoje hasło"
          register={register("password", {
            required: "Hasło jest wymagane",
          })}
          error={errors.password}
        />

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
    </FormWrapper>
  );
}
