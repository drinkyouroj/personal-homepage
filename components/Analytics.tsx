'use client'

import { useEffect } from 'react'
import Script from 'next/script'

interface AnalyticsProps {
  googleAnalyticsId?: string
  plausibleDomain?: string
  enabled?: boolean
}

export default function Analytics({
  googleAnalyticsId,
  plausibleDomain,
  enabled = false,
}: AnalyticsProps) {
  if (!enabled) return null

  return (
    <>
      {googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}');
            `}
          </Script>
        </>
      )}

      {plausibleDomain && (
        <Script
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      )}
    </>
  )
}

