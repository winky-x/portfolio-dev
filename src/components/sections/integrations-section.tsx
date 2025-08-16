import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Music, Twitter } from "lucide-react"
import { StaggeredContainer, StaggeredItem } from '@/components/ui/animated-entrance'
import { PremiumCard } from '@/components/ui/premium-card'

export function IntegrationsSection() {
    return (
        <section id="integrations" className="py-20 lg:py-32 bg-transparent">
            <div className="container">
                <StaggeredContainer stagger={0.1}>
                    <StaggeredItem direction="up" distance={40}>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">
                                Developer Life
                            </h2>
                            <p className="mt-2 max-w-2xl mx-auto text-lg text-muted-foreground">
                                A peek into my recent activity, code, and what I'm listening to.
                            </p>
                        </div>
                    </StaggeredItem>
                </StaggeredContainer>

                <StaggeredContainer stagger={0.15}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <StaggeredItem direction="up" distance={30} delay={0.1}>
                            <PremiumCard
                                className="h-full backdrop-blur-sm"
                                neonColor="#10b981"
                                glow={true}
                                tilt={true}
                                scale={true}
                            >
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                   <CardTitle className="text-lg font-medium">GitHub Activity</CardTitle>
                                   <Github className="w-6 h-6 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-muted-foreground mb-4">Recent contributions</div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            <span className="text-sm">Added portfolio animations</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                            <span className="text-sm">Updated dependencies</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                            <span className="text-sm">Fixed responsive issues</span>
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-4">
                                        Latest: Portfolio redesign 3 days ago
                                    </div>
                                </CardContent>
                            </PremiumCard>
                        </StaggeredItem>

                         <StaggeredItem direction="up" distance={30} delay={0.2}>
                            <PremiumCard
                                className="h-full backdrop-blur-sm"
                                neonColor="#8b5cf6"
                                glow={true}
                                tilt={true}
                                scale={true}
                            >
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                   <CardTitle className="text-lg font-medium">Currently Learning</CardTitle>
                                   <Music className="w-6 h-6 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">AI</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">AI/ML Integration</p>
                                                <p className="text-xs text-muted-foreground">Exploring GenAI tools</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">3D</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">Three.js & WebGL</p>
                                                <p className="text-xs text-muted-foreground">Advanced 3D graphics</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </PremiumCard>
                        </StaggeredItem>

                        <StaggeredItem direction="up" distance={30} delay={0.3}>
                            <PremiumCard
                                className="h-full backdrop-blur-sm"
                                neonColor="#f59e0b"
                                glow={true}
                                tilt={true}
                                scale={true}
                            >
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                   <CardTitle className="text-lg font-medium">Tech Stack</CardTitle>
                                   <Twitter className="w-6 h-6 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                     <div className="space-y-3">
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">React</span>
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Next.js</span>
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">TypeScript</span>
                                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Tailwind</span>
                                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Node.js</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Always exploring new technologies and frameworks
                                        </p>
                                     </div>
                                </CardContent>
                            </PremiumCard>
                        </StaggeredItem>
                    </div>
                </StaggeredContainer>
            </div>
        </section>
    )
}
