export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent">
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-2">
          <div
            className="w-3 h-3 bg-gray-800 rounded-full animate-bounce"
            style={{ animationDelay: "0ms", animationDuration: "1s" }}
          ></div>
          <div
            className="w-3 h-3 bg-gray-700 rounded-full animate-bounce"
            style={{ animationDelay: "150ms", animationDuration: "1s" }}
          ></div>
          <div
            className="w-3 h-3 bg-gray-600 rounded-full animate-bounce"
            style={{ animationDelay: "300ms", animationDuration: "1s" }}
          ></div>
        </div>
        <p className="text-sm font-medium text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
