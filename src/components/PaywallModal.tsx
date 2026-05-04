import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { PurchaseModal } from './PurchaseModal'
import type { PurchaseItem } from './PurchaseModal'

type Props = { onClose: () => void; feature?: string; detected?: boolean }

const PLANS = [
  {
    name: 'Starter', emoji: '⚡', color: '#22d3ee',
    monthly: 14.99, annual: 7.49,
    perks: ['Verified badge', '2× reach boost', '10 DMs/day', '1 spin + 1 card draw/day'],
  },
  {
    name: 'Creator', emoji: '🌟', color: '#e879f9', popular: true,
    monthly: 39.99, annual: 19.99,
    perks: ['5× reach boost', 'See who viewed you', '5 spins + 5 draws/day', 'Analytics dashboard'],
  },
  {
    name: 'Elite', emoji: '👑', color: '#facc15',
    monthly: 79.99, annual: 39.99,
    perks: ['10× reach boost', 'Unlimited DMs', '10 spins + draws/day', 'Priority in search'],
  },
  {
    name: 'Titan', emoji: '💎', color: '#f87171',
    monthly: 199.99, annual: 99.99,
    perks: ['Unlimited reach multiplier', 'Concierge support*', 'Dedicated account mgr', 'Unlimited spins + draws'],
  },
] as const

export function PaywallModal({ onClose, feature = 'this feature', detected = false }: Props) {
  const [seconds, setSeconds] = useState(299)
  const [annual, setAnnual] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(1)
  const [confirmClose, setConfirmClose] = useState(false)
  const [purchaseItem, setPurchaseItem] = useState<PurchaseItem | null>(null)

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 299)), 1000)
    return () => clearInterval(id)
  }, [])

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`
  const plan = PLANS[selectedPlan]
  const price = annual ? plan.annual : plan.monthly

  const handleClose = () => {
    if (confirmClose) { onClose(); return }
    setConfirmClose(true)
  }

  const portal = createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-[#131720] rounded-2xl p-5 max-w-sm w-full border border-[#1e2636] overflow-y-auto max-h-[92vh]"
        style={{ boxShadow: '0 0 60px rgba(232, 121, 249, 0.35)' }}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-xs font-bold transition-colors"
          style={{ color: confirmClose ? '#f87171' : '#3d4a5c' }}
        >
          {confirmClose ? 'Really? 💔' : '✕'}
        </button>

        {detected && (
          <div
            className="rounded-xl p-2.5 mb-4 text-xs text-center"
            style={{ backgroundColor: '#34d39918', border: '1px solid #34d39944', color: '#34d399' }}
          >
            <span className="font-black">👀 We detected you were considering an upgrade</span>
            <br />
            <span className="text-[#6b7591]">so we opened this for you. You're welcome! 😊</span>
          </div>
        )}

        <div className="text-center mb-4">
          <div className="text-4xl mb-1">🔒</div>
          <h2 className="text-lg font-black text-[#f0f2f8]">Unlock {feature}</h2>
          <p className="text-[#6b7591] text-xs mt-0.5">Join 2.4M+ premium members</p>
        </div>

        <div className="rounded-xl p-2.5 mb-4 text-center border" style={{ backgroundColor: '#1e2636', borderColor: '#f87171aa' }}>
          <div className="text-xs font-bold tracking-widest uppercase" style={{ color: '#f87171' }}>⚡ Sale Ends In</div>
          <div className="text-3xl font-black mt-0.5" style={{ color: '#f87171' }}>{timeStr}</div>
        </div>

        <div className="flex items-center justify-center gap-1 mb-4 bg-[#0d0f14] rounded-full p-1">
          <button
            type="button"
            onClick={() => setAnnual(false)}
            className="flex-1 text-xs font-bold py-1.5 rounded-full transition-all"
            style={!annual ? { backgroundColor: '#1e2636', color: '#f0f2f8' } : { color: '#6b7591' }}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            className="flex-1 text-xs font-bold py-1.5 rounded-full transition-all"
            style={annual ? { backgroundColor: '#1e2636', color: '#f0f2f8' } : { color: '#6b7591' }}
          >
            Annual <span style={{ color: '#34d399' }}>−50%</span>
          </button>
        </div>

        <div className="flex gap-1 mb-3">
          {PLANS.map((p, i) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setSelectedPlan(i)}
              className="flex-1 py-2 rounded-lg text-sm relative transition-all"
              style={
                selectedPlan === i
                  ? { backgroundColor: `${p.color}22`, color: p.color, border: `1px solid ${p.color}55` }
                  : { backgroundColor: '#1e2636', color: '#6b7591', border: '1px solid transparent' }
              }
            >
              {p.emoji}
              {'popular' in p && p.popular && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[7px] bg-[#e879f9] text-[#0d0f14] font-black px-1.5 rounded-full whitespace-nowrap">
                  HOT
                </span>
              )}
            </button>
          ))}
        </div>

        <div
          className="rounded-xl p-3.5 mb-4 border"
          style={{ backgroundColor: '#0d0f14', borderColor: `${plan.color}55` }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="font-black text-base" style={{ color: plan.color }}>
              {plan.emoji} {plan.name}
            </span>
            <div className="text-right">
              <div>
                <span className="font-black text-2xl" style={{ color: plan.color }}>${price}</span>
                <span className="text-[#6b7591] text-xs">/mo</span>
              </div>
              {annual && (
                <div className="text-[10px] text-[#6b7591]">billed ${(price * 12).toFixed(2)}/yr</div>
              )}
            </div>
          </div>
          <ul className="space-y-1.5">
            {plan.perks.map((perk) => (
              <li key={perk} className="flex items-center gap-1.5 text-xs text-[#dde1ec]">
                <span style={{ color: plan.color }}>✓</span>
                {perk}
              </li>
            ))}
          </ul>
          {plan.name === 'Titan' && (
            <p className="text-[10px] text-[#3d4a5c] mt-2 italic">
              * Concierge = email response within 72 business hours
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            setPurchaseItem({
              emoji: plan.emoji,
              name: `${plan.name} Plan`,
              description: plan.perks.join(' · '),
              price: annual ? `$${(price * 12).toFixed(2)}/yr` : `$${price}/mo`,
              quantityLabel: `${plan.name} ${annual ? '(Annual)' : '(Monthly)'}`,
            })
          }
          className="btn-rainbow w-full py-3 rounded-xl text-white font-black text-base hover:opacity-90 transition-opacity mb-2"
        >
          Get {plan.name} — ${price}/mo 🎉
        </button>
        <button
          type="button"
          onClick={handleClose}
          className="w-full py-2 text-xs transition-colors"
          style={{ color: confirmClose ? '#f87171' : '#3d4a5c' }}
        >
          {confirmClose
            ? `yes, I'll miss out on ${plan.name} forever 💔`
            : 'maybe later (you will lose this offer)'}
        </button>
      </div>
    </div>,
    document.body
  )

  return (
    <>
      {portal}
      {purchaseItem && (
        <PurchaseModal
          item={purchaseItem}
          onClose={() => setPurchaseItem(null)}
          onSuccess={() => {
            setPurchaseItem(null)
            onClose()
          }}
        />
      )}
    </>
  )
}
