# TimeTravel - Online Clock & Timer Tools

A modern, production-ready clock and timer application featuring alarm clock, timer, stopwatch, and world clock functionality. Built with Next.js, optimized for performance, SEO, and PWA support.

## Features

- ⏰ **Alarm Clock** - Set online alarms with snooze functionality
- ⏱️ **Timer** - Countdown timer with sound alerts
- ⏲️ **Stopwatch** - Track elapsed time with lap functionality
- 🌍 **World Clock** - View times across multiple cities
- 📱 **PWA Support** - Installable, works offline
- 🌓 **Dark/Light Theme** - Persistent theme preference
- 🕐 **12/24 Hour Format** - User preference toggle
- 📊 **SEO Optimized** - Static city pages, sitemap, robots.txt
- 🎯 **AdSense Ready** - Placeholder components for monetization
- 📈 **GA4 Ready** - Analytics placeholder setup

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State**: localStorage for user preferences
- **Timezone**: date-fns-tz
- **PWA**: next-pwa
- **Deployment**: Vercel/Netlify ready

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── alarm/             # Alarm clock page
│   ├── timer/             # Countdown timer page
│   ├── stopwatch/         # Stopwatch page
│   ├── world-clock/       # World clock page
│   ├── time/[city]/       # Dynamic city time pages
│   ├── embed/[tool]/      # Embed versions
│   ├── privacy/           # Privacy policy
│   ├── terms/             # Terms of service
│   └── contact/           # Contact page
├── components/            # React components
│   ├── embeds/           # Embed components
│   └── ...
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
├── data/                  # Static data (cities, etc.)
└── public/               # Static assets
```

## Configuration

### AdSense Integration

Replace the placeholder in `components/AdPlaceholder.tsx` with your actual AdSense code:

```typescript
// Add your AdSense script
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXX"
     crossorigin="anonymous"></script>
```

### Google Analytics 4

Add your GA4 measurement ID in `app/layout.tsx`:

```typescript
// Add GA4 script
<script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}></script>
```

### PWA Icons

Add your PWA icons to `public/`:
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)
- `favicon.ico`

## Features in Detail

### Alarm Clock
- Set alarm time with time picker
- Snooze functionality (configurable duration)
- Test sound button
- Settings saved in localStorage
- Automatic alarm triggering

### Timer
- Set minutes and seconds
- Start/pause/reset controls
- Sound alert when timer ends
- Wake lock to prevent screen sleep
- Visual countdown display

### Stopwatch
- Start/stop/reset controls
- Lap functionality
- Millisecond precision display
- Lap history tracking
- Wake lock support

### World Clock
- Add/remove cities
- Real-time updates
- Multiple timezone support
- Saved city preferences
- Links to individual city pages

### SEO Features
- Static city pages (`/time/[city]`)
- Dynamic metadata for each page
- Sitemap generation
- Robots.txt configuration
- OpenGraph tags
- Twitter cards

## Performance Optimizations

- Client-side rendering for interactive features
- Lazy loading for embed components
- IntersectionObserver for ad loading
- LocalStorage for offline functionality
- Static generation for city pages
- Minimal JavaScript bundle size

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- PWA support (installable on mobile/desktop)

## License

MIT License - feel free to use this project for your own purposes.

## Deployment

### Vercel

```bash
vercel
```

### Netlify

```bash
netlify deploy --prod
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
