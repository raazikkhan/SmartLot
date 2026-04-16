// src/pages/Login.jsx
import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (_err) {
      setError("Invalid email or password");
    }
  }

  return (
    <div className="min-h-screen w-screen  flex  items-center justify-center text-black bg-zinc-200">
      <div className=" bg-zinc-100 rounded-3xl shadow-xl  min-h-[500px] w-[500px] flex   justify-center  ">
        <div className="flex flex-col text-center p-10 gap-4">
          <h1 className="text-3xl text-blue-600 font-bold">SmartLot</h1>
          <p className="text-lg text-zinc-500">Enter your Admin Access</p>
          <div>
            <form
              onSubmit={handleLogin}
              className="flex flex-col p-12 gap-10 w-sm "
            >
              <input
                className="p-2"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="p-2"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p style={{ color: "red" }}>{error}</p>}
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 p-3 rounded-xl text-xl text-[#fff]"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
