"use client";

export default function LoadingSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="h-12 bg-gray-200 rounded w-1/2 mb-8"></div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
          <div className="h-8 bg-gray-200 w-1/3 mb-4"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
