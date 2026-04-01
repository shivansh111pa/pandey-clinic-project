import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollAnimator from '@/components/layout/ScrollAnimator';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Pandey Care — Dr. Shivansh A. Pandey, MBBS',
  description: 'Book your appointment with Dr. Shivansh A. Pandey, MBBS at Pandey Care clinic, AIIMS Gorakhpur. Quality healthcare for 5000+ patients.',
  keywords: 'doctor, clinic, appointment, MBBS, Gorakhpur, AIIMS, healthcare',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <ScrollAnimator />
        </Providers>
      </body>
    </html>
  );
}
