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
              src="https://placehold.co/600x400.png"
              alt="Developer portrait"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg"
              data-ai-hint="developer portrait"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">
              A Decade of Pushing Pixels
            </h2>
            <p className="text-lg text-muted-foreground">
              From the early days of static sites to the complex, dynamic applications of today, I've been on a journey of continuous learning and creation. My passion lies at the intersection of design and technology, where I strive to build products that are not only functional but also delightful to use.
            </p>
            <p className="text-lg text-muted-foreground">
              I believe in clean code, user-centric design, and the power of collaboration to turn ambitious ideas into reality.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-24 text-center">
          <Card>
            <CardHeader>
              <CardTitle className="text-5xl font-bold font-headline text-primary">
                <AnimatedCounter value={50} />+
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Projects Launched</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="text-5xl font-bold font-headline text-primary">
                <AnimatedCounter value={10} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Years of Experience</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="text-5xl font-bold font-headline text-primary">
                <AnimatedCounter value={1000} />+
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
