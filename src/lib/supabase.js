import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getProducts() {
  const { data, error } = await supabase
    .from('products').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getProductById(id) {
  const { data, error } = await supabase
    .from('products').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from('products').select('*').eq('featured', true).order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getFlashSaleProducts() {
  const { data, error } = await supabase
    .from('products').select('*').not('old_price', 'is', null).order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getProducts_byCategory(category) {
  const query = supabase.from('products').select('*').order('created_at', { ascending: false })
  if (category && category !== 'all') query.eq('category', category)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function insertProduct(product) {
  const { data, error } = await supabase.from('products').insert([product]).select().single()
  if (error) throw error
  return data
}

export async function updateProduct(id, updates) {
  const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

// Upload image ou vidéo dans product-media
export async function uploadMedia(file, productId) {
  const ext = file.name.split('.').pop().toLowerCase()
  const isVideo = ['mp4', 'mov', 'webm'].includes(ext)
  const folder = isVideo ? 'videos' : 'images'
  const path = `${folder}/${productId}/${Date.now()}.${ext}`
  
  const { error } = await supabase.storage
    .from('product-media')
    .upload(path, file, { contentType: file.type, upsert: false })
  if (error) throw error
  
  const { data } = supabase.storage.from('product-media').getPublicUrl(path)
  return { url: data.publicUrl, isVideo }
}
