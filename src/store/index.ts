import { createStore } from 'vuex'
import drivers from './data/drivers'
import { driverProfiles } from './data/driverProfiles'
import { teams } from './data/teams'
import { tracks } from './data/tracks'
import calendar from './data/calendar'
import { news } from './data/news'
import type { RootState } from './types'
export type { DriverStatus, Driver, DriverProfile, Team, Track, RaceEvent, NewsItem, RootState } from './types'

export default createStore<RootState>({
  state: {
    drivers,
    driverProfiles,
    teams,
    tracks,
    calendar,
    news,
  },
  getters: {
    drivers: (state: RootState) => state.drivers,
    activeDrivers: (state: RootState) => state.drivers.filter((driver) => driver.status === 'active'),
    legendDrivers: (state: RootState) => state.drivers.filter((driver) => driver.status === 'legend'),
    championDrivers: (state: RootState) => state.drivers.filter((driver) => driver.championships > 0),
    driverById: (state: RootState) => (id: string) => state.drivers.find((driver) => driver.id === id),
    driverProfileById: (state: RootState) => (id: string) => state.driverProfiles[id] ?? null,

    teams: (state: RootState) => state.teams,
    teamsBySeason: (state: RootState) => (season: string) =>
      state.teams.filter((team) => team.season === season),

    tracks: (state: RootState) => state.tracks,
    trackById: (state: RootState) => (id: string) => state.tracks.find((track) => track.id === id) ?? null,

    calendar: (state: RootState) => state.calendar,

    news: (state: RootState) => state.news,
    newsBySlug: (state: RootState) => (slug: string) => state.news.find((item) => item.slug === slug) ?? null,
  },
})
