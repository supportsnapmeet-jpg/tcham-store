import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, LogOut, Package, Eye, Upload, X } from 'lucide-react'
import { getProducts, insertProduct, updateProduct, deleteProduct, uploadProductImage } from '../lib/supabase'
import { categories, formatPrice } from '../data/products'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'tcham2025'
const emptyForm = { name: '', price: '', old_price: '', category: 'homme', badge: '', description: '', sizes: '', colors: '', stock: '', featured: false }

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('tcham_admin') === '1')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState(false)
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [msg, setMsg] = useState('')
  const [imageFiles, setImageFiles] = useState([])
  const [uploadingImages, setUploadingImages] = useState(false)

  useEffect(() => {
    if (authed) loadProducts()
  }, [authed])

  const loadProducts = async () => {
    setLoadingProducts(true)
    try {
      const data = await getProducts()
      setItems(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingProducts(false)
    }
  }

  const login = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('tcham_admin', '1')
      setAuthed(true)
    } else {
      setLoginError(true)
      setTimeout(() => setLoginError(false), 2500)
    }
  }

  const logout = () => { sessionStorage.removeItem('tcham_admin'); setAuthed(false) }

  const openNew = () => { setForm(emptyForm); setEditing(null); setImageFiles([]); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const openEdit = (item) => {
    setForm({
      ...item,
      sizes: Array.isArray(item.sizes) ? item.sizes.join(', ') : '',
      colors: Array.isArray(item.colors) ? item.colors.join(', ') : '',
      old_price: item.old_price || '',
    })
    setEditing(item.id)
    setImageFiles([])
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeForm = () => { setShowForm(false); setEditing(null); setForm(emptyForm); setImageFiles([]) }

  const notify = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3500) }

  const saveProduct = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        name: form.name,
        price: Number(form.price),
        old_price: form.old_price ? Number(form.old_price) : null,
        category: form.category,
        badge: form.badge || null,
        description: form.description,
        stock: Number(form.stock) || 0,
        featured: form.featured,
        sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
        colors: form.colors.split(',').map((c) => c.trim()).filter(Boolean),
        images: editing ? (items.find(i => i.id === editing)?.images || []) : [],
      }

      let savedId = editing
      if (editing) {
        await updateProduct(editing, payload)
        notify('✅ Produit modifié !')
      } else {
        const created = await insertProduct(payload)
        savedId = created.id
        notify('✅ Produit ajouté !')
      }

      // Upload images si présentes
      if (imageFiles.length > 0 && savedId) {
        setUploadingImages(true)
        try {
          const urls = await Promise.all(imageFiles.map((f) => uploadProductImage(f, savedId)))
          const existingImages = editing ? (items.find(i => i.id === editing)?.images || []) : []
          await updateProduct(savedId, { images: [...existingImages, ...urls] })
        } catch (imgErr) {
          notify('⚠️ Produit sauvegardé mais erreur upload images. Vérifiez le bucket Supabase Storage.')
        } finally {
          setUploadingImages(false)
        }
      }

      await loadProducts()
      closeForm()
    } catch (err) {
      notify('❌ Erreur : ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return
    try {
      await deleteProduct(id)
      setItems((prev) => prev.filter((p) => p.id !== id))
      notify('🗑️ Produit supprimé.')
    } catch (e) {
      notify('❌ Erreur suppression : ' + e.message)
    }
  }

  // ── LOGIN ──
  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-100 p-8 w-full max-w-sm">
          <div className="text-center mb-8">
            <p className="font-display text-2xl font-black tracking-widest text-gray-900">TCHAM<span className="text-gold-400">.</span></p>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Panel Admin</p>
          </div>
          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="text-xs font-bold tracking-widest uppercase text-gray-500 block mb-1.5">Mot de passe</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className={`w-full border px-3 py-3 text-sm focus:outline-none transition-colors ${loginError ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-gray-400'}`}
                placeholder="••••••••" />
              {loginError && <p className="text-red-500 text-xs mt-1">Mot de passe incorrect.</p>}
            </div>
            <button type="submit" className="w-full bg-gray-900 text-white py-3 text-xs font-bold tracking-widest uppercase hover:bg-gold-400 hover:text-gray-900 transition-colors">
              Connexion
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── DASHBOARD ──
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package size={20} className="text-gold-400" />
          <span className="font-display font-bold tracking-widest">TCHAM Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" target="_blank" className="text-gray-400 hover:text-gold-400 transition-colors flex items-center gap-1 text-xs">
            <Eye size={14} /> Voir le site
          </Link>
          <button onClick={logout} className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors text-xs">
            <LogOut size={14} /> Déconnexion
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Produits', val: items.length, icon: '📦' },
            { label: 'En promo', val: items.filter((p) => p.old_price).length, icon: '🏷️' },
            { label: 'Mis en avant', val: items.filter((p) => p.featured).length, icon: '⭐' },
            { label: 'Stock faible', val: items.filter((p) => p.stock <= 5).length, icon: '⚠️' },
          ].map(({ label, val, icon }) => (
            <div key={label} className="bg-white border border-gray-100 p-4">
              <div className="text-2xl mb-2">{icon}</div>
              <div className="font-display text-2xl font-black text-gray-900">{val}</div>
              <div className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {msg && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 mb-6">{msg}</div>}

        {/* Formulaire */}
        {showForm && (
          <div className="bg-white border border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-gray-900">{editing ? 'Modifier le produit' : 'Nouveau produit'}</h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-700 text-2xl leading-none"><X size={20} /></button>
            </div>
            <form onSubmit={saveProduct} className="grid sm:grid-cols-2 gap-5">
              {[
                { name: 'name', label: 'Nom du produit *', type: 'text', required: true, placeholder: 'Ex: T-Shirt Oversize Premium' },
                { name: 'price', label: 'Prix (FCFA) *', type: 'number', required: true, placeholder: '8500' },
                { name: 'old_price', label: 'Ancien prix (FCFA)', type: 'number', placeholder: 'Laisser vide si pas de promo' },
                { name: 'stock', label: 'Stock', type: 'number', placeholder: '20' },
                { name: 'badge', label: 'Badge', type: 'text', placeholder: 'Ex: Nouveau, -50%, Premium' },
                { name: 'sizes', label: 'Tailles (virgule)', type: 'text', placeholder: 'S, M, L, XL' },
                { name: 'colors', label: 'Couleurs (virgule)', type: 'text', placeholder: 'Noir, Blanc, Beige' },
              ].map(({ name, label, type, required, placeholder }) => (
                <div key={name}>
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-500 block mb-1.5">{label}</label>
                  <input type={type} required={required} placeholder={placeholder} value={form[name] ?? ''}
                    onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition-colors" />
                </div>
              ))}

              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 block mb-1.5">Catégorie *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-white">
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-3 pt-5">
                <input type="checkbox" id="featured" checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4" />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">Mettre en avant (accueil)</label>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 block mb-1.5">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400 resize-none transition-colors"
                  placeholder="Description du produit…" />
              </div>

              {/* Upload images */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 block mb-1.5">
                  Images produit <span className="text-gray-400 normal-case font-normal">(JPG, PNG · max 5 Mo chacune)</span>
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded p-4 text-center hover:border-gray-400 transition-colors">
                  <input type="file" multiple accept="image/*" id="imgUpload" className="hidden"
                    onChange={(e) => setImageFiles(Array.from(e.target.files))} />
                  <label htmlFor="imgUpload" className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload size={24} className="text-gray-300" />
                    <span className="text-xs text-gray-400">Cliquer pour sélectionner des images</span>
                  </label>
                  {imageFiles.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 justify-center">
                      {imageFiles.map((f, i) => (
                        <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">{f.name}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2 flex gap-3">
                <button type="submit" disabled={loading || uploadingImages}
                  className="flex-1 bg-gray-900 text-white py-3 text-xs font-bold tracking-widest uppercase hover:bg-gold-400 hover:text-gray-900 transition-colors disabled:opacity-50">
                  {loading ? 'Enregistrement…' : uploadingImages ? 'Upload images…' : editing ? 'Modifier' : 'Ajouter le produit'}
                </button>
                <button type="button" onClick={closeForm}
                  className="px-6 border border-gray-200 text-gray-600 text-xs font-bold tracking-widest uppercase hover:border-gray-400 transition-colors">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste produits */}
        <div className="bg-white border border-gray-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-display text-lg font-bold text-gray-900">Produits ({items.length})</h2>
            <button onClick={openNew} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-gold-400 hover:text-gray-900 transition-colors">
              <Plus size={16} /> Ajouter
            </button>
          </div>

          {loadingProducts ? (
            <div className="p-12 text-center text-gray-400 text-sm">Chargement…</div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['Produit', 'Catégorie', 'Prix', 'Stock', 'En avant', 'Actions'].map((h) => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {item.images?.[0] ? (
                              <img src={item.images[0]} alt="" className="w-10 h-10 object-cover bg-gray-100 flex-none" />
                            ) : (
                              <div className="w-10 h-10 bg-gray-100 flex items-center justify-center text-lg flex-none">
                                {categories.find(c => c.id === item.category)?.icon}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900 line-clamp-1">{item.name}</p>
                              {item.badge && <span className="text-[10px] font-bold text-gold-600 uppercase tracking-widest">{item.badge}</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-500 capitalize">{item.category}</td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-gray-900">{formatPrice(item.price)}</div>
                          {item.old_price && <div className="text-xs text-gray-400 line-through">{formatPrice(item.old_price)}</div>}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-bold ${item.stock <= 5 ? 'text-red-500' : 'text-green-600'}`}>{item.stock}</span>
                        </td>
                        <td className="px-5 py-4 text-center">{item.featured ? '⭐' : '—'}</td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-gray-700 transition-colors"><Edit2 size={15} /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-gray-50">
                {items.map((item) => (
                  <div key={item.id} className="px-4 py-4 flex items-center gap-3">
                    {item.images?.[0] ? (
                      <img src={item.images[0]} alt="" className="w-12 h-12 object-cover bg-gray-100 flex-none" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 flex items-center justify-center text-xl flex-none">
                        {categories.find(c => c.id === item.category)?.icon}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{item.category} · {formatPrice(item.price)}</p>
                    </div>
                    <div className="flex gap-1 flex-none">
                      <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-gray-700"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
