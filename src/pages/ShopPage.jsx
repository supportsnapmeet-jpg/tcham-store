import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProducts } from '../lib/supabase'
import ProductCard from '../components/ProductCard'
import { categories } from '../data/products'

const sortOptions = [
  { value: 'default', label: 'Recommandés' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'new', label: 'Nouveautés' },
  { value: 'promo', label: 'En promo' },
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

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sort, setSort] = useState('default')
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const activeCategory = searchParams.get('cat') || 'all'

  useEffect(() => {
    getProducts()
      .then(setAllProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const setCategory = (cat) => {
    if (cat === 'all') searchParams.delete('cat')
    else searchParams.set('cat', cat)
    setSearchParams(searchParams)
  }

  const filtered = useMemo(() => {
    let list = activeCategory === 'all' ? allProducts : allProducts.filter((p) => p.category === activeCategory)
    switch (sort) {
      case 'price_asc': return [...list].sort((a, b) => a.price - b.price)
      case 'price_desc': return [...list].sort((a, b) => b.price - a.price)
      case 'new': return [...list].filter((p) => p.badge === 'Nouveau').concat(list.filter((p) => p.badge !== 'Nouveau'))
      case 'promo': return [...list].filter((p) => p.old_price).concat(list.filter((p) => !p.old_price))
      default: return list
    }
  }, [activeCategory, sort, allProducts])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-gold-400 mb-1">Notre sélection</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">Boutique</h1>
      </div>

      {/* Filtres catégories */}
      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-6">
        <button
          onClick={() => setCategory('all')}
          className={`flex-none px-4 py-2 text-xs font-bold tracking-widest uppercase border transition-colors ${
            activeCategory === 'all' ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'
          }`}
        >
          Tout ({allProducts.length})
        </button>
        {categories.map((cat) => {
          const count = allProducts.filter((p) => p.category === cat.id).length
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex-none flex items-center gap-1.5 px-4 py-2 text-xs font-bold tracking-widest uppercase border transition-colors ${
                activeCategory === cat.id ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              <span>{cat.icon}</span>{cat.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 py-3 border-y border-gray-100">
        <p className="text-xs text-gray-400">
          <span className="font-semibold text-gray-900">{filtered.length}</span> produits
        </p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="text-xs font-medium text-gray-700 border border-gray-200 px-3 py-2 focus:outline-none focus:border-gray-400 bg-white"
        >
          {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-gray-400 text-sm">Aucun produit dans cette catégorie.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </div>
  )
}
