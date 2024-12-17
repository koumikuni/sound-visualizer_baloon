import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '音量可視化アプリ',
  description: 'マイクの音量に応じて円の大きさが変化するアプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}

