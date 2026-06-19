import { Link } from 'react-router-dom'
import { Share2, MessageCircle, Globe, Play } from 'lucide-react'

const WHATSAPP = '22507984705170'

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">

        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="font-display text-2xl font-black tracking-widest text-white">
            TCHAM<span className="text-gold-400">.</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-gray-500">
            Mode, accessoires & lifestyle pour l'Afrique qui ose. Basé à Abidjan.
          </p>
          <div className="flex gap-3 mt-5">
            {[
              { label: 'Instagram', href: '#', icon: '📸' },
              { label: 'Facebook', href: '#', icon: '👍' },
              { label: 'TikTok', href: '#', icon: '🎵' },
              { label: 'WhatsApp', href: `https://wa.me/${WHATSAPP}`, icon: '💬' },
            ].map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-sm hover:border-gold-400 transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-white text-xs font-bold tracking-widest uppercase mb-4">Boutique</h3>
          <ul className="space-y-3 text-sm">
            {['Nouveautés', 'Mode Homme', 'Mode Femme', 'Chaussures', 'Accessoires', 'Promotions'].map((l) => (
              <li key={l}><Link to="/boutique" className="hover:text-gold-400 transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white text-xs font-bold tracking-widest uppercase mb-4">Aide</h3>
          <ul className="space-y-3 text-sm">
            {['Comment commander', 'Livraison & délais', 'Retours & échanges', 'FAQ', 'Contact'].map((l) => (
              <li key={l}><Link to="/contact" className="hover:text-gold-400 transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white text-xs font-bold tracking-widest uppercase mb-4">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li>📍 Bingerville, Abidjan</li>
            <li><a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors">💬 WhatsApp</a></li>
            <li><a href="mailto:contact@tchamstore.ci" className="hover:text-gold-400 transition-colors">✉️ contact@tchamstore.ci</a></li>
            <li>🕐 Lun–Sam : 8h – 20h</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} TCHAM STORE. Tous droits réservés.</p>
          <div className="flex gap-2 flex-wrap justify-center">
            {['WAVE', 'ORANGE MONEY', 'MTN MOMO'].map((m) => (
              <span key={m} className="border border-gray-700 px-3 py-1 rounded text-[10px] tracking-widest font-bold text-gray-500">{m}</span>
            ))}
          </div>
          <div className="flex gap-4">
            <Link to="#" className="hover:text-gold-400 transition-colors">CGV</Link>
            <Link to="#" className="hover:text-gold-400 transition-colors">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
