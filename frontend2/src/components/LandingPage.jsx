// LandingPage.jsx
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
         style={{ backgroundImage: "url('/your-background-image.png')" }} // replace with actual image
    >

      <div className="relative z-10 text-white text-center px-6 py-12 rounded-xl shadow-lg bg-white/10 border border-white/30 backdrop-blur-lg max-w-xl">
        <h1 className="text-4xl font-bold mb-4">Welcome to ChatApp</h1>
        <p className="text-lg mb-6">
          Connect instantly with friends. Secure, real-time messaging at your fingertips.
        </p>

        <div className="flex justify-center gap-4">
          <Link to="/login">
            <button className="bg-black text-white px-6 py-2 rounded hover:bg-white hover:text-black transition">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="bg-white text-black px-6 py-2 rounded hover:bg-black hover:text-white transition">
              Signup
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
