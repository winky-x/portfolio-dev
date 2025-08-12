'use client'

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const experience = [
  {
    role: 'Lead Frontend Developer',
    company: 'Stellar Solutions Inc.',
    period: '2020 - Present',
    description:
      'Led the development of a design system and high-traffic web applications using React and TypeScript. Mentored junior developers and improved code quality by 30%.',
  },
  {
    role: 'Senior Software Engineer',
    company: 'Innovatech',
    period: '2017 - 2020',
    description:
      'Engineered and maintained large-scale e-commerce platforms. Specialized in performance optimization, reducing page load times by 50% for key user flows.',
  },
  {
    role: 'Web Developer',
    company: 'Digital Creations',
    period: '2014 - 2017',
    description:
      'Developed responsive websites and web applications for various clients across different industries. Gained expertise in JavaScript, HTML5, and CSS3.',
  },
];

const ExperienceItem = ({ item, index }: { item: typeof experience[0]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        'relative pl-8 md:pl-0 transition-opacity duration-1000 ease-out',
        isVisible ? 'opacity-100' : 'opacity-0',
        index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'
      )}
    >
      <div className={cn('absolute left-0 top-0 h-full w-0.5 bg-primary/20',
          'md:left-1/2 md:-translate-x-1/2')}>
        <div className={cn(
          'absolute left-1/2 top-1 -translate-x-1/2 h-3 w-3 rounded-full bg-primary transition-transform duration-500',
          isVisible ? 'scale-100' : 'scale-0'
        )}></div>
      </div>
      <Card className={cn('transition-transform duration-500', isVisible ? 'translate-y-0' : 'translate-y-4')}>
        <CardHeader>
          <CardTitle className="text-xl font-headline">{item.role}</CardTitle>
          <CardDescription className="text-base !mt-1">
            {item.company} &bull; {item.period}
          </CardDescription>
          <p className="!mt-4 text-muted-foreground">{item.description}</p>
        </CardHeader>
      </Card>
    </div>
  );
};

export function ExperienceSection() {
  return (
    <section id="experience" className="py-20 lg:py-32">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">
            Career Journey
          </h2>
          <p className="mt-2 max-w-2xl mx-auto text-lg text-muted-foreground">
            Tracing my path through the world of web development.
          </p>
        </div>
        <div className="relative">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-12">
            {experience.map((item, index) => (
              <React.Fragment key={item.role}>
                {index % 2 === 0 ? <ExperienceItem item={item} index={index} /> : <div></div>}
                {index % 2 !== 0 ? <ExperienceItem item={item} index={index} /> : <div></div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
