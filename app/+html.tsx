import { ScrollViewStyleReset } from "expo-router/html";

// Inline SVG favicon as data URI - Savvymax growth trend icon
const SAVVYMAX_FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="7" fill="#0F172A"/>
  <defs>
    <linearGradient id="g" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#22C55E"/>
      <stop offset="100%" stop-color="#14B8A6"/>
    </linearGradient>
  </defs>
  <path d="M6 24V18h3v6H6z" fill="url(#g)" opacity="0.5"/>
  <path d="M11 24V14h3v10h-3z" fill="url(#g)" opacity="0.7"/>
  <path d="M16 24V11h3v13h-3z" fill="url(#g)" opacity="0.85"/>
  <path d="M21 24V7h3v17h-3z" fill="url(#g)"/>
  <path d="M5 20l5-4.5 4 2.5 9-8" stroke="url(#g)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M19.5 9L24 9L24 13.5" stroke="url(#g)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="21" cy="7" r="1.2" fill="#22C55E"/>
</svg>`;

const faviconDataUri = `data:image/svg+xml,${encodeURIComponent(SAVVYMAX_FAVICON_SVG)}`;

// 180x180 apple-touch-icon as inline SVG data URI
const APPLE_TOUCH_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" fill="none">
  <rect width="180" height="180" rx="40" fill="#0F172A"/>
  <defs>
    <linearGradient id="g" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#22C55E"/>
      <stop offset="100%" stop-color="#14B8A6"/>
    </linearGradient>
  </defs>
  <path d="M35 140V105h16v35H35z" fill="url(#g)" opacity="0.5"/>
  <path d="M58 140V80h16v60H58z" fill="url(#g)" opacity="0.7"/>
  <path d="M81 140V65h16v75H81z" fill="url(#g)" opacity="0.85"/>
  <path d="M104 140V40h16v100h-16z" fill="url(#g)"/>
  <path d="M30 115l28-25 22 14 50-45" stroke="url(#g)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M115 52l20 0l0 20" stroke="url(#g)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="125" cy="42" r="6" fill="#22C55E"/>
</svg>`;

const appleTouchIconDataUri = `data:image/svg+xml,${encodeURIComponent(APPLE_TOUCH_ICON_SVG)}`;

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#0F172A" />
        <meta name="application-name" content="Savvymax" />
        <meta name="apple-mobile-web-app-title" content="Savvymax" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="description" content="Maximize your cash deposits effortlessly. Compare savings rates and find the best APY." />

        {/* Favicon - Inline SVG */}
        <link rel="icon" type="image/svg+xml" href={faviconDataUri} />
        <link rel="icon" type="image/png" sizes="192x192" href="/savvymax-icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/savvymax-icon-512.png" />

        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" sizes="180x180" href={appleTouchIconDataUri} />

        {/* Web App Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Microsoft Tile */}
        <meta name="msapplication-TileColor" content="#0F172A" />
        <meta name="msapplication-config" content="none" />

        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
