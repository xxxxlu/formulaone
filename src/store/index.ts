import { createStore } from 'vuex'

import TrackMelbourne from '../assets/track/Albert-Park-Circuit.png'
import TrackImola from '../assets/track/Autodromo-Enzo-e-Dino.png'
import TrackMonza from '../assets/track/Autodromo-Nazionale-Monza.png'
import TrackMexico from '../assets/track/Autodromo-Hermanos-Rodriguez.png'
import TrackInterlagos from '../assets/track/Autodromo-Jose-Carlos-Pace.png'
import TrackBahrain from '../assets/track/Bahrain-circuit.png'
import TrackBaku from '../assets/track/Baku-City-Circuit.png'
import TrackShanghai from '../assets/track/China-GP.png'
import TrackCanada from '../assets/track/Circuit-Gilles-Villeneuve.png'
import TrackZandvoort from '../assets/track/Circuit-Zandvoort.png'
import TrackBarcelona from '../assets/track/Circuit-de-Barcelona.png'
import TrackMonaco from '../assets/track/Circuit-de-Monaco.png'
import TrackSpa from '../assets/track/Circuit-de-Spa-Francorchamps.png'
import TrackCota from '../assets/track/Circuit-of-The-Americas.png'
import TrackQatar from '../assets/track/GP-Qatar.png'
import TrackHungary from '../assets/track/Hungaroring.png'
import TrackJeddah from '../assets/track/Jeddah-Corniche-Circuit.png'
import TrackVegas from '../assets/track/Las-Vegas-GP.png'
import TrackMiami from '../assets/track/Miami-International-Autodrome.png'
import TrackRedBullRing from '../assets/track/Red-Bull-Ring.png'
import TrackSilverstone from '../assets/track/Silverstone-Circuit.png'
import TrackSingapore from '../assets/track/Singapore-GP.png'
import TrackSuzuka from '../assets/track/Suzuka-International-Racing-Course--1536x864.png'
import TrackYasMarina from '../assets/track/Yas-Marina-Circuit.png'
const driverImg = (file: string) => new URL(`../assets/deivers/${file}`, import.meta.url).href

export type DriverStatus = 'active' | 'legend'

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
  tracks: Track[]
  calendar: RaceEvent[]
  news: NewsItem[]
}

const tracks: Track[] = [
  {
    id: 'melbourne',
    name: 'Albert Park Circuit',
    location: 'Melbourne, Australia',
    country: 'Australia',
    lengthKm: 5.278,
    flag: '🇦🇺',
    image: TrackMelbourne,
    tagline: 'Reprofiled parkland sweepers favoring agile chassis',
    description: 'Semi-permanent street circuit with flowing high-speed chicanes and improved DRS zones.',
  },
  {
    id: 'imola',
    name: 'Autodromo Enzo e Dino Ferrari',
    location: 'Imola, Italy',
    country: 'Italy',
    lengthKm: 4.909,
    flag: '🇮🇹',
    image: TrackImola,
    tagline: 'Anti-clockwise flow with old-school runoff',
    description: 'Fast chicanes and elevation changes reward mechanical grip and precision.',
  },
  {
    id: 'shanghai',
    name: 'Shanghai International Circuit',
    location: 'Shanghai, China',
    country: 'China',
    lengthKm: 5.451,
    flag: '🇨🇳',
    image: TrackShanghai,
    tagline: 'Signature snail complex and brutal back straight',
    description: 'Technical opening sector leading to the 1.2km straight that pushes power units and brakes.',
  },
  {
    id: 'suzuka',
    name: 'Suzuka Circuit',
    location: 'Suzuka, Japan',
    country: 'Japan',
    lengthKm: 5.807,
    flag: '🇯🇵',
    image: TrackSuzuka,
    tagline: 'Figure-eight icon with relentless rhythm',
    description: 'The Esses, Degners, and 130R test aero balance and driver commitment every lap.',
  },
  {
    id: 'sakhir',
    name: 'Bahrain International Circuit',
    location: 'Sakhir, Bahrain',
    country: 'Bahrain',
    lengthKm: 5.412,
    flag: '🇧🇭',
    image: TrackBahrain,
    tagline: 'Night race, heavy traction, and brake energy harvesting',
    description: 'Desert venue with big stops into T1 and T14 rewarding hybrid deployment mastery.',
  },
  {
    id: 'jeddah',
    name: 'Jeddah Corniche Circuit',
    location: 'Jeddah, Saudi Arabia',
    country: 'Saudi Arabia',
    lengthKm: 6.174,
    flag: '🇸🇦',
    image: TrackJeddah,
    tagline: 'High-speed walls with relentless commitment',
    description: 'Fastest street circuit on the calendar with flowing blind entries and minimal lift-off.',
  },
  {
    id: 'miami',
    name: 'Miami International Autodrome',
    location: 'Miami, USA',
    country: 'United States',
    lengthKm: 5.412,
    flag: '🇺🇸',
    image: TrackMiami,
    tagline: 'Hard braking under humid heat',
    description: 'Stadium section hairpins and a punishing back straight test cooling packages.',
  },
  {
    id: 'gilles-villeneuve',
    name: 'Circuit Gilles Villeneuve',
    location: 'Montreal, Canada',
    country: 'Canada',
    lengthKm: 4.361,
    flag: '🇨🇦',
    image: TrackCanada,
    tagline: 'Stop-go rhythm and the Wall of Champions',
    description: 'Low-downforce setup with big kerb usage across chicanes lining the island park.',
  },
  {
    id: 'monte-carlo',
    name: 'Circuit de Monaco',
    location: 'Monte Carlo, Monaco',
    country: 'Monaco',
    lengthKm: 3.337,
    flag: '🇲🇨',
    image: TrackMonaco,
    tagline: 'Precision, traction, zero margin',
    description: 'The tightest street circuit demands mechanical grip and razor sharp steering feel.',
  },
  {
    id: 'catalunya',
    name: 'Circuit de Barcelona-Catalunya',
    location: 'Barcelona, Spain',
    country: 'Spain',
    lengthKm: 4.657,
    flag: '🇪🇸',
    image: TrackBarcelona,
    tagline: 'Aero benchmark with mixed corner speeds',
    description: 'Long T3 loads the front axle; revised final sector favors rotation and tire management.',
  },
  {
    id: 'red-bull-ring',
    name: 'Red Bull Ring',
    location: 'Spielberg, Austria',
    country: 'Austria',
    lengthKm: 4.318,
    flag: '🇦🇹',
    image: TrackRedBullRing,
    tagline: 'Short lap, altitude, and DRS punch',
    description: 'Three uphill drags and quick middle sector reward power and confident kerb usage.',
  },
  {
    id: 'silverstone',
    name: 'Silverstone Circuit',
    location: 'Silverstone, United Kingdom',
    country: 'United Kingdom',
    lengthKm: 5.891,
    flag: '🇬🇧',
    image: TrackSilverstone,
    tagline: 'High-downforce cathedral of speed',
    description: 'Maggotts-Becketts-Chapel sequence is the ultimate aero stress test.',
  },
  {
    id: 'spa',
    name: 'Circuit de Spa-Francorchamps',
    location: 'Spa, Belgium',
    country: 'Belgium',
    lengthKm: 7.004,
    flag: '🇧🇪',
    image: TrackSpa,
    tagline: 'Elevation, weather roulette, and flat-out Eau Rouge',
    description: 'Longest lap with microclimate chaos; mixed sectors challenge every setup choice.',
  },
  {
    id: 'hungaroring',
    name: 'Hungaroring',
    location: 'Budapest, Hungary',
    country: 'Hungary',
    lengthKm: 4.381,
    flag: '🇭🇺',
    image: TrackHungary,
    tagline: 'Monaco without walls',
    description: 'Tight, twisty layout rewards downforce and tire whispering in the summer heat.',
  },
  {
    id: 'zandvoort',
    name: 'Circuit Zandvoort',
    location: 'Zandvoort, Netherlands',
    country: 'Netherlands',
    lengthKm: 4.259,
    flag: '🇳🇱',
    image: TrackZandvoort,
    tagline: 'Banked corners and coastal winds',
    description: 'Arena banking at T3 and T14 plus quick left-rights deliver relentless load.',
  },
  {
    id: 'monza',
    name: 'Autodromo Nazionale di Monza',
    location: 'Monza, Italy',
    country: 'Italy',
    lengthKm: 5.793,
    flag: '🇮🇹',
    image: TrackMonza,
    tagline: 'Temple of Speed with minimal wing',
    description: 'Long straights, heavy braking into chicanes, and traction out of Lesmos define lap time.',
  },
  {
    id: 'madrid',
    name: 'Madrid Street Circuit',
    location: 'Madrid, Spain',
    country: 'Spain',
    lengthKm: 5.0,
    flag: '🇪🇸',
    image: TrackBarcelona,
    tagline: 'New-for-2026 hybrid street layout',
    description: 'Long radius sweepers blended with technical infield crafted for overtakes.',
  },
  {
    id: 'baku',
    name: 'Baku City Circuit',
    location: 'Baku, Azerbaijan',
    country: 'Azerbaijan',
    lengthKm: 6.003,
    flag: '🇦🇿',
    image: TrackBaku,
    tagline: 'Castle section and 2.2km flat-out blast',
    description: 'Massive top speed demands low drag; medieval walls punish mistakes.',
  },
  {
    id: 'singapore',
    name: 'Marina Bay Street Circuit',
    location: 'Singapore',
    country: 'Singapore',
    lengthKm: 4.94,
    flag: '🇸🇬',
    image: TrackSingapore,
    tagline: 'Night heat and relentless 90-degree corners',
    description: 'Revised layout flows quicker but still brutal on cooling and concentration.',
  },
  {
    id: 'vegas',
    name: 'Las Vegas Strip Circuit',
    location: 'Las Vegas, USA',
    country: 'United States',
    lengthKm: 6.201,
    flag: '🇺🇸',
    image: TrackVegas,
    tagline: 'Freezing night temps and strip straight-line drag',
    description: 'Low downforce street profile with giant straights and heavy braking zones.',
  },
  {
    id: 'mexico',
    name: 'Autódromo Hermanos Rodríguez',
    location: 'Mexico City, Mexico',
    country: 'Mexico',
    lengthKm: 4.304,
    flag: '🇲🇽',
    image: TrackMexico,
    tagline: 'High altitude, thin air, huge wings',
    description: 'Peraltada stadium finish and kilometer-long pit straight challenge PU cooling.',
  },
  {
    id: 'interlagos',
    name: 'Interlagos',
    location: 'São Paulo, Brazil',
    country: 'Brazil',
    lengthKm: 4.309,
    flag: '🇧🇷',
    image: TrackInterlagos,
    tagline: 'Anti-clockwise flow with rollercoaster elevation',
    description: 'Infield twist and uphill full-throttle run to the line strain traction and ERS.',
  },
  {
    id: 'lusail',
    name: 'Lusail International Circuit',
    location: 'Lusail, Qatar',
    country: 'Qatar',
    lengthKm: 5.419,
    flag: '🇶🇦',
    image: TrackQatar,
    tagline: 'MotoGP-born, F1-fast night flow',
    description: 'High-speed sweepers punish understeer and reward stable rear aero balance.',
  },
  {
    id: 'yas-marina',
    name: 'Yas Marina Circuit',
    location: 'Abu Dhabi, UAE',
    country: 'United Arab Emirates',
    lengthKm: 5.281,
    flag: '🇦🇪',
    image: TrackYasMarina,
    tagline: 'Sunset finale with simplified chicanes',
    description: 'Reworked hairpins and hotel section create better flow and overtaking chances.',
  },
  {
    id: 'austin',
    name: 'Circuit of the Americas',
    location: 'Austin, USA',
    country: 'United States',
    lengthKm: 5.513,
    flag: '🇺🇸',
    image: TrackCota,
    tagline: 'Multi-sector sampler with signature uphill T1',
    description: 'Merges high-speed esses with heavy braking zones, stressing aero versatility.',
  },
]

const calendar: RaceEvent[] = [
  { id: 'aus-2026', name: 'Australian GP', location: 'Melbourne', flag: '🇦🇺', start: '2026-03-06T09:30:00+08:00', trackId: 'melbourne' },
  { id: 'chn-2026', name: 'Chinese GP', location: 'Shanghai', flag: '🇨🇳', start: '2026-03-13T11:30:00+08:00', trackId: 'shanghai' },
  { id: 'jpn-2026', name: 'Japanese GP', location: 'Suzuka', flag: '🇯🇵', start: '2026-03-27T10:30:00+08:00', trackId: 'suzuka' },
  { id: 'bhr-2026', name: 'Bahrain GP', location: 'Sakhir', flag: '🇧🇭', start: '2026-04-10T19:30:00+08:00', trackId: 'sakhir' },
  { id: 'sau-2026', name: 'Saudi Arabian GP', location: 'Jeddah', flag: '🇸🇦', start: '2026-04-17T21:30:00+08:00', trackId: 'jeddah' },
  { id: 'mia-2026', name: 'Miami GP', location: 'Miami', flag: '🇺🇸', start: '2026-05-02T00:30:00+08:00', trackId: 'miami' },
  { id: 'can-2026', name: 'Canadian GP', location: 'Montreal', flag: '🇨🇦', start: '2026-05-23T00:30:00+08:00', trackId: 'gilles-villeneuve' },
  { id: 'mon-2026', name: 'Monaco GP', location: 'Monte Carlo', flag: '🇲🇨', start: '2026-06-05T19:30:00+08:00', trackId: 'monte-carlo' },
  { id: 'esp-2026', name: 'Spanish GP', location: 'Barcelona', flag: '🇪🇸', start: '2026-06-12T19:30:00+08:00', trackId: 'catalunya' },
  { id: 'aut-2026', name: 'Austrian GP', location: 'Spielberg', flag: '🇦🇹', start: '2026-06-26T19:30:00+08:00', trackId: 'red-bull-ring' },
  { id: 'gbr-2026', name: 'British GP', location: 'Silverstone', flag: '🇬🇧', start: '2026-07-03T19:30:00+08:00', trackId: 'silverstone' },
  { id: 'bel-2026', name: 'Belgian GP', location: 'Spa', flag: '🇧🇪', start: '2026-07-17T19:30:00+08:00', trackId: 'spa' },
  { id: 'hun-2026', name: 'Hungarian GP', location: 'Budapest', flag: '🇭🇺', start: '2026-07-24T19:30:00+08:00', trackId: 'hungaroring' },
  { id: 'ned-2026', name: 'Dutch GP', location: 'Zandvoort', flag: '🇳🇱', start: '2026-08-21T18:30:00+08:00', trackId: 'zandvoort' },
  { id: 'ita-2026', name: 'Italian GP', location: 'Monza', flag: '🇮🇹', start: '2026-09-04T18:30:00+08:00', trackId: 'monza' },
  { id: 'mad-2026', name: 'Spanish GP', location: 'Madrid', flag: '🇪🇸', start: '2026-09-11T19:30:00+08:00', trackId: 'madrid' },
  { id: 'aze-2026', name: 'Azerbaijan GP', location: 'Baku', flag: '🇦🇿', start: '2026-09-24T16:30:00+08:00', trackId: 'baku' },
  { id: 'sgp-2026', name: 'Singapore GP', location: 'Singapore', flag: '🇸🇬', start: '2026-10-09T17:30:00+08:00', trackId: 'singapore' },
  { id: 'lv-2026', name: 'Las Vegas GP', location: 'Las Vegas', flag: '🇺🇸', start: '2026-10-24T01:30:00+08:00', trackId: 'vegas' },
  { id: 'mex-2026', name: 'Mexico GP', location: 'Mexico City', flag: '🇲🇽', start: '2026-10-31T02:30:00+08:00', trackId: 'mexico' },
  { id: 'bra-2026', name: 'São Paulo GP', location: 'São Paulo', flag: '🇧🇷', start: '2026-11-06T23:30:00+08:00', trackId: 'interlagos' },
  { id: 'qat-2026', name: 'Qatar GP', location: 'Lusail', flag: '🇶🇦', start: '2026-11-27T21:30:00+08:00', trackId: 'lusail' },
  { id: 'ab-2026', name: 'Abu Dhabi GP', location: 'Yas Marina', flag: '🇦🇪', start: '2026-12-04T17:30:00+08:00', trackId: 'yas-marina' },
]

const news: NewsItem[] = [
  {
    slug: 'exclusive-a-good-lad-norris-title',
    title: 'How Norris made his school teachers “enormously proud”',
    excerpt:
      'Lando Norris realised a childhood dream with his 2025 title while his Millfield School teachers celebrate the champion who stayed humble.',
    hero:
      'https://media.formula1.com/image/upload/c_fill,w_1600/q_auto/v1740000000/fom-website/2025/Miscellaneous/norris-millfield-header-display.webp',
    tag: 'Norris',
    publishedAt: '2025-12-18',
    author: 'Mike Seymour',
    sourceUrl:
      'https://www.formula1.com/en/latest/article/exclusive-a-good-lad-who-never-got-arrogant-how-f1-title-winner-norris-made.14J9P4Dz5pJkF2JExDVekA',
    content: [
      'Lando Norris made his childhood dream a reality at the Abu Dhabi Grand Prix when a hard-earned podium sealed the 2025 F1 World Championship. While McLaren celebrated trackside, teachers at Millfield School felt immense pride in their former student.',
      'His early karting trophies once lined the school reception. Staff remember a polite, attentive pupil who quietly excelled on race weekends and never became arrogant.',
      'Former teachers describe how Norris balanced racing with coursework and stayed grounded regardless of results.',
      'Millfield are preparing their own tribute and urging students to vote Norris for BBC Sports Personality of the Year – a fitting cherry on top of his title season.',
    ],
  },
  {
    slug: 'apxgp-movie-costume-design',
    title: 'How APXGP was brought to life by costume designer Julian Day',
    excerpt: 'A behind-the-scenes look at the rapid creation of Brad Pitt’s APXGP world for the F1 movie.',
    hero:
      'https://media.formula1.com/image/upload/t_16by9Centre/c_fill,w_1600/q_auto/v1740000000/fom-website/2025/F1%20movie/GettyImages-2188302445.webp',
    tag: 'F1 Movie',
    publishedAt: '2025-12-18',
    author: 'F1 Staff',
    sourceUrl:
      'https://www.formula1.com/en/latest/article/how-apxgp-was-brought-to-life-inside-the-rapid-creation-of-f1-the-movies.73ZVNOiyddgPL7jtNhX6Jq',
    content: [
      'Costume designer Julian Day explains how the fictional APXGP team was rapidly brought to life for the upcoming F1 movie, balancing authenticity with cinematic flair.',
      'The team uniforms and driver looks were built to feel like a real entrant while still serving the storytelling on screen.',
    ],
  },
  {
    slug: 'stroll-opens-up-on-noise',
    title: "Stroll opens up on 'noise' that has followed him in F1",
    excerpt: 'Lance Stroll reflects on public scrutiny and how he deals with criticism in the paddock.',
    hero:
      'https://media.formula1.com/image/upload/t_16by9North/c_fill,w_1600/q_auto/v1740000000/trackside-images/2025/F1_Grand_Prix_of_Qatar___Sprint__Qualifying/2249027523.webp',
    tag: 'Interviews',
    publishedAt: '2025-12-18',
    author: 'F1 Staff',
    sourceUrl:
      'https://www.formula1.com/en/latest/article/if-i-buy-into-it-it-bothers-me-stroll-opens-up-on-noise-that-has-followed.DbbfNBEJDNhjjw0ibCjrv',
    content: [
      'Lance Stroll speaks candidly about dealing with outside noise and criticism that has followed him in F1.',
      'He focuses on performance, leans on team support, and tunes out distractions to keep improving.',
    ],
  },
  {
    slug: 'leclerc-2026-focus-no-brainer',
    title: 'Leclerc calls Ferrari’s focus shift to 2026 a ‘no-brainer’',
    excerpt: 'Charles Leclerc backs Ferrari’s early pivot to the 2026 regulations to fight at the front.',
    hero:
      'https://media.formula1.com/image/upload/t_16by9North/c_fill,w_1600/q_auto/v1740000000/trackside-images/2025/F1_Grand_Prix_of_Abu_Dhabi___Practice/2250085285.webp',
    tag: 'Ferrari',
    publishedAt: '2025-12-18',
    author: 'F1 Staff',
    sourceUrl:
      'https://www.formula1.com/en/latest/article/i-dont-regret-it-leclerc-insists-ferrari-decision-to-focus-early-on-2026-was.2NLLkEjPr7oRNHjEUdMIrH',
    content: [
      'Leclerc explains why Ferrari’s early pivot to the 2026 rules is a “no-brainer” to challenge for future titles.',
      'He accepts short-term compromises in order to build a stronger platform for the regulation reset.',
    ],
  },
  {
    slug: 'f1-allwyn-community-awards',
    title: 'Celebrating the first F1 Allwyn Global Community Awards',
    excerpt: 'F1 spotlights grassroots heroes and community projects in the inaugural Allwyn awards.',
    hero:
      'https://media.formula1.com/image/upload/t_16by9Centre/c_fill,w_1600/q_auto/v1740000000/fom-website/campaign/support-partner/allwyn/F1%20Allwyn%20Global%20Community%20Award.webp',
    tag: 'Community',
    publishedAt: '2025-12-18',
    author: 'F1 Staff',
    sourceUrl:
      'https://www.formula1.com/en/latest/article/celebrating-the-inaugural-season-of-the-f1-allwyn-global-community-award.7GyOm3UZsWMOhhomTcQSi1',
    content: [
      'F1 spotlights inspiring grassroots projects worldwide in the inaugural Allwyn Global Community Awards.',
      'The programme honours initiatives that drive inclusion, education, and sustainability within motorsport communities.',
    ],
  },
  {
    slug: 'championship-celebrations-best',
    title: 'The most iconic recent championship celebrations',
    excerpt: 'From trackside donuts to pit-lane parties, F1 relives unforgettable title moments.',
    hero:
      'https://media.formula1.com/image/upload/t_16by9Centre/c_fill,w_1600/q_auto/v1740000000/fom-website/2025/Lifestyle/ADHOC/GettyImages-2160150106.webp',
    tag: 'History',
    publishedAt: '2025-12-18',
    author: 'F1 Staff',
    sourceUrl:
      'https://www.formula1.com/en/latest/article/the-greatest-f1-world-championship-celebrations-in-recent-history.4gWkaXUSgi7KvN37D8S4ZT',
    content: [
      'A look back at the most memorable championship celebrations of recent seasons and the personalities that made them special.',
      'From pit-lane parties to burnout-laden donuts, these moments defined title euphoria.',
    ],
  },
  {
    slug: 'verstappen-number-3-2026',
    title: 'Verstappen confirms new number for 2026 season',
    excerpt: 'Max Verstappen will run car number 3 for 2026 as he looks to a fresh era of regulations.',
    hero:
      'https://media.formula1.com/image/upload/t_16by9North/c_fill,w_1600/q_auto/v1740000000/trackside-images/2025/F1_Grand_Prix_of_Abu_Dhabi/2250531225.webp',
    tag: 'Verstappen',
    publishedAt: '2025-12-18',
    author: 'F1 Staff',
    sourceUrl:
      'https://www.formula1.com/en/latest/article/max-verstappen-confirms-he-will-use-car-number-3-for-2026-season.6qvN2SQwcyGYnMWhGdDpNS',
    content: [
      'The triple champion confirms he will run car number 3 for 2026, embracing a fresh era of regulations.',
      'Verstappen outlines the personal and sporting reasons behind the switch.',
    ],
  },
  {
    slug: '2026-car-renders',
    title: 'GALLERY: Check out renders of the innovative 2026 car',
    excerpt: 'First-look renders show the bold aero and wheel changes for 2026’s F1 machinery.',
    hero:
      'https://media.formula1.com/image/upload/c_fill,w_1600/q_auto/v1740000000/fom-website/2026%20regulations/2026_Explainer_FIA_Front_3_4_1920x1080.webp',
    tag: '2026 Rules',
    publishedAt: '2025-12-18',
    author: 'F1 Staff',
    sourceUrl:
      'https://www.formula1.com/en/latest/article/gallery-new-look-new-tech-new-rules-f1-reveals-renders-of-the-innovative.4DYoUzwNaKhW9aQeeVXJMv',
    content: [
      'Renders highlight slimmer bodywork, over-wheel aero, and wheel covers that define the 2026 technical reset.',
      'The images preview how active aero and new wheel wake management will shape the next-gen cars.',
    ],
  },
  {
    slug: '2026-rules-key-terms',
    title: 'EXPLAINED: The key terms for F1’s new-for-2026 rules',
    excerpt: 'A jargon-buster for the 2026 regulations including X-mode, active aero, and more.',
    hero:
      'https://media.formula1.com/image/upload/t_16by9Centre/c_fill,w_1600/q_auto/v1740000000/fom-website/2026%20regulations/2026_Wheel_50_Overtake.webp',
    tag: '2026 Rules',
    publishedAt: '2025-12-18',
    author: 'F1 Staff',
    sourceUrl:
      'https://www.formula1.com/en/latest/article/explained-the-new-key-terms-for-formula-1s-new-for-2026-rules.3T5BU6TC9quGcIpGzoWkY0',
    content: [
      'A jargon-buster for the 2026 regulations: active aero phases, power-unit deployment rules, and wheel wake control devices.',
      'The guide breaks down key terms so fans can follow the technical reset more easily.',
    ],
  },
  {
    slug: '2026-rules-everything-you-need',
    title: "Everything you need to know about F1's new rules for 2026",
    excerpt: 'A full explainer on how the 2026 regulations reshape cars, racing, and strategy.',
    hero:
      'https://media.formula1.com/image/upload/t_16by9Centre/c_fill,w_1600/q_auto/v1740000000/fom-website/2026%20regulations/2026_Explainer_FIA_Above_1920x1080.webp',
    tag: '2026 Rules',
    publishedAt: '2025-12-18',
    author: 'F1 Staff',
    sourceUrl: 'https://www.formula1.com/en/latest/article/everything-you-need-to-know-about-the-new-f1-rules-for-2026.48bv0VTxhIlhrQXmxercXk',
    content: [
      'From aero to power units, here’s how the 2026 rulebook will change racing and what teams are already planning.',
      'The article details chassis targets, active aero, and hybrid deployment that will shape strategy.',
    ],
  },
  {
    slug: 'best-of-2025-beyond-the-grid',
    title: 'The best of 2025, from Norris’ evolution to Brad Pitt’s “need for speed”',
    excerpt: 'A Beyond The Grid roundup of the standout stories and voices from 2025.',
    hero:
      'https://media.formula1.com/image/upload/t_16by9Centre/c_fill,w_1600/q_auto/v1740000000/fom-website/2025/Beyond%20The%20Grid/BTG%20BEST%20OF%202025%20ARTWORK%2016x9.webp',
    tag: 'Podcast',
    publishedAt: '2025-12-18',
    author: 'F1 Staff',
    sourceUrl:
      'https://www.formula1.com/en/latest/article/beyond-the-grid-norris-champion-evolution-vowles-podium-pride-and-brad-pitts.2Ae9yop66D00B3VD6MQqBC',
    content: [
      'A curated listen: Norris’ title evolution, team bosses’ insights, and Hollywood’s take on F1 speed culture.',
      'The best BTG moments of 2025 collected into one feature episode.',
    ],
  },
  {
    slug: 'lando-way-world-champion',
    title: 'Winning “the Lando way” – how Norris became World Champion',
    excerpt: 'F1 Nation recaps Norris’s title run, focusing on key weekends and mindset shifts.',
    hero:
      'https://media.formula1.com/image/upload/t_16by9North/c_fill,w_1600/q_auto/v1740000000/fom-website/2025/F1%20Nation/F1N%20ABU%20DHABI%20GP%20REVIEW%20ARTWORK%2016x9%20.COM.webp',
    tag: 'Norris',
    publishedAt: '2025-12-18',
    author: 'F1 Nation',
    sourceUrl:
      'https://www.formula1.com/en/latest/article/f1-nation-winning-the-lando-way-how-norris-became-world-champion.4zpEvhFth1jo1cVFy7YzEJ',
    content: [
      'F1 Nation breaks down Norris’s season, psychological shift, and the team support that enabled his title.',
      'Key weekends and decisive moments illustrate the “Lando way” to the crown.',
    ],
  },
  {
    slug: 'norris-first-interview-champion',
    title: "WATCH: Norris' first in-depth interview as the new World Champion",
    excerpt: 'Norris’ first long-form interview after clinching the title, reflecting on the journey and future goals.',
    hero:
      'https://media.formula1.com/image/upload/c_fill,w_1600/q_auto/v1740000000/fom-website/2025/Abu%20Dhabi/GENERAL%20CROP%20-%202025-12-08T101545.270.webp',
    tag: 'Norris',
    publishedAt: '2025-12-18',
    author: 'F1 Staff',
    sourceUrl:
      'https://www.formula1.com/en/latest/article/watch-lando-norris-first-in-depth-interview-as-the-new-formula-1-world.4ou4lzjQG3J4r3OFeSCcje',
    content: [
      'A sit-down video interview where Norris reflects on the path from karting to champion.',
      'He discusses lessons learned, celebrations, and how he plans to defend the crown.',
    ],
  },
  {
    slug: 'piastri-key-role-title',
    title: 'The key role Piastri played that helped seal Norris’ title',
    excerpt: 'How teammate Oscar Piastri contributed in Abu Dhabi to help seal Norris’s title.',
    hero:
      'https://media.formula1.com/image/upload/c_fill,w_1600/q_auto/v1740000000/fom-website/2025/Abu%20Dhabi/Monday%20Morning%20Debrief%20V1%20%20(6).webp',
    tag: 'McLaren',
    publishedAt: '2025-12-18',
    author: 'F1 Staff',
    sourceUrl:
      'https://www.formula1.com/en/latest/article/monday-morning-debrief-the-key-role-piastri-played-in-abu-dhabi-that-helped.3kDSuwnkHJlFQwUYW8NPev',
    content: [
      'Engineering calls, teammate cooperation, and tyre management underline Piastri’s hidden-hero role.',
      'The debrief highlights how his pace and positioning opened strategy options for Norris.',
    ],
  },
  {
    slug: 'domenicali-praises-norris',
    title: 'Domenicali hails “great character” of new champion Norris',
    excerpt: 'F1 CEO Stefano Domenicali praises the character and professionalism of the new champion.',
    hero:
      'https://media.formula1.com/image/upload/t_16by9North/c_fill,w_1600/q_auto/v1740000000/fom-website/2025/Abu%20Dhabi/GettyImages-2250513090%20(1).webp',
    tag: 'Norris',
    publishedAt: '2025-12-18',
    author: 'F1 Staff',
    sourceUrl:
      'https://www.formula1.com/en/latest/article/exclusive-stefano-domenicali-praises-great-character-of-new-f1-champion.2XEhajfQ1nse6hME2RKETl',
    content: [
      'Domenicali talks about Norris’s mentality, his value as a role model, and expectations for the next season.',
      'He highlights the champion’s humility and consistency across the campaign.',
    ],
  },
  {
    slug: 'abu-dhabi-key-moments',
    title: 'All the key moments from the Abu Dhabi GP',
    excerpt: 'A rundown of the decisive moments at the Abu Dhabi finale that paved the way for the title.',
    hero:
      'https://media.formula1.com/image/upload/c_fill,w_1600/q_auto/v1740000000/fom-website/2025/Abu%20Dhabi/GENERAL%20CROP%20-%202025-12-07T201033.251.webp',
    tag: 'Race Recap',
    publishedAt: '2025-12-18',
    author: 'F1 Staff',
    sourceUrl:
      'https://www.formula1.com/en/latest/article/abu-dhabi-lowdown-all-the-key-moments-as-norris-seals-his-debut-title-and.6WLoFRGsfe4fbq1TZeoVIa',
    content: [
      'From the start, defensive moves, pit stops, and safety car windows, the feature breaks down the title-clinching race.',
      'Key overtakes and tyre calls show how the finale unfolded for McLaren and Norris.',
    ],
  },
  {
    slug: 'tremayne-column-norris-worthy',
    title: '“Super-fast Norris is a very worthy World Champion”',
    excerpt: 'Columnist David Tremayne explains why Norris fully deserves the World Championship trophy.',
    hero:
      'https://media.formula1.com/image/upload/c_fill,w_1600/q_auto/v1740000000/fom-website/2025/Abu%20Dhabi/GENERAL%20CROP%20-%202025-12-07T195222.104.webp',
    tag: 'Opinion',
    publishedAt: '2025-12-18',
    author: 'David Tremayne',
    sourceUrl:
      'https://www.formula1.com/en/latest/article/tremayne-determined-candid-and-super-fast-lando-norris-is-a-very-worthy.6Aqf5TqNNLQqZqjTNqU8RR',
    content: [
      'Tremayne dives into Norris’s speed, temperament, and growth to argue he is a worthy champion.',
      'He notes the driver’s maturity, consistency, and rapport with McLaren throughout the season.',
    ],
  },
  {
    slug: 'teams-said-abu-dhabi-2025',
    title: 'What the teams said – Race day in Abu Dhabi',
    excerpt: 'Team-by-team reactions to the Abu Dhabi race, revealing strategy choices and takeaways.',
    hero:
      'https://media.formula1.com/image/upload/t_16by9Centre/c_fill,w_1600/q_auto/v1740000000/trackside-images/2025/F1_Grand_Prix_of_Abu_Dhabi/2250514722.webp',
    tag: 'Race Recap',
    publishedAt: '2025-12-18',
    author: 'F1 Staff',
    sourceUrl: 'https://www.formula1.com/en/latest/article/what-the-teams-said-race-day-in-abu-dhabi-2025.53LuGvgWY8FgAcxWXLZyN9',
    content: [
      'Team principals and drivers share their views on the finale, covering strategy, pace, and season-end reflections.',
      'Comments highlight differing tyre calls, overtakes, and what each squad takes into 2026.',
    ],
  },
]

const drivers: Driver[] = [
  {
    id: 'max-verstappen',
    code: 'VER',
    number: 1,
    firstName: 'Max',
    lastName: 'Verstappen',
    team: 'Red Bull Racing',
    countryCode: 'NED',
    nationality: 'Dutch',
    status: 'active',
    championships: 3,
    wins: 60,
    startYear: 2015,
    accent: '#1e5bc6',
    accentSoft: 'rgba(30, 91, 198, 0.16)',
    accentGlow: 'rgba(30, 91, 198, 0.45)',
    icon: 'bolt',
    image: driverImg('2025redbullracingmaxver01right.avif'),
  },
  {
    id: 'yuki-tsunoda',
    code: 'TSU',
    number: 22,
    firstName: 'Yuki',
    lastName: 'Tsunoda',
    team: 'Red Bull Racing',
    countryCode: 'JPN',
    nationality: 'Japanese',
    status: 'active',
    championships: 0,
    wins: 0,
    startYear: 2021,
    accent: '#1e5bc6',
    accentSoft: 'rgba(30, 91, 198, 0.16)',
    accentGlow: 'rgba(30, 91, 198, 0.45)',
    icon: 'bolt',
    image: driverImg('2025redbullracingyuktsu01right.avif'),
  },
  {
    id: 'charles-leclerc',
    code: 'LEC',
    number: 16,
    firstName: 'Charles',
    lastName: 'Leclerc',
    team: 'Ferrari',
    countryCode: 'MON',
    nationality: 'Monegasque',
    status: 'active',
    championships: 0,
    wins: 6,
    startYear: 2018,
    accent: '#ef1a2d',
    accentSoft: 'rgba(239, 26, 45, 0.16)',
    accentGlow: 'rgba(239, 26, 45, 0.45)',
    icon: 'local_fire_department',
    image: driverImg('2025ferrarichalec01right.avif'),
  },
  {
    id: 'lewis-hamilton',
    code: 'HAM',
    number: 44,
    firstName: 'Lewis',
    lastName: 'Hamilton',
    team: 'Ferrari',
    countryCode: 'GBR',
    nationality: 'British',
    status: 'active',
    championships: 7,
    wins: 103,
    startYear: 2007,
    accent: '#ef1a2d',
    accentSoft: 'rgba(239, 26, 45, 0.16)',
    accentGlow: 'rgba(239, 26, 45, 0.45)',
    icon: 'local_fire_department',
    image: driverImg('2025ferrarilewham01right.avif'),
  },
  {
    id: 'george-russell',
    code: 'RUS',
    number: 63,
    firstName: 'George',
    lastName: 'Russell',
    team: 'Mercedes',
    countryCode: 'GBR',
    nationality: 'British',
    status: 'active',
    championships: 0,
    wins: 2,
    startYear: 2019,
    accent: '#00d2be',
    accentSoft: 'rgba(0, 210, 190, 0.16)',
    accentGlow: 'rgba(0, 210, 190, 0.45)',
    icon: 'mode_fan',
    image: driverImg('2025mercedesgeorus01right.avif'),
  },
  {
    id: 'kimi-antonelli',
    code: 'ANT',
    number: 7,
    firstName: 'Andrea Kimi',
    lastName: 'Antonelli',
    team: 'Mercedes',
    countryCode: 'ITA',
    nationality: 'Italian',
    status: 'active',
    championships: 0,
    wins: 0,
    startYear: 2025,
    accent: '#00d2be',
    accentSoft: 'rgba(0, 210, 190, 0.16)',
    accentGlow: 'rgba(0, 210, 190, 0.45)',
    icon: 'mode_fan',
    image: driverImg('2025mercedesandant01right.avif'),
  },
  {
    id: 'lando-norris',
    code: 'NOR',
    number: 4,
    firstName: 'Lando',
    lastName: 'Norris',
    team: 'McLaren',
    countryCode: 'GBR',
    nationality: 'British',
    status: 'active',
    championships: 1,
    wins: 10,
    startYear: 2019,
    accent: '#ff8700',
    accentSoft: 'rgba(255, 135, 0, 0.18)',
    accentGlow: 'rgba(255, 135, 0, 0.45)',
    icon: 'speed',
    image: driverImg('2025mclarenlannor01right.avif'),
  },
  {
    id: 'oscar-piastri',
    code: 'PIA',
    number: 81,
    firstName: 'Oscar',
    lastName: 'Piastri',
    team: 'McLaren',
    countryCode: 'AUS',
    nationality: 'Australian',
    status: 'active',
    championships: 0,
    wins: 2,
    startYear: 2023,
    accent: '#ff8700',
    accentSoft: 'rgba(255, 135, 0, 0.18)',
    accentGlow: 'rgba(255, 135, 0, 0.45)',
    icon: 'speed',
    image: driverImg('2025mclarenoscpia01right.avif'),
  },
  {
    id: 'fernando-alonso',
    code: 'ALO',
    number: 14,
    firstName: 'Fernando',
    lastName: 'Alonso',
    team: 'Aston Martin',
    countryCode: 'ESP',
    nationality: 'Spanish',
    status: 'active',
    championships: 2,
    wins: 32,
    startYear: 2001,
    accent: '#006f62',
    accentSoft: 'rgba(0, 111, 98, 0.18)',
    accentGlow: 'rgba(0, 111, 98, 0.45)',
    icon: 'military_tech',
    image: driverImg('2025astonmartinferalo01right.avif'),
  },
  {
    id: 'lance-stroll',
    code: 'STR',
    number: 18,
    firstName: 'Lance',
    lastName: 'Stroll',
    team: 'Aston Martin',
    countryCode: 'CAN',
    nationality: 'Canadian',
    status: 'active',
    championships: 0,
    wins: 0,
    startYear: 2017,
    accent: '#006f62',
    accentSoft: 'rgba(0, 111, 98, 0.18)',
    accentGlow: 'rgba(0, 111, 98, 0.45)',
    icon: 'maps_car_front',
    image: driverImg('2025astonmartinlanstr01right.avif'),
  },
  {
    id: 'pierre-gasly',
    code: 'GAS',
    number: 10,
    firstName: 'Pierre',
    lastName: 'Gasly',
    team: 'Alpine',
    countryCode: 'FRA',
    nationality: 'French',
    status: 'active',
    championships: 0,
    wins: 1,
    startYear: 2017,
    accent: '#0090ff',
    accentSoft: 'rgba(0, 144, 255, 0.18)',
    accentGlow: 'rgba(0, 144, 255, 0.45)',
    icon: 'waves',
    image: driverImg('2025alpinepiegas01right.avif'),
  },
  {
    id: 'franco-colapinto',
    code: 'COL',
    number: 43,
    firstName: 'Franco',
    lastName: 'Colapinto',
    team: 'Alpine',
    countryCode: 'ARG',
    nationality: 'Argentine',
    status: 'active',
    championships: 0,
    wins: 0,
    startYear: 2024,
    accent: '#0090ff',
    accentSoft: 'rgba(0, 144, 255, 0.18)',
    accentGlow: 'rgba(0, 144, 255, 0.45)',
    icon: 'waves',
    image: driverImg('2025alpinefracol01right.avif'),
  },
  {
    id: 'alex-albon',
    code: 'ALB',
    number: 23,
    firstName: 'Alex',
    lastName: 'Albon',
    team: 'Williams',
    countryCode: 'THA',
    nationality: 'Thai',
    status: 'active',
    championships: 0,
    wins: 0,
    startYear: 2019,
    accent: '#00a3e0',
    accentSoft: 'rgba(0, 163, 224, 0.18)',
    accentGlow: 'rgba(0, 163, 224, 0.45)',
    icon: 'flight_takeoff',
    image: driverImg('2025williamsalealb01right.avif'),
  },
  {
    id: 'carlos-sainz',
    code: 'SAI',
    number: 55,
    firstName: 'Carlos',
    lastName: 'Sainz',
    team: 'Williams',
    countryCode: 'ESP',
    nationality: 'Spanish',
    status: 'active',
    championships: 0,
    wins: 3,
    startYear: 2015,
    accent: '#00a3e0',
    accentSoft: 'rgba(0, 163, 224, 0.18)',
    accentGlow: 'rgba(0, 163, 224, 0.45)',
    icon: 'flight_takeoff',
    image: driverImg('2025williamscarsai01right.avif'),
  },
  {
    id: 'nico-hulkenberg',
    code: 'HUL',
    number: 27,
    firstName: 'Nico',
    lastName: 'Hülkenberg',
    team: 'Kick Sauber',
    countryCode: 'GER',
    nationality: 'German',
    status: 'active',
    championships: 0,
    wins: 0,
    startYear: 2010,
    accent: '#00e300',
    accentSoft: 'rgba(0, 227, 0, 0.18)',
    accentGlow: 'rgba(0, 227, 0, 0.45)',
    icon: 'eco',
    image: driverImg('2025kicksaubernichul01right.avif'),
  },
  {
    id: 'gabriel-bortoleto',
    code: 'BOR',
    number: 6,
    firstName: 'Gabriel',
    lastName: 'Bortoleto',
    team: 'Kick Sauber',
    countryCode: 'BRA',
    nationality: 'Brazilian',
    status: 'active',
    championships: 0,
    wins: 0,
    startYear: 2025,
    accent: '#00e300',
    accentSoft: 'rgba(0, 227, 0, 0.18)',
    accentGlow: 'rgba(0, 227, 0, 0.45)',
    icon: 'eco',
    image: driverImg('2025kicksaubergabbor01right.avif'),
  },
  {
    id: 'esteban-ocon',
    code: 'OCO',
    number: 31,
    firstName: 'Esteban',
    lastName: 'Ocon',
    team: 'Haas',
    countryCode: 'FRA',
    nationality: 'French',
    status: 'active',
    championships: 0,
    wins: 1,
    startYear: 2016,
    accent: '#d4001f',
    accentSoft: 'rgba(212, 0, 31, 0.18)',
    accentGlow: 'rgba(212, 0, 31, 0.45)',
    icon: 'construction',
    image: driverImg('2025haasf1teamestoco01right.avif'),
  },
  {
    id: 'oliver-bearman',
    code: 'BEA',
    number: 87,
    firstName: 'Oliver',
    lastName: 'Bearman',
    team: 'Haas',
    countryCode: 'GBR',
    nationality: 'British',
    status: 'active',
    championships: 0,
    wins: 0,
    startYear: 2025,
    accent: '#d4001f',
    accentSoft: 'rgba(212, 0, 31, 0.18)',
    accentGlow: 'rgba(212, 0, 31, 0.45)',
    icon: 'construction',
    image: driverImg('2025haasf1teamolibea01right.avif'),
  },
  {
    id: 'liam-lawson',
    code: 'LAW',
    number: 30,
    firstName: 'Liam',
    lastName: 'Lawson',
    team: 'RB',
    countryCode: 'NZL',
    nationality: 'New Zealander',
    status: 'active',
    championships: 0,
    wins: 0,
    startYear: 2023,
    accent: '#2b2d3f',
    accentSoft: 'rgba(43, 45, 63, 0.2)',
    accentGlow: 'rgba(43, 45, 63, 0.45)',
    icon: 'sports_motorsports',
    image: driverImg('2025racingbullslialaw01right.avif'),
  },
  {
    id: 'isack-hadjar',
    code: 'HAD',
    number: 21,
    firstName: 'Isack',
    lastName: 'Hadjar',
    team: 'RB',
    countryCode: 'FRA',
    nationality: 'French',
    status: 'active',
    championships: 0,
    wins: 0,
    startYear: 2025,
    accent: '#2b2d3f',
    accentSoft: 'rgba(43, 45, 63, 0.2)',
    accentGlow: 'rgba(43, 45, 63, 0.45)',
    icon: 'sports_motorsports',
    image: driverImg('2025racingbullsisahad01right.avif'),
  },
]

export default createStore<RootState>({
  state: {
    drivers,
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
    tracks: (state: RootState) => state.tracks,
    trackById: (state: RootState) => (id: string) => state.tracks.find((track) => track.id === id) ?? null,
    calendar: (state: RootState) => state.calendar,
    news: (state: RootState) => state.news,
    newsBySlug: (state: RootState) => (slug: string) => state.news.find((item) => item.slug === slug) ?? null,
  },
})
