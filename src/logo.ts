import taallamGoLogo from './tout les image de projet/TaallamGO - logo.png'
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
