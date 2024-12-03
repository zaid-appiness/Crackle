export default function ErrorWithRetry({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <p className="text-xl text-gray-400">{message}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 
        transition-colors duration-200"
      >
        Try Again
      </button>
    </div>
  );
}
