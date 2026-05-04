export type User = {
  id: string
  name: string
  handle: string
  bio: string
  followersCount: number
  followingCount: number
  initials: string
  avatarColor: string
  verified: boolean
}

export type Tweet = {
  id: string
  author: User
  content: string
  createdAt: string
  replyCount: number
  retweetCount: number
  likeCount: number
  viewCount: string
  imageBg?: string
  retweetedBy?: string
}

export type TrendingTopic = {
  category: string
  topic: string
  postCount: string
}

// ─── Current user ────────────────────────────────────────────────────────────

export const currentUser: User = {
  id: 'u0',
  name: 'John Doe',
  handle: 'johndoe',
  bio: 'Building things on the web.',
  followersCount: 142,
  followingCount: 89,
  initials: 'JD',
  avatarColor: '#a78bfa',
  verified: false,
}

// ─── Other users ─────────────────────────────────────────────────────────────

const sara: User = {
  id: 'u1',
  name: 'Sara Chen',
  handle: 'sarachen',
  bio: 'Journalist. Covering tech, politics, and the slow collapse of civilization. she/her',
  followersCount: 12400,
  followingCount: 443,
  initials: 'SC',
  avatarColor: '#e879f9',
  verified: true,
}

const marcus: User = {
  id: 'u2',
  name: 'Marcus Webb',
  handle: 'marcuswebb',
  bio: 'Software dev. Terminally online. Deeply unimpressed by most things.',
  followersCount: 3210,
  followingCount: 890,
  initials: 'MW',
  avatarColor: '#22d3ee',
  verified: false,
}

const leila: User = {
  id: 'u3',
  name: 'Leila Nouri',
  handle: 'leilanouri',
  bio: 'AI researcher. I helped build this thing and I am begging you to stop anthropomorphizing it.',
  followersCount: 47800,
  followingCount: 201,
  initials: 'LN',
  avatarColor: '#34d399',
  verified: true,
}

const jordan: User = {
  id: 'u4',
  name: 'Jordan Park',
  handle: 'jordanpark',
  bio: 'indie hacker | 3x founder | 0x exit | the 4th one is different I promise',
  followersCount: 8900,
  followingCount: 1200,
  initials: 'JP',
  avatarColor: '#fb923c',
  verified: false,
}

const alex: User = {
  id: 'u5',
  name: 'Alex Mercer',
  handle: 'alexmercer',
  bio: 'Political correspondent. My opinions are my own. My employer has no opinions.',
  followersCount: 23100,
  followingCount: 567,
  initials: 'AM',
  avatarColor: '#f87171',
  verified: true,
}

// ─── Suggested users (right sidebar) ─────────────────────────────────────────

export const suggestedUsers: User[] = [sara, leila, alex]

// ─── Trending topics (right sidebar) ─────────────────────────────────────────

export const trendingTopics: TrendingTopic[] = [
  { category: 'Politics · Trending', topic: '#TariffSzn', postCount: '214K' },
  { category: 'Trending', topic: 'AGI Achieved', postCount: '88.3K' },
  { category: 'Economy', topic: 'Recession Maybe', postCount: '61.7K' },
  { category: 'Entertainment · Trending', topic: 'Minecraft Movie 2', postCount: '39.1K' },
  { category: 'Trending in US', topic: '#RentIsUnreal', postCount: '103K' },
]

// ─── Prediction markets (right sidebar + feed card) ──────────────────────────

export type PredictionMarket = {
  id: string
  question: string
  yesOdds: number
  noOdds: number
  volume: string
  closesLabel: string
  activity: string
  expertSignal: string
  nearMiss: { YES: string; NO: string }
}

export const predictionMarkets: PredictionMarket[] = [
  {
    id: 'm1',
    question: 'Will the Fed cut rates in Q2 2026?',
    yesOdds: 44,
    noOdds: 56,
    volume: '$2.1M',
    closesLabel: 'LIVE',
    activity: '847 bets in the last hour',
    expertSignal: 'Strong NO',
    nearMiss: {
      YES: 'YES peaked at 49% before a last-minute NO sweep. You were this close.',
      NO: 'Resolved YES. A single $80K bet flipped the market in the final 90 seconds.',
    },
  },
  {
    id: 'm2',
    question: 'Another AI lab claims AGI by EOY 2026?',
    yesOdds: 91,
    noOdds: 9,
    volume: '$890K',
    closesLabel: '6h 12m',
    activity: 'Gary Null just won $38.40 · 2m ago',
    expertSignal: 'Hedge YES',
    nearMiss: {
      YES: 'Resolved NO. First time this market flipped in 3 months. You picked the wrong day.',
      NO: "Resolved YES. Bold play on the 9%. Should've gone with the crowd.",
    },
  },
  {
    id: 'm3',
    question: 'Will rent drop in any major US city by Q3?',
    yesOdds: 12,
    noOdds: 88,
    volume: '$445K',
    closesLabel: '2d 4h',
    activity: '1,203 bets today',
    expertSignal: 'Strong NO',
    nearMiss: {
      YES: "Resolved NO. Gutsy 8-to-1 play. The market loved you until it didn't.",
      NO: 'Resolved YES. Chad Grift called it — Premium Signal holders walked away up.',
    },
  },
]

// ─── Feed tweets ─────────────────────────────────────────────────────────────

export const tweets: Tweet[] = [
  {
    id: 't1',
    author: leila,
    content:
      "Another week, another startup claiming AGI has been achieved. This one was trained on 3 Wikipedia articles and a Discord server from 2019. The demo involved it correctly guessing that Paris is in France. Congrats to the whole team.",
    createdAt: '1h',
    replyCount: 412,
    retweetCount: 2100,
    likeCount: 18400,
    viewCount: '841K',
  },
  {
    id: 't2',
    author: marcus,
    content:
      "my landlord emailed to let me know rent is going up because the neighborhood has \"increased energy\" now. I've been living here 4 years. I am the increased energy. I am being charged for myself.",
    createdAt: '2h',
    replyCount: 893,
    retweetCount: 5600,
    likeCount: 47200,
    viewCount: '1.2M',
  },
  {
    id: 't3',
    author: sara,
    content:
      "The tariff situation explained, for those just tuning in:\n\n• prices go up\n• economists say prices will go up\n• government says economists are wrong\n• prices go up\n• economists are blamed for saying prices went up\n\nHope this helps.",
    createdAt: '3h',
    replyCount: 1240,
    retweetCount: 8900,
    likeCount: 61000,
    viewCount: '2.4M',
  },
  {
    id: 't4',
    author: jordan,
    content:
      "just pivoted my startup from B2B SaaS to 'AI-native agentic workflow automation' and my investor reply rate went from 0% to 4%. same product. different adjectives. this is the industry.",
    createdAt: '4h',
    replyCount: 188,
    retweetCount: 1400,
    likeCount: 11300,
    viewCount: '198K',
  },
  {
    id: 't5',
    author: alex,
    content:
      "Breaking: man who has never rented an apartment in his life has strong opinions about why rent control doesn't work. Developing.",
    createdAt: '5h',
    replyCount: 2100,
    retweetCount: 6700,
    likeCount: 54000,
    viewCount: '3.1M',
    retweetedBy: 'Marcus Webb',
  },
  {
    id: 't6',
    author: leila,
    content:
      "The AI arms race has reached the point where companies are announcing models to announce that they're announcing a model. We are deeply cooked.",
    createdAt: '7h',
    replyCount: 540,
    retweetCount: 3300,
    likeCount: 28900,
    viewCount: '760K',
  },
  {
    id: 't7',
    author: sara,
    content:
      "A CEO just went viral for a LinkedIn post about how waking up at 4am changed his life. He has 340 employees. None of them were asked about their sleep schedules. Just noting this.",
    createdAt: '9h',
    replyCount: 677,
    retweetCount: 4100,
    likeCount: 36700,
    viewCount: '980K',
  },
]
