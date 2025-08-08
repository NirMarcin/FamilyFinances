export default function FormWrapper({ title, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent dark:bg-black px-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-lg rounded-xl p-8 border border-orange-200 dark:border-gray-800 transition-colors duration-300">
        <h2 className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-6 text-center">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
//used in LOGIN /