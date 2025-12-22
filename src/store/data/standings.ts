export type DriverStanding = {
  position: number
  driver: string
  team: string
  points: number
}

export const standings2025: DriverStanding[] = [
  { position: 1, driver: 'Lando Norris', team: 'McLaren', points: 423 },
  { position: 2, driver: 'Max Verstappen', team: 'Red Bull Racing', points: 421 },
  { position: 3, driver: 'Oscar Piastri', team: 'McLaren', points: 410 },
  { position: 4, driver: 'George Russell', team: 'Mercedes', points: 319 },
  { position: 5, driver: 'Charles Leclerc', team: 'Ferrari', points: 242 },
  { position: 6, driver: 'Lewis Hamilton', team: 'Ferrari', points: 156 },
  { position: 7, driver: 'Kimi Antonelli', team: 'Mercedes', points: 150 },
  { position: 8, driver: 'Alexander Albon', team: 'Williams', points: 73 },
  { position: 9, driver: 'Carlos Sainz', team: 'Williams', points: 64 },
  { position: 10, driver: 'Fernando Alonso', team: 'Aston Martin', points: 56 },
  { position: 11, driver: 'Nico Hulkenberg', team: 'Kick Sauber', points: 51 },
  { position: 12, driver: 'Isack Hadjar', team: 'Racing Bulls', points: 51 },
  { position: 13, driver: 'Oliver Bearman', team: 'Haas F1 Team', points: 41 },
  { position: 14, driver: 'Liam Lawson', team: 'Racing Bulls', points: 38 },
  { position: 15, driver: 'Esteban Ocon', team: 'Haas F1 Team', points: 38 },
  { position: 16, driver: 'Lance Stroll', team: 'Aston Martin', points: 33 },
  { position: 17, driver: 'Yuki Tsunoda', team: 'Red Bull Racing', points: 33 },
  { position: 18, driver: 'Pierre Gasly', team: 'Alpine', points: 22 },
  { position: 19, driver: 'Gabriel Bortoleto', team: 'Kick Sauber', points: 19 },
  { position: 20, driver: 'Franco Colapinto', team: 'Alpine', points: 0 },
  { position: 21, driver: 'Jack Doohan', team: 'Alpine', points: 0 },
]
