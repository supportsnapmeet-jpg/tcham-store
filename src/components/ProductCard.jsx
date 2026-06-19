import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Heart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../data/products'

const PLACEHOLDER_COLORS = [
  'bg-stone-100', 'bg-slate-100', 'bg-zinc-100',
  'bg-neutral-100', 'bg-gray-100', 'bg-amber-50',
]
const EMOJIS = { homme: '👔', femme: '👗', chaussures: '👟', accessoires: '💍', electronique: '📱' }

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart()
  const [liked, setLiked] = useState(false)
  const [added, setAdded] = useState(false)

  const bg = PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length]
  const emoji = EMOJIS[product.category] || '🛍️'

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const size = product.sizes?.[0] || 'Taille unique'
    const color = product.colors?.[0] || ''
    addToCart(product, size, color)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const discount = product.old_price
    ? Math.round((1 - product.price / product.old_price) * 100)
    : null

  return (
    <Link to={`/produit/${product.id}`} className="group block">
      {/* Image zone */}
      <div className={`relative overflow-hidden ${bg} aspect-[3/4]`}>
        {product.images?.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl transition-transform duration-500 group-hover:scale-105">
            {emoji}
          </div>
        )}

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-gray-900 text-white text-[10px] font-bold tracking-widest px-2.5 py-1">
            {product.badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLiked(!liked) }}
          aria-label="Ajouter aux favoris"
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <Heart size={15} className={liked ? 'fill-red-500 text-red-500' : 'text-gray-500'} />
        </button>

        {/* Add to cart overlay */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAdd}
            className={`w-full py-3 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors ${
              added ? 'bg-green-600 text-white' : 'bg-gray-900 text-white hover:bg-gold-400 hover:text-gray-900'
            }`}
          >
            <ShoppingBag size={15} />
            {added ? 'Ajouté ✓' : 'Ajouter au panier'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-3 pb-1">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{product.category}</p>
        <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-gold-600 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-base font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.old_price && (
            <>
              <span className="text-sm text-gray-400 line-through">{formatPrice(product.old_price)}</span>
              <span className="text-xs font-bold text-red-500">-{discount}%</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
