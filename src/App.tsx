import { useState, useEffect } from 'react'
import { LeftSidebar } from './components/LeftSidebar'
import { Feed } from './components/Feed'
import { RightSidebar } from './components/RightSidebar'
import { SpinWheelModal } from './components/SpinWheelModal'
import { PaywallModal } from './components/PaywallModal'
import { MobileGate } from './components/MobileGate'

export default function App() {
  const [showSpin, setShowSpin] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [showViral, setShowViral] = useState(false)
  const [viralConfirmClose, setViralConfirmClose] = useState(false)

  useEffect(() => {
    if (window.innerWidth < 640) return
    const viralId = setTimeout(() => setShowViral(true), 8000)
    const spinDelay = 30000 + Math.random() * 30000
    const spinId = setTimeout(() => setShowSpin(true), spinDelay)
    return () => { clearTimeout(viralId); clearTimeout(spinId) }
  }, [])

  const handleViralClose = () => {
    if (viralConfirmClose) {
      setShowViral(false)
      setViralConfirmClose(false)
    } else {
      setViralConfirmClose(true)
    }
  }

  return (
    <div className="min-h-screen text-[#f0f2f8]">
      {/* Mobile gate — replaces everything on small screens */}
      <div className="sm:hidden">
        <MobileGate />
      </div>

      {/* Aurora — z:-1 so it's above body canvas but below all content */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden hidden sm:block" style={{ zIndex: -1 }}>
        <div style={{ position: 'absolute', left: '-160px', top: '8%', width: '480px', height: '480px', borderRadius: '50%', background: '#e879f9', filter: 'blur(130px)', opacity: 0.18, animation: 'aurora 9s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', left: '-120px', bottom: '10%', width: '360px', height: '360px', borderRadius: '50%', background: '#a78bfa', filter: 'blur(110px)', opacity: 0.18, animation: 'aurora 11s ease-in-out infinite 2.5s' }} />
        <div style={{ position: 'absolute', right: '-160px', top: '15%', width: '480px', height: '480px', borderRadius: '50%', background: '#22d3ee', filter: 'blur(130px)', opacity: 0.18, animation: 'aurora 8s ease-in-out infinite 1s' }} />
        <div style={{ position: 'absolute', right: '-120px', bottom: '15%', width: '400px', height: '400px', borderRadius: '50%', background: '#facc15', filter: 'blur(110px)', opacity: 0.18, animation: 'aurora 12s ease-in-out infinite 3.5s' }} />
        <div style={{ position: 'absolute', left: '30%', top: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: '#34d399', filter: 'blur(100px)', opacity: 0.18, animation: 'aurora 10s ease-in-out infinite 1.5s' }} />
      </div>

      {/* Content wrapper — desktop only */}
      <div className="hidden sm:flex max-w-[1280px] mx-auto min-h-screen">
        <aside className="hidden sm:flex w-[68px] xl:w-[275px] shrink-0 sticky top-0 h-screen flex-col px-1 xl:px-2">
          <LeftSidebar />
        </aside>

        {/* bg-[#0d0f14] prevents the aurora from bleeding through the feed column */}
        <main className="flex-1 min-w-0 max-w-[600px] border-x border-[#1e2636] bg-[#0d0f14]">
          <Feed />
        </main>

        <aside className="hidden lg:block w-[350px] shrink-0 px-7">
          <RightSidebar />
        </aside>
      </div>

      {/* Floating spin button — desktop only */}
      <button
        type="button"
        onClick={() => setShowSpin(true)}
        className="hidden sm:block fixed bottom-6 right-6 z-40 btn-rainbow text-white font-black text-sm px-4 py-3 rounded-full hover:opacity-90 transition-opacity"
        style={{ boxShadow: '0 0 28px rgba(250, 204, 21, 0.55), 0 0 56px rgba(250, 204, 21, 0.25)' }}
      >
        🎰 SPIN TO WIN
      </button>

      {/* All modals below are z-50 in root stacking context — above floating button */}

      {showViral && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative bg-[#131720] rounded-2xl p-6 max-w-sm w-full border border-[#1e2636] text-center"
            style={{ boxShadow: '0 0 60px rgba(52, 211, 153, 0.35)' }}
          >
            <button
              type="button"
              onClick={handleViralClose}
              className="absolute top-4 right-4 text-xs font-bold transition-colors"
              style={{ color: viralConfirmClose ? '#f87171' : '#3d4a5c' }}
            >
              {viralConfirmClose ? 'Sure? 💔' : '✕'}
            </button>
            <div className="text-5xl mb-2">🔥</div>
            <h2 className="text-xl font-black text-[#f0f2f8]">You're going VIRAL!</h2>
            <p className="text-[#6b7591] text-sm mt-1 mb-4">
              127 people viewed your profile in the last hour
            </p>
            <div className="rounded-xl p-3 mb-4 text-left space-y-2" style={{ backgroundColor: '#1e2636' }}>
              <div className="flex items-center gap-2 text-sm">
                <span style={{ color: '#34d399' }}>👁</span>
                <span className="text-[#dde1ec]">See <span className="font-bold" style={{ color: '#34d399' }}>exactly who</span> viewed your profile</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span style={{ color: '#22d3ee' }}>📍</span>
                <span className="text-[#dde1ec]">Their location, device & time spent</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span style={{ color: '#e879f9' }}>🔔</span>
                <span className="text-[#dde1ec]">Real-time alerts when someone visits</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setShowViral(false); setShowPaywall(true) }}
              className="btn-rainbow w-full py-3 rounded-xl text-white font-black text-base hover:opacity-90 transition-opacity mb-2"
            >
              See Who Viewed — Upgrade Now 👁
            </button>
            <button
              type="button"
              onClick={handleViralClose}
              className="w-full py-2 text-xs transition-colors"
              style={{ color: viralConfirmClose ? '#f87171' : '#3d4a5c' }}
            >
              {viralConfirmClose ? "yes, I don't want to know 💔" : 'stay anonymous, I guess'}
            </button>
          </div>
        </div>
      )}

      {showSpin && (
        <SpinWheelModal
          onClose={() => setShowSpin(false)}
          onUpgrade={() => { setShowSpin(false); setShowPaywall(true) }}
        />
      )}

      {showPaywall && (
        <PaywallModal onClose={() => setShowPaywall(false)} feature="Premium" />
      )}
    </div>
  )
}
