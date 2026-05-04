import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { currentUser, predictionMarkets } from '../data'
import type { PredictionMarket } from '../data'
import { AppMark, PenIcon, HomeIcon, SearchIcon, BellIcon, MailIcon, BookmarkIcon, UserIcon, MoreHorizIcon, ChartIcon } from './icons'
import { PaywallModal } from './PaywallModal'
import { PurchaseModal } from './PurchaseModal'
import type { PurchaseItem } from './PurchaseModal'

type NavItemDef = { icon: ReactNode; label: string; color: string; badge?: number }

const navItems: NavItemDef[] = [
  { icon: <HomeIcon />, label: 'Home', color: '#e879f9' },
  { icon: <SearchIcon />, label: 'Explore', color: '#22d3ee' },
  { icon: <BellIcon />, label: 'Notifications', color: '#34d399', badge: 47 },
  { icon: <MailIcon />, label: 'Messages', color: '#fb923c' },
  { icon: <ChartIcon size={24} />, label: 'Markets', color: '#fb923c', badge: 2 },
  { icon: <BookmarkIcon />, label: 'Bookmarks', color: '#f87171' },
  { icon: <UserIcon />, label: 'Profile', color: '#a78bfa' },
  { icon: <MoreHorizIcon />, label: 'More', color: '#facc15' },
]

const BET_AMOUNTS = [1, 5, 10, 25]

function calcWin(amount: number, odds: number) {
  return ((100 / odds) * 0.85 * amount).toFixed(2)
}

function NavButton({ item, isActive, onClick }: { item: NavItemDef; isActive: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  const lit = isActive || hovered

  return (
    <button
      type="button"
      className="flex items-center gap-5 px-3 py-3 rounded-full w-full xl:justify-start justify-center font-semibold transition-colors"
      style={lit ? { color: item.color, backgroundColor: `${item.color}18` } : { color: '#6b7591' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <span className="relative">
        {item.icon}
        {item.badge !== undefined && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 rounded-full bg-[#f87171] text-[#0d0f14] text-[9px] font-black flex items-center justify-center px-0.5 animate-pulse">
            {item.badge}
          </span>
        )}
      </span>
      <span className="hidden xl:block text-base leading-none">{item.label}</span>
    </button>
  )
}

export function LeftSidebar() {
  const [showPaywall, setShowPaywall] = useState(false)
  const [paywallFeature, setPaywallFeature] = useState('this feature')
  const [detectedUpgrade, setDetectedUpgrade] = useState(false)

  // Prediction market state
  const [marketIndex, setMarketIndex] = useState(0)
  const [betSide, setBetSide] = useState<'YES' | 'NO' | null>(null)
  const [betPhase, setBetPhase] = useState<'idle' | 'result'>('idle')
  const [activeBet, setActiveBet] = useState<{ market: PredictionMarket; side: 'YES' | 'NO'; amount: number } | null>(null)
  const [betPurchaseItem, setBetPurchaseItem] = useState<PurchaseItem | null>(null)
  const [marketSeconds, setMarketSeconds] = useState(1123)

  useEffect(() => {
    const id = setInterval(() => setMarketSeconds((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [])

  const mktMins = Math.floor(marketSeconds / 60)
  const mktSecs = marketSeconds % 60
  const mktTimeStr = `${mktMins}:${String(mktSecs).padStart(2, '0')}`
  const mktUrgent = marketSeconds < 300

  const market = predictionMarkets[marketIndex]
  const betOdds = betSide === 'YES' ? market.yesOdds : market.noOdds

  const openPaywall = (feature: string, detected = false) => {
    setPaywallFeature(feature)
    setDetectedUpgrade(detected)
    setShowPaywall(true)
  }

  const resetBet = () => {
    setBetSide(null)
    setBetPhase('idle')
    setActiveBet(null)
  }

  const nextMarket = () => {
    setMarketIndex((i) => (i + 1) % predictionMarkets.length)
    resetBet()
  }

  const placeBet = (amount: number) => {
    if (!betSide) return
    const win = calcWin(amount, betOdds)
    setBetPurchaseItem({
      emoji: '🔮',
      name: `${betSide} — ${market.question.length > 42 ? market.question.slice(0, 42) + '…' : market.question}`,
      description: `Potential win: $${win} · We only take a tiny 15% cut of your winnings 🤝`,
      price: `$${amount.toFixed(2)}`,
      quantityLabel: `${betSide} at ${betOdds}% odds`,
    })
  }

  return (
    <>
      <div className="flex flex-col h-full py-2 xl:items-start items-center w-full">
        <button
          type="button"
          className="p-3 rounded-full hover:bg-white/5 transition-colors mb-1"
        >
          <AppMark size={28} />
        </button>

        <nav className="flex flex-col gap-0.5 w-full">
          {navItems.map((item) => (
            <NavButton
              key={item.label}
              item={item}
              isActive={item.label === 'Home'}
              onClick={
                item.label === 'Home'
                  ? () => {}
                  : () => openPaywall(item.label.toLowerCase())
              }
            />
          ))}
        </nav>

        {/* Upgrade button */}
        <div className="mt-3 w-full flex xl:justify-start justify-center px-1">
          <button
            type="button"
            onClick={() => openPaywall('Premium')}
            onMouseEnter={() => { if (!showPaywall) openPaywall('Premium', true) }}
            className="btn-upgrade text-white font-black rounded-full hover:opacity-90 transition-opacity xl:w-full xl:py-2.5 xl:px-4 xl:text-sm p-2.5"
          >
            <span className="hidden xl:block">⚡ Upgrade to Premium</span>
            <span className="xl:hidden text-base">⚡</span>
          </button>
        </div>

        <div className="mt-3 w-full flex xl:justify-start justify-center px-1">
          <button
            type="button"
            className="btn-rainbow text-white font-bold rounded-full hover:opacity-90 transition-opacity xl:w-full xl:py-3 xl:px-4 xl:text-base p-3"
          >
            <span className="hidden xl:block">Post</span>
            <span className="xl:hidden"><PenIcon size={20} /></span>
          </button>
        </div>

        {/* Prediction Markets widget — xl only */}
        <div className="hidden xl:block mt-4 w-full px-1">
          <div className="rounded-xl p-3" style={{ backgroundColor: '#131720', border: '1px solid #1e2636' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black tracking-widest uppercase" style={{ color: '#fb923c' }}>
                🔮 Markets
              </span>
              <button
                type="button"
                onClick={() => openPaywall('your market portfolio')}
                className="text-[10px] font-bold hover:underline"
                style={{ color: '#34d399' }}
              >
                +312% today ↗
              </button>
            </div>

            {betPhase === 'result' && activeBet ? (
              /* Result view */
              <div>
                <div className="text-center mb-2">
                  <div className="text-xl mb-0.5">📉</div>
                  <div className="text-xs font-black" style={{ color: '#f87171' }}>Market Resolved 😤</div>
                  <p className="text-[10px] text-[#dde1ec] mt-1 leading-relaxed">
                    {activeBet.market.nearMiss[activeBet.side]}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={resetBet}
                    className="flex-1 py-1.5 rounded-lg text-[10px] font-black hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#fb923c22', color: '#fb923c', border: '1px solid #fb923c44' }}
                  >
                    Bet Again
                  </button>
                  <button
                    type="button"
                    onClick={nextMarket}
                    className="flex-1 py-1.5 rounded-lg text-[10px] font-black hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#1e2636', color: '#6b7591', border: '1px solid #2a3547' }}
                  >
                    Next →
                  </button>
                </div>
              </div>
            ) : (
              /* Betting view */
              <>
                {/* Market info */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                    style={
                      marketIndex === 0 && mktUrgent
                        ? { backgroundColor: '#f8717120', color: '#f87171', border: '1px solid #f8717140' }
                        : { backgroundColor: '#fb923c20', color: '#fb923c', border: '1px solid #fb923c40' }
                    }
                  >
                    {marketIndex === 0 ? `⏰ ${mktTimeStr}` : `🕐 ${market.closesLabel}`}
                  </span>
                  <span className="text-[9px] text-[#6b7591]">{market.volume} vol.</span>
                </div>

                <p className="text-[11px] font-bold text-[#f0f2f8] mb-2 leading-snug">{market.question}</p>

                {/* Odds bar */}
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[10px] font-black shrink-0" style={{ color: '#34d399' }}>YES {market.yesOdds}%</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-[#2a3547]">
                    <div className="h-full rounded-full bg-[#34d399]" style={{ width: `${market.yesOdds}%` }} />
                  </div>
                  <span className="text-[10px] font-black shrink-0" style={{ color: '#f87171' }}>NO {market.noOdds}%</span>
                </div>

                <div className="text-[9px] text-[#6b7591] mb-2">{market.activity}</div>

                {!betSide ? (
                  /* Step 1: pick side */
                  <>
                    <div className="flex gap-1.5 mb-2">
                      <button
                        type="button"
                        onClick={() => setBetSide('YES')}
                        className="flex-1 py-1.5 rounded-lg text-[11px] font-black hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#34d39922', color: '#34d399', border: '1px solid #34d39944' }}
                      >
                        YES
                      </button>
                      <button
                        type="button"
                        onClick={() => setBetSide('NO')}
                        className="flex-1 py-1.5 rounded-lg text-[11px] font-black hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#f8717122', color: '#f87171', border: '1px solid #f8717144' }}
                      >
                        NO
                      </button>
                    </div>

                    {/* Blurred "see more" markets — premium locked */}
                    <div className="relative rounded-lg overflow-hidden">
                      <div
                        className="space-y-1.5 p-2"
                        style={{ filter: 'blur(3.5px)', pointerEvents: 'none', userSelect: 'none', backgroundColor: '#0d0f14' }}
                        aria-hidden
                      >
                        {predictionMarkets.filter((_, i) => i !== marketIndex).map((m) => (
                          <div key={m.id} className="flex items-center justify-between gap-2">
                            <span className="text-[9px] text-[#6b7591] truncate">{m.question}</span>
                            <div className="flex gap-1 shrink-0">
                              <span className="text-[8px] font-black px-1 py-0.5 rounded" style={{ backgroundColor: '#34d39922', color: '#34d399' }}>YES</span>
                              <span className="text-[8px] font-black px-1 py-0.5 rounded" style={{ backgroundColor: '#f8717122', color: '#f87171' }}>NO</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => openPaywall('all prediction markets')}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 w-full"
                        style={{ background: 'linear-gradient(to bottom, #0d0f1444 0%, #0d0f14bb 60%, #0d0f14 100%)' }}
                      >
                        <span className="text-[10px] font-black" style={{ color: '#fb923c' }}>🔒 See all markets</span>
                        <span className="text-[8px] text-[#6b7591]">Premium unlocks much more</span>
                      </button>
                    </div>
                  </>
                ) : (
                  /* Step 2: pick amount */
                  <>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black" style={{ color: betSide === 'YES' ? '#34d399' : '#f87171' }}>
                        Bet {betSide}
                      </span>
                      <button
                        type="button"
                        onClick={() => setBetSide(null)}
                        className="text-[10px] text-[#6b7591] hover:text-[#f0f2f8]"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {BET_AMOUNTS.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => placeBet(amt)}
                          className="rounded-lg py-1.5 px-2 text-left hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: '#0d0f14', border: '1px solid #2a3547' }}
                        >
                          <div className="text-[10px] font-black text-[#f0f2f8]">${amt}</div>
                          <div className="text-[9px]" style={{ color: '#34d399' }}>
                            → ${calcWin(amt, betOdds)}
                          </div>
                        </button>
                      ))}
                    </div>
                    <p className="text-[8px] text-[#3d4a5c] mt-1.5">* We only take a tiny 15% cut of your winnings 🤝</p>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <div className="mt-auto w-full">
          <button
            type="button"
            className="flex items-center gap-3 p-3 rounded-full hover:bg-white/5 transition-colors w-full xl:justify-start justify-center"
          >
            <div
              className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-[#0d0f14] text-sm font-bold"
              style={{ backgroundColor: currentUser.avatarColor }}
            >
              {currentUser.initials}
            </div>
            <div className="hidden xl:flex xl:flex-col text-left min-w-0 flex-1">
              <span className="font-bold text-sm text-[#f0f2f8] leading-tight truncate">{currentUser.name}</span>
              <span className="text-[#6b7591] text-sm leading-tight">@{currentUser.handle}</span>
            </div>
            <MoreHorizIcon size={18} className="hidden xl:block text-[#6b7591] shrink-0" />
          </button>
        </div>
      </div>

      {showPaywall && (
        <PaywallModal
          feature={paywallFeature}
          detected={detectedUpgrade}
          onClose={() => { setShowPaywall(false); setDetectedUpgrade(false) }}
        />
      )}

      {betPurchaseItem && (
        <PurchaseModal
          item={betPurchaseItem}
          onClose={() => setBetPurchaseItem(null)}
          onSuccess={() => {
            const bet = { market, side: betSide!, amount: Number(betPurchaseItem.price.replace('$', '')) }
            setBetPurchaseItem(null)
            setActiveBet(bet)
            setBetPhase('result')
            setBetSide(null)
          }}
        />
      )}
    </>
  )
}
