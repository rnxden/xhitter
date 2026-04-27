import type { ReactNode } from 'react'
import { useState } from 'react'
import { currentUser } from '../data'
import { AppMark, PenIcon, HomeIcon, SearchIcon, BellIcon, MailIcon, BookmarkIcon, UserIcon, MoreHorizIcon } from './icons'
import { PaywallModal } from './PaywallModal'

type NavItemDef = { icon: ReactNode; label: string; color: string; badge?: number }

const navItems: NavItemDef[] = [
  { icon: <HomeIcon />, label: 'Home', color: '#e879f9' },
  { icon: <SearchIcon />, label: 'Explore', color: '#22d3ee' },
  { icon: <BellIcon />, label: 'Notifications', color: '#34d399', badge: 47 },
  { icon: <MailIcon />, label: 'Messages', color: '#fb923c' },
  { icon: <BookmarkIcon />, label: 'Bookmarks', color: '#f87171' },
  { icon: <UserIcon />, label: 'Profile', color: '#a78bfa' },
  { icon: <MoreHorizIcon />, label: 'More', color: '#facc15' },
]

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

  const openPaywall = (feature: string, detected = false) => {
    setPaywallFeature(feature)
    setDetectedUpgrade(detected)
    setShowPaywall(true)
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
    </>
  )
}
