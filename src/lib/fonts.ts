import {
  DM_Serif_Display,
  Inter,
  Lora,
  Montserrat,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Poppins,
  Raleway,
  Space_Grotesk,
} from 'next/font/google'

export const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' })
export const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
export const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
export const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' })
export const lora = Lora({ subsets: ['latin'], variable: '--font-lora' })
export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})
export const raleway = Raleway({ subsets: ['latin'], variable: '--font-raleway' })
export const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' })
export const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dmserif',
})

export const fontVariables = [
  jakarta,
  inter,
  playfair,
  montserrat,
  lora,
  poppins,
  raleway,
  spaceGrotesk,
  dmSerif,
]
  .map((f) => f.variable)
  .join(' ')
