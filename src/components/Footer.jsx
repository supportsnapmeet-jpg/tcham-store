import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'

const WHATSAPP = '22507984705170'

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* Avantages */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '🚚', title: 'Livraison rapide', sub: 'Abidjan sous 24–48h' },
            { icon: '💳', title: 'Paiement mobile', sub: 'Wave · Orange Money · MTN' },
            { icon: '🔄', title: 'Retours faciles', sub: '7 jours pour changer d\'avis' },
            { icon: '✅', title: 'Qualité garantie', sub: 'Sélection rigoureuse' },
          ].map(({ icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="text-xl mt-0.5">{icon}</span>
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="font-display text-2xl font-black tracking-widest text-white">TCHAM.</Link>
          <p className="mt-4 text-sm leading-relaxed text-gray-500">Mode, accessoires & lifestyle. Basé à Abidjan.</p>
          <div className="flex gap-3 mt-5">
            {[
              { href: '#', icon: '📸', label: 'Instagram' },
              { href: '#', icon: '👍', label: 'Facebook' },
              { href: '#', icon: '🎵', label: 'TikTok' },
              { href: `https://wa.me/${WHATSAPP}`, icon: '💬', label: 'WhatsApp' },
            ].map(({ href, icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-sm hover:border-white transition-colors">
                {icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-white text-xs font-bold tracking-widest uppercase mb-4">Boutique</h3>
          <ul className="space-y-3 text-sm">
            {['Nouveautés', 'Homme', 'Femme', 'Chaussures', 'Accessoires', 'Promotions'].map(l => (
              <li key={l}><Link to="/boutique" className="hover:text-white transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white text-xs font-bold tracking-widest uppercase mb-4">Aide</h3>
          <ul className="space-y-3 text-sm">
            {['Comment commander', 'Livraison & délais', 'Retours', 'Contact'].map(l => (
              <li key={l}><Link to="/contact" className="hover:text-white transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white text-xs font-bold tracking-widest uppercase mb-4">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li>📍 Bingerville, Abidjan</li>
            <li><a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">💬 +225 07 98 47 05 17</a></li>
            <li><a href="mailto:contact@tchamstore.ci" className="hover:text-white transition-colors">✉️ contact@tchamstore.ci</a></li>
            <li>🕐 Lun–Sam : 8h – 20h</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} TCHAM STORE.</p>
          <div className="flex gap-2">
            {['WAVE', 'ORANGE MONEY', 'MTN MOMO'].map(m => (
              <span key={m} className="border border-gray-700 px-2 py-1 text-[10px] tracking-widest font-bold">{m}</span>
            ))}
          </div>
          <div className="flex gap-4">
            <Link to="#" className="hover:text-white transition-colors">CGV</Link>
            <Link to="#" className="hover:text-white transition-colors">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
