import {
  DM_Serif_Display,
  Lato,
  Lora,
  Life_Savers,
  Montserrat,
  Manrope,
  Outfit,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Poppins,
  Raleway,
  Space_Grotesk,
  Urbanist,
} from 'next/font/google'

export const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' })
export const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-lato',
})
export const lifeSavers = Life_Savers({ subsets: ['latin'],
  weight: [ '400', '700', '800'],
  variable: '--font-lifesavers' })
export const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
export const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' })
export const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })
export const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })
export const lora = Lora({ subsets: ['latin'], variable: '--font-lora' })
export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})
export const raleway = Raleway({ subsets: ['latin'], variable: '--font-raleway' })
export const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' })
export const urbanist = Urbanist({ subsets: ['latin'], variable: '--font-urbanist' })
export const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dmserif',
})

export const fontVariables = [
  jakarta,
  lato,
  lifeSavers,
  playfair,
  montserrat,
  manrope,
  outfit,
  lora,
  poppins,
  raleway,
  spaceGrotesk,
  urbanist,
  dmSerif,
]
  .map((f) => f.variable)
  .join(' ')
