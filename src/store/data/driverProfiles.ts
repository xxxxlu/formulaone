import driverProfilesJson from '../../data/driver-profiles.json'
import type { DriverProfile } from '../types'

export const driverProfiles = driverProfilesJson as Record<string, DriverProfile>
