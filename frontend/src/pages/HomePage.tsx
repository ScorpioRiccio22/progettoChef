import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import ServicesSection from '@/components/sections/ServicesSection'
import RecipesPreviewSection from '@/components/sections/RecipesPreviewSection'
import EventsPreviewSection from '@/components/sections/EventsPreviewSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import NewsletterSection from '@/components/sections/NewsletterSection'
import ContactPreviewSection from '@/components/sections/ContactPreviewSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <RecipesPreviewSection />
      <EventsPreviewSection />
      <TestimonialsSection />
      <NewsletterSection />
      <ContactPreviewSection />
    </>
  )
}
