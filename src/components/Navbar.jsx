import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ShoppingBag, Menu, X, Search } from 'lucide-react'
import { useCart } from '../context/CartContext'

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/boutique', label: 'Boutique' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { count } = useCart()
  const location = useLocation()

  useEffect(() => { setOpen(false) }, [location])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Promo bar */}
      <div className="bg-gray-900 text-white text-center py-2 text-xs tracking-widest font-medium">
        ✦ LIVRAISON ABIDJAN 24H · WAVE · ORANGE MONEY · MTN MOMO ✦
      </div>

      {/* Navbar */}
      <nav className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'border-b border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl font-black tracking-widest text-gray-900">
            TCHAM<span className="text-gray-900">.</span>
          </Link>

          <ul className="hidden md:flex items-center gap-8">
            {links.map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} end={to === '/'}
                  className={({ isActive }) =>
                    `text-xs font-semibold tracking-widest uppercase transition-colors duration-200 ${
                      isActive ? 'text-gray-900 border-b-2 border-gray-900 pb-0.5' : 'text-gray-500 hover:text-gray-900'
                    }`
                  }>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <Link to="/panier" className="relative text-gray-700 hover:text-gray-900 transition-colors" aria-label="Panier">
              <ShoppingBag size={22} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

            <button className="md:hidden text-gray-700 hover:text-gray-900 transition-colors" onClick={() => setOpen(!open)}>
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-6 pt-4">
            <ul className="flex flex-col gap-1">
              {links.map(({ to, label }) => (
                <li key={to}>
                  <NavLink to={to} end={to === '/'}
                    className={({ isActive }) =>
                      `block py-3 text-sm font-semibold tracking-widest uppercase border-b border-gray-50 ${
                        isActive ? 'text-gray-900' : 'text-gray-500'
                      }`
                    }>
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </>
  )
}
