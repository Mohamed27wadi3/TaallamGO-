import type { Lang } from '../data'
import { taallamGoArabicDarkLogoSrc, taallamGoArabicLightLogoSrc, taallamGoDarkLogoSrc, taallamGoLightLogoSrc } from '../logo'

type Props = {
  className?: string
  lang: Lang
}

export function LocalizedThemeLogo({ className, lang }: Props) {
  const classes = ['tg-theme-logo', `tg-theme-logo--${lang}`, className].filter(Boolean).join(' ')

  return (
    <span className={classes} aria-label="TaallamGo">
      <img className="tg-theme-logo__image tg-theme-logo__image--fr tg-theme-logo__image--light" src={taallamGoLightLogoSrc} alt="TaallamGo" />
      <img className="tg-theme-logo__image tg-theme-logo__image--fr tg-theme-logo__image--dark" src={taallamGoDarkLogoSrc} alt="TaallamGo" />
      <img className="tg-theme-logo__image tg-theme-logo__image--ar tg-theme-logo__image--light" src={taallamGoArabicLightLogoSrc} alt="TaallamGo" />
      <img className="tg-theme-logo__image tg-theme-logo__image--ar tg-theme-logo__image--dark" src={taallamGoArabicDarkLogoSrc} alt="TaallamGo" />
    </span>
  )
}
