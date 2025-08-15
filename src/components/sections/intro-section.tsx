import Image from 'next/image'
import { AnimatedCounter } from '@/components/animated-counter'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

export function IntroSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-96">
             <Image
              src="/images/developer-portrait.jpg"
              alt="Full-stack developer at work"
              fill
              className="rounded-lg shadow-lg object-cover"
            />
          </div>
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-24 text-center">
          <Card>
            <CardHeader>
              <CardTitle className="text-5xl font-bold font-headline text-primary">
                <AnimatedCounter value={25} />+
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Projects Completed</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="text-5xl font-bold font-headline text-primary">
                <AnimatedCounter value={5} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Years of Experience</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="text-5xl font-bold font-headline text-primary">
                <AnimatedCounter value={500} />+
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">GitHub Commits</p>
            </CardContent>
          </Card>
        </div>


      </div>
    </section>
  )
}
