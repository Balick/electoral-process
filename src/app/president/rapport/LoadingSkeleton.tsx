"use client";

export function LoadingSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse border rounded-lg p-4">
          <div className="h-6 bg-gray-200 w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 w-1/2"></div>
            <div className="h-4 bg-gray-200 w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
