"use client";

export default function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="p-4 bg-red-50 text-red-700 rounded">
      <h2 className="font-bold">Erreur de chargement</h2>
      <p>{error.message}</p>
    </div>
  );
}
