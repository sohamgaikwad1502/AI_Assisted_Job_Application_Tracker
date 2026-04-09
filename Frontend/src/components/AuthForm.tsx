import { FormEvent, useState } from "react";

type Props = {
  mode: "login" | "register";
  onModeChange: (mode: "login" | "register") => void;
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string) => void;
  loading: boolean;
  error: string;
};

const AuthForm = ({
  mode,
  onModeChange,
  onLogin,
  onRegister,
  loading,
  error
}: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mode === "login") {
      onLogin(email, password);
    } else {
      onRegister(email, password);
    }
  };

  return (
    <div className="w-full max-w-sm bg-[#151a21] p-4 silly-shadow">
      <div className="flex gap-2 mb-3">
        <button
          className={`px-2 py-1 ${
            mode === "login"
              ? "bg-[#2563eb] text-white"
              : "bg-[#0f172a] text-[#cbd5e1]"
          }`}
          onClick={() => onModeChange("login")}
        >
          login
        </button>
        <button
          className={`px-2 py-1 ${
            mode === "register"
              ? "bg-[#2563eb] text-white"
              : "bg-[#0f172a] text-[#cbd5e1]"
          }`}
          onClick={() => onModeChange("register")}
        >
          register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          className="w-full border p-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border p-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-[#1d4ed8] text-white py-2"
          type="submit"
          disabled={loading}
        >
          {loading ? "wait..." : mode}
        </button>
      </form>

      {error && <div className="text-sm mt-2 text-red-400">{error}</div>}
    </div>
  );
};

export default AuthForm;
