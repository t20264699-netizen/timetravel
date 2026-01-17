export interface Holiday {
  name: string
  date: string // Format: 'YYYY-MM-DD'
}

export const holidays: Holiday[] = [
  { name: 'New Year', date: '2027-01-01' },
  { name: 'Martin Luther King Day', date: '2026-01-19' },
  { name: 'Groundhog Day', date: '2026-02-02' },
  { name: 'Chinese New Year', date: '2026-02-17' },
  { name: "Valentine's Day", date: '2026-02-14' },
  { name: 'Presidents Day', date: '2026-02-16' },
  { name: "St. Patrick's Day", date: '2026-03-17' },
  { name: 'Good Friday', date: '2026-04-03' },
  { name: 'Easter', date: '2026-04-05' },
  { name: 'Tax Day', date: '2026-04-15' },
  { name: "Mother's Day", date: '2026-05-10' },
  { name: 'Memorial Day', date: '2026-05-25' },
  { name: "Father's Day", date: '2026-06-21' },
  { name: 'Juneteenth', date: '2026-06-19' },
  { name: 'Independence Day', date: '2026-07-04' },
  { name: 'Labor Day', date: '2026-09-07' },
  { name: 'Columbus Day', date: '2026-10-12' },
  { name: 'Halloween', date: '2026-10-31' },
  { name: 'Veterans Day', date: '2026-11-11' },
  { name: 'Thanksgiving Day', date: '2026-11-26' },
  { name: 'Black Friday', date: '2026-11-27' },
  { name: 'Cyber Monday', date: '2026-11-30' },
  { name: 'Christmas', date: '2026-12-25' },
]
