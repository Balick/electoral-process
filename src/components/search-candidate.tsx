"use client";

import { useSearchCandidate } from "@/context/search-candidate-provider";

export default function SearchCandidate() {
  const { term, updateTerm } = useSearchCandidate();

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
      <label className="font-semibold text-pink-700 text-lg text-nowrap">
        Composez le numéro de votre candidat :
      </label>
      <input
        type="text"
        value={term}
        onChange={(e) => updateTerm(e.target.value)}
        className="w-full border-2 border-pink-700 h-10 px-4 text-center font-semibold text-lg"
      />
    </div>
  );
}
