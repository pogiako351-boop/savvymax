import { ScrollViewStyleReset } from "expo-router/html";

// High-resolution inline SVG for Savvymax icon - renders crisp on all Retina/AMOLED displays
// Features: dark background, green growth chart with upward arrow, rounded app icon shape
const SAVVYMAX_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="108" fill="#0F172A"/>
  <defs>
    <linearGradient id="gBar" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#16A34A"/>
      <stop offset="100%" stop-color="#22C55E"/>
    </linearGradient>
    <linearGradient id="gLine" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#22C55E"/>
      <stop offset="100%" stop-color="#4ADE80"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <!-- Bar chart -->
  <rect x="80" y="310" width="48" height="90" rx="8" fill="url(#gBar)" opacity="0.45"/>
  <rect x="152" y="250" width="48" height="150" rx="8" fill="url(#gBar)" opacity="0.6"/>
  <rect x="224" y="195" width="48" height="205" rx="8" fill="url(#gBar)" opacity="0.75"/>
  <rect x="296" y="145" width="48" height="255" rx="8" fill="url(#gBar)" opacity="0.88"/>
  <rect x="368" y="90" width="48" height="310" rx="8" fill="url(#gBar)"/>
  <!-- Growth trend line with glow -->
  <path d="M95 295 L168 240 L240 200 L312 155 L384 100" stroke="url(#gLine)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>
  <!-- Arrow head pointing up-right -->
  <path d="M355 85 L400 80 L395 125" stroke="#4ADE80" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>
  <circle cx="398" cy="82" r="8" fill="#4ADE80"/>
  <!-- SM text mark -->
  <text x="256" y="455" font-family="system-ui,-apple-system,sans-serif" font-size="56" font-weight="700" fill="#4ADE80" text-anchor="middle" opacity="0.7">SM</text>
</svg>`;

const svgFaviconDataUri = `data:image/svg+xml,${encodeURIComponent(SAVVYMAX_ICON_SVG)}`;

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

        {/* Favicon - PNG from high-res source + SVG fallback */}
        <link rel="icon" type="image/svg+xml" href={svgFaviconDataUri} />
        <link rel="icon" type="image/png" sizes="512x512" href="/savvymax-icon-512.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/savvymax-icon-192.png" />
        <link rel="shortcut icon" href="/savvymax-icon-512.png" />

        {/* Apple Touch Icon - high-res 512px PNG */}
        <link rel="apple-touch-icon" sizes="512x512" href="/savvymax-icon-512.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/savvymax-icon-192.png" />

        {/* Web App Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Microsoft Tile */}
        <meta name="msapplication-TileColor" content="#0F172A" />
        <meta name="msapplication-TileImage" content="/savvymax-icon-512.png" />
        <meta name="msapplication-config" content="none" />

        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
