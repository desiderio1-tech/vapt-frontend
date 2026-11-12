import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-vapt-blue text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* COLUNA 1 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-white text-vapt-blue font-extrabold text-xl px-2 py-1 rounded">
              V
            </div>
            <span className="text-xl font-extrabold">VAPT</span>
          </div>
          <p className="text-sm text-blue-200">
            O supermercado de usados mais perto de você. Compre e venda de forma simples, segura e rápida.
          </p>
        </div>

        {/* COLUNA 2 */}
        <div>
          <h4 className="font-bold mb-4">Categorias</h4>
          <ul className="space-y-2 text-sm text-blue-200">
            <li><Link href="/anuncios?categoria=Telemóveis" className="hover:text-white">Telemóveis</Link></li>
            <li><Link href="/anuncios?categoria=Computadores" className="hover:text-white">Computadores</Link></li>
            <li><Link href="/anuncios?categoria=Veículos" className="hover:text-white">Veículos</Link></li>
            <li><Link href="/anuncios?categoria=Móveis" className="hover:text-white">Móveis</Link></li>
          </ul>
        </div>

        {/* COLUNA 3 */}
        <div>
          <h4 className="font-bold mb-4">Ajuda</h4>
          <ul className="space-y-2 text-sm text-blue-200">
            <li><Link href="#" className="hover:text-white">Como vender</Link></li>
            <li><Link href="#" className="hover:text-white">Segurança</Link></li>
            <li><Link href="#" className="hover:text-white">Termos de uso</Link></li>
            <li><Link href="#" className="hover:text-white">Contacto</Link></li>
          </ul>
        </div>

        {/* COLUNA 4 */}
        <div>
          <h4 className="font-bold mb-4">Instala a App</h4>
          <p className="text-sm text-blue-200 mb-4">
            Adiciona o VAPT ao ecrã inicial do teu telemóvel.
          </p>
          <div className="flex gap-2">
            <span className="bg-white/10 px-3 py-2 rounded-lg text-xs">📱 Android</span>
            <span className="bg-white/10 px-3 py-2 rounded-lg text-xs">🍎 iOS</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-sm text-blue-200">
        © 2026 VAPT — Feito em Moçambique 🇲🇿 | Usados hoje, valem amanhã.
      </div>
    </footer>
  );
}