import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import ModalProvider from '@/components/modal-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Prometheus - Generate Everything',
  description: 'All in one generative AI solution',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">

        <body className={inter.className}>
          <ModalProvider />
          {children}</body>
      </html>
    </ClerkProvider>
  )
}
