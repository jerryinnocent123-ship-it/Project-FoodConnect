import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCart } from '../../context/CartContext'
import ClientLayout from '../../layouts/ClientLayout'

function Cart() {
  const { t } = useTranslation()
  const { cartItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState('moncash')
  const [checkoutMessage, setCheckoutMessage] = useState('')

  const handleCheckout = () => {
    if (cartItems.length === 0) return

    const message =
      paymentMethod === 'moncash'
        ? t('Your Moncash payment option is selected. We will redirect you soon.')
        : t('Cash on delivery selected. Please keep your phone available for delivery.')

    setCheckoutMessage(message)
    clearCart()
  }

  return (
    <ClientLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-full bg-orange-100 p-3 text-orange-600">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              {t('Cart')}
            </p>
            <h1 className="text-3xl font-bold text-slate-900">{t('Your Cart')}</h1>
          </div>
        </div>

        {checkoutMessage && (
          <div className="mb-6 rounded-2xl bg-emerald-50 px-4 py-3 text-emerald-700">
            {checkoutMessage}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {cartItems.length === 0 && (
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-slate-600">
                {t('Your cart is empty.')}
              </div>
            )}

            {cartItems.map((item) => (
              <article
                key={item.id}
                className="grid gap-4 rounded-[2rem] bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] md:grid-cols-[140px_1fr]"
              >
                <img src={item.image_url} alt={item.title} className="h-36 w-full rounded-2xl object-cover" />
                <div className="flex flex-col justify-between gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
                      <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="rounded-full bg-red-50 p-3 text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="rounded-full bg-slate-100 p-2 text-slate-700"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-lg font-semibold text-slate-900">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="rounded-full bg-slate-100 p-2 text-slate-700"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="text-lg font-semibold text-slate-900">
                      ${(Number(item.price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-300">
              {t('Order Summary')}
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-slate-300">
                <span>{t('Items')}</span>
                <span>{cartItems.length}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xl font-semibold text-white">
                <span>{t('Total')}</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-sm font-semibold text-slate-200">{t('Choose payment method')}</p>
              <div className="space-y-3">
                <label className="flex items-center gap-3 rounded-2xl border border-slate-700 p-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="moncash"
                    checked={paymentMethod === 'moncash'}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                  />
                  <span>{t('Moncash')}</span>
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-slate-700 p-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="delivery"
                    checked={paymentMethod === 'delivery'}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                  />
                  <span>{t('Cash on delivery')}</span>
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              className="mt-8 w-full rounded-full bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {t('Proceed to Payment')}
            </button>
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}

export default Cart
