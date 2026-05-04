import { useState } from 'react'
import { trendingTopics, suggestedUsers } from '../data'
import { SearchIcon } from './icons'
import { PaywallModal } from './PaywallModal'
import { PurchaseModal } from './PurchaseModal'
import type { PurchaseItem } from './PurchaseModal'

const trendColors = ['#e879f9', '#22d3ee', '#34d399', '#fb923c', '#f87171']

const CARD_BUNDLES = [
  { draws: 1, price: '$0.99' },
  { draws: 5, price: '$3.99', popular: true },
  { draws: 30, price: '$14.99', note: '$0.50/draw' },
]

export function RightSidebar() {
  const [followed, setFollowed] = useState<Set<string>>(new Set())
  const [showPaywall, setShowPaywall] = useState(false)
  const [paywallFeature, setPaywallFeature] = useState('this feature')
  const [cardPurchase, setCardPurchase] = useState(false)
  const [flippedCard, setFlippedCard] = useState<number | null>(null)
  const [purchaseItem, setPurchaseItem] = useState<PurchaseItem | null>(null)
  const [cardTokens, setCardTokens] = useState(0)

  const openPaywall = (feature: string) => {
    setPaywallFeature(feature)
    setShowPaywall(true)
  }

  const toggleFollow = (id: string) => {
    setFollowed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const flipCard = (i: number) => {
    setFlippedCard(i)
    setTimeout(() => setCardPurchase(true), 400)
  }

  const resetCards = () => {
    setFlippedCard(null)
    setCardPurchase(false)
  }

  return (
    <>
      <div className="py-4 space-y-6">
        {/* Search — paywalled */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7591] pointer-events-none">
            <SearchIcon size={16} />
          </div>
          <input
            type="text"
            placeholder="Search"
            readOnly
            onFocus={() => openPaywall('search')}
            className="w-full bg-[#131720] text-[#f0f2f8] rounded-lg py-2.5 pl-9 pr-4 text-sm outline-none placeholder-[#3d4a5c] border border-[#1e2636] focus:border-[#a78bfa] transition-colors cursor-pointer"
          />
        </div>

        {/* Live ticker */}
        <div
          className="rounded-xl px-3 py-2.5 flex items-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #131720, #1a1f2e)',
            border: '1px solid #1e2636',
            borderLeft: '3px solid #f87171',
          }}
        >
          <span className="w-2 h-2 rounded-full bg-[#f87171] shrink-0 animate-pulse" />
          <span className="text-xs font-bold text-[#f87171]">LIVE</span>
          <span className="text-xs text-[#dde1ec]">4,821 people online right now</span>
        </div>

        {/* Trending — last 2 blurred */}
        <section>
          <h2 className="text-xs font-bold tracking-widest uppercase mb-3 px-0.5" style={{ color: '#e879f9' }}>
            Trending
          </h2>
          <div className="space-y-0.5">
            {trendingTopics.slice(0, 3).map((trend, i) => (
              <button
                key={trend.topic}
                type="button"
                className="w-full text-left px-2 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[#6b7591] text-xs mb-0.5">{trend.category}</div>
                    <div className="font-semibold text-[#f0f2f8] text-sm">{trend.topic}</div>
                    <div className="text-[#6b7591] text-xs mt-0.5">{trend.postCount} posts</div>
                  </div>
                  <span
                    className="text-xs font-mono font-bold pt-0.5 shrink-0"
                    style={{ color: trendColors[i % trendColors.length] }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              </button>
            ))}

            {/* Blurred premium-locked trends */}
            <div className="relative">
              {trendingTopics.slice(3).map((trend, i) => (
                <button
                  key={trend.topic}
                  type="button"
                  tabIndex={-1}
                  aria-hidden
                  className="w-full text-left px-2 py-2.5 rounded-lg pointer-events-none select-none"
                  style={{ filter: 'blur(5px)' }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[#6b7591] text-xs mb-0.5">{trend.category}</div>
                      <div className="font-semibold text-[#f0f2f8] text-sm">{trend.topic}</div>
                      <div className="text-[#6b7591] text-xs mt-0.5">{trend.postCount} posts</div>
                    </div>
                    <span
                      className="text-xs font-mono font-bold pt-0.5 shrink-0"
                      style={{ color: trendColors[(i + 3) % trendColors.length] }}
                    >
                      {String(i + 4).padStart(2, '0')}
                    </span>
                  </div>
                </button>
              ))}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-xl cursor-pointer"
                style={{ background: 'linear-gradient(to bottom, #0d0f1455 0%, #0d0f14cc 50%, #0d0f14 100%)' }}
                onClick={() => openPaywall('full trending')}
              >
                <span className="text-sm font-black" style={{ color: '#e879f9' }}>🔒 Premium Only</span>
                <span className="text-xs text-[#6b7591]">See all trending topics</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openPaywall('full trending')}
            className="text-[#a78bfa] text-sm px-2 py-2 hover:underline"
          >
            Show more
          </button>
        </section>

        <div className="border-t border-[#1e2636]" />

        {/* Visibility Score */}
        <div
          className="rounded-xl p-3"
          style={{ background: '#131720', border: '1px solid #1e2636' }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-black tracking-widest uppercase" style={{ color: '#facc15' }}>
              📡 Visibility Score
            </span>
            <span className="text-xs font-bold" style={{ color: '#34d399' }}>Top 10%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[#1e2636] overflow-hidden mb-1.5">
            <div className="h-full rounded-full btn-rainbow" style={{ width: '73%' }} />
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-[10px] text-[#6b7591]">73 / 100</span>
            <span className="text-[10px]" style={{ color: '#f87171' }}>−8 pts from unboosted post</span>
          </div>
          <p className="text-[10px] text-[#6b7591] mb-1.5">
            Posts reach only <span className="font-bold text-[#f87171]">7% of your followers</span> when unboosted.
          </p>
          <button
            type="button"
            onClick={() => openPaywall('post visibility boost')}
            className="text-[10px] font-bold hover:underline"
            style={{ color: '#a78bfa' }}
          >
            Boost a post to recover your score →
          </button>
        </div>

        {/* Daily Card Draw */}
        <section>
          <div className="flex items-center justify-between mb-1 px-0.5">
            <h2 className="text-xs font-bold tracking-widest uppercase" style={{ color: '#22d3ee' }}>
              🃏 Daily Card Draw
            </h2>
            {cardTokens > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#22d3ee20', color: '#22d3ee', border: '1px solid #22d3ee40' }}>
                {cardTokens} token{cardTokens !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-[#6b7591] text-xs px-0.5 mb-3">Pick a card — reveal your prize!</p>

          {!cardPurchase ? (
            <>
              <div className="flex gap-2 justify-center">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => flipCard(i)}
                    className="flex-1 h-20 rounded-xl flex items-center justify-center text-3xl font-black transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: flippedCard === i
                        ? 'linear-gradient(135deg, #1e2636, #2a3547)'
                        : 'linear-gradient(135deg, #a78bfa22, #22d3ee22)',
                      border: flippedCard === i ? '1px solid #2a3547' : '1px solid #a78bfa55',
                      boxShadow: flippedCard === i ? 'none' : '0 0 16px rgba(167,139,250,0.18)',
                    }}
                  >
                    {flippedCard === i ? '🃏' : '🂠'}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-[#6b7591] text-center mt-2">Flip a card, reveal your fate 🃏</p>
            </>
          ) : (
            <div className="rounded-xl p-3" style={{ backgroundColor: '#1e2636', border: '1px solid #2a3547' }}>
              <div className="text-center mb-2.5">
                <div className="text-2xl">🃏</div>
                <div className="text-sm font-black" style={{ color: '#fb923c' }}>So close! 😤</div>
                <div className="text-[10px] text-[#6b7591] mt-0.5">The prize was behind another card. Try again?</div>
              </div>
              <div className="space-y-1.5 mb-2">
                {CARD_BUNDLES.map((b) => (
                  <button
                    key={b.draws}
                    type="button"
                    onClick={() =>
                      setPurchaseItem({
                        emoji: '🃏',
                        name: `${b.draws} Card Draw${b.draws > 1 ? 's' : ''}`,
                        description: 'More flips, more chances — the prize is in there somewhere',
                        price: b.price,
                        quantityLabel: `${b.draws} Card Draw${b.draws > 1 ? 's' : ''}`,
                      })
                    }
                    className="w-full flex items-center justify-between rounded-lg px-3 py-2 transition-all hover:opacity-90 relative"
                    style={{
                      backgroundColor: b.popular ? '#22d3ee18' : '#0d0f14',
                      border: b.popular ? '1px solid #22d3ee44' : '1px solid #2a3547',
                    }}
                  >
                    {b.popular && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[7px] bg-[#22d3ee] text-[#0d0f14] font-black px-1.5 rounded-full whitespace-nowrap">
                        POPULAR
                      </span>
                    )}
                    <span className="text-xs font-bold text-[#f0f2f8]">{b.draws} Draw{b.draws > 1 ? 's' : ''}</span>
                    <div className="text-right">
                      <span className="text-xs font-black" style={{ color: b.popular ? '#22d3ee' : '#f0f2f8' }}>{b.price}</span>
                      {b.note && <div className="text-[9px] text-[#6b7591]">{b.note}</div>}
                    </div>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => openPaywall('Premium card draws')}
                className="w-full py-1.5 text-[10px] font-bold hover:underline text-center"
                style={{ color: '#e879f9' }}
              >
                ⭐ Get Premium — 5 free winning draws daily
              </button>
            </div>
          )}
        </section>

        <div className="border-t border-[#1e2636]" />

        {/* People */}
        <section>
          <h2 className="text-xs font-bold tracking-widest uppercase mb-3 px-0.5" style={{ color: '#22d3ee' }}>
            People
          </h2>
          <div className="space-y-0.5">
            {suggestedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer"
              >
                <div
                  className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-[#0d0f14] text-xs font-bold"
                  style={{ backgroundColor: user.avatarColor }}
                >
                  {user.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate leading-tight" style={{ color: user.avatarColor }}>
                    {user.name}
                  </div>
                  <div className="text-[#6b7591] text-xs truncate">@{user.handle}</div>
                </div>
                <button
                  type="button"
                  className="shrink-0 font-bold text-xs py-1.5 px-3.5 rounded-full transition-all"
                  style={
                    followed.has(user.id)
                      ? { border: `1px solid ${user.avatarColor}`, color: user.avatarColor, opacity: 0.7 }
                      : { backgroundColor: user.avatarColor, color: '#0d0f14' }
                  }
                  onClick={(e) => { e.stopPropagation(); toggleFollow(user.id) }}
                >
                  {followed.has(user.id) ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => openPaywall('suggested people')}
            className="text-[#a78bfa] text-sm px-2 py-2 hover:underline"
          >
            Show more
          </button>
        </section>

        <div className="border-t border-[#1e2636]" />

        <div className="text-xs text-[#3d4a5c] flex flex-wrap gap-x-3 gap-y-1 px-0.5 pb-4">
          {['Terms', 'Privacy', 'Cookies', 'More'].map((link) => (
            <span key={link} className="hover:text-[#6b7591] hover:underline cursor-pointer transition-colors">
              {link}
            </span>
          ))}
          <span>© 2025 Xhitter</span>
        </div>
      </div>

      {showPaywall && (
        <PaywallModal feature={paywallFeature} onClose={() => setShowPaywall(false)} />
      )}

      {purchaseItem && (
        <PurchaseModal
          item={purchaseItem}
          onClose={() => setPurchaseItem(null)}
          onSuccess={() => {
            const draws = Number(purchaseItem.quantityLabel?.match(/\d+/)?.[0] ?? 0)
            setCardTokens((t) => t + draws)
            setPurchaseItem(null)
            resetCards()
          }}
        />
      )}
    </>
  )
}
