import taallamGoLogo from './tout les image de projet/TaallamGO - logo.png'
import taallamGoArabicDarkLogo from './tout les image de projet/logo arabe dark mode transparent.png'
import taallamGoArabicLightLogo from './tout les image de projet/logo arabe light mode transparent.png'
import taallamGoDarkLogo from './tout les image de projet/logo dark mode transparent.png'
import taallamGoLightLogo from './tout les image de projet/Logo light mode sans background.PNG'

type ImportedImage = string | { src: string }

export const taallamGoLogoSrc =
  typeof (taallamGoLogo as ImportedImage) === 'string'
    ? taallamGoLogo
    : (taallamGoLogo as unknown as { src: string }).src

export const taallamGoLightLogoSrc =
  typeof (taallamGoLightLogo as ImportedImage) === 'string'
    ? taallamGoLightLogo
    : (taallamGoLightLogo as unknown as { src: string }).src

export const taallamGoDarkLogoSrc =
  typeof (taallamGoDarkLogo as ImportedImage) === 'string'
    ? taallamGoDarkLogo
    : (taallamGoDarkLogo as unknown as { src: string }).src

export const taallamGoArabicLightLogoSrc =
  typeof (taallamGoArabicLightLogo as ImportedImage) === 'string'
    ? taallamGoArabicLightLogo
    : (taallamGoArabicLightLogo as unknown as { src: string }).src

export const taallamGoArabicDarkLogoSrc =
  typeof (taallamGoArabicDarkLogo as ImportedImage) === 'string'
    ? taallamGoArabicDarkLogo
    : (taallamGoArabicDarkLogo as unknown as { src: string }).src
