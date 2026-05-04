import { useState, useEffect } from 'react'
import { PaywallModal } from './PaywallModal'

export function MobileGate() {
  const [showPaywall, setShowPaywall] = useState(false)
  const [seconds, setSeconds] = useState(899)

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 899)), 1000)
    return () => clearInterval(id)
  }, [])

  const timeStr = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`

  return (
    <>
      <div className="min-h-screen bg-[#0d0f14] flex flex-col items-center justify-center px-6 py-10 text-center overflow-y-auto">
        {/* Branding */}
        <div className="mb-6">
          <div
            className="text-3xl font-black mb-1"
            style={{ background: 'linear-gradient(135deg, #e879f9, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Xhitter
          </div>
          <div className="text-[#3d4a5c] text-xs">the social network that loves you back*</div>
        </div>

        {/* Blurred app preview */}
        <div className="relative w-full max-w-xs mb-6 rounded-2xl overflow-hidden">
          <div
            className="p-4 space-y-3"
            style={{ backgroundColor: '#131720', border: '1px solid #1e2636', filter: 'blur(4px)', userSelect: 'none', pointerEvents: 'none' }}
            aria-hidden
          >
            {[
              { color: '#e879f9', name: 'Vera Grimm', text: 'Another week, another startup claiming AGI. The demo was it correctly guessing that Paris is in France.' },
              { color: '#22d3ee', name: 'Gary Null', text: 'my landlord raised rent because the neighborhood has "increased energy". I am the increased energy.' },
              { color: '#34d399', name: 'Nina Bias', text: 'I helped build this thing and I am begging you to stop anthropomorphizing it.' },
            ].map((p) => (
              <div key={p.name} className="flex gap-3 text-left">
                <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black text-[#0d0f14]" style={{ backgroundColor: p.color }}>
                  {p.name.split(' ').map(w => w[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[#f0f2f8]">{p.name}</div>
                  <div className="text-[11px] text-[#6b7591] leading-snug mt-0.5">{p.text}</div>
                </div>
              </div>
            ))}
          </div>
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2"
            style={{ background: 'linear-gradient(to bottom, #0d0f1444 0%, #0d0f14bb 50%, #0d0f14 100%)' }}
          >
            <div className="text-4xl">📱</div>
            <div className="text-base font-black text-[#f0f2f8]">Premium Only</div>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-2xl font-black text-[#f0f2f8] mb-2">Mobile is a Premium Feature</h1>
        <p className="text-[#6b7591] text-sm mb-6 max-w-xs leading-relaxed">
          Xhitter on mobile is exclusive to Premium members. Upgrade to take the chaos with you.
        </p>

        {/* Countdown */}
        <div
          className="rounded-xl px-5 py-3 mb-5 w-full max-w-xs"
          style={{ backgroundColor: '#1e2636', border: '1px solid #f8717144' }}
        >
          <div className="text-[10px] font-black tracking-widest uppercase mb-0.5" style={{ color: '#f87171' }}>
            ⚡ Limited Offer Ends In
          </div>
          <div className="text-3xl font-black" style={{ color: '#f87171' }}>{timeStr}</div>
        </div>

        {/* Social proof */}
        <div className="text-xs text-[#6b7591] mb-6">
          <span className="font-bold" style={{ color: '#34d399' }}>4,821</span> Premium members on mobile right now 🔥
          <br />
          <span className="text-[10px]">3 people just upgraded in the last minute</span>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={() => setShowPaywall(true)}
          className="btn-rainbow w-full max-w-xs py-4 rounded-2xl text-white font-black text-lg hover:opacity-90 transition-opacity mb-2"
        >
          Unlock Mobile Access 📱
        </button>
        <div className="text-xs text-[#6b7591] mb-6">from $14.99/mo · cancel anytime</div>

        {/* Alternative access */}
        <div className="w-full max-w-xs mb-6 rounded-xl p-4" style={{ backgroundColor: '#131720', border: '1px solid #1e2636' }}>
          <p className="text-xs text-[#6b7591] mb-3 leading-relaxed">
            Alternatively, you can access Xhitter on a <span className="text-[#f0f2f8] font-bold">computer</span> for free.
            <br />
            <span className="text-[10px]">Don't have one? We've got you covered.</span>
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href="https://www.apple.com/shop/buy-mac"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg transition-colors hover:bg-white/5"
              style={{ border: '1px solid #1e2636' }}
            >
              {/* Apple logo */}
              <svg viewBox="0 0 814 1000" className="w-6 h-6 fill-[#f0f2f8]">
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-155.5-127.4C46 790.7 0 663.4 0 541.8c0-207.9 133.7-318 265-318 70.4 0 128.7 46.1 171.8 46.1 41.8 0 107.6-48.8 185.4-48.8zM653.3 149.2c31.1-37.6 53.4-89.8 53.4-142 0-7.3-.6-14.7-1.9-20.7-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 84.7-55.1 137.6 0 8.3 1.3 16.6 1.9 19.2 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.2-71.2z" />
              </svg>
              <span className="text-[10px] font-bold text-[#f0f2f8]">Apple Mac</span>
              <span className="text-[9px] text-[#34d399]">Shop now →</span>
            </a>
            <a
              href="https://www.lenovo.com/us/en/laptops/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg transition-colors hover:bg-white/5"
              style={{ border: '1px solid #1e2636' }}
            >
              {/* Lenovo wordmark */}
              <svg viewBox="0 0 200 40" className="w-16 h-6 fill-[#f0f2f8]">
                <text x="0" y="32" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="36">LENOVO</text>
              </svg>
              <span className="text-[10px] font-bold text-[#f0f2f8]">Lenovo Laptop</span>
              <span className="text-[9px] text-[#34d399]">Shop now →</span>
            </a>
          </div>
          <p className="text-[8px] text-[#3d4a5c] mt-2 text-center">Sponsored · We earn a commission on purchases</p>
        </div>

        {/* Footnote */}
        <p className="text-[9px] text-[#3d4a5c] max-w-xs">
          * Xhitter does not love you back. Mobile access requires an active Premium subscription.
          Desktop version available at no charge. By continuing you agree to our Terms, Privacy Policy,
          and the fact that we know what you're doing.
        </p>
      </div>

      {showPaywall && (
        <PaywallModal feature="mobile access" onClose={() => setShowPaywall(false)} />
      )}
    </>
  )
}
