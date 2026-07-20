type Props = {
  variant?: 'hero' | 'light'
}

export function AnimatedBackground({ variant = 'light' }: Props) {
  return (
    <div className={`tg-animated-bg tg-animated-bg--${variant}`} aria-hidden="true">
      <span className="tg-blob tg-blob--one" />
      <span className="tg-blob tg-blob--two" />
      <span className="tg-blob tg-blob--three" />
      <svg className="tg-network" viewBox="0 0 640 360" role="presentation" focusable="false">
        <path d="M48 244 C 180 140, 278 318, 420 172 S 560 92, 612 132" />
        <path d="M82 108 C 188 182, 248 68, 362 126 S 486 252, 586 206" />
        <circle cx="86" cy="108" r="3" />
        <circle cx="212" cy="158" r="3" />
        <circle cx="362" cy="126" r="3" />
        <circle cx="484" cy="220" r="3" />
        <circle cx="586" cy="206" r="3" />
      </svg>
    </div>
  )
}
