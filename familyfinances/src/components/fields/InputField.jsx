export default function InputField({
  label,
  id,
  type = "text",
  register,
  error,
  placeholder,
  wrapperClassName = "",
  labelClassName = "",
  inputClassName = "",
  ...rest
}) {
  return (
    <div className={wrapperClassName}>
      <label
        htmlFor={id}
        className={`block mb-1 font-semibold text-orange-700 dark:text-orange-300 ${labelClassName}`}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        {...register}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 transition-colors duration-300 ${
          error ? "border-red-500" : "border-gray-300 dark:border-gray-700"
        } ${inputClassName}`}
        {...rest}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error.message}</p>}
    </div>
  );
}
