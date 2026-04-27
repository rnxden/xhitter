import { useState } from 'react'
import { createPortal } from 'react-dom'
import { PurchaseModal } from './PurchaseModal'
import type { PurchaseItem } from './PurchaseModal'

type Props = { onClose: () => void; onUpgrade: () => void }

const BUNDLES = [
  { spins: 3, price: '$2.99', note: '$1.00 per spin' },
  { spins: 10, price: '$7.99', note: '$0.80 per spin', popular: true },
  { spins: 30, price: '$19.99', note: '$0.67 per spin' },
]

const LEGEND = [
  { color: '#e879f9', label: '50% off Premium' },
  { color: '#22d3ee', label: '3 Free Spins' },
  { color: '#34d399', label: 'Free Day Pass' },
  { color: '#fb923c', label: 'Post Boost' },
  { color: '#f87171', label: '2× Reach 24h' },
  { color: '#facc15', label: '3 Card Draws' },
  { color: '#a78bfa', label: 'Verified 24h' },
]

export function SpinWheelModal({ onClose, onUpgrade }: Props) {
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<'lose' | null>(null)
  const [tokens, setTokens] = useState(0)
  const [showPurchase, setShowPurchase] = useState(false)
  const [purchaseBundle, setPurchaseBundle] = useState<typeof BUNDLES[0] | null>(null)
  const [confirmClose, setConfirmClose] = useState(false)

  const handleClose = () => {
    if (confirmClose) { onClose(); return }
    setConfirmClose(true)
  }

  const doSpin = () => {
    if (spinning) return
    setSpinning(true)
    setResult(null)
    const current = rotation % 360
    const extra = (337.5 - current + 360) % 360
    const newRotation = rotation + 5 * 360 + extra
    setRotation(newRotation)
    setTimeout(() => {
      setSpinning(false)
      setResult('lose')
    }, 3500)
  }

  const handleSpin = () => {
    if (spinning) return
    if (result === null) { doSpin(); return }
    if (tokens > 0) { setTokens((t) => t - 1); doSpin(); return }
    setShowPurchase(true)
  }

  const purchaseItem: PurchaseItem | null = purchaseBundle
    ? {
        emoji: '🎰',
        name: `${purchaseBundle.spins} Spin Tokens`,
        description: 'More spins, more chances at the jackpot',
        price: purchaseBundle.price,
        quantityLabel: `${purchaseBundle.spins} Spin Tokens`,
      }
    : null

  const spinBtnLabel = spinning
    ? 'SPINNING...'
    : result !== null && tokens > 0
    ? `SPIN AGAIN (${tokens} left)`
    : result !== null
    ? 'TRY AGAIN 🎰'
    : 'SPIN!'

  return (
    <>
      {createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative bg-[#131720] rounded-2xl p-6 max-w-sm w-full border border-[#1e2636] text-center"
            style={{ boxShadow: '0 0 60px rgba(250, 204, 21, 0.3)' }}
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 text-xs font-bold transition-colors"
              style={{ color: confirmClose ? '#f87171' : '#6b7591' }}
            >
              {confirmClose ? 'Sure? 💔' : '✕'}
            </button>

            <div className="text-2xl font-black text-[#f0f2f8] mb-1">🎰 SPIN TO WIN</div>
            <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: '#facc1520', color: '#facc15', border: '1px solid #facc1540' }}
              >
                🎟 Daily Lucky Spin
              </span>
              {tokens > 0 && (
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ backgroundColor: '#a78bfa20', color: '#a78bfa', border: '1px solid #a78bfa40' }}
                >
                  {tokens} Token{tokens !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Wheel — 7 prizes, 1 gray lose slot */}
            <div className="relative w-52 h-52 mx-auto mb-4">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 text-xl" style={{ color: '#facc15' }}>▼</div>
              <div
                className="w-full h-full rounded-full border-4 border-[#2a3547]"
                style={{
                  background: `conic-gradient(
                    #2a3547 0deg 45deg,
                    #e879f9 45deg 90deg,
                    #22d3ee 90deg 135deg,
                    #34d399 135deg 180deg,
                    #fb923c 180deg 225deg,
                    #f87171 225deg 270deg,
                    #facc15 270deg 315deg,
                    #a78bfa 315deg 360deg
                  )`,
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning ? 'transform 3.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-[#0d0f14] border-2 border-[#2a3547] flex items-center justify-center text-lg">
                  🎰
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-2 mb-4 flex-wrap">
              {LEGEND.map((s) => (
                <span key={s.label} className="flex items-center gap-1 text-[10px] text-[#6b7591]">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  {s.label}
                </span>
              ))}
            </div>

            {result === 'lose' && !showPurchase && (
              <div
                className="rounded-xl p-3 mb-4 border"
                style={{ backgroundColor: '#1e2636', borderColor: '#fb923c55' }}
              >
                <div className="font-bold text-sm" style={{ color: '#fb923c' }}>So close! 😤</div>
                <div className="text-[#6b7591] text-xs mt-0.5">
                  {tokens > 0
                    ? `${tokens} spin${tokens !== 1 ? 's' : ''} left — the Grand Prize is still up for grabs!`
                    : '3 people won the Grand Prize this hour. Keep spinning 🔥'}
                </div>
              </div>
            )}

            {!showPurchase ? (
              <>
                <button
                  type="button"
                  onClick={handleSpin}
                  disabled={spinning}
                  className="btn-rainbow w-full py-3 rounded-xl text-white font-black text-base hover:opacity-90 disabled:opacity-50 transition-opacity mb-1"
                >
                  {spinBtnLabel}
                </button>
                {result !== null && tokens === 0 && (
                  <p className="text-[10px] text-[#6b7591]">Get more spins — you might be one away from the jackpot</p>
                )}
              </>
            ) : (
              <div className="text-left">
                <div className="font-black text-base text-[#f0f2f8] mb-1 text-center">Keep Spinning 🎰</div>
                <p className="text-[10px] text-[#6b7591] text-center mb-3">
                  The jackpot resets soon — grab tokens before someone else wins it first.
                </p>
                <div className="space-y-2 mb-3">
                  {BUNDLES.map((b) => (
                    <button
                      key={b.spins}
                      type="button"
                      onClick={() => setPurchaseBundle(b)}
                      className="w-full flex items-center justify-between rounded-xl px-4 py-2.5 transition-all hover:opacity-90 relative"
                      style={{
                        backgroundColor: b.popular ? '#facc1518' : '#1e2636',
                        border: b.popular ? '1px solid #facc1544' : '1px solid #2a3547',
                      }}
                    >
                      {b.popular && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] bg-[#facc15] text-[#0d0f14] font-black px-2 rounded-full">
                          BEST VALUE
                        </span>
                      )}
                      <span className="font-black text-sm text-[#f0f2f8]">{b.spins} Spins</span>
                      <div className="text-right">
                        <div className="font-black text-sm" style={{ color: b.popular ? '#facc15' : '#f0f2f8' }}>{b.price}</div>
                        <div className="text-[10px] text-[#6b7591]">{b.note}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={onUpgrade}
                  className="w-full py-2 text-xs font-bold hover:underline"
                  style={{ color: '#e879f9' }}
                >
                  ⭐ Get Premium — 5 spins + 5 draws daily, guaranteed prizes
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {purchaseItem && purchaseBundle && (
        <PurchaseModal
          item={purchaseItem}
          onClose={() => setPurchaseBundle(null)}
          onSuccess={() => {
            setTokens((t) => t + purchaseBundle.spins)
            setPurchaseBundle(null)
            setShowPurchase(false)
          }}
        />
      )}
    </>
  )
}
