import { Header } from '@/components/header'
import { HeroSection } from '@/components/sections/hero-section'
import { IntroSection } from '@/components/sections/intro-section'
import { ProjectsSection } from '@/components/sections/projects-section'
import { ExperienceSection } from '@/components/sections/experience-section'
import { IntegrationsSection } from '@/components/sections/integrations-section'
import { Footer } from '@/components/footer'


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <IntroSection />
        <ProjectsSection />
        <ExperienceSection />
        <IntegrationsSection />
      </main>
      <Footer />
    </div>
  )
}
