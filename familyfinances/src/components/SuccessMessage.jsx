export default function SuccessMessage({ message }) {
  if (!message) return null;

  return (
    <div className="mt-4 flex items-center justify-center gap-2 bg-green-50 border border-green-200 text-green-800 rounded px-4 py-3 text-center">
      {/* Ikona sukcesu */}
      <svg
        className="h-6 w-6 flex-shrink-0 text-green-500"
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
          className="stroke-green-300"
          stroke="currentColor"
          strokeWidth={1.8}
          fill="#D1FAE5"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 13l3 3 6-6"
          className="stroke-green-600"
          strokeWidth={2}
        />
      </svg>
      <span className="font-medium">{message}</span>
    </div>
  );
}
