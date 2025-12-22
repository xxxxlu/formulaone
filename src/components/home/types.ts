export type CountdownEventWithTs = {
  id: string
  name: string
  location: string
  flag: string
  start: string
  trackId: string
  ts: number
}

export type CountdownState = {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

export type StandingDisplay = {
  position: number
  driver: string
  team: string
  points: number
  accent?: string
  avatar?: string
  teamLogo?: string
}

export type RaceDisplay = {
  round: number
  grandPrix: string
  date: string
  winner: string
  car: string
  laps: string
  time: string
  accent?: string
  winnerAvatar?: string
  teamLogo?: string
}

export type FastestLapDisplay = {
  round: number
  grandPrix: string
  driver: string
  time: string
  accent?: string
  avatar?: string
  teamLogo?: string
  car?: string
}
