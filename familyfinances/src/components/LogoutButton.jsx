import { useNavigate } from "react-router-dom"
import { auth } from "../firebase"
import { signOut } from "firebase/auth"

export default function LogoutButton({ variant = "desktop", onClickExtra }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      if (onClickExtra) onClickExtra()
      navigate("/")
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error)
    }
  }

  // Definicja klas dla obu wariantów
  const baseClasses = "text-orange-600 font-semibold hover:text-orange-800"
  const variants = {
    desktop: "hidden md:block px-4 py-2 rounded",
    mobile: "block w-full text-left px-4 py-2 hover:bg-orange-100",
  }

  return (
    <button
      onClick={handleLogout}
      className={`${variants[variant]} ${baseClasses}`}
    >
      Wyloguj się
    </button>
  )
}
