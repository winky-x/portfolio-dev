import Image from 'next/image'
import { AnimatedCounter } from '@/components/animated-counter'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { StaggeredContainer, StaggeredItem } from '@/components/ui/animated-entrance'
import { PremiumCard } from '@/components/ui/premium-card'
import { DynamicBackground } from '@/components/ui/dynamic-background'

export function IntroSection() {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Dynamic background */}
      <DynamicBackground
        pattern="waves"
        colors={['#6366f1', '#8b5cf6', '#06b6d4']}
        intensity={0.4}
        speed={0.8}
      />
      
      <div className="container relative z-10">
        <StaggeredContainer stagger={0.2}>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <StaggeredItem direction="left" distance={40}>
              <div className="relative h-96">
                <PremiumCard
                  className="h-full overflow-hidden"
                  neonColor="#6366f1"
                  glow={true}
                  tilt={true}
                >
                  <Image
                    src="/images/developer-portrait.jpg"
                    alt="Full-stack developer at work"
                    fill
                    className="rounded-lg object-cover"
                  />
                </PremiumCard>
              </div>
            </StaggeredItem>
            
            <StaggeredItem direction="right" distance={40}>
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">
                  Building Digital Solutions That Matter
                </h2>
                <p className="text-lg text-muted-foreground">
                  I'm a passionate full-stack developer with expertise in modern web technologies. I specialize in creating scalable applications using React, Next.js, Node.js, and cloud platforms like AWS. My approach combines technical excellence with user experience design.
                </p>
                <p className="text-lg text-muted-foreground">
                  I've worked on projects ranging from e-commerce platforms to enterprise applications, always focusing on performance, accessibility, and maintainable code.
                </p>
              </div>
            </StaggeredItem>
          </div>
        </StaggeredContainer>

        <StaggeredContainer stagger={0.15}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-24 text-center">
            <StaggeredItem direction="up" distance={30} delay={0.1}>
              <PremiumCard
                className="backdrop-blur-sm"
                neonColor="#10b981"
                glow={true}
                tilt={true}
                scale={true}
              >
                <CardHeader>
                  <CardTitle className="text-5xl font-bold font-headline text-primary">
                    <AnimatedCounter value={25} />+
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Projects Completed</p>
                </CardContent>
              </PremiumCard>
            </StaggeredItem>
            
            <StaggeredItem direction="up" distance={30} delay={0.2}>
              <PremiumCard
                className="backdrop-blur-sm"
                neonColor="#8b5cf6"
                glow={true}
                tilt={true}
                scale={true}
              >
                <CardHeader>
                  <CardTitle className="text-5xl font-bold font-headline text-primary">
                    <AnimatedCounter value={5} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Years of Experience</p>
                </CardContent>
              </PremiumCard>
            </StaggeredItem>
            
            <StaggeredItem direction="up" distance={30} delay={0.3}>
              <PremiumCard
                className="backdrop-blur-sm"
                neonColor="#f59e0b"
                glow={true}
                tilt={true}
                scale={true}
              >
                <CardHeader>
                  <CardTitle className="text-5xl font-bold font-headline text-primary">
                    <AnimatedCounter value={500} />+
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">GitHub Commits</p>
                </CardContent>
              </PremiumCard>
            </StaggeredItem>
          </div>
        </StaggeredContainer>


      </div>
    </section>
  )
}
