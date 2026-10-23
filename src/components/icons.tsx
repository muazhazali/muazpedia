import type { IconName } from '@/data/lessons'
import { Brain, Binary, Sigma, Shapes } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const MAP: Record<IconName, LucideIcon> = {
  brain: Brain,
  sigma: Sigma,
  binary: Binary,
  shapes: Shapes,
}

export function IconByName({ name, className }: { name: IconName; className?: string }) {
  const Icon = MAP[name]
  return <Icon className={className} />
}