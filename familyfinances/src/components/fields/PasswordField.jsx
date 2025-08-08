import InputField from "./InputField"
export default function PasswordField({ label, id, register, error, placeholder }) {
  return (
    <InputField
      wrapperClassName="mb-4"
      label={label}
      id={id}
      type="password"
      register={register}
      placeholder={placeholder}
      error={error}
      inputClassName="bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 border border-orange-200 dark:border-gray-700 transition-colors duration-300"
      labelClassName="text-orange-700 dark:text-orange-300"
    />
  )
}
