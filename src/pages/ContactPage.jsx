import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'

const WHATSAPP = '22507984705170'

export default function ContactPage() {
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const msg = encodeURIComponent(`Bonjour TCHAM STORE 👋\n\n*${form.sujet}*\n\n${form.message}\n\nEnvoyé par : ${form.nom} (${form.email})`)
    window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, '_blank')
    setSent(true)
    setForm({ nom: '', email: '', sujet: '', message: '' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-gold-400 mb-2">On est là</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Contactez-nous</h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">Une question sur une commande, un produit ? On vous répond rapidement.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Infos */}
        <div>
          <div className="space-y-6 mb-8">
            {[
              { Icon: MapPin, title: 'Adresse', val: 'Bingerville, Abidjan, Côte d\'Ivoire' },
              { Icon: MessageCircle, title: 'WhatsApp', val: '+225 07 XX XX XX XX', href: `https://wa.me/${WHATSAPP}` },
              { Icon: Mail, title: 'Email', val: 'contact@tchamstore.ci', href: 'mailto:contact@tchamstore.ci' },
              { Icon: Clock, title: 'Horaires', val: 'Lundi – Samedi : 8h – 20h' },
            ].map(({ Icon, title, val, href }) => (
              <div key={title} className="flex gap-4">
                <div className="w-10 h-10 bg-stone-50 rounded-sm flex items-center justify-center flex-none">
                  <Icon size={18} className="text-gold-400" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-0.5">{title}</p>
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-900 hover:text-gold-600 transition-colors">{val}</a>
                  ) : (
                    <p className="text-sm font-medium text-gray-900">{val}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-green-500 text-white px-6 py-4 text-sm font-bold tracking-widest uppercase hover:bg-green-600 transition-colors w-full justify-center sm:w-auto"
          >
            <MessageCircle size={18} />
            Nous écrire sur WhatsApp
          </a>

          {/* FAQ rapide */}
          <div className="mt-10 space-y-4">
            <h3 className="font-display font-bold text-lg text-gray-900 mb-4">Questions fréquentes</h3>
            {[
              { q: 'Livrez-vous partout en Côte d\'Ivoire ?', a: 'Oui ! Abidjan sous 24–48h, reste de la CI sous 3–5 jours ouvrables.' },
              { q: 'Quels modes de paiement acceptez-vous ?', a: 'Wave, Orange Money, MTN MoMo et paiement à la livraison pour Abidjan.' },
              { q: 'Puis-je retourner un article ?', a: 'Oui, sous 7 jours après réception si l\'article est dans son état d\'origine.' },
            ].map(({ q, a }) => (
              <div key={q} className="border-l-2 border-gold-400 pl-4">
                <p className="text-sm font-semibold text-gray-900 mb-1">{q}</p>
                <p className="text-sm text-gray-500">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Formulaire */}
        <div>
          <div className="border border-gray-100 p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Envoyer un message</h2>

            {sent && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 mb-6 rounded">
                ✅ Message redirigé vers WhatsApp. Nous vous répondons rapidement !
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-500 block mb-1.5">Nom *</label>
                  <input required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                    placeholder="Votre nom" />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-500 block mb-1.5">Email *</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                    placeholder="email@exemple.com" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 block mb-1.5">Sujet *</label>
                <input required value={form.sujet} onChange={(e) => setForm({ ...form, sujet: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                  placeholder="Ex: Question sur une commande" />
              </div>
              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 block mb-1.5">Message *</label>
                <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition-colors resize-none"
                  placeholder="Votre message…" />
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white py-4 text-xs font-bold tracking-widest uppercase hover:bg-gold-400 hover:text-gray-900 transition-colors duration-300">
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
