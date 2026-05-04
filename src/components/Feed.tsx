import { Fragment, useState } from 'react'
import { createPortal } from 'react-dom'
import { tweets, currentUser, predictionMarkets } from '../data'
import { TweetCard } from './Tweet'
import { PaywallModal } from './PaywallModal'
import { PurchaseModal } from './PurchaseModal'

const BET_AMOUNTS = [1, 5, 10, 25]
function calcWin(amount: number, odds: number) {
  return ((100 / odds) * 0.85 * amount).toFixed(2)
}

function MarketBetModal({ side, onClose }: { side: 'YES' | 'NO'; onClose: () => void }) {
  const market = predictionMarkets[0]
  const odds = side === 'YES' ? market.yesOdds : market.noOdds
  const [betPurchaseItem, setBetPurchaseItem] = useState<{ emoji: string; name: string; description: string; price: string; quantityLabel: string } | null>(null)
  const [settled, setSettled] = useState(false)
  const [confirmClose, setConfirmClose] = useState(false)

  const handleClose = () => {
    if (settled) { onClose(); return }
    if (confirmClose) { onClose(); return }
    setConfirmClose(true)
  }

  const placeBet = (amount: number) => {
    setBetPurchaseItem({
      emoji: '🔮',
      name: `${side} — ${market.question}`,
      description: `Potential win: $${calcWin(amount, odds)} · We only take a tiny 15% cut of your winnings 🤝`,
      price: `$${amount.toFixed(2)}`,
      quantityLabel: `${side} at ${odds}% odds`,
    })
  }

  return (
    <>
      {createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative bg-[#131720] rounded-2xl p-5 max-w-sm w-full border border-[#1e2636]"
            style={{ boxShadow: '0 0 60px rgba(251,146,60,0.3)' }}
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 text-xs font-bold transition-colors"
              style={{ color: confirmClose ? '#f87171' : '#6b7591' }}
            >
              {confirmClose ? 'Sure? 💔' : '✕'}
            </button>

            {settled ? (
              <>
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">📉</div>
                  <h2 className="text-lg font-black" style={{ color: '#f87171' }}>Market Resolved 😤</h2>
                  <p className="text-[#6b7591] text-sm mt-1">{market.nearMiss[side]}</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-rainbow w-full py-3 rounded-xl text-white font-black text-sm hover:opacity-90 transition-opacity"
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <span
                    className="text-[10px] font-black px-2 py-0.5 rounded-full mb-2 inline-block"
                    style={{ backgroundColor: '#fb923c20', color: '#fb923c', border: '1px solid #fb923c40' }}
                  >
                    🔮 Live Market · ⏰ Closing Soon
                  </span>
                  <p className="font-black text-base text-[#f0f2f8] leading-snug mb-2">{market.question}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black shrink-0" style={{ color: '#34d399' }}>YES {market.yesOdds}%</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-[#2a3547]">
                      <div className="h-full rounded-full bg-[#34d399]" style={{ width: `${market.yesOdds}%` }} />
                    </div>
                    <span className="text-xs font-black shrink-0" style={{ color: '#f87171' }}>NO {market.noOdds}%</span>
                  </div>
                </div>

                <div className="mb-1">
                  <span className="text-sm font-black" style={{ color: side === 'YES' ? '#34d399' : '#f87171' }}>
                    Betting {side} — pick an amount
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {BET_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => placeBet(amt)}
                      className="rounded-xl py-2.5 px-3 text-left hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#1e2636', border: '1px solid #2a3547' }}
                    >
                      <div className="text-sm font-black text-[#f0f2f8]">${amt}</div>
                      <div className="text-xs" style={{ color: '#34d399' }}>→ ${calcWin(amt, odds)}</div>
                    </button>
                  ))}
                </div>
                <p className="text-[9px] text-[#3d4a5c] text-center">* We only take a tiny 15% cut of your winnings 🤝</p>
              </>
            )}
          </div>
        </div>,
        document.body
      )}

      {betPurchaseItem && (
        <PurchaseModal
          item={betPurchaseItem}
          onClose={() => setBetPurchaseItem(null)}
          onSuccess={() => { setBetPurchaseItem(null); setSettled(true) }}
        />
      )}
    </>
  )
}

function MarketFeedCard({ onPickSide }: { onPickSide: (side: 'YES' | 'NO') => void }) {
  const market = predictionMarkets[0]
  return (
    <div
      className="mx-3 my-2.5 rounded-xl bg-[#131720] p-4"
      style={{
        border: '1px solid #fb923c55',
        borderLeft: '3px solid #fb923c',
        boxShadow: '0 4px 64px rgba(251,146,60,0.55), 0 0 0 1px rgba(251,146,60,0.22)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-black tracking-widest uppercase" style={{ color: '#fb923c' }}>
          🔮 Live Market
        </span>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse"
          style={{ backgroundColor: '#f8717120', color: '#f87171', border: '1px solid #f8717140' }}
        >
          ⏰ Closing Soon
        </span>
      </div>

      <p className="font-black text-sm text-[#f0f2f8] mb-3 leading-snug">{market.question}</p>

      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-black w-16 text-right shrink-0" style={{ color: '#34d399' }}>YES {market.yesOdds}%</span>
        <div className="flex-1 h-2 rounded-full overflow-hidden bg-[#2a3547]">
          <div className="h-full rounded-full" style={{ width: `${market.yesOdds}%`, background: 'linear-gradient(90deg, #34d399, #22d3ee)' }} />
        </div>
        <span className="text-xs font-black w-16 shrink-0" style={{ color: '#f87171' }}>NO {market.noOdds}%</span>
      </div>

      <div className="text-[10px] text-[#6b7591] mb-3">{market.activity} 🔥</div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPickSide('YES')}
          className="flex-1 py-2 rounded-xl text-xs font-black hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#34d39922', color: '#34d399', border: '1px solid #34d39955' }}
        >
          Predict YES
        </button>
        <button
          type="button"
          onClick={() => onPickSide('NO')}
          className="flex-1 py-2 rounded-xl text-xs font-black hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#f8717122', color: '#f87171', border: '1px solid #f8717155' }}
        >
          Predict NO
        </button>
      </div>
      <p className="text-[9px] text-[#3d4a5c] text-center mt-2">4,821 active traders · Join the market</p>
    </div>
  )
}

function SponsoredCard({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div
      className="mx-3 my-2.5 rounded-xl bg-[#131720] p-4"
      style={{
        border: '1px solid #facc1555',
        borderLeft: '3px solid #facc15',
        boxShadow: '0 4px 64px rgba(250, 204, 21, 0.55), 0 0 0 1px rgba(250, 204, 21, 0.22)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-black tracking-widest uppercase" style={{ color: '#facc15' }}>
          💰 Sponsored
        </span>
        <span className="text-[#3d4a5c] text-xs cursor-pointer hover:text-[#6b7591]">Why am I seeing this?</span>
      </div>

      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-[#0d0f14] text-lg bg-[#facc15] font-black">
          💎
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-black text-sm mb-1" style={{ color: '#facc15' }}>Xhitter Premium Gold+</div>
          <p className="text-[#dde1ec] text-[14px] leading-relaxed">
            Your posts deserve to be SEEN. Upgrade and unlock{' '}
            <span className="font-bold" style={{ color: '#34d399' }}>10× the reach</span>,
            see who viewed your profile, and spin for prizes every day. 🔥
          </p>
          <div className="flex gap-2 mt-2.5 flex-wrap">
            {['👑 Verified', '🎰 Daily spins', '📈 Analytics', '👁 Profile views'].map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-[#1e2636] border border-[#2a3547]"
                style={{ color: '#a78bfa' }}
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={onUpgrade}
            className="btn-rainbow mt-3 px-5 py-2 rounded-full text-white font-black text-sm hover:opacity-90 transition-opacity"
          >
            UPGRADE NOW — 50% OFF annual 🔥
          </button>
        </div>
      </div>
    </div>
  )
}

function BoostModal({ onClose }: { onClose: () => void }) {
  const [confirmClose, setConfirmClose] = useState(false)
  const [showPurchase, setShowPurchase] = useState(false)
  const [boosted, setBoosted] = useState(false)

  const handleClose = () => {
    if (boosted) { onClose(); return }
    if (confirmClose) { onClose(); return }
    setConfirmClose(true)
  }

  return (
    <>
      {createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div
          className="relative bg-[#131720] rounded-2xl p-6 max-w-sm w-full border border-[#1e2636] text-center"
          style={{ boxShadow: '0 0 60px rgba(52, 211, 153, 0.3)' }}
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 text-xs font-bold transition-colors"
            style={{ color: confirmClose ? '#f87171' : '#6b7591' }}
          >
            {confirmClose ? 'Sure? 💔' : '✕'}
          </button>

          {boosted ? (
            <>
              <div className="text-5xl mb-2">🚀</div>
              <h2 className="text-xl font-black" style={{ color: '#34d399' }}>Post Boosted!</h2>
              <p className="text-[#6b7591] text-sm mt-1 mb-4">Reaching ~1,200 people right now</p>
              <div className="rounded-xl p-3 mb-4 bg-[#1e2636]">
                <div className="text-xs text-[#6b7591]">Estimated reach</div>
                <div className="text-3xl font-black mt-1" style={{ color: '#34d399' }}>~1,200</div>
                <div className="w-full h-1.5 rounded-full bg-[#2a3547] mt-2 overflow-hidden">
                  <div className="h-full rounded-full btn-rainbow" style={{ width: '100%' }} />
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="btn-rainbow w-full py-3 rounded-xl text-white font-black text-base hover:opacity-90 transition-opacity"
              >
                Awesome! 🎉
              </button>
            </>
          ) : (
            <>
              <div className="text-5xl mb-2">🚀</div>
              <h2 className="text-xl font-black text-[#f0f2f8]">Your post is live!</h2>
              <p className="text-[#6b7591] text-sm mt-1 mb-4">Want to reach 10× more people right now?</p>

              <div className="rounded-xl p-4 mb-4 text-left space-y-2 bg-[#1e2636]">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b7591]">Without boost</span>
                  <span className="text-[#f0f2f8]">~12 people 😴</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-bold" style={{ color: '#34d399' }}>With boost 🚀</span>
                  <span className="font-black" style={{ color: '#34d399' }}>~1,200 people</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPurchase(true)}
                className="btn-rainbow w-full py-3 rounded-xl text-white font-black text-base hover:opacity-90 transition-opacity mb-2"
              >
                Boost Now — $4.99 🚀
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2 text-xs transition-colors"
                style={{ color: confirmClose ? '#f87171' : '#3d4a5c' }}
              >
                {confirmClose ? 'yes, stay invisible 💔' : 'no thanks, stay invisible'}
              </button>
            </>
          )}
        </div>
      </div>,
      document.body
      )}

      {showPurchase && (
        <PurchaseModal
          item={{
            emoji: '🚀',
            name: 'Post Boost',
            description: 'Amplify your post to ~1,200 people for 24 hours',
            price: '$4.99',
            quantityLabel: '1 Post Boost (24h)',
          }}
          onClose={() => setShowPurchase(false)}
          onSuccess={() => {
            setShowPurchase(false)
            setBoosted(true)
          }}
        />
      )}
    </>
  )
}

export function Feed() {
  const [draft, setDraft] = useState('')
  const [showPaywall, setShowPaywall] = useState(false)
  const [paywallFeature, setPaywallFeature] = useState('Following feed')
  const [showBoost, setShowBoost] = useState(false)
  const [marketBetSide, setMarketBetSide] = useState<'YES' | 'NO' | null>(null)

  const openPaywall = (feature: string) => {
    setPaywallFeature(feature)
    setShowPaywall(true)
  }

  const handlePost = () => {
    setDraft('')
    setShowBoost(true)
  }

  return (
    <>
      <div>
        <div className="sticky top-0 bg-[#0d0f14] border-b border-[#1e2636] z-10">
          <div className="flex">
            <button
              type="button"
              className="flex-1 py-4 text-sm font-semibold transition-colors relative hover:bg-white/[0.04]"
              style={{ color: '#e879f9' }}
            >
              Latest
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full"
                style={{ backgroundColor: '#e879f9' }}
              />
            </button>
            <button
              type="button"
              className="flex-1 py-4 text-sm font-semibold transition-colors relative hover:bg-white/[0.04]"
              style={{ color: '#6b7591' }}
              onClick={() => openPaywall('Following feed')}
            >
              Following 🔒
            </button>
          </div>
        </div>

        <div className="px-4 pt-4 pb-3 border-b border-[#1e2636]">
          <div className="flex gap-3">
            <div
              className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-[#0d0f14] text-xs font-bold mt-1"
              style={{ backgroundColor: currentUser.avatarColor }}
            >
              {currentUser.initials}
            </div>
            <div className="flex-1 min-w-0">
              <textarea
                className="w-full bg-transparent text-[#f0f2f8] placeholder-[#3d4a5c] text-lg resize-none outline-none min-h-[72px] pt-1.5"
                placeholder="What's on your mind?"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <div className="flex justify-end items-center pt-2 border-t border-[#1e2636]">
                <button
                  type="button"
                  disabled={!draft.trim()}
                  className="btn-rainbow text-white font-bold px-5 py-1.5 rounded-full text-sm hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                  onClick={handlePost}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="py-1">
          {tweets.map((tweet, i) => (
            <Fragment key={tweet.id}>
              <TweetCard tweet={tweet} />
              {i === 2 && (
                <SponsoredCard onUpgrade={() => openPaywall('Premium')} />
              )}
              {i === 4 && (
                <MarketFeedCard onPickSide={(side) => setMarketBetSide(side)} />
              )}
            </Fragment>
          ))}
        </div>
      </div>

      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} feature={paywallFeature} />}
      {showBoost && <BoostModal onClose={() => setShowBoost(false)} />}
      {marketBetSide && <MarketBetModal side={marketBetSide} onClose={() => setMarketBetSide(null)} />}
    </>
  )
}
