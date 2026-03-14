import { Inter } from 'next/font/google';
import { Navbar } from '@/components/landing-page/Navbar';
import { HeroSection } from '@/components/landing-page/HeroSection';
import { FeaturesSection } from '@/components/landing-page/Features';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
});

export default function LandingPage() {
  return (
    <div className={`min-h-screen bg-[#FAFAFA] text-gray-900 ${inter.variable} font-sans`}>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
    </div>
  )
}