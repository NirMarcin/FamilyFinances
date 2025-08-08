import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import InputField from "../components/fields/InputField";
import PasswordField from "../components/fields/PasswordField";
import Button from "../components/buttons/Button";
import FormWrapper from "../components/FormWrapper";
import SuccessMessage from "../components/SuccessMessage";

import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();
  const { register: registerUser, authError, setAuthError, user } = useAuth();
  const password = watch("password");

  const [localStatus, setLocalStatus] = useState(null);
  const [localError, setLocalError] = useState("");

  const onSubmit = async (data) => {
    setLocalStatus(null);
    setLocalError("");
    setAuthError(null);

    const { success, message } = await registerUser(data.email, data.password);

    if (success) {
      setLocalStatus("success");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } else {
      setLocalStatus("error");
      setLocalError(message || "Wystąpił nieznany błąd podczas rejestracji.");
    }
  };
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <FormWrapper title="Zarejestruj się">
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
            minLength: {
              value: 6,
              message: "Hasło musi mieć min. 6 znaków",
            },
          })}
          error={errors.password}
          inputClassName="bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 border border-orange-200 dark:border-gray-700"
          labelClassName="text-orange-700 dark:text-orange-300"
        />

        <PasswordField
          id="confirmPassword"
          label="Powtórz hasło"
          placeholder="Powtórz hasło"
          register={register("confirmPassword", {
            required: "Powtórzenie hasła jest wymagane",
            validate: (value) => value === password || "Hasła nie są zgodne",
          })}
          error={errors.confirmPassword}
          inputClassName="bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 border border-orange-200 dark:border-gray-700"
          labelClassName="text-orange-700 dark:text-orange-300"
        />

        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="w-full mt-4 bg-orange-600 dark:bg-orange-700 text-white dark:text-orange-200"
        >
          {isSubmitting ? "Rejestrowanie..." : "Zarejestruj się"}
        </Button>

        {/* Komunikaty z lokalnego stanu oraz z kontekstu authError */}
        {localStatus === "error" && (localError || authError) && (
          <p className="mt-4 text-red-700 dark:text-red-400 text-center">
            {localError || authError}
          </p>
        )}
        {localStatus === "success" && (
          <SuccessMessage message="Rejestracja zakończona sukcesem! Przekierowanie..." />
        )}
      </form>

      <p className="mt-6 text-center text-orange-700 dark:text-orange-300 text-sm">
        Masz już konto?{" "}
        <Link
          to="/login"
          className="font-semibold underline hover:text-orange-500 dark:hover:text-orange-400"
        >
          Zaloguj się
        </Link>
      </p>
    </FormWrapper>
  );
}
