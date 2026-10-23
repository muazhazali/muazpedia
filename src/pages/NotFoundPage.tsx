import { Link } from 'react-router-dom'
import { ArrowLeft, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <SearchX className="text-muted-foreground size-8" />
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Concept not found</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        This page does not exist in the library — it may have been renamed or is still planned.
      </p>
      <Button asChild variant="outline" className="mt-6">
        <Link to="/">
          <ArrowLeft /> Back to the library
        </Link>
      </Button>
    </main>
  )
}