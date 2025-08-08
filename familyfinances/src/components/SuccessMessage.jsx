export default function SuccessMessage({ message }) {
  if (!message) return null;

  return (
    <div className="mt-4 flex items-center justify-center gap-2 bg-green-50 dark:bg-black border border-green-200 dark:border-green-700 text-green-800 dark:text-orange-300 rounded px-4 py-3 text-center transition-colors duration-300">
      <svg
        className="h-6 w-6 flex-shrink-0 text-green-500 dark:text-orange-400"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          cx={12}
          cy={12}
          r={11}
          className="stroke-green-300 dark:stroke-orange-400"
          stroke="currentColor"
          strokeWidth={1.8}
          fill="#D1FAE5"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 13l3 3 6-6"
          className="stroke-green-600 dark:stroke-orange-400"
          strokeWidth={2}
        />
      </svg>
      <span className="font-medium">{message}</span>
    </div>
  );
}
