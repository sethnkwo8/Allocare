// Landing page 
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/landing-page/Navbar';
import { HeroSection } from '@/components/landing-page/HeroSection';
import { FeaturesSection } from '@/components/landing-page/Features';
import { Footer } from '@/components/landing-page/Footer';
import { HowItWorks } from '@/components/landing-page/HowItWorks';
import { FAQSection } from '@/components/landing-page/FAQ';
import { CTABanner } from '@/components/landing-page/CTABanner';

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
      <HowItWorks />
      <FAQSection />
      <CTABanner />
      <Footer />
    </div>
  )
}