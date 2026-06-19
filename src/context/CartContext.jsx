import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext(null)

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(
        (i) => i.id === action.product.id && i.size === action.size && i.color === action.color
      )
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i === existing ? { ...i, qty: i.qty + 1 } : i
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.product, size: action.size, color: action.color, qty: 1 }],
      }
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((_, idx) => idx !== action.index) }
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map((item, idx) =>
          idx === action.index ? { ...item, qty: Math.max(1, action.qty) } : item
        ),
      }
    case 'CLEAR':
      return { ...state, items: [] }
    default:
      return state
  }
}

const STORAGE_KEY = 'tcham_cart'

export function CartProvider({ children }) {
  const stored = (() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { items: [] } } catch { return { items: [] } }
  })()

  const [state, dispatch] = useReducer(cartReducer, stored)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const total = state.items.reduce((acc, i) => acc + i.price * i.qty, 0)
  const count = state.items.reduce((acc, i) => acc + i.qty, 0)

  const addToCart = (product, size, color) => dispatch({ type: 'ADD', product, size, color })
  const removeItem = (index) => dispatch({ type: 'REMOVE', index })
  const updateQty = (index, qty) => dispatch({ type: 'UPDATE_QTY', index, qty })
  const clearCart = () => dispatch({ type: 'CLEAR' })

  const buildWhatsAppMessage = () => {
    const lines = state.items.map(
      (i) => `• ${i.name} (${i.size || '-'}, ${i.color || '-'}) x${i.qty} = ${(i.price * i.qty).toLocaleString('fr-CI')} FCFA`
    )
    const msg = `Bonjour TCHAM STORE 👋\n\nJe souhaite commander :\n\n${lines.join('\n')}\n\n*Total : ${total.toLocaleString('fr-CI')} FCFA*\n\nMerci de me confirmer la disponibilité.`
    return encodeURIComponent(msg)
  }

  return (
    <CartContext.Provider value={{ items: state.items, total, count, addToCart, removeItem, updateQty, clearCart, buildWhatsAppMessage }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
