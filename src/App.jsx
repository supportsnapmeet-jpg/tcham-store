import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import ContactPage from './pages/ContactPage'
import AdminPage from './pages/AdminPage'

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/boutique" element={<Layout><ShopPage /></Layout>} />
          <Route path="/produit/:id" element={<Layout><ProductPage /></Layout>} />
          <Route path="/panier" element={<Layout><CartPage /></Layout>} />
          <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
          <Route path="*" element={
            <Layout>
              <div className="max-w-lg mx-auto px-4 py-32 text-center">
                <p className="font-display text-8xl font-black text-gray-100 mb-4">404</p>
                <h1 className="font-display text-2xl font-bold text-gray-900 mb-3">Page introuvable</h1>
                <p className="text-gray-400 text-sm mb-8">Cette page n'existe pas ou a été déplacée.</p>
                <a href="/" className="inline-block bg-gray-900 text-white text-xs font-bold tracking-widest uppercase px-8 py-4 hover:bg-gold-400 hover:text-gray-900 transition-colors">
                  Retour à l'accueil
                </a>
              </div>
            </Layout>
          } />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}
