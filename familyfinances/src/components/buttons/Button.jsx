import clsx from "clsx";

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "px-6 py-3 rounded-md font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400";

  const variants = {
    primary:
      "bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-700 dark:hover:bg-orange-800 dark:text-orange-200",
    secondary:
      "bg-white border border-orange-500 text-orange-500 hover:bg-orange-100 dark:bg-gray-900 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-gray-800",
    deleted:
      "bg-red-500 hover:bg-red-600 text-white font-bold rounded shadow transition disabled:opacity-50 dark:bg-orange-700 dark:hover:bg-orange-800 dark:text-orange-200",
  };

  return (
    <button className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
