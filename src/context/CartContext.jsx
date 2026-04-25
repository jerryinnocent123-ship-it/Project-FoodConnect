/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext({})
const STORAGE_KEY = 'foodconnect-cart'

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    const storedCart = window.localStorage.getItem(STORAGE_KEY)
    if (!storedCart) return

    try {
      const parsedCart = JSON.parse(storedCart)
      if (Array.isArray(parsedCart)) {
        setCartItems(parsedCart)
      }
    } catch (error) {
      console.error('Error restoring cart:', error)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (menu) => {
    setCartItems((current) => {
      const existingItem = current.find((item) => item.id === menu.id)

      if (existingItem) {
        return current.map((item) =>
          item.id === menu.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }

      return [...current, { ...menu, quantity: 1 }]
    })
  }

  const updateQuantity = (menuId, quantity) => {
    if (quantity <= 0) {
      setCartItems((current) => current.filter((item) => item.id !== menuId))
      return
    }

    setCartItems((current) =>
      current.map((item) => (item.id === menuId ? { ...item, quantity } : item))
    )
  }

  const removeFromCart = (menuId) => {
    setCartItems((current) => current.filter((item) => item.id !== menuId))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const totals = useMemo(() => {
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0)
    const totalPrice = cartItems.reduce(
      (total, item) => total + Number(item.price || 0) * item.quantity,
      0
    )

    return { itemCount, totalPrice }
  }, [cartItems])

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount: totals.itemCount,
        totalPrice: totals.totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
