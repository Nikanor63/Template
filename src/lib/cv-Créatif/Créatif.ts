import { FontName, type CategoryConfig } from '../cv-shared/category-config'

const CREATIF: CategoryConfig = {
  heading: FontName.space,
  body: FontName.poppins,
  upper: false,
  headingVariant: 'dot',
  names: ['Pop', 'Collage', 'Atelier', 'Pigment', 'Studio', 'Mosaïque', 'Confetti', 'Palette', 'Graffiti', 'Éclat'],
  tags: ['design', 'coloré', 'artistique'],
  palettes: [
    { primary: '#FF679D', secondary: '#FFE361' },
    { primary: '#FF679D', secondary: '#0e2238' },
    { primary: '#f97316', secondary: '#fff7ed' },
    { primary: '#8b5cf6', secondary: '#FFE361' },
    { primary: '#FF679D', secondary: '#fff1f6' },
    { primary: '#5CAFE7', secondary: '#FFE361' },
    { primary: '#ec4899', secondary: '#1e1b4b' },
    { primary: '#e11d48', secondary: '#ffe4ec' },
    { primary: '#FF679D', secondary: '#82CEF9' },
    { primary: '#d946ef', secondary: '#fdf4ff' },
  ],
}

export default CREATIF
