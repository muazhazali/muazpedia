import { Link, NavLink } from 'react-router-dom'
import { BookOpen, Layers } from 'lucide-react'
import { ThemeMenu } from '@/components/ThemeMenu'
import { LogoMark } from '@/components/LogoMark'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/', label: 'Library', icon: Layers },
  { to: '/review', label: 'Review', icon: BookOpen },
]

export function SiteHeader() {
  return (
    <header className="border-border/80 bg-background/85 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Muazpedia home">
          <LogoMark className="size-7 rounded-md" />
          <span className="text-[15px] font-semibold tracking-tight">muazpedia</span>
        </Link>
        <nav className="flex items-center gap-1" aria-label="Main navigation">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                )
              }
            >
              <Icon className="size-4" />
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
          <ThemeMenu />
        </nav>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-border/70 mt-auto border-t">
      <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col gap-1.5 px-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          <span className="text-foreground font-semibold">muazpedia</span> — one concept, one
          visual, one experiment, one quick test.
        </p>
        <p>Progress is stored locally in your browser. No account, no tracking.</p>
      </div>
    </footer>
  )
}