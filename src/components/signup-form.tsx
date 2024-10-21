"use client";

// import { signUpWithEmail } from "@/lib/actions";
import { useState } from "react";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  return (
    <form
      //action={signUpWithEmail}
      className="flex flex-col w-full items-center space-y-2"
    >
      <input
        id="name"
        name="name"
        placeholder="Nom de l'utilisateur"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-nonce bg-slate-50 border text-lg px-4 py-2 rounded-lg hover:ring-4 focus:ring-4 focus:outline-none ring-cblue-light/20 transition-all duration-300 w-full max-w-[30rem]"
      />
      <input
        id="email"
        name="email"
        placeholder="Email"
        type="email"
        value={email}
        className="flex-nonce bg-slate-50 border text-lg px-4 py-2 rounded-lg hover:ring-4 focus:ring-4 focus:outline-none ring-cblue-light/20 transition-all duration-300 w-full max-w-[30rem]"
      />
      <input
        id="password"
        name="password"
        placeholder="Mot de passe"
        type="password"
        value={password}
        className="flex-nonce bg-slate-50 border text-lg px-4 py-2 rounded-lg hover:ring-4 focus:ring-4 focus:outline-none ring-cblue-light/20 transition-all duration-300 w-full max-w-[30rem]"
      />
      <input
        id="password"
        name="password"
        placeholder="Confirmer le mot de passe"
        type="password"
        value={confirmPassword}
        className="flex-nonce bg-slate-50 border text-lg px-4 py-2 rounded-lg hover:ring-4 focus:ring-4 focus:outline-none ring-cblue-light/20 transition-all duration-300 w-full max-w-[30rem]"
      />

      <button
        type="submit"
        className="bg-cblue-light hover:bg-cblue text-white uppercase px-8 py-2 text-lg font-semibold rounded-lg transition-all duration-300 w-full max-w-[30rem]"
      >
        Ajouter l&apos;utilisateur
      </button>
    </form>
  );
}
