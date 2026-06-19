import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Minus, Plus, ShoppingBag, MessageCircle, ArrowLeft } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../data/products'

const WHATSAPP = '22507984705170'

export default function CartPage() {
  const { items, total, removeItem, updateQty, clearCart, buildWhatsAppMessage } = useCart()
  const [checkout, setCheckout] = useState(false)
  const [form, setForm] = useState({ nom: '', tel: '', adresse: '', mode: 'wave' })
  const [submitted, setSubmitted] = useState(false)

  const livraison = total >= 25000 ? 0 : 2000
  const totalFinal = total + livraison

  const handleWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP}?text=${buildWhatsAppMessage()}`
    window.open(url, '_blank')
  }

  const handleOrder = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">Commande envoyée !</h1>
        <p className="text-gray-500 mb-2 text-sm">
          Merci <strong>{form.nom}</strong> ! Nous vous contactons au <strong>{form.tel}</strong> pour confirmer votre commande et le paiement.
        </p>
        <p className="text-xs text-gray-400 mb-8">Un récapitulatif vous sera envoyé par WhatsApp.</p>
        <Link to="/" onClick={clearCart} className="inline-block bg-gray-900 text-white text-xs font-bold tracking-widest uppercase px-8 py-4 hover:bg-gold-400 hover:text-gray-900 transition-colors">
          Retour à l'accueil
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-3">Votre panier est vide</h1>
        <p className="text-gray-400 text-sm mb-8">Ajoutez des produits pour passer votre commande.</p>
        <Link to="/boutique" className="inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-bold tracking-widest uppercase px-8 py-4 hover:bg-gold-400 hover:text-gray-900 transition-colors">
          <ShoppingBag size={16} /> Voir la boutique
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <Link to="/boutique" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 mb-4 transition-colors">
          <ArrowLeft size={14} /> Continuer mes achats
        </Link>
        <h1 className="font-display text-3xl font-bold text-gray-900">Mon Panier</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-4 border border-gray-100 p-4">
              <div className="w-20 h-24 bg-stone-50 flex-none flex items-center justify-center text-3xl overflow-hidden">
                {item.images?.[0] ? (
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                ) : '🛍️'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug">{item.name}</h3>
                    {(item.size || item.color) && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.size && `Taille: ${item.size}`}{item.size && item.color && ' · '}{item.color && `Couleur: ${item.color}`}
                      </p>
                    )}
                  </div>
                  <button onClick={() => removeItem(idx)} className="text-gray-300 hover:text-red-400 transition-colors flex-none">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200">
                    <button onClick={() => updateQty(idx, item.qty - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                    <button onClick={() => updateQty(idx, item.qty + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="font-bold text-gray-900">{formatPrice(item.price * item.qty)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary + Checkout */}
        <div>
          {/* Résumé */}
          <div className="border border-gray-100 p-6 mb-4">
            <h2 className="font-display text-lg font-bold text-gray-900 mb-5">Résumé</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span className="font-semibold text-gray-900">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span className={livraison === 0 ? 'text-green-600 font-semibold' : 'font-semibold text-gray-900'}>
                  {livraison === 0 ? 'Gratuite 🎉' : formatPrice(livraison)}
                </span>
              </div>
              {livraison > 0 && (
                <p className="text-xs text-gray-400">Livraison gratuite dès 25 000 FCFA</p>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span className="font-display text-xl">{formatPrice(totalFinal)}</span>
              </div>
            </div>
          </div>

          {/* CTA WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-4 text-sm font-bold tracking-widest uppercase mb-3 hover:bg-green-600 transition-colors"
          >
            <MessageCircle size={18} />
            Commander via WhatsApp
          </button>

          {/* CTA Formulaire */}
          {!checkout ? (
            <button
              onClick={() => setCheckout(true)}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 text-sm font-bold tracking-widest uppercase hover:bg-gold-400 hover:text-gray-900 transition-colors"
            >
              Payer par Wave / Orange Money
            </button>
          ) : (
            <form onSubmit={handleOrder} className="border border-gray-100 p-5 space-y-4 mt-4">
              <h3 className="font-display font-bold text-gray-900 text-base mb-1">Vos informations</h3>
              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 block mb-1">Nom complet *</label>
                <input required className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Ex : Konan Aya" />
              </div>
              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 block mb-1">Téléphone * (WhatsApp)</label>
                <input required className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400" value={form.tel} onChange={(e) => setForm({ ...form, tel: e.target.value })} placeholder="+225 07 XX XX XX XX" />
              </div>
              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 block mb-1">Adresse de livraison *</label>
                <input required className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400" value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} placeholder="Quartier, commune, repère…" />
              </div>
              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 block mb-2">Mode de paiement *</label>
                <div className="flex gap-2 flex-wrap">
                  {['wave', 'orange', 'mtn'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setForm({ ...form, mode })}
                      className={`px-4 py-2 text-xs font-bold border transition-colors ${
                        form.mode === mode ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {mode === 'wave' ? 'Wave' : mode === 'orange' ? 'Orange Money' : 'MTN MoMo'}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full bg-gold-400 text-gray-900 py-3.5 text-xs font-black tracking-widest uppercase hover:bg-gold-200 transition-colors">
                Confirmer la commande → {formatPrice(totalFinal)}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
