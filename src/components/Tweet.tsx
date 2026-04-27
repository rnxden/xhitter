import { useState } from 'react'
import type { Tweet } from '../data'
import {
  ReplyIcon,
  RetweetIcon,
  HeartIcon,
  HeartFilledIcon,
  ChartIcon,
  BookmarkIcon,
  BookmarkFilledIcon,
  ShareIcon,
} from './icons'

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

export function TweetCard({ tweet }: { tweet: Tweet }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(tweet.likeCount)
  const [retweeted, setRetweeted] = useState(false)
  const [retweetCount, setRetweetCount] = useState(tweet.retweetCount)
  const [bookmarked, setBookmarked] = useState(false)

  const toggleLike = () => {
    setLiked((v) => !v)
    setLikeCount((c) => (liked ? c - 1 : c + 1))
  }

  const toggleRetweet = () => {
    setRetweeted((v) => !v)
    setRetweetCount((c) => (retweeted ? c - 1 : c + 1))
  }

  return (
    <article
      className="tweet-card mx-3 my-2.5 rounded-xl bg-[#131720] p-4 cursor-pointer"
      style={{
        border: '1px solid #1e2636',
        borderLeft: `3px solid ${tweet.author.avatarColor}`,
        '--glow-color': `${tweet.author.avatarColor}33`,
      } as React.CSSProperties}
    >
      {tweet.retweetedBy && (
        <div className="flex items-center gap-2 text-[#6b7591] text-xs mb-2.5 pl-11">
          <RetweetIcon size={12} />
          <span>{tweet.retweetedBy} reposted</span>
        </div>
      )}

      <div className="flex gap-3">
        <div
          className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-[#0d0f14] text-sm font-bold"
          style={{ backgroundColor: tweet.author.avatarColor }}
        >
          {tweet.author.initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="font-bold text-sm hover:underline"
              style={{ color: tweet.author.avatarColor }}
            >
              {tweet.author.name}
            </span>
            <span className="text-[#6b7591] text-sm">
              @{tweet.author.handle} · {tweet.createdAt}
            </span>
          </div>

          <p className="mt-1 text-[#dde1ec] whitespace-pre-wrap leading-relaxed text-[15px]">
            {tweet.content}
          </p>

          {tweet.imageBg && (
            <div
              className="mt-3 rounded-lg h-48 w-full"
              style={{ backgroundColor: tweet.imageBg }}
            />
          )}

          <div className="flex items-center justify-between mt-3 text-[#6b7591] -ml-1.5 max-w-[400px]">
            <ActionBtn
              icon={<ReplyIcon />}
              count={fmt(tweet.replyCount)}
              hoverColor="#22d3ee"
              onClick={(e) => e.stopPropagation()}
            />
            <ActionBtn
              icon={<RetweetIcon />}
              count={fmt(retweetCount)}
              hoverColor="#34d399"
              active={retweeted}
              onClick={(e) => { e.stopPropagation(); toggleRetweet() }}
            />
            <ActionBtn
              icon={liked ? <HeartFilledIcon /> : <HeartIcon />}
              count={fmt(likeCount)}
              hoverColor="#f87171"
              active={liked}
              onClick={(e) => { e.stopPropagation(); toggleLike() }}
            />
            <ActionBtn
              icon={<ChartIcon />}
              count={tweet.viewCount}
              hoverColor="#a78bfa"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex items-center gap-0.5">
              <ActionIconBtn
                icon={bookmarked ? <BookmarkFilledIcon size={20} /> : <BookmarkIcon size={20} />}
                hoverColor="#facc15"
                active={bookmarked}
                onClick={(e) => { e.stopPropagation(); setBookmarked((v) => !v) }}
              />
              <ActionIconBtn
                icon={<ShareIcon size={20} />}
                hoverColor="#fb923c"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

type ActionBtnProps = {
  icon: React.ReactNode
  count: string
  hoverColor: string
  active?: boolean
  onClick: (e: React.MouseEvent) => void
}

function ActionBtn({ icon, count, hoverColor, active = false, onClick }: ActionBtnProps) {
  const [hovered, setHovered] = useState(false)
  const lit = active || hovered
  return (
    <button
      type="button"
      className="flex items-center gap-1 transition-colors"
      style={lit ? { color: hoverColor } : {}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <span
        className="p-1.5 rounded-full transition-colors"
        style={lit ? { backgroundColor: `${hoverColor}18` } : {}}
      >
        {icon}
      </span>
      <span className="text-sm">{count}</span>
    </button>
  )
}

type ActionIconBtnProps = {
  icon: React.ReactNode
  hoverColor: string
  active?: boolean
  onClick: (e: React.MouseEvent) => void
}

function ActionIconBtn({ icon, hoverColor, active = false, onClick }: ActionIconBtnProps) {
  const [hovered, setHovered] = useState(false)
  const lit = active || hovered
  return (
    <button
      type="button"
      className="p-1.5 rounded-full transition-colors"
      style={lit ? { color: hoverColor, backgroundColor: `${hoverColor}18` } : {}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {icon}
    </button>
  )
}
