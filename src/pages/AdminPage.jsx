import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, LogOut, Package, Eye, Upload, X, Play, Image } from 'lucide-react'
import { getProducts, insertProduct, updateProduct, deleteProduct, uploadMedia } from '../lib/supabase'
import { categories, formatPrice } from '../data/products'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'tcham2025'
const emptyForm = { name:'', price:'', old_price:'', category:'homme', badge:'', description:'', sizes:'', colors:'', stock:'', featured:false }

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
  const [msg, setMsg] = useState({ text:'', type:'success' })
  const [mediaFiles, setMediaFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileRef = useRef()

  useEffect(() => { if (authed) loadProducts() }, [authed])

  const loadProducts = async () => {
    setLoadingProducts(true)
    try { setItems(await getProducts()) }
    catch(e) { notify('❌ Erreur chargement : ' + e.message, 'error') }
    finally { setLoadingProducts(false) }
  }

  const notify = (text, type = 'success') => {
    setMsg({ text, type })
    setTimeout(() => setMsg({ text:'', type:'success' }), 4000)
  }

  const login = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) { sessionStorage.setItem('tcham_admin','1'); setAuthed(true) }
    else { setLoginError(true); setTimeout(() => setLoginError(false), 2500) }
  }

  const logout = () => { sessionStorage.removeItem('tcham_admin'); setAuthed(false) }

  const openNew = () => { setForm(emptyForm); setEditing(null); setMediaFiles([]); setShowForm(true); window.scrollTo({ top:0, behavior:'smooth' }) }

  const openEdit = (item) => {
    setForm({
      ...item,
      sizes: Array.isArray(item.sizes) ? item.sizes.join(', ') : '',
      colors: Array.isArray(item.colors) ? item.colors.join(', ') : '',
      old_price: item.old_price || '',
    })
    setEditing(item.id)
    setMediaFiles([])
    setShowForm(true)
    window.scrollTo({ top:0, behavior:'smooth' })
  }

  const closeForm = () => { setShowForm(false); setEditing(null); setForm(emptyForm); setMediaFiles([]) }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setMediaFiles(prev => [...prev, ...files])
  }

  const removeFile = (idx) => setMediaFiles(prev => prev.filter((_,i) => i !== idx))

  const saveProduct = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const existing = editing ? items.find(i => i.id === editing) : null
      const payload = {
        name: form.name,
        price: Number(form.price),
        old_price: form.old_price ? Number(form.old_price) : null,
        category: form.category,
        badge: form.badge || null,
        description: form.description,
        stock: Number(form.stock) || 0,
        featured: form.featured,
        sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
        colors: form.colors.split(',').map(c => c.trim()).filter(Boolean),
        images: existing?.images || [],
        videos: existing?.videos || [],
      }

      let savedId = editing
      if (editing) {
        await updateProduct(editing, payload)
      } else {
        const created = await insertProduct(payload)
        savedId = created.id
      }

      // Upload médias
      if (mediaFiles.length > 0 && savedId) {
        setUploading(true)
        const existingItem = items.find(i => i.id === savedId)
        let newImages = [...(existingItem?.images || payload.images)]
        let newVideos = [...(existingItem?.videos || payload.videos)]

        for (let i = 0; i < mediaFiles.length; i++) {
          setUploadProgress(Math.round((i / mediaFiles.length) * 100))
          try {
            const { url, isVideo } = await uploadMedia(mediaFiles[i], savedId)
            if (isVideo) newVideos.push(url)
            else newImages.push(url)
          } catch(err) {
            notify(`⚠️ Erreur upload ${mediaFiles[i].name}: ${err.message}`, 'error')
          }
        }

        await updateProduct(savedId, { images: newImages, videos: newVideos })
        setUploadProgress(100)
        setUploading(false)
      }

      notify(editing ? '✅ Produit modifié !' : '✅ Produit ajouté !')
      await loadProducts()
      closeForm()
    } catch(err) {
      notify('❌ Erreur : ' + err.message, 'error')
    } finally {
      setLoading(false)
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return
    try { await deleteProduct(id); setItems(prev => prev.filter(p => p.id !== id)); notify('🗑️ Produit supprimé.') }
    catch(e) { notify('❌ ' + e.message, 'error') }
  }

  // ── LOGIN ──
  if (!authed) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-100 p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display text-2xl font-black tracking-widest text-gray-900">TCHAM<span className="text-gold-400">.</span></p>
          <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Panel Admin</p>
        </div>
        <form onSubmit={login} className="space-y-4">
          <div>
            <label className="text-xs font-bold tracking-widest uppercase text-gray-500 block mb-1.5">Mot de passe</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
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

  // ── DASHBOARD ──
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
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
            { label:'Produits', val:items.length, icon:'📦' },
            { label:'En promo', val:items.filter(p=>p.old_price).length, icon:'🏷️' },
            { label:'Mis en avant', val:items.filter(p=>p.featured).length, icon:'⭐' },
            { label:'Stock faible', val:items.filter(p=>p.stock<=5).length, icon:'⚠️' },
          ].map(({ label, val, icon }) => (
            <div key={label} className="bg-white border border-gray-100 p-4">
              <div className="text-2xl mb-2">{icon}</div>
              <div className="font-display text-2xl font-black text-gray-900">{val}</div>
              <div className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Message */}
        {msg.text && (
          <div className={`px-4 py-3 mb-6 text-sm border ${msg.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
            {msg.text}
          </div>
        )}

        {/* Formulaire produit */}
        {showForm && (
          <div className="bg-white border border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-gray-900">{editing ? 'Modifier le produit' : 'Nouveau produit'}</h2>
              <button onClick={closeForm}><X size={20} className="text-gray-400 hover:text-gray-700" /></button>
            </div>

            <form onSubmit={saveProduct} className="grid sm:grid-cols-2 gap-5">
              {[
                { name:'name', label:'Nom *', placeholder:'Ex: T-Shirt Oversize', required:true, type:'text' },
                { name:'price', label:'Prix (FCFA) *', placeholder:'8500', required:true, type:'number' },
                { name:'old_price', label:'Ancien prix (promo)', placeholder:'Laisser vide si pas de promo', type:'number' },
                { name:'stock', label:'Stock', placeholder:'20', type:'number' },
                { name:'badge', label:'Badge', placeholder:'Nouveau · -50% · Premium', type:'text' },
                { name:'sizes', label:'Tailles (séparées par virgule)', placeholder:'S, M, L, XL', type:'text' },
                { name:'colors', label:'Couleurs (séparées par virgule)', placeholder:'Noir, Blanc, Beige', type:'text' },
              ].map(({ name, label, placeholder, required, type }) => (
                <div key={name}>
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-500 block mb-1.5">{label}</label>
                  <input type={type} required={required} placeholder={placeholder} value={form[name] ?? ''}
                    onChange={e => setForm({ ...form, [name]: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition-colors" />
                </div>
              ))}

              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 block mb-1.5">Catégorie *</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-white">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-3 pt-5">
                <input type="checkbox" id="featured" checked={form.featured}
                  onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4" />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">⭐ Mettre en avant sur l'accueil</label>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 block mb-1.5">Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400 resize-none"
                  placeholder="Description du produit…" />
              </div>

              {/* Upload médias */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 block mb-1.5">
                  Photos & Vidéos <span className="normal-case font-normal text-gray-400">(JPG, PNG, MP4 · depuis ton téléphone ou ordinateur)</span>
                </label>

                {/* Zone drop */}
                <div
                  className="border-2 border-dashed border-gray-200 rounded p-6 text-center hover:border-gold-400 transition-colors cursor-pointer"
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload size={28} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-medium">Appuie pour ajouter des photos ou vidéos</p>
                  <p className="text-xs text-gray-400 mt-1">Tu peux sélectionner plusieurs fichiers à la fois</p>
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    accept="image/*,video/mp4,video/mov,video/quicktime"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                {/* Aperçu fichiers sélectionnés */}
                {mediaFiles.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {mediaFiles.map((f, i) => {
                      const isVideo = f.type.startsWith('video')
                      const preview = !isVideo ? URL.createObjectURL(f) : null
                      return (
                        <div key={i} className="relative aspect-square bg-gray-100 overflow-hidden rounded">
                          {isVideo ? (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                              <Play size={20} className="text-gray-400" />
                              <span className="text-[10px] text-gray-400 text-center px-1 truncate w-full">{f.name}</span>
                            </div>
                          ) : (
                            <img src={preview} alt="" className="w-full h-full object-cover" />
                          )}
                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Médias existants */}
                {editing && (() => {
                  const item = items.find(i => i.id === editing)
                  const allMedia = [
                    ...(item?.images||[]).map(u=>({url:u,type:'image'})),
                    ...(item?.videos||[]).map(u=>({url:u,type:'video'})),
                  ]
                  return allMedia.length > 0 ? (
                    <div className="mt-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Médias actuels</p>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {allMedia.map((m, i) => (
                          <div key={i} className="relative aspect-square bg-gray-100 overflow-hidden rounded">
                            {m.type === 'video' ? (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <Play size={20} className="text-gray-400" />
                              </div>
                            ) : (
                              <img src={m.url} alt="" className="w-full h-full object-cover" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null
                })()}

                {/* Barre de progression upload */}
                {uploading && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Upload en cours…</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gold-400 h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="sm:col-span-2 flex gap-3">
                <button type="submit" disabled={loading || uploading}
                  className="flex-1 bg-gray-900 text-white py-3.5 text-xs font-bold tracking-widest uppercase hover:bg-gold-400 hover:text-gray-900 transition-colors disabled:opacity-50">
                  {uploading ? `Upload ${uploadProgress}%…` : loading ? 'Enregistrement…' : editing ? 'Modifier le produit' : 'Ajouter le produit'}
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
              {/* Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['Produit','Catégorie','Prix','Médias','Stock','En avant','Actions'].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {items.map(item => {
                      const imgCount = item.images?.length || 0
                      const vidCount = item.videos?.length || 0
                      return (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 flex-none overflow-hidden">
                                {item.images?.[0]
                                  ? <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                                  : <div className="w-full h-full flex items-center justify-center text-lg">{categories.find(c=>c.id===item.category)?.icon}</div>
                                }
                              </div>
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
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              {imgCount > 0 && <span className="flex items-center gap-0.5"><Image size={12} />{imgCount}</span>}
                              {vidCount > 0 && <span className="flex items-center gap-0.5 text-gold-600"><Play size={12} />{vidCount}</span>}
                              {imgCount === 0 && vidCount === 0 && <span className="text-gray-300">—</span>}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`text-xs font-bold ${item.stock <= 5 ? 'text-red-500' : 'text-green-600'}`}>{item.stock}</span>
                          </td>
                          <td className="px-5 py-4 text-center">{item.featured ? '⭐' : '—'}</td>
                          <td className="px-5 py-4">
                            <div className="flex gap-2">
                              <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-gray-700"><Edit2 size={15} /></button>
                              <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={15} /></button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="md:hidden divide-y divide-gray-50">
                {items.map(item => (
                  <div key={item.id} className="px-4 py-4 flex items-center gap-3">
                    <div className="w-14 h-14 bg-gray-100 flex-none overflow-hidden rounded">
                      {item.images?.[0]
                        ? <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-2xl">{categories.find(c=>c.id===item.category)?.icon}</div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.category} · {formatPrice(item.price)}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                        {(item.images?.length||0) > 0 && <span>{item.images.length} 📸</span>}
                        {(item.videos?.length||0) > 0 && <span className="text-gold-600">{item.videos.length} 🎬</span>}
                      </div>
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
