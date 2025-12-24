export type DriverStatus = 'active' | 'legend'
export type DriverEra = '2025' | '2026' | 'legend'

export interface Driver {
  id: string
  code: string
  number: number
  firstName: string
  lastName: string
  team: string
  countryCode: string
  nationality: string
  status: DriverStatus
  era: DriverEra
  championships: number
  wins: number
  startYear: number
  endYear?: number
  accent: string
  accentSoft: string
  accentGlow: string
  icon: string
  image?: string
  badge?: string
  badgeColor?: string
  badgeText?: string
}

export interface DriverProfile {
  slug: string
  season: Record<string, string>
  career: Record<string, string>
  bio: { birthDate: string; birthPlace: string }
}

export interface Track {
  id: string
  name: string
  location: string
  country: string
  lengthKm: number
  flag: string
  image: string
  tagline: string
  description: string
}

export interface Team {
  id: string
  name: string
  base: string
  established: number
  titles: number
  rank: number
  color: string
  colorSoft: string
  logo: string
  season: string
  carImage?: string
  drivers?: string[]
  about?: string
  teamChief?: string
  technicalChief?: string
  chassis?: string
  powerUnit?: string
  firstEntry?: number
  highestFinish?: string
  highestFinishCount?: number
  polePositions?: number
  fastestLaps?: number
  winsTotal?: number
  seasonPoints?: number
  seasonWins?: number
  seasonPodiums?: number
  seasonPoles?: number
  seasonFastestLaps?: number
}

export interface RaceEvent {
  id: string
  name: string
  location: string
  flag: string
  start: string
  trackId: string
}

export interface NewsItem {
  slug: string
  title: string
  excerpt: string
  hero: string
  tag: string
  publishedAt: string
  author: string
  sourceUrl: string
  content: string[]
}

export interface RootState {
  drivers: Driver[]
  driverProfiles: Record<string, DriverProfile>
  teams: Team[]
  tracks: Track[]
  calendar: RaceEvent[]
  news: NewsItem[]
}
