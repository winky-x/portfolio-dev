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
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce solution with React frontend, Node.js backend, and Stripe payment integration.',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    image: '/images/projects/ecommerce.jpg',
    aiHint: 'modern ecommerce platform',
    desktopImage: '/images/projects/ecommerce-desktop.jpg',
    mobileImage: '/images/projects/ecommerce-mobile.jpg',
    liveUrl: 'https://demo-ecommerce.vercel.app',
    githubUrl: 'https://github.com/username/ecommerce-platform',
  },
  {
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates and team collaboration features.',
    tags: ['Next.js', 'TypeScript', 'Prisma', 'WebSocket'],
    image: '/images/projects/taskapp.jpg',
    aiHint: 'task management dashboard',
    desktopImage: '/images/projects/taskapp-desktop.jpg',
    mobileImage: '/images/projects/taskapp-mobile.jpg',
    liveUrl: 'https://taskapp-demo.vercel.app',
    githubUrl: 'https://github.com/username/task-management-app',
  },
  {
    title: 'Portfolio Website',
    description: 'A modern portfolio website built with Next.js, featuring 3D elements and smooth animations.',
    tags: ['Next.js', 'Three.js', 'Tailwind CSS', 'Framer Motion'],
    image: '/images/projects/portfolio.jpg',
    aiHint: 'portfolio showcase',
    desktopImage: '/images/projects/portfolio-desktop.jpg',
    mobileImage: '/images/projects/portfolio-mobile.jpg',
    liveUrl: 'https://portfolio-demo.vercel.app',
    githubUrl: 'https://github.com/username/portfolio-website',
  },
  {
    title: 'Weather Dashboard',
    description: 'A weather application with interactive maps, forecasts, and location-based services.',
    tags: ['React', 'OpenWeather API', 'Leaflet Maps', 'Chart.js'],
    image: '/images/projects/weather.jpg',
    aiHint: 'weather dashboard',
    desktopImage: '/images/projects/weather-desktop.jpg',
    mobileImage: '/images/projects/weather-mobile.jpg',
    liveUrl: 'https://weather-demo.vercel.app',
    githubUrl: 'https://github.com/username/weather-dashboard',
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
