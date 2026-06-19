import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { getProducts, getFeaturedProducts, getFlashSaleProducts } from '../lib/supabase'
import { formatPrice } from '../data/products'
import { useCart } from '../context/CartContext'

const EMOJIS = { homme:'👔', femme:'👗', chaussures:'👟', accessoires:'💍', electronique:'📱' }

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-gray-100 mb-3" />
      <div className="h-3 bg-gray-100 rounded w-1/3 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-1/2" />
    </div>
  )
}

// Spotlight — un produit en plein écran
function Spotlight({ product, onClose }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  if (!product) return null

  const emoji = EMOJIS[product.category] || '🛍️'
  const discount = product.old_price ? Math.round((1 - product.price / product.old_price) * 100) : null

  const handleAdd = () => {
    addToCart(product, product.sizes?.[0] || 'Taille unique', product.colors?.[0] || '')
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col md:flex-row" onClick={onClose}>
      {/* Image */}
      <div className="flex-1 relative overflow-hidden" onClick={e => e.stopPropagation()}>
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[120px] bg-gray-950">
            {emoji}
          </div>
        )}
        {/* Fermer */}
        <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur text-white flex items-center justify-center text-xl hover:bg-white/20 transition-colors">
          ✕
        </button>
      </div>

      {/* Info */}
      <div className="md:w-80 bg-white flex flex-col justify-center p-8" onClick={e => e.stopPropagation()}>
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-gray-400 mb-3">{product.category}</p>
        <h2 className="font-display text-2xl font-black text-gray-900 mb-4 leading-tight">{product.name}</h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">{product.description}</p>

        <div className="flex items-center gap-3 mb-8">
          <span className="font-display text-3xl font-black text-gray-900">{formatPrice(product.price)}</span>
          {product.old_price && (
            <>
              <span className="text-gray-400 line-through text-sm">{formatPrice(product.old_price)}</span>
              <span className="bg-gray-900 text-white text-xs font-bold px-2 py-0.5">-{discount}%</span>
            </>
          )}
        </div>

        <button onClick={handleAdd}
          className={`w-full flex items-center justify-center gap-2 py-4 text-sm font-bold tracking-widest uppercase transition-colors mb-3 ${
            added ? 'bg-green-600 text-white' : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}>
          <ShoppingBag size={16} />
          {added ? 'Ajouté ✓' : 'Ajouter au panier'}
        </button>

        <Link to={`/produit/${product.id}`} onClick={onClose}
          className="w-full flex items-center justify-center gap-2 py-4 text-sm font-bold tracking-widest uppercase border border-gray-200 text-gray-700 hover:border-gray-900 transition-colors">
          Voir le produit <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}

// Countdown
function useCountdown(hours = 23) {
  const target = useRef(new Date(Date.now() + hours * 3600 * 1000))
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 })
  useEffect(() => {
    const tick = () => {
      const diff = target.current - Date.now()
      if (diff <= 0) return
      setTime({
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

const reviews = [
  { name: 'Fatou K.', loc: 'Cocody', stars: 5, text: 'Qualité impeccable, livraison en 24h !' },
  { name: 'Konan A.', loc: 'Plateau', stars: 5, text: 'Commande via Wave, super rapide.' },
  { name: 'Mariam T.', loc: 'Yopougon', stars: 4, text: 'Belle sélection, service client au top.' },
]

export default function HomePage() {
  const [allProducts, setAllProducts] = useState([])
  const [featured, setFeatured] = useState([])
  const [flashSale, setFlashSale] = useState([])
  const [loading, setLoading] = useState(true)
  const [spotlight, setSpotlight] = useState(null)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const countdown = useCountdown(23)

  useEffect(() => {
    Promise.all([getProducts(), getFeaturedProducts(), getFlashSaleProducts()])
      .then(([all, feat, flash]) => {
        setAllProducts(all)
        setFeatured(feat.slice(0, 4))
        setFlashSale(flash.slice(0, 4))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Auto spotlight — affiche un produit featured toutes les 30s
  useEffect(() => {
    if (featured.length === 0) return
    const id = setInterval(() => {
      const random = featured[Math.floor(Math.random() * featured.length)]
      setSpotlight(random)
    }, 30000)
    return () => clearInterval(id)
  }, [featured])

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.includes('@')) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <div>
      {/* SPOTLIGHT */}
      {spotlight && <Spotlight product={spotlight} onClose={() => setSpotlight(null)} />}

      {/* ── HERO ── */}
      <section className="relative bg-gray-950 text-white overflow-hidden" style={{ minHeight: '70vh' }}>
        {/* Background — première image d'un produit featured */}
        {featured[0]?.images?.[0] && (
          <img
            src={featured[0].images[0]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-center h-full py-20 md:py-32">
          <p className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-4">Nouvelle Collection</p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl font-black leading-none mb-6">
            STYLE<br />SANS<br />LIMITE.
          </h1>
          <p className="text-gray-400 text-base max-w-sm mb-8 leading-relaxed">
            Mode & accessoires livrés à Abidjan sous 24h.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/boutique" className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 text-xs font-black tracking-widest uppercase px-8 py-4 hover:bg-gray-100 transition-colors">
              Voir la boutique <ArrowRight size={16} />
            </Link>
            {featured[0] && (
              <button onClick={() => setSpotlight(featured[0])}
                className="inline-flex items-center justify-center gap-2 border border-white/30 text-white text-xs font-bold tracking-widest uppercase px-8 py-4 hover:border-white transition-colors">
                Coup de cœur du moment
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="bg-gray-900 overflow-hidden py-3 select-none">
        <div className="flex whitespace-nowrap animate-ticker">
          {Array(6).fill(['LIVRAISON ABIDJAN 24H', 'WAVE & ORANGE MONEY', 'NOUVEAUTÉS', 'MODE HOMME & FEMME', 'QUALITÉ GARANTIE']).flat().map((t, i) => (
            <span key={i} className="text-white text-[11px] font-bold tracking-[0.3em] uppercase px-8">✦ {t}</span>
          ))}
        </div>
      </div>

      {/* ── FLASH SALE ── */}
      {flashSale.length > 0 && (
        <section className="bg-gray-950 py-12 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-bold tracking-[0.3em] uppercase text-gray-500 mb-1">⚡ Offre limitée</p>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-white">Vente Flash</h2>
              </div>
              {/* Countdown */}
              <div className="flex items-center gap-3 text-white">
                {[
                  [String(countdown.h).padStart(2,'0'), 'H'],
                  [String(countdown.m).padStart(2,'0'), 'M'],
                  [String(countdown.s).padStart(2,'0'), 'S'],
                ].map(([val, lbl], i) => (
                  <div key={lbl} className="flex items-center gap-3">
                    {i > 0 && <span className="text-gray-600 font-black text-xl">:</span>}
                    <div className="text-center">
                      <div className="font-display text-3xl font-black">{val}</div>
                      <div className="text-[10px] tracking-widest text-gray-500">{lbl}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {loading ? Array(4).fill(0).map((_,i) => <ProductSkeleton key={i} />)
                : flashSale.map((p, i) => (
                  <div key={p.id} onClick={() => setSpotlight(p)} className="cursor-pointer">
                    <ProductCard product={p} index={i} />
                  </div>
                ))
              }
            </div>
          </div>
        </section>
      )}

      {/* ── TOUS LES PRODUITS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-gray-400 mb-1">Disponibles maintenant</p>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-gray-900">Nos Articles</h2>
          </div>
          <Link to="/boutique" className="text-xs font-bold tracking-widest uppercase text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1">
            Tout voir <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {loading
            ? Array(8).fill(0).map((_,i) => <ProductSkeleton key={i} />)
            : allProducts.slice(0, 8).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))
          }
        </div>

        {allProducts.length > 8 && (
          <div className="text-center mt-10">
            <Link to="/boutique" className="inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-bold tracking-widest uppercase px-8 py-4 hover:bg-gray-800 transition-colors">
              Voir tous les articles ({allProducts.length}) <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>

      {/* ── BANNER PROMO ── */}
      <section className="bg-gray-900 py-14 px-4 sm:px-6 text-center text-white">
        <p className="text-xs font-bold tracking-[0.4em] uppercase text-gray-500 mb-3">Offre spéciale</p>
        <h2 className="font-display text-3xl sm:text-5xl font-black mb-4 leading-tight">
          Achète 1,<br />Obtiens 1 Gratuit
        </h2>
        <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto">Sur une sélection d'articles. Jusqu'à épuisement des stocks.</p>
        <Link to="/boutique" className="inline-flex items-center gap-2 bg-white text-gray-900 text-xs font-black tracking-widest uppercase px-8 py-4 hover:bg-gray-100 transition-colors">
          En profiter <ArrowRight size={16} />
        </Link>
      </section>

      {/* ── AVIS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-gray-400 mb-1">Témoignages</p>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-gray-900">Ce qu'ils disent</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {reviews.map(({ name, loc, stars, text }) => (
            <div key={name} className="border border-gray-100 p-6">
              <div className="text-gray-900 text-sm mb-3">{'★'.repeat(stars)}{'☆'.repeat(5-stars)}</div>
              <p className="text-gray-600 text-sm leading-relaxed italic mb-4">"{text}"</p>
              <div>
                <p className="font-semibold text-sm text-gray-900">{name}</p>
                <p className="text-xs text-gray-400">{loc}, Abidjan</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="bg-gray-950 py-14 px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-gray-500 mb-3">Newsletter</p>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white mb-3">–10% sur votre 1ère commande</h2>
          <p className="text-gray-500 text-sm mb-6">Inscrivez-vous et recevez votre code promo.</p>
          {subscribed ? (
            <p className="text-green-400 font-semibold">✅ Merci ! Votre code vous a été envoyé.</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Votre email…" required
                className="flex-1 bg-gray-900 text-white placeholder-gray-600 px-4 py-3 text-sm border border-gray-800 focus:outline-none focus:border-gray-500" />
              <button type="submit" className="bg-white text-gray-900 text-xs font-black tracking-widest uppercase px-6 py-3 hover:bg-gray-100 transition-colors whitespace-nowrap">
                S'inscrire
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
