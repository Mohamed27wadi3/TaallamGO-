import taallamGoLogo from './tout les image de projet/TaallamGO - logo.png'

type ImportedImage = string | { src: string }

export const taallamGoLogoSrc =
  typeof (taallamGoLogo as ImportedImage) === 'string'
    ? taallamGoLogo
    : (taallamGoLogo as unknown as { src: string }).src
