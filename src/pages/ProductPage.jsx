import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingBag, MessageCircle, Heart, ChevronRight, Play, Image } from 'lucide-react'
import { getProductById, getProducts } from '../lib/supabase'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../data/products'
import ProductCard from '../components/ProductCard'

const EMOJIS = { homme:'👔', femme:'👗', chaussures:'👟', accessoires:'💍', electronique:'📱' }
const WHATSAPP = '22507984705170'

export default function ProductPage() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [added, setAdded] = useState(false)
  const [liked, setLiked] = useState(false)
  const [activeMedia, setActiveMedia] = useState(0)

  // Combine images + videos into one media array
  const mediaItems = product ? [
    ...(product.images || []).map(url => ({ url, type: 'image' })),
    ...(product.videos || []).map(url => ({ url, type: 'video' })),
  ] : []

  useEffect(() => {
    setLoading(true)
    setActiveMedia(0)
    getProductById(id)
      .then(async (p) => {
        setProduct(p)
        setSelectedSize(p.sizes?.[0] || '')
        setSelectedColor(p.colors?.[0] || '')
        const all = await getProducts()
        setRelated(all.filter(x => x.category === p.category && x.id !== id).slice(0, 4))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 animate-pulse">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-100" />
        <div className="space-y-4">
          <div className="h-4 bg-gray-100 rounded w-1/4" />
          <div className="h-8 bg-gray-100 rounded w-3/4" />
          <div className="h-8 bg-gray-100 rounded w-1/3" />
          <div className="h-20 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  )

  if (!product) return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <p className="text-6xl mb-4">🔍</p>
      <p className="text-gray-500 mb-6">Produit introuvable.</p>
      <Link to="/boutique" className="text-gold-600 font-semibold underline">Retour à la boutique</Link>
    </div>
  )

  const discount = product.old_price ? Math.round((1 - product.price / product.old_price) * 100) : null
  const emoji = EMOJIS[product.category] || '🛍️'
  const currentMedia = mediaItems[activeMedia]

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Bonjour TCHAM STORE 👋\n\nJe suis intéressé(e) par :\n\n*${product.name}*\nTaille : ${selectedSize}\nCouleur : ${selectedColor}\nPrix : ${formatPrice(product.price)}\n\nMerci de confirmer la disponibilité.`
    )
    window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, '_blank')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-6 flex-wrap">
        <Link to="/" className="hover:text-gray-700 transition-colors">Accueil</Link>
        <ChevronRight size={12} />
        <Link to="/boutique" className="hover:text-gray-700 transition-colors">Boutique</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium line-clamp-1">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-14">
        {/* Médias */}
        <div>
          {/* Média principal */}
          <div className="relative aspect-square bg-stone-50 overflow-hidden mb-3">
            {mediaItems.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-9xl">{emoji}</div>
            ) : currentMedia.type === 'video' ? (
              <video
                key={currentMedia.url}
                src={currentMedia.url}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={currentMedia.url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            )}

            {product.badge && (
              <span className="absolute top-4 left-4 bg-gray-900 text-white text-xs font-bold tracking-widest px-3 py-1.5">
                {product.badge}
              </span>
            )}
            <button
              onClick={() => setLiked(!liked)}
              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow"
            >
              <Heart size={18} className={liked ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
            </button>
          </div>

          {/* Thumbnails */}
          {mediaItems.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {mediaItems.map((media, i) => (
                <button
                  key={i}
                  onClick={() => setActiveMedia(i)}
                  className={`relative flex-none w-16 h-16 border-2 overflow-hidden transition-colors ${
                    activeMedia === i ? 'border-gray-900' : 'border-transparent bg-gray-100'
                  }`}
                >
                  {media.type === 'video' ? (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Play size={16} className="text-gray-500" fill="currentColor" />
                    </div>
                  ) : (
                    <img src={media.url} alt="" className="w-full h-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info produit */}
        <div className="flex flex-col">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-gold-400 mb-2">{product.category}</p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>

          {/* Prix */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="font-display text-3xl font-black text-gray-900">{formatPrice(product.price)}</span>
            {product.old_price && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.old_price)}</span>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5">–{discount}%</span>
              </>
            )}
          </div>

          <p className="text-sm text-gray-500 leading-relaxed mb-6">{product.description}</p>

          {/* Couleur */}
          {product.colors?.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-bold tracking-widest uppercase text-gray-700 mb-3">
                Couleur : <span className="text-gold-600 normal-case font-semibold">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(c => (
                  <button key={c} onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                      selectedColor === c ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Taille */}
          {product.sizes?.length > 0 && product.sizes[0] !== 'Taille unique' && (
            <div className="mb-6">
              <p className="text-xs font-bold tracking-widest uppercase text-gray-700 mb-3">
                Taille : <span className="text-gold-600 normal-case font-semibold">{selectedSize}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className={`w-12 h-10 text-xs font-bold border transition-colors ${
                      selectedSize === s ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-700 hover:border-gray-400'
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-xs text-red-500 font-semibold mb-4">⚠️ Plus que {product.stock} en stock !</p>
          )}
          {product.stock === 0 && (
            <p className="text-xs text-red-600 font-bold mb-4">❌ Rupture de stock</p>
          )}

          {/* CTAs */}
          <div className="flex flex-col gap-3 mt-2">
            <button onClick={handleAddToCart} disabled={product.stock === 0}
              className={`w-full flex items-center justify-center gap-2 py-4 text-sm font-bold tracking-widest uppercase transition-colors duration-300 ${
                product.stock === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : added ? 'bg-green-600 text-white'
                : 'bg-gray-900 text-white hover:bg-gold-400 hover:text-gray-900'
              }`}>
              <ShoppingBag size={18} />
              {added ? 'Ajouté au panier ✓' : 'Ajouter au panier'}
            </button>

            <button onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-2 py-4 text-sm font-bold tracking-widest uppercase border border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-colors duration-300">
              <MessageCircle size={18} />
              Commander via WhatsApp
            </button>
          </div>

          {/* Infos livraison */}
          <div className="mt-6 pt-6 border-t border-gray-100 space-y-2 text-xs text-gray-400">
            <p>🚚 Livraison Abidjan sous 24–48h · Reste de la CI sous 3–5 jours</p>
            <p>💳 Wave · Orange Money · MTN MoMo</p>
            <p>🔄 Retours acceptés sous 7 jours</p>
          </div>
        </div>
      </div>

      {/* Produits similaires */}
      {related.length > 0 && (
        <div className="mt-20">
          <div className="mb-8">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-gold-400 mb-1">Vous aimerez aussi</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">Produits similaires</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      )}
    </div>
  )
}
