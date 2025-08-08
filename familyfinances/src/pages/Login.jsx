import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Button from "../components/buttons/Button";
import FormWrapper from "../components/FormWrapper";
import InputField from "../components/fields/InputField";
import PasswordField from "../components/fields/PasswordField";
import SuccessMessage from "../components/SuccessMessage";

import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();
  const { login, user, authError, setAuthError } = useAuth();
  const [localError, setLocalError] = useState("");
  const [localStatus, setLocalStatus] = useState(null);

  const onSubmit = async (data) => {
    setLocalStatus(null);
    setLocalError("");
    setAuthError(null);

    const { success, message } = await login(data.email, data.password);

    if (success) {
      setLocalStatus("success");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } else {
      setLocalError(message || "Wystąpił błąd podczas logowania.");
    }
  };
  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    }
  }, [user, navigate]);

  return (
    <FormWrapper title="Zaloguj się">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <InputField
          wrapperClassName="mb-4"
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
          inputClassName="bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 border border-orange-200 dark:border-gray-700"
          labelClassName="text-orange-700 dark:text-orange-300"
        />
        <PasswordField
          id="password"
          label="Hasło"
          placeholder="Twoje hasło"
          register={register("password", {
            required: "Hasło jest wymagane",
          })}
          error={errors.password}
          inputClassName="bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 border border-orange-200 dark:border-gray-700"
          labelClassName="text-orange-700 dark:text-orange-300"
        />

        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="w-full bg-orange-600 dark:bg-orange-700 text-white dark:text-orange-200"
        >
          {isSubmitting ? "Logowanie..." : "Zaloguj się"}
        </Button>
      </form>

      {/* Komunikat z błędem logowania */}
      {(localError || authError) && (
        <p className="mt-4 text-red-700 dark:text-red-400 text-center">
          {localError || authError}
        </p>
      )}
      {localStatus === "success" && (
        <SuccessMessage message="Logowanie zakończone sukcesem!" />
      )}

      <p className="mt-6 text-center text-orange-700 dark:text-orange-300">
        Nie masz konta?{" "}
        <Link
          to="/register"
          className="font-semibold underline hover:text-orange-500 dark:hover:text-orange-400"
        >
          Zarejestruj się
        </Link>
      </p>
    </FormWrapper>
  );
}
