import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { ArrowRight, Github } from 'lucide-react'

const projects = [
  {
    title: 'QuantumLeap CRM',
    description: 'A futuristic CRM platform with predictive analytics and AI-powered insights.',
    tags: ['React', 'Node.js', 'GraphQL', 'AI'],
    image: 'https://placehold.co/600x400.png',
    aiHint: 'futuristic dashboard',
    desktopImage: 'https://placehold.co/1200x800.png',
    mobileImage: 'https://placehold.co/400x800.png',
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    title: 'Aether eCommerce',
    description: 'A high-performance online marketplace for digital goods with a focus on user experience.',
    tags: ['Next.js', 'TailwindCSS', 'Stripe'],
    image: 'https://placehold.co/600x400.png',
    aiHint: 'modern ecommerce',
    desktopImage: 'https://placehold.co/1200x800.png',
    mobileImage: 'https://placehold.co/400x800.png',
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    title: 'Nova Social',
    description: 'A decentralized social media platform empowering creators with blockchain technology.',
    tags: ['Vue.js', 'Web3', 'Solidity'],
    image: 'https://placehold.co/600x400.png',
    aiHint: 'social network',
    desktopImage: 'https://placehold.co/1200x800.png',
    mobileImage: 'https://placehold.co/400x800.png',
    liveUrl: '#',
    githubUrl: '#',
  },
   {
    title: 'Momentum Dash',
    description: 'An enterprise dashboard for visualizing complex data streams in real-time.',
    tags: ['Svelte', 'D3.js', 'WebSocket'],
    image: 'https://placehold.co/600x400.png',
    aiHint: 'data visualization',
    desktopImage: 'https://placehold.co/1200x800.png',
    mobileImage: 'https://placehold.co/400x800.png',
    liveUrl: '#',
    githubUrl: '#',
  },
]

export function ProjectsSection() {
  return (
    <section id="projects" className="py-20 lg:py-32 bg-transparent">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">
            Showcase of Work
          </h2>
          <p className="mt-2 max-w-2xl mx-auto text-lg text-muted-foreground">
            A selection of projects that demonstrate my skills and passion for building.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <Dialog key={project.title}>
              <DialogTrigger asChild>
                <Card className="group overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                      data-ai-hint={project.aiHint}
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl font-headline">{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <div key={tag} className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full">
                          {tag}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0">
                <div className="grid md:grid-cols-2">
                  <div className="p-8 space-y-6">
                    <DialogHeader>
                      <DialogTitle className="text-3xl font-headline">{project.title}</DialogTitle>
                      <DialogDescription className="text-base">
                        {project.description}
                      </DialogDescription>
                    </DialogHeader>
                    <div>
                      <h4 className="font-semibold mb-2">Technologies Used:</h4>
                      <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <div key={tag} className="text-sm font-medium px-3 py-1 bg-secondary rounded-md">
                          {tag}
                        </div>
                      ))}
                    </div>
                    </div>
                     <div className="flex gap-4 pt-4">
                        <Button asChild>
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">View Live <ArrowRight className="ml-2"/></a>
                        </Button>
                        <Button variant="secondary" asChild>
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"><Github className="mr-2"/> GitHub</a>
                        </Button>
                    </div>
                  </div>
                  <div className="relative h-[450px] bg-background hidden md:flex items-center justify-center p-8 overflow-hidden">
                    <Image src={project.desktopImage} alt={`${project.title} Desktop View`} width={1200} height={800} className="w-full rounded-lg shadow-2xl" data-ai-hint="website screenshot" />
                    <Image src={project.mobileImage} alt={`${project.title} Mobile View`} width={200} height={400} className="absolute right-4 bottom-4 w-1/4 rounded-md shadow-2xl border-4 border-background" data-ai-hint="mobile app screenshot" />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  )
}
