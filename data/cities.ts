export interface City {
  name: string
  timezone: string
  country: string
  slug: string
}

export const cities: City[] = [
  { name: 'New York', timezone: 'America/New_York', country: 'United States', slug: 'new-york' },
  { name: 'Los Angeles', timezone: 'America/Los_Angeles', country: 'United States', slug: 'los-angeles' },
  { name: 'Chicago', timezone: 'America/Chicago', country: 'United States', slug: 'chicago' },
  { name: 'Denver', timezone: 'America/Denver', country: 'United States', slug: 'denver' },
  { name: 'Phoenix', timezone: 'America/Phoenix', country: 'United States', slug: 'phoenix' },
  { name: 'Anchorage', timezone: 'America/Anchorage', country: 'United States', slug: 'anchorage' },
  { name: 'Honolulu', timezone: 'Pacific/Honolulu', country: 'United States', slug: 'honolulu' },
  { name: 'London', timezone: 'Europe/London', country: 'United Kingdom', slug: 'london' },
  { name: 'Paris', timezone: 'Europe/Paris', country: 'France', slug: 'paris' },
  { name: 'Tokyo', timezone: 'Asia/Tokyo', country: 'Japan', slug: 'tokyo' },
  { name: 'Sydney', timezone: 'Australia/Sydney', country: 'Australia', slug: 'sydney' },
  { name: 'Dubai', timezone: 'Asia/Dubai', country: 'United Arab Emirates', slug: 'dubai' },
  { name: 'Mumbai', timezone: 'Asia/Kolkata', country: 'India', slug: 'mumbai' },
  { name: 'Beijing', timezone: 'Asia/Shanghai', country: 'China', slug: 'beijing' },
  { name: 'Berlin', timezone: 'Europe/Berlin', country: 'Germany', slug: 'berlin' },
  { name: 'Rome', timezone: 'Europe/Rome', country: 'Italy', slug: 'rome' },
  { name: 'Madrid', timezone: 'Europe/Madrid', country: 'Spain', slug: 'madrid' },
  { name: 'Moscow', timezone: 'Europe/Moscow', country: 'Russia', slug: 'moscow' },
  { name: 'São Paulo', timezone: 'America/Sao_Paulo', country: 'Brazil', slug: 'sao-paulo' },
  { name: 'Mexico City', timezone: 'America/Mexico_City', country: 'Mexico', slug: 'mexico-city' },
  { name: 'Toronto', timezone: 'America/Toronto', country: 'Canada', slug: 'toronto' },
  { name: 'Singapore', timezone: 'Asia/Singapore', country: 'Singapore', slug: 'singapore' },
  { name: 'Hong Kong', timezone: 'Asia/Hong_Kong', country: 'Hong Kong', slug: 'hong-kong' },
  { name: 'Seoul', timezone: 'Asia/Seoul', country: 'South Korea', slug: 'seoul' },
  // Additional cities for "Most Popular Time Zones and Cities" section
  { name: 'Philadelphia', timezone: 'America/New_York', country: 'United States', slug: 'philadelphia' },
  { name: 'Houston', timezone: 'America/Chicago', country: 'United States', slug: 'houston' },
  { name: 'San Antonio', timezone: 'America/Chicago', country: 'United States', slug: 'san-antonio' },
  { name: 'Dallas', timezone: 'America/Chicago', country: 'United States', slug: 'dallas' },
  { name: 'San Diego', timezone: 'America/Los_Angeles', country: 'United States', slug: 'san-diego' },
  { name: 'San Jose', timezone: 'America/Los_Angeles', country: 'United States', slug: 'san-jose' },
  { name: 'Adak', timezone: 'America/Adak', country: 'United States', slug: 'adak' },
  { name: 'Montreal', timezone: 'America/Montreal', country: 'Canada', slug: 'montreal' },
  { name: 'Winnipeg', timezone: 'America/Winnipeg', country: 'Canada', slug: 'winnipeg' },
  { name: 'Calgary', timezone: 'America/Calgary', country: 'Canada', slug: 'calgary' },
  { name: 'Vancouver', timezone: 'America/Vancouver', country: 'Canada', slug: 'vancouver' },
  { name: 'Dublin', timezone: 'Europe/Dublin', country: 'Ireland', slug: 'dublin' },
  { name: 'Melbourne', timezone: 'Australia/Melbourne', country: 'Australia', slug: 'melbourne' },
  { name: 'Brisbane', timezone: 'Australia/Brisbane', country: 'Australia', slug: 'brisbane' },
  { name: 'Perth', timezone: 'Australia/Perth', country: 'Australia', slug: 'perth' },
  { name: 'Adelaide', timezone: 'Australia/Adelaide', country: 'Australia', slug: 'adelaide' },
  { name: 'Wellington', timezone: 'Pacific/Wellington', country: 'New Zealand', slug: 'wellington' },
  { name: 'Manila', timezone: 'Asia/Manila', country: 'Philippines', slug: 'manila' },
  { name: 'Taipei', timezone: 'Asia/Taipei', country: 'Taiwan', slug: 'taipei' },
  { name: 'Shanghai', timezone: 'Asia/Shanghai', country: 'China', slug: 'shanghai' },
  { name: 'Urumqi', timezone: 'Asia/Urumqi', country: 'China', slug: 'urumqi' },
  { name: 'Copenhagen', timezone: 'Europe/Copenhagen', country: 'Denmark', slug: 'copenhagen' },
  { name: 'Ceuta', timezone: 'Africa/Ceuta', country: 'Spain', slug: 'ceuta' },
  { name: 'Canary Islands', timezone: 'Atlantic/Canary', country: 'Spain', slug: 'canary-islands' },
  { name: 'Stockholm', timezone: 'Europe/Stockholm', country: 'Sweden', slug: 'stockholm' },
  { name: 'Lisbon', timezone: 'Europe/Lisbon', country: 'Portugal', slug: 'lisbon' },
  { name: 'Madeira', timezone: 'Atlantic/Madeira', country: 'Portugal', slug: 'madeira' },
  { name: 'Azores', timezone: 'Atlantic/Azores', country: 'Portugal', slug: 'azores' },
  { name: 'Helsinki', timezone: 'Europe/Helsinki', country: 'Finland', slug: 'helsinki' },
  { name: 'Athens', timezone: 'Europe/Athens', country: 'Greece', slug: 'athens' },
  { name: 'Istanbul', timezone: 'Europe/Istanbul', country: 'Turkey', slug: 'istanbul' },
  { name: 'Warsaw', timezone: 'Europe/Warsaw', country: 'Poland', slug: 'warsaw' },
  { name: 'Kiev', timezone: 'Europe/Kiev', country: 'Ukraine', slug: 'kiev' },
  { name: 'Jerusalem', timezone: 'Asia/Jerusalem', country: 'Israel', slug: 'jerusalem' },
  { name: 'New Delhi', timezone: 'Asia/Kolkata', country: 'India', slug: 'new-delhi' },
  { name: 'Kolkata', timezone: 'Asia/Kolkata', country: 'India', slug: 'kolkata' },
  { name: 'Noronha', timezone: 'America/Noronha', country: 'Brazil', slug: 'noronha' },
  { name: 'Rio de Janeiro', timezone: 'America/Rio_de_Janeiro', country: 'Brazil', slug: 'rio-de-janeiro' },
  { name: 'Manaus', timezone: 'America/Manaus', country: 'Brazil', slug: 'manaus' },
  { name: 'Rio Branco', timezone: 'America/Rio_Branco', country: 'Brazil', slug: 'rio-branco' },
  { name: 'Santiago', timezone: 'America/Santiago', country: 'Chile', slug: 'santiago' },
  { name: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires', country: 'Argentina', slug: 'buenos-aires' },
]

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((city) => city.slug === slug)
}

// Generate full slug with country (e.g., "new-york-united-states")
export function getCityFullSlug(city: City): string {
  const countrySlug = city.country.toLowerCase().replace(/\s+/g, '-')
  return `${city.slug}-${countrySlug}`
}

// Get city by full slug (e.g., "new-york-united-states")
export function getCityByFullSlug(fullSlug: string): City | undefined {
  // Try to find by matching the city slug part
  for (const city of cities) {
    const fullSlugMatch = getCityFullSlug(city)
    if (fullSlugMatch === fullSlug) {
      return city
    }
  }
  // Fallback: try to match just the city slug
  return getCityBySlug(fullSlug)
}
