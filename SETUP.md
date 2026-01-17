# Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables (optional):**
   Create a `.env.local` file:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

3. **Add PWA icons:**
   Replace the placeholder icon files in `public/`:
   - `icon-192.png` (192x192 pixels)
   - `icon-512.png` (512x512 pixels)
   - `favicon.ico`

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## AdSense Integration

1. Get your AdSense publisher ID
2. Update `components/AdPlaceholder.tsx` with your actual AdSense code
3. Replace the placeholder divs with actual ad units

Example:
```tsx
<ins
  className="adsbygoogle"
  style={{ display: 'block' }}
  data-ad-client="ca-pub-XXXXXXXXXX"
  data-ad-slot="XXXXXXXXXX"
  data-ad-format="auto"
/>
```

## Google Analytics 4 Setup

1. Create a GA4 property at https://analytics.google.com/
2. Get your Measurement ID (format: G-XXXXXXXXXX)
3. Add it to `.env.local`:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
4. The GA4 script will automatically load after cookie consent

## PWA Configuration

The app is configured as a PWA using `next-pwa`. The service worker will be generated automatically during build.

To test PWA features:
1. Build the app: `npm run build`
2. Serve it: `npm start`
3. Open in browser and check "Add to Home Screen" option

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Netlify

1. Push to GitHub
2. Import project in Netlify
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add environment variables in Netlify dashboard

## Customization

### Adding More Cities

Edit `data/cities.ts` to add more cities:
```typescript
{ name: 'City Name', timezone: 'Continent/City', country: 'Country', slug: 'city-name' }
```

### Customizing Colors

Edit `tailwind.config.ts` to customize the color scheme.

### Adding Alarm Sounds

1. Add sound files to `public/sounds/`
2. Update `utils/audio.ts` to reference your sound files

## Troubleshooting

### PWA not working
- Make sure you're running a production build (`npm run build && npm start`)
- Check browser console for service worker errors
- Verify `manifest.json` is accessible

### Icons not showing
- Replace placeholder icon files with actual PNG files
- Ensure icons are the correct size (192x192 and 512x512)

### AdSense not loading
- Check browser console for errors
- Verify AdSense code is correct
- Ensure ads are enabled in your AdSense account
