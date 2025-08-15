import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Music, Twitter } from "lucide-react"

export function IntegrationsSection() {
    return (
        <section id="integrations" className="py-20 lg:py-32 bg-transparent">
            <div className="container">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">
                        Developer Life
                    </h2>
                    <p className="mt-2 max-w-2xl mx-auto text-lg text-muted-foreground">
                        A peek into my recent activity, code, and what I'm listening to.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                           <CardTitle className="text-lg font-medium">GitHub Activity</CardTitle>
                           <Github className="w-6 h-6 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground mb-4">My contribution graph</div>
                            <div className="flex gap-1">
                                {Array.from({ length: 15 }).map((_, i) => (
                                    <div key={i} className="w-full h-8 bg-muted rounded-sm flex items-center justify-center">
                                         <div style={{width: '90%', height: `${Math.random() * 80 + 10}%`}} className="bg-primary/20 rounded-sm"></div>
                                    </div>
                                ))}
                            </div>
                            <div className="text-xs text-muted-foreground mt-4">
                                Latest commit: `feat: implement dark mode` 2 hours ago
                            </div>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                           <CardTitle className="text-lg font-medium">Listening On Spotify</CardTitle>
                           <Music className="w-6 h-6 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0"></div>
                                <div className="space-y-1">
                                    <p className="font-semibold leading-none">Not Playing</p>
                                    <p className="text-sm text-muted-foreground">Spotify is not active</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                           <CardTitle className="text-lg font-medium">Latest on X</CardTitle>
                           <Twitter className="w-6 h-6 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                             <div className="space-y-2">
                                <p className="text-sm">Excited to explore the new features in Next.js 15! The React Compiler integration looks promising. #webdev #react</p>
                                <p className="text-xs text-muted-foreground">1 day ago</p>
                             </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
