import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import InputField from '../components/fields/ InputField'
import PasswordField from '../components/fields/PasswordField'
import Button from '../components/Button'
import FormWrapper from '../components/FormWrapper'

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const navigate = useNavigate()
  const password = watch('password')

  const onSubmit = async (data) => {
    console.log('Zarejestrowano:', data)
    navigate('/dashboard')
  }

  return (
    <FormWrapper title="Zarejestruj się">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <InputField
          id="email"
          label="Email"
          type="email"
          placeholder="example@domain.com"
          register={register('email', {
            required: 'Email jest wymagany',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Nieprawidłowy adres email',
            },
          })}
          error={errors.email}
        />

        <PasswordField
          id="password"
          label="Hasło"
          placeholder="Twoje hasło"
          register={register('password', {
            required: 'Hasło jest wymagane',
            minLength: {
              value: 6,
              message: 'Hasło musi mieć min. 6 znaków',
            },
          })}
          error={errors.password}
        />

        <PasswordField
          id="confirmPassword"
          label="Powtórz hasło"
          placeholder="Powtórz hasło"
          register={register('confirmPassword', {
            required: 'Powtórzenie hasła jest wymagane',
            validate: (value) =>
              value === password || 'Hasła nie są zgodne',
          })}
          error={errors.confirmPassword}
        />

        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="w-full mt-4"
        >
          {isSubmitting ? 'Rejestrowanie...' : 'Zarejestruj się'}
        </Button>
      </form>

      <p className="mt-6 text-center text-orange-700 text-sm">
        Masz już konto?{' '}
        <Link to="/login" className="font-semibold underline hover:text-orange-500">
          Zaloguj się
        </Link>
      </p>
    </FormWrapper>
  )
}
