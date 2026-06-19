import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { getFeaturedProducts, getFlashSaleProducts } from '../lib/supabase'
import { formatPrice } from '../data/products'

function useCountdown(hoursFromNow = 47) {
  const target = new Date(Date.now() + hoursFromNow * 3600 * 1000)
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 })
  useEffect(() => {
    const tick = () => {
      const diff = target - Date.now()
      if (diff <= 0) return
      setTime({
        d: Math.floor(diff / 86400000),
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

function CountBlock({ value, label }) {
  return (
    <div className="text-center">
      <div className="font-display text-4xl sm:text-5xl font-black text-gray-900">{String(value).padStart(2, '0')}</div>
      <div className="text-[10px] tracking-widest uppercase text-gray-400 mt-1">{label}</div>
    </div>
  )
}

const reviews = [
  { name: 'Fatou K.', loc: 'Cocody, Abidjan', stars: 5, text: 'Qualité impeccable, livraison en 24h. Je recommande vivement TCHAM STORE !' },
  { name: 'Konan A.', loc: 'Plateau, Abidjan', stars: 5, text: 'Commande via Wave, super simple. Les sneakers sont exactement comme sur les photos.' },
  { name: 'Mariam T.', loc: 'Yopougon, Abidjan', stars: 4, text: 'Belle sélection tendance, le service client répond très vite sur WhatsApp.' },
]

const categories = [
  { id: 'homme', label: 'Homme', icon: '👔' },
  { id: 'femme', label: 'Femme', icon: '👗' },
  { id: 'chaussures', label: 'Chaussures', icon: '👟' },
  { id: 'accessoires', label: 'Accessoires', icon: '💍' },
  { id: 'electronique', label: 'Électronique', icon: '📱' },
]

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

export default function HomePage() {
  const countdown = useCountdown(47)
  const [featured, setFeatured] = useState([])
  const [flashSale, setFlashSale] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    Promise.all([getFeaturedProducts(), getFlashSaleProducts()])
      .then(([feat, flash]) => {
        setFeatured(feat.slice(0, 6))
        setFlashSale(flash.slice(0, 4))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.includes('@')) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative min-h-[100svh] sm:min-h-[90vh] flex items-center bg-white overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-stone-50 hidden md:block" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold-100 rounded-full -translate-x-1/2 translate-y-1/2 opacity-60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full py-12 md:py-0">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] uppercase text-gold-400 mb-6">Nouvelle Collection — 2025</p>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] text-gray-900 mb-6">
                STYLE<br /><span className="text-gold-400">SANS</span><br />LIMITE.
              </h1>
              <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-sm">
                Mode, accessoires et lifestyle pour ceux qui osent s'affirmer. Livraison rapide à Abidjan.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/boutique" className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white text-xs font-bold tracking-widest uppercase px-8 py-4 hover:bg-gold-400 hover:text-gray-900 transition-colors duration-300">
                  Découvrir la boutique <ArrowRight size={16} />
                </Link>
                <Link to="/boutique" className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 text-xs font-bold tracking-widest uppercase px-8 py-4 hover:border-gray-900 transition-colors duration-300">
                  Ventes flash →
                </Link>
              </div>
              <div className="flex gap-8 mt-12 pt-8 border-t border-gray-100">
                {[['500+', 'Produits'], ['4.9★', 'Satisfaction'], ['24h', 'Livraison']].map(([val, lbl]) => (
                  <div key={lbl}>
                    <div className="font-display text-2xl font-black text-gray-900">{val}</div>
                    <div className="text-xs text-gray-400 tracking-widest uppercase mt-0.5">{lbl}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="aspect-[4/5] bg-stone-100 flex items-center justify-center text-8xl overflow-hidden">
                {/* Remplace ce div par : <img src="/hero.jpg" className="w-full h-full object-cover" /> */}
                🛍️
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white border border-gray-100 px-5 py-4 shadow-lg">
                <p className="text-xs text-gray-400 uppercase tracking-widest">Livraison gratuite</p>
                <p className="font-display font-bold text-gray-900 text-sm">Dès 25 000 FCFA</p>
              </div>
              <div className="absolute -top-4 -right-4 bg-gold-400 text-white px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-widest">Promo</p>
                <p className="font-display font-black text-xl">–50%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="bg-gray-900 overflow-hidden py-3 select-none">
        <div className="flex whitespace-nowrap animate-ticker">
          {Array(4).fill(['MODE HOMME', 'MODE FEMME', 'ACCESSOIRES', 'LIVRAISON ABIDJAN', 'WAVE & ORANGE MONEY', 'NOUVEAUTÉS CHAQUE SEMAINE']).flat().map((t, i) => (
            <span key={i} className="text-white text-[11px] font-bold tracking-[0.3em] uppercase px-10">✦ {t}</span>
          ))}
        </div>
      </div>

      {/* ── AVANTAGES ── */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '🚚', title: 'Livraison rapide', sub: 'Abidjan sous 24–48h' },
            { icon: '💳', title: 'Paiement mobile', sub: 'Wave · Orange Money · MTN' },
            { icon: '🔄', title: 'Retours faciles', sub: '7 jours pour changer d\'avis' },
            { icon: '✅', title: 'Qualité garantie', sub: 'Sélection rigoureuse' },
          ].map(({ icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">{icon}</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATÉGORIES ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-8">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-gold-400 mb-1">Explorer</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">Nos Univers</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide md:grid md:grid-cols-5 md:overflow-visible md:pb-0">
          {categories.map((cat) => (
            <Link key={cat.id} to={`/boutique?cat=${cat.id}`} className="flex-none w-36 md:w-auto group">
              <div className="aspect-square bg-stone-50 rounded-sm flex items-center justify-center text-4xl group-hover:bg-gold-50 transition-colors duration-300">
                {cat.icon}
              </div>
              <p className="text-xs font-bold tracking-widest uppercase text-gray-700 text-center mt-3 group-hover:text-gold-600 transition-colors">
                {cat.label}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FLASH SALE ── */}
      <section className="bg-gray-950 py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] uppercase text-gold-400 mb-1">⚡ Offre limitée</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">Vente Flash</h2>
            </div>
            <div className="flex items-center gap-4">
              <CountBlock value={countdown.d} label="Jours" />
              <span className="font-display text-3xl text-gold-400 font-black mb-4">:</span>
              <CountBlock value={countdown.h} label="Heures" />
              <span className="font-display text-3xl text-gold-400 font-black mb-4">:</span>
              <CountBlock value={countdown.m} label="Min" />
              <span className="font-display text-3xl text-gold-400 font-black mb-4">:</span>
              <CountBlock value={countdown.s} label="Sec" />
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {loading
              ? Array(4).fill(0).map((_, i) => <ProductSkeleton key={i} />)
              : flashSale.length > 0
                ? flashSale.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
                : <p className="col-span-4 text-center text-gray-500 py-12">Aucune vente flash en cours.</p>
            }
          </div>
          <div className="text-center mt-10">
            <Link to="/boutique" className="inline-flex items-center gap-2 border border-gold-400 text-gold-400 text-xs font-bold tracking-widest uppercase px-8 py-3 hover:bg-gold-400 hover:text-gray-900 transition-colors duration-300">
              Voir toutes les promos <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-gold-400 mb-1">Cette semaine</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">Nos Coups de Cœur</h2>
          </div>
          <Link to="/boutique" className="hidden sm:flex items-center gap-1 text-xs font-bold tracking-widest uppercase text-gray-500 hover:text-gold-600 transition-colors">
            Tout voir <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {loading
            ? Array(6).fill(0).map((_, i) => <ProductSkeleton key={i} />)
            : featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
          }
        </div>
        <div className="text-center mt-10 sm:hidden">
          <Link to="/boutique" className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 text-xs font-bold tracking-widest uppercase px-8 py-3">
            Voir tout <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── BANNER ── */}
      <section className="bg-stone-50 py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-gold-400 mb-3">Exclusivité</p>
          <h2 className="font-display text-3xl sm:text-5xl font-black text-gray-900 mb-4 leading-tight">
            Achète 1, Obtiens 1 <span className="text-gold-400">Gratuit</span>
          </h2>
          <p className="text-gray-500 text-base mb-8 max-w-md mx-auto">Sur une sélection d'articles. Valable jusqu'à épuisement des stocks.</p>
          <Link to="/boutique" className="inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-bold tracking-widest uppercase px-10 py-4 hover:bg-gold-400 hover:text-gray-900 transition-colors duration-300">
            Profiter de l'offre <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── AVIS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-gold-400 mb-1">Témoignages</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">Ce qu'ils disent</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map(({ name, loc, stars, text }) => (
            <div key={name} className="border border-gray-100 p-6">
              <div className="text-gold-400 text-sm mb-3">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</div>
              <p className="text-gray-600 text-sm leading-relaxed italic mb-4">"{text}"</p>
              <div>
                <p className="font-semibold text-sm text-gray-900">{name}</p>
                <p className="text-xs text-gray-400">{loc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="bg-gray-900 py-16 px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-gold-400 mb-3">Newsletter</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">Restez dans la Tendance</h2>
          <p className="text-gray-400 text-sm mb-8">Inscrivez-vous et obtenez <span className="text-gold-400 font-bold">–10%</span> sur votre première commande.</p>
          {subscribed ? (
            <p className="text-green-400 font-semibold">✅ Merci ! Votre code –10% a été envoyé.</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Votre adresse email…"
                className="flex-1 bg-gray-800 text-white placeholder-gray-500 px-4 py-3 text-sm border border-gray-700 focus:outline-none focus:border-gold-400" required />
              <button type="submit" className="bg-gold-400 text-gray-900 text-xs font-bold tracking-widest uppercase px-6 py-3 hover:bg-gold-200 transition-colors whitespace-nowrap">
                S'inscrire
              </button>
            </form>
          )}
          <p className="text-gray-600 text-xs mt-4">Pas de spam. Désinscription à tout moment.</p>
        </div>
      </section>
    </div>
  )
}
