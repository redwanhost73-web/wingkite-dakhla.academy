'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface PricingCardProps {
  title: string
  price: string
  duration: string
  description: string
  features: string[]
  popular?: boolean
  ctaText: string
  ctaHref: string
}

export function PricingCard({
  title,
  price,
  duration,
  description,
  features,
  popular = false,
  ctaText,
  ctaHref,
}: PricingCardProps) {
  return (
    <Card className={cn(
      'relative flex flex-col',
      popular && 'border-primary shadow-lg scale-105'
    )}>
      {popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
          Populaire
        </Badge>
      )}
      
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl">{title}</CardTitle>
        <div className="mt-4">
          <span className="text-4xl font-bold text-primary">{price}</span>
          <span className="text-muted-foreground ml-1">/ {duration}</span>
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          asChild 
          className={cn(
            'w-full',
            popular 
              ? 'bg-primary hover:bg-primary/90' 
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          )}
        >
          <Link href={ctaHref}>{ctaText}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
