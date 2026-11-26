export default function Loading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-vapt-gray">
      <div className="relative flex items-center justify-center">
        {/* Círculo de fundo */}
        <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center z-10">
          <span className="text-4xl font-extrabold text-vapt-blue">V</span>
        </div>
        {/* Anel animado */}
        <div className="absolute w-28 h-28 border-4 border-vapt-green border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-6 text-vapt-blue font-bold tracking-widest animate-pulse text-sm uppercase">
        A carregar VAPT...
      </p>
    </div>
  );
}