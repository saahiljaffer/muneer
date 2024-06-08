import { Providers } from '@/app/docs/providers'

import '@/styles/tailwind.css'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s - Protocol API Reference',
    default: 'Protocol API Reference',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="flex min-h-full bg-white antialiased dark:bg-zinc-900">
        {children}
      </body>
    </html>
  )
}
