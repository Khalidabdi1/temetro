import React from 'react'
import { 
  Header, 
  Hero, 
  Stats,
  Features, 
  HowItWorks, 
  Testimonials,
  Pricing, 
  CTA,
  Footer 
} from '@/components/landing'

const LandingLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Stats />
        <section id="features">
          <Features />
        </section>
        <section id="how-it-works">
          <HowItWorks />
        </section>
        <Testimonials />
        <section id="pricing">
          <Pricing />
        </section>
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

export default LandingLayout
