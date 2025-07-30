import clsx from 'clsx';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base =
    "px-6 py-3 rounded-md font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400";

  const variants = {
    primary: "bg-orange-500 text-white hover:bg-orange-600",
    secondary: "bg-white border border-orange-500 text-orange-500 hover:bg-orange-100",
    deleted: "bg-white border border-orange-500 text-orange-500 hover:bg-orange-600 hover:text-white ml-2 rounded px-4 py-2 transition",
  };

  return (
    <button
      className={clsx(base, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
