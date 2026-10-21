import { FontName, type CategoryConfig } from '../cv-shared/category-config'

const ELEGANT: CategoryConfig = {
  heading: FontName.playfair,
  body: FontName.raleway,
  upper: false,
  headingVariant: 'plain',
  names: ['Aurore', 'Velours', 'Opale', 'Sérénade', 'Ivoire', 'Lumière', 'Satin', 'Camée', 'Riviera', 'Grâce'],
  tags: ['raffiné', 'luxe', 'classique'],
  palettes: [
    { primary: '#a16207', secondary: '#1c1917', bg: '#fffdf8' },
    { primary: '#9f1239', secondary: '#fdf2f4', bg: '#fffcfc' },
    { primary: '#065f46', secondary: '#ecf5f1', bg: '#fdfefd' },
    { primary: '#854d0e', secondary: '#faf6ee', bg: '#fffdf9' },
    { primary: '#4c1d95', secondary: '#f6f3fb' },
    { primary: '#b45309', secondary: '#292524', bg: '#fffcf7' },
    { primary: '#7c2d12', secondary: '#f9f1ec' },
    { primary: '#1e3a8a', secondary: '#f3f5fb' },
    { primary: '#a16207', secondary: '#f8f4ea', bg: '#fffdf8' },
    { primary: '#831843', secondary: '#2a1320' },
  ],
}

export default ELEGANT
