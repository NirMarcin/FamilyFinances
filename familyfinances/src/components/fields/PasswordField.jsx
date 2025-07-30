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
    />
  )
}
