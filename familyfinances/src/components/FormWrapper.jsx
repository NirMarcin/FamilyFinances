export default function FormWrapper({ title, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">
          {title}
        </h2>
        {children}
      </div>
    </div>
  )
}
