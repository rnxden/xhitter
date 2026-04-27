import { useState } from 'react'
import { createPortal } from 'react-dom'

export type PurchaseItem = {
  emoji: string
  name: string
  description: string
  price: string
  quantityLabel?: string
}

type Props = {
  item: PurchaseItem
  onClose: () => void
  onSuccess: () => void
}

type Phase = 'form' | 'processing' | 'success'

export function PurchaseModal({ item, onClose, onSuccess }: Props) {
  const [phase, setPhase] = useState<Phase>('form')
  const [card, setCard] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [confirmClose, setConfirmClose] = useState(false)

  const handleClose = () => {
    if (phase === 'success') { onClose(); return }
    if (confirmClose) { onClose(); return }
    setConfirmClose(true)
  }

  const handleBuy = () => {
    setPhase('processing')
    setTimeout(() => {
      setPhase('success')
      onSuccess()
    }, 1800)
  }

  const formatCard = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
  }

  const canBuy = card.replace(/\s/g, '').length === 16 && expiry.length === 5 && cvv.length === 3

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative bg-[#131720] rounded-2xl p-5 max-w-xs w-full border border-[#1e2636]"
        style={{ boxShadow: '0 0 60px rgba(167, 139, 250, 0.35)' }}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-xs font-bold transition-colors"
          style={{ color: confirmClose ? '#f87171' : '#3d4a5c' }}
        >
          {confirmClose ? 'Really? 💔' : '✕'}
        </button>

        {phase === 'success' && (
          <div className="text-center py-4">
            <div className="text-5xl mb-3">✅</div>
            <h2 className="text-lg font-black text-[#f0f2f8]">Purchase Complete!</h2>
            <p className="font-bold text-sm mt-1" style={{ color: '#34d399' }}>
              {item.quantityLabel ?? item.name}
            </p>
            <p className="text-[#6b7591] text-xs mt-1">added to your account</p>
            <button
              type="button"
              onClick={onClose}
              className="btn-rainbow w-full py-2.5 rounded-xl text-white font-black text-sm hover:opacity-90 transition-opacity mt-5"
            >
              Let's Go! 🎉
            </button>
          </div>
        )}

        {phase === 'processing' && (
          <div className="text-center py-10">
            <div className="text-4xl mb-3" style={{ display: 'inline-block', animation: 'shimmer 1s linear infinite' }}>⏳</div>
            <p className="text-[#f0f2f8] font-bold mt-2">Processing...</p>
            <p className="text-[#6b7591] text-xs mt-1">Do not close this window</p>
          </div>
        )}

        {phase === 'form' && (
          <>
            <div className="text-center mb-4">
              <div className="text-3xl mb-1">{item.emoji}</div>
              <h2 className="text-base font-black text-[#f0f2f8]">{item.name}</h2>
              <p className="text-[#6b7591] text-xs mt-0.5">{item.description}</p>
            </div>

            <div
              className="rounded-xl p-3 mb-4 flex items-center justify-between"
              style={{ backgroundColor: '#0d0f14', border: '1px solid #1e2636' }}
            >
              <span className="text-sm text-[#dde1ec]">{item.quantityLabel ?? item.name}</span>
              <span className="font-black text-lg" style={{ color: '#a78bfa' }}>{item.price}</span>
            </div>

            <div className="space-y-2 mb-4">
              <input
                type="text"
                placeholder="Card number"
                value={card}
                onChange={(e) => setCard(formatCard(e.target.value))}
                className="w-full bg-[#1e2636] text-[#f0f2f8] rounded-lg py-2 px-3 text-sm outline-none placeholder-[#3d4a5c] border border-[#2a3547] focus:border-[#a78bfa] transition-colors"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  className="flex-1 bg-[#1e2636] text-[#f0f2f8] rounded-lg py-2 px-3 text-sm outline-none placeholder-[#3d4a5c] border border-[#2a3547] focus:border-[#a78bfa] transition-colors"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  maxLength={3}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  className="w-24 bg-[#1e2636] text-[#f0f2f8] rounded-lg py-2 px-3 text-sm outline-none placeholder-[#3d4a5c] border border-[#2a3547] focus:border-[#a78bfa] transition-colors"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleBuy}
              disabled={!canBuy}
              className="btn-rainbow w-full py-3 rounded-xl text-white font-black text-sm hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity mb-2"
            >
              Pay {item.price} Now 🔒
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="w-full py-2 text-xs transition-colors text-center"
              style={{ color: confirmClose ? '#f87171' : '#3d4a5c' }}
            >
              {confirmClose ? "yes, miss out 💔" : 'cancel'}
            </button>
          </>
        )}
      </div>
    </div>,
    document.body
  )
}
