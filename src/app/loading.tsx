export default function Loading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="relative">
        {/* Círculo exterior */}
        <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
        {/* Círculo animado */}
        <div className="w-20 h-20 border-4 border-vapt-blue border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        {/* Letra no meio */}
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <span className="text-2xl font-extrabold text-vapt-blue">V</span>
        </div>
      </div>
      <p className="text-vapt-blue font-bold mt-6 animate-pulse">A carregar o VAPT...</p>
    </div>
  );
}