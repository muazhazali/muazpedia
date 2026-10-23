export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="Muazpedia logo"
    >
      <rect width="64" height="64" rx="15" fill="var(--color-primary)" />
      <text
        x="32"
        y="46"
        textAnchor="middle"
        fontFamily='system-ui, -apple-system, "Segoe UI", Arial, sans-serif'
        fontSize="37"
        fontWeight="700"
        letterSpacing="0.5"
        fill="var(--color-primary-foreground)"
      >
        M
      </text>
    </svg>
  )
}