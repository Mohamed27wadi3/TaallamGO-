import { taallamGoDarkLogoSrc, taallamGoLightLogoSrc } from '../logo'

type Props = {
  className?: string
}

export function ThemeLogo({ className }: Props) {
  const classes = ['tg-theme-logo', className].filter(Boolean).join(' ')

  return (
    <span className={classes} aria-label="TaallamGo">
      <img className="tg-theme-logo__image tg-theme-logo__image--light" src={taallamGoLightLogoSrc} alt="TaallamGo" />
      <img className="tg-theme-logo__image tg-theme-logo__image--dark" src={taallamGoDarkLogoSrc} alt="TaallamGo" />
    </span>
  )
}
