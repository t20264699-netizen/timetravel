// Comprehensive list of countries and their timezones
// Based on IANA timezone database

export interface CountryTimezone {
  country: string
  timezones: Array<{
    timezone: string
    city: string
  }>
}

export const countriesTimezones: CountryTimezone[] = [
  {
    country: 'United States',
    timezones: [
      { timezone: 'America/New_York', city: 'New York' },
      { timezone: 'America/New_York', city: 'Washington, D.C.' },
      { timezone: 'America/Chicago', city: 'Chicago' },
      { timezone: 'America/Denver', city: 'Denver' },
      { timezone: 'America/Los_Angeles', city: 'Los Angeles' },
      { timezone: 'America/Los_Angeles', city: 'Seattle' },
      { timezone: 'America/Phoenix', city: 'Phoenix' },
      { timezone: 'America/Anchorage', city: 'Anchorage' },
      { timezone: 'Pacific/Honolulu', city: 'Honolulu' },
      { timezone: 'America/Detroit', city: 'Detroit' },
      { timezone: 'America/Indianapolis', city: 'Indianapolis' },
      { timezone: 'America/Boise', city: 'Boise' },
      { timezone: 'America/Juneau', city: 'Juneau' },
    ],
  },
  {
    country: 'United Kingdom',
    timezones: [
      { timezone: 'Europe/London', city: 'London' },
    ],
  },
  {
    country: 'Canada',
    timezones: [
      { timezone: 'America/Toronto', city: 'Toronto' },
      { timezone: 'America/Vancouver', city: 'Vancouver' },
      { timezone: 'America/Montreal', city: 'Montreal' },
      { timezone: 'America/Calgary', city: 'Calgary' },
      { timezone: 'America/Winnipeg', city: 'Winnipeg' },
      { timezone: 'America/Halifax', city: 'Halifax' },
      { timezone: 'America/St_Johns', city: "St. John's" },
    ],
  },
  {
    country: 'Australia',
    timezones: [
      { timezone: 'Australia/Sydney', city: 'Sydney' },
      { timezone: 'Australia/Melbourne', city: 'Melbourne' },
      { timezone: 'Australia/Brisbane', city: 'Brisbane' },
      { timezone: 'Australia/Perth', city: 'Perth' },
      { timezone: 'Australia/Adelaide', city: 'Adelaide' },
      { timezone: 'Australia/Darwin', city: 'Darwin' },
      { timezone: 'Australia/Hobart', city: 'Hobart' },
    ],
  },
  {
    country: 'France',
    timezones: [
      { timezone: 'Europe/Paris', city: 'Paris' },
      { timezone: 'Europe/Marseille', city: 'Marseille' },
      { timezone: 'Europe/Lyon', city: 'Lyon' },
    ],
  },
  {
    country: 'Germany',
    timezones: [
      { timezone: 'Europe/Berlin', city: 'Berlin' },
      { timezone: 'Europe/Munich', city: 'Munich' },
      { timezone: 'Europe/Frankfurt', city: 'Frankfurt' },
      { timezone: 'Europe/Hamburg', city: 'Hamburg' },
    ],
  },
  {
    country: 'Italy',
    timezones: [
      { timezone: 'Europe/Rome', city: 'Rome' },
      { timezone: 'Europe/Milan', city: 'Milan' },
      { timezone: 'Europe/Naples', city: 'Naples' },
    ],
  },
  {
    country: 'Spain',
    timezones: [
      { timezone: 'Europe/Madrid', city: 'Madrid' },
      { timezone: 'Europe/Barcelona', city: 'Barcelona' },
      { timezone: 'Africa/Ceuta', city: 'Ceuta' },
      { timezone: 'Atlantic/Canary', city: 'Canary Islands' },
    ],
  },
  {
    country: 'Japan',
    timezones: [
      { timezone: 'Asia/Tokyo', city: 'Tokyo' },
      { timezone: 'Asia/Osaka', city: 'Osaka' },
      { timezone: 'Asia/Yokohama', city: 'Yokohama' },
    ],
  },
  {
    country: 'China',
    timezones: [
      { timezone: 'Asia/Shanghai', city: 'Beijing' },
      { timezone: 'Asia/Shanghai', city: 'Shanghai' },
      { timezone: 'Asia/Hong_Kong', city: 'Hong Kong' },
    ],
  },
  {
    country: 'India',
    timezones: [
      { timezone: 'Asia/Kolkata', city: 'Mumbai' },
      { timezone: 'Asia/Kolkata', city: 'New Delhi' },
      { timezone: 'Asia/Kolkata', city: 'Bangalore' },
      { timezone: 'Asia/Kolkata', city: 'Kolkata' },
    ],
  },
  {
    country: 'Russia',
    timezones: [
      { timezone: 'Europe/Moscow', city: 'Moscow' },
      { timezone: 'Europe/Saint_Petersburg', city: 'Saint Petersburg' },
      { timezone: 'Asia/Yekaterinburg', city: 'Yekaterinburg' },
      { timezone: 'Asia/Novosibirsk', city: 'Novosibirsk' },
      { timezone: 'Asia/Irkutsk', city: 'Irkutsk' },
      { timezone: 'Asia/Vladivostok', city: 'Vladivostok' },
    ],
  },
  {
    country: 'Brazil',
    timezones: [
      { timezone: 'America/Sao_Paulo', city: 'São Paulo' },
      { timezone: 'America/Rio_de_Janeiro', city: 'Rio de Janeiro' },
      { timezone: 'America/Brasilia', city: 'Brasilia' },
      { timezone: 'America/Fortaleza', city: 'Fortaleza' },
      { timezone: 'America/Manaus', city: 'Manaus' },
    ],
  },
  {
    country: 'Mexico',
    timezones: [
      { timezone: 'America/Mexico_City', city: 'Mexico City' },
      { timezone: 'America/Cancun', city: 'Cancun' },
      { timezone: 'America/Tijuana', city: 'Tijuana' },
      { timezone: 'America/Monterrey', city: 'Monterrey' },
    ],
  },
  {
    country: 'Argentina',
    timezones: [
      { timezone: 'America/Argentina/Buenos_Aires', city: 'Buenos Aires' },
      { timezone: 'America/Argentina/Cordoba', city: 'Cordoba' },
    ],
  },
  {
    country: 'Philippines',
    timezones: [
      { timezone: 'Asia/Manila', city: 'Manila' },
      { timezone: 'Asia/Manila', city: 'Cebu' },
    ],
  },
  {
    country: 'Singapore',
    timezones: [
      { timezone: 'Asia/Singapore', city: 'Singapore' },
    ],
  },
  {
    country: 'United Arab Emirates',
    timezones: [
      { timezone: 'Asia/Dubai', city: 'Dubai' },
      { timezone: 'Asia/Dubai', city: 'Abu Dhabi' },
    ],
  },
  {
    country: 'South Korea',
    timezones: [
      { timezone: 'Asia/Seoul', city: 'Seoul' },
      { timezone: 'Asia/Seoul', city: 'Busan' },
    ],
  },
  {
    country: 'Turkey',
    timezones: [
      { timezone: 'Europe/Istanbul', city: 'Istanbul' },
      { timezone: 'Europe/Istanbul', city: 'Ankara' },
    ],
  },
  {
    country: 'Poland',
    timezones: [
      { timezone: 'Europe/Warsaw', city: 'Warsaw' },
      { timezone: 'Europe/Warsaw', city: 'Krakow' },
    ],
  },
  {
    country: 'Ukraine',
    timezones: [
      { timezone: 'Europe/Kiev', city: 'Kiev' },
      { timezone: 'Europe/Kiev', city: 'Kharkiv' },
    ],
  },
  {
    country: 'Israel',
    timezones: [
      { timezone: 'Asia/Jerusalem', city: 'Jerusalem' },
      { timezone: 'Asia/Jerusalem', city: 'Tel Aviv' },
    ],
  },
  // Add more countries as needed
  {
    country: 'Netherlands',
    timezones: [
      { timezone: 'Europe/Amsterdam', city: 'Amsterdam' },
    ],
  },
  {
    country: 'Belgium',
    timezones: [
      { timezone: 'Europe/Brussels', city: 'Brussels' },
    ],
  },
  {
    country: 'Switzerland',
    timezones: [
      { timezone: 'Europe/Zurich', city: 'Zurich' },
    ],
  },
  {
    country: 'Austria',
    timezones: [
      { timezone: 'Europe/Vienna', city: 'Vienna' },
    ],
  },
  {
    country: 'Sweden',
    timezones: [
      { timezone: 'Europe/Stockholm', city: 'Stockholm' },
    ],
  },
  {
    country: 'Norway',
    timezones: [
      { timezone: 'Europe/Oslo', city: 'Oslo' },
    ],
  },
  {
    country: 'Denmark',
    timezones: [
      { timezone: 'Europe/Copenhagen', city: 'Copenhagen' },
    ],
  },
  {
    country: 'Finland',
    timezones: [
      { timezone: 'Europe/Helsinki', city: 'Helsinki' },
    ],
  },
  {
    country: 'Greece',
    timezones: [
      { timezone: 'Europe/Athens', city: 'Athens' },
    ],
  },
  {
    country: 'Portugal',
    timezones: [
      { timezone: 'Europe/Lisbon', city: 'Lisbon' },
    ],
  },
  {
    country: 'Ireland',
    timezones: [
      { timezone: 'Europe/Dublin', city: 'Dublin' },
    ],
  },
  {
    country: 'New Zealand',
    timezones: [
      { timezone: 'Pacific/Auckland', city: 'Auckland' },
      { timezone: 'Pacific/Wellington', city: 'Wellington' },
    ],
  },
  {
    country: 'South Africa',
    timezones: [
      { timezone: 'Africa/Johannesburg', city: 'Johannesburg' },
      { timezone: 'Africa/Johannesburg', city: 'Cape Town' },
    ],
  },
  {
    country: 'Egypt',
    timezones: [
      { timezone: 'Africa/Cairo', city: 'Cairo' },
    ],
  },
  {
    country: 'Saudi Arabia',
    timezones: [
      { timezone: 'Asia/Riyadh', city: 'Riyadh' },
      { timezone: 'Asia/Riyadh', city: 'Jeddah' },
    ],
  },
  {
    country: 'Thailand',
    timezones: [
      { timezone: 'Asia/Bangkok', city: 'Bangkok' },
    ],
  },
  {
    country: 'Indonesia',
    timezones: [
      { timezone: 'Asia/Jakarta', city: 'Jakarta' },
      { timezone: 'Asia/Makassar', city: 'Makassar' },
      { timezone: 'Asia/Jayapura', city: 'Jayapura' },
    ],
  },
  {
    country: 'Malaysia',
    timezones: [
      { timezone: 'Asia/Kuala_Lumpur', city: 'Kuala Lumpur' },
    ],
  },
  {
    country: 'Vietnam',
    timezones: [
      { timezone: 'Asia/Ho_Chi_Minh', city: 'Ho Chi Minh City' },
      { timezone: 'Asia/Ho_Chi_Minh', city: 'Hanoi' },
    ],
  },
  {
    country: 'Chile',
    timezones: [
      { timezone: 'America/Santiago', city: 'Santiago' },
    ],
  },
  {
    country: 'Colombia',
    timezones: [
      { timezone: 'America/Bogota', city: 'Bogota' },
    ],
  },
  {
    country: 'Peru',
    timezones: [
      { timezone: 'America/Lima', city: 'Lima' },
    ],
  },
  {
    country: 'Venezuela',
    timezones: [
      { timezone: 'America/Caracas', city: 'Caracas' },
    ],
  },
  {
    country: 'Czech Republic',
    timezones: [
      { timezone: 'Europe/Prague', city: 'Prague' },
    ],
  },
  {
    country: 'Hungary',
    timezones: [
      { timezone: 'Europe/Budapest', city: 'Budapest' },
    ],
  },
  {
    country: 'Romania',
    timezones: [
      { timezone: 'Europe/Bucharest', city: 'Bucharest' },
    ],
  },
  {
    country: 'Bulgaria',
    timezones: [
      { timezone: 'Europe/Sofia', city: 'Sofia' },
    ],
  },
  {
    country: 'Croatia',
    timezones: [
      { timezone: 'Europe/Zagreb', city: 'Zagreb' },
    ],
  },
  {
    country: 'Serbia',
    timezones: [
      { timezone: 'Europe/Belgrade', city: 'Belgrade' },
    ],
  },
  {
    country: 'Slovakia',
    timezones: [
      { timezone: 'Europe/Bratislava', city: 'Bratislava' },
    ],
  },
  {
    country: 'Slovenia',
    timezones: [
      { timezone: 'Europe/Ljubljana', city: 'Ljubljana' },
    ],
  },
  {
    country: 'Lithuania',
    timezones: [
      { timezone: 'Europe/Vilnius', city: 'Vilnius' },
    ],
  },
  {
    country: 'Latvia',
    timezones: [
      { timezone: 'Europe/Riga', city: 'Riga' },
    ],
  },
  {
    country: 'Estonia',
    timezones: [
      { timezone: 'Europe/Tallinn', city: 'Tallinn' },
    ],
  },
  {
    country: 'Iceland',
    timezones: [
      { timezone: 'Atlantic/Reykjavik', city: 'Reykjavik' },
    ],
  },
  {
    country: 'Luxembourg',
    timezones: [
      { timezone: 'Europe/Luxembourg', city: 'Luxembourg' },
    ],
  },
  {
    country: 'Monaco',
    timezones: [
      { timezone: 'Europe/Monaco', city: 'Monaco' },
    ],
  },
  {
    country: 'Malta',
    timezones: [
      { timezone: 'Europe/Malta', city: 'Valletta' },
    ],
  },
  {
    country: 'Cyprus',
    timezones: [
      { timezone: 'Asia/Nicosia', city: 'Nicosia' },
    ],
  },
  // More Asian countries
  {
    country: 'Bangladesh',
    timezones: [
      { timezone: 'Asia/Dhaka', city: 'Dhaka' },
    ],
  },
  {
    country: 'Pakistan',
    timezones: [
      { timezone: 'Asia/Karachi', city: 'Karachi' },
      { timezone: 'Asia/Karachi', city: 'Islamabad' },
    ],
  },
  {
    country: 'Sri Lanka',
    timezones: [
      { timezone: 'Asia/Colombo', city: 'Colombo' },
    ],
  },
  {
    country: 'Nepal',
    timezones: [
      { timezone: 'Asia/Kathmandu', city: 'Kathmandu' },
    ],
  },
  {
    country: 'Myanmar',
    timezones: [
      { timezone: 'Asia/Yangon', city: 'Yangon' },
    ],
  },
  {
    country: 'Cambodia',
    timezones: [
      { timezone: 'Asia/Phnom_Penh', city: 'Phnom Penh' },
    ],
  },
  {
    country: 'Laos',
    timezones: [
      { timezone: 'Asia/Vientiane', city: 'Vientiane' },
    ],
  },
  {
    country: 'Mongolia',
    timezones: [
      { timezone: 'Asia/Ulaanbaatar', city: 'Ulaanbaatar' },
    ],
  },
  {
    country: 'Kazakhstan',
    timezones: [
      { timezone: 'Asia/Almaty', city: 'Almaty' },
      { timezone: 'Asia/Aqtobe', city: 'Aqtobe' },
    ],
  },
  {
    country: 'Uzbekistan',
    timezones: [
      { timezone: 'Asia/Tashkent', city: 'Tashkent' },
    ],
  },
  {
    country: 'Kyrgyzstan',
    timezones: [
      { timezone: 'Asia/Bishkek', city: 'Bishkek' },
    ],
  },
  {
    country: 'Tajikistan',
    timezones: [
      { timezone: 'Asia/Dushanbe', city: 'Dushanbe' },
    ],
  },
  {
    country: 'Afghanistan',
    timezones: [
      { timezone: 'Asia/Kabul', city: 'Kabul' },
    ],
  },
  {
    country: 'Iran',
    timezones: [
      { timezone: 'Asia/Tehran', city: 'Tehran' },
    ],
  },
  {
    country: 'Iraq',
    timezones: [
      { timezone: 'Asia/Baghdad', city: 'Baghdad' },
    ],
  },
  {
    country: 'Jordan',
    timezones: [
      { timezone: 'Asia/Amman', city: 'Amman' },
    ],
  },
  {
    country: 'Lebanon',
    timezones: [
      { timezone: 'Asia/Beirut', city: 'Beirut' },
    ],
  },
  {
    country: 'Syria',
    timezones: [
      { timezone: 'Asia/Damascus', city: 'Damascus' },
    ],
  },
  {
    country: 'Yemen',
    timezones: [
      { timezone: 'Asia/Aden', city: 'Sanaa' },
    ],
  },
  {
    country: 'Oman',
    timezones: [
      { timezone: 'Asia/Muscat', city: 'Muscat' },
    ],
  },
  {
    country: 'Kuwait',
    timezones: [
      { timezone: 'Asia/Kuwait', city: 'Kuwait City' },
    ],
  },
  {
    country: 'Qatar',
    timezones: [
      { timezone: 'Asia/Qatar', city: 'Doha' },
    ],
  },
  {
    country: 'Bahrain',
    timezones: [
      { timezone: 'Asia/Bahrain', city: 'Manama' },
    ],
  },
  // More African countries
  {
    country: 'Nigeria',
    timezones: [
      { timezone: 'Africa/Lagos', city: 'Lagos' },
      { timezone: 'Africa/Lagos', city: 'Abuja' },
    ],
  },
  {
    country: 'Kenya',
    timezones: [
      { timezone: 'Africa/Nairobi', city: 'Nairobi' },
    ],
  },
  {
    country: 'Ethiopia',
    timezones: [
      { timezone: 'Africa/Addis_Ababa', city: 'Addis Ababa' },
    ],
  },
  {
    country: 'Ghana',
    timezones: [
      { timezone: 'Africa/Accra', city: 'Accra' },
    ],
  },
  {
    country: 'Morocco',
    timezones: [
      { timezone: 'Africa/Casablanca', city: 'Casablanca' },
      { timezone: 'Africa/Casablanca', city: 'Rabat' },
    ],
  },
  {
    country: 'Algeria',
    timezones: [
      { timezone: 'Africa/Algiers', city: 'Algiers' },
    ],
  },
  {
    country: 'Tunisia',
    timezones: [
      { timezone: 'Africa/Tunis', city: 'Tunis' },
    ],
  },
  {
    country: 'Libya',
    timezones: [
      { timezone: 'Africa/Tripoli', city: 'Tripoli' },
    ],
  },
  {
    country: 'Sudan',
    timezones: [
      { timezone: 'Africa/Khartoum', city: 'Khartoum' },
    ],
  },
  {
    country: 'Tanzania',
    timezones: [
      { timezone: 'Africa/Dar_es_Salaam', city: 'Dar es Salaam' },
    ],
  },
  {
    country: 'Uganda',
    timezones: [
      { timezone: 'Africa/Kampala', city: 'Kampala' },
    ],
  },
  {
    country: 'Zimbabwe',
    timezones: [
      { timezone: 'Africa/Harare', city: 'Harare' },
    ],
  },
  {
    country: 'Zambia',
    timezones: [
      { timezone: 'Africa/Lusaka', city: 'Lusaka' },
    ],
  },
  {
    country: 'Angola',
    timezones: [
      { timezone: 'Africa/Luanda', city: 'Luanda' },
    ],
  },
  {
    country: 'Mozambique',
    timezones: [
      { timezone: 'Africa/Maputo', city: 'Maputo' },
    ],
  },
  {
    country: 'Madagascar',
    timezones: [
      { timezone: 'Indian/Antananarivo', city: 'Antananarivo' },
    ],
  },
  {
    country: 'Mauritius',
    timezones: [
      { timezone: 'Indian/Mauritius', city: 'Port Louis' },
    ],
  },
  {
    country: 'Senegal',
    timezones: [
      { timezone: 'Africa/Dakar', city: 'Dakar' },
    ],
  },
  {
    country: 'Ivory Coast',
    timezones: [
      { timezone: 'Africa/Abidjan', city: 'Abidjan' },
    ],
  },
  {
    country: 'Cameroon',
    timezones: [
      { timezone: 'Africa/Douala', city: 'Douala' },
    ],
  },
  // More American countries
  {
    country: 'Ecuador',
    timezones: [
      { timezone: 'America/Guayaquil', city: 'Guayaquil' },
      { timezone: 'America/Guayaquil', city: 'Quito' },
    ],
  },
  {
    country: 'Bolivia',
    timezones: [
      { timezone: 'America/La_Paz', city: 'La Paz' },
    ],
  },
  {
    country: 'Paraguay',
    timezones: [
      { timezone: 'America/Asuncion', city: 'Asuncion' },
    ],
  },
  {
    country: 'Uruguay',
    timezones: [
      { timezone: 'America/Montevideo', city: 'Montevideo' },
    ],
  },
  {
    country: 'Guatemala',
    timezones: [
      { timezone: 'America/Guatemala', city: 'Guatemala City' },
    ],
  },
  {
    country: 'Honduras',
    timezones: [
      { timezone: 'America/Tegucigalpa', city: 'Tegucigalpa' },
    ],
  },
  {
    country: 'El Salvador',
    timezones: [
      { timezone: 'America/El_Salvador', city: 'San Salvador' },
    ],
  },
  {
    country: 'Nicaragua',
    timezones: [
      { timezone: 'America/Managua', city: 'Managua' },
    ],
  },
  {
    country: 'Costa Rica',
    timezones: [
      { timezone: 'America/Costa_Rica', city: 'San Jose' },
    ],
  },
  {
    country: 'Panama',
    timezones: [
      { timezone: 'America/Panama', city: 'Panama City' },
    ],
  },
  {
    country: 'Cuba',
    timezones: [
      { timezone: 'America/Havana', city: 'Havana' },
    ],
  },
  {
    country: 'Jamaica',
    timezones: [
      { timezone: 'America/Jamaica', city: 'Kingston' },
    ],
  },
  {
    country: 'Haiti',
    timezones: [
      { timezone: 'America/Port-au-Prince', city: 'Port-au-Prince' },
    ],
  },
  {
    country: 'Dominican Republic',
    timezones: [
      { timezone: 'America/Santo_Domingo', city: 'Santo Domingo' },
    ],
  },
  {
    country: 'Trinidad and Tobago',
    timezones: [
      { timezone: 'America/Port_of_Spain', city: 'Port of Spain' },
    ],
  },
  {
    country: 'Barbados',
    timezones: [
      { timezone: 'America/Barbados', city: 'Bridgetown' },
    ],
  },
  // More Asian countries (continued)
  {
    country: 'Bhutan',
    timezones: [
      { timezone: 'Asia/Thimphu', city: 'Thimphu' },
    ],
  },
  {
    country: 'Brunei',
    timezones: [
      { timezone: 'Asia/Brunei', city: 'Bandar Seri Begawan' },
    ],
  },
  {
    country: 'East Timor',
    timezones: [
      { timezone: 'Asia/Dili', city: 'Dili' },
    ],
  },
  {
    country: 'Papua New Guinea',
    timezones: [
      { timezone: 'Pacific/Port_Moresby', city: 'Port Moresby' },
    ],
  },
  {
    country: 'Fiji',
    timezones: [
      { timezone: 'Pacific/Fiji', city: 'Suva' },
    ],
  },
  {
    country: 'Samoa',
    timezones: [
      { timezone: 'Pacific/Apia', city: 'Apia' },
    ],
  },
  {
    country: 'Tonga',
    timezones: [
      { timezone: 'Pacific/Tongatapu', city: "Nuku'alofa" },
    ],
  },
  // More countries
  {
    country: 'Albania',
    timezones: [
      { timezone: 'Europe/Tirane', city: 'Tirana' },
    ],
  },
  {
    country: 'Bosnia and Herzegovina',
    timezones: [
      { timezone: 'Europe/Sarajevo', city: 'Sarajevo' },
    ],
  },
  {
    country: 'North Macedonia',
    timezones: [
      { timezone: 'Europe/Skopje', city: 'Skopje' },
    ],
  },
  {
    country: 'Montenegro',
    timezones: [
      { timezone: 'Europe/Podgorica', city: 'Podgorica' },
    ],
  },
  {
    country: 'Kosovo',
    timezones: [
      { timezone: 'Europe/Belgrade', city: 'Pristina' },
    ],
  },
  {
    country: 'Moldova',
    timezones: [
      { timezone: 'Europe/Chisinau', city: 'Chisinau' },
    ],
  },
  {
    country: 'Belarus',
    timezones: [
      { timezone: 'Europe/Minsk', city: 'Minsk' },
    ],
  },
  {
    country: 'Armenia',
    timezones: [
      { timezone: 'Asia/Yerevan', city: 'Yerevan' },
    ],
  },
  {
    country: 'Azerbaijan',
    timezones: [
      { timezone: 'Asia/Baku', city: 'Baku' },
    ],
  },
  {
    country: 'Georgia',
    timezones: [
      { timezone: 'Asia/Tbilisi', city: 'Tbilisi' },
    ],
  },
  {
    country: 'Turkmenistan',
    timezones: [
      { timezone: 'Asia/Ashgabat', city: 'Ashgabat' },
    ],
  },
  {
    country: 'Seychelles',
    timezones: [
      { timezone: 'Indian/Mahe', city: 'Victoria' },
    ],
  },
  {
    country: 'Reunion',
    timezones: [
      { timezone: 'Indian/Reunion', city: 'Saint-Denis' },
    ],
  },
]

// Get all unique countries
export function getAllCountries(): string[] {
  const countries = countriesTimezones.map((ct) => ct.country)
  return Array.from(new Set(countries)).sort()
}

// Get timezones for a specific country
export function getTimezonesForCountry(country: string): Array<{ timezone: string; city: string }> {
  if (!country || country.trim() === '') return []
  const trimmedCountry = country.trim()
  const countryData = countriesTimezones.find((ct) => ct.country === trimmedCountry)
  if (!countryData) {
    // No timezones found for country - validation error
    return []
  }
  return countryData.timezones || []
}

// Get UTC offset label for a timezone
export function getTimezoneOffsetLabel(timezone: string): string {
  try {
    const now = new Date()
    // Create a date formatter for the timezone
    const tzFormatter = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      hour: '2-digit',
      hour12: false,
      timeZoneName: 'longOffset',
    })
    
    // Get the offset by comparing UTC and timezone times
    const utcTime = now.getTime()
    const tzTimeStr = now.toLocaleString('en-US', { timeZone: timezone })
    const tzTime = new Date(tzTimeStr).getTime()
    
    // Calculate offset in minutes
    const offsetMs = tzTime - utcTime
    const offsetMins = Math.round(offsetMs / (1000 * 60))
    const offsetHours = Math.floor(offsetMins / 60)
    const offsetMinsRem = Math.abs(offsetMins % 60)
    
    const sign = offsetMins >= 0 ? '+' : '-'
    const absHours = Math.abs(offsetHours).toString().padStart(2, '0')
    const absMins = offsetMinsRem.toString().padStart(2, '0')
    
    return `(UTC ${sign}${absHours}:${absMins})`
  } catch (e) {
    // Fallback: try using Intl API
    try {
      const now = new Date()
      const formatter = new Intl.DateTimeFormat('en', {
        timeZone: timezone,
        timeZoneName: 'shortOffset',
      })
      const parts = formatter.formatToParts(now)
      const offset = parts.find((p) => p.type === 'timeZoneName')?.value || ''
      return offset ? `(UTC ${offset})` : ''
    } catch {
      return ''
    }
  }
}
