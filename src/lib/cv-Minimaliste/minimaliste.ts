import { FontName, type CategoryConfig } from '../cv-shared/category-config'

const MINIMALISTE: CategoryConfig = {
  heading: FontName.playfair,
  body: FontName.lato,
  upper: false,
  headingVariant: 'plain',
  names: [
    'Bleu et Blanc',
    'Étudiant Professionnel',
    'Minimaliste Éditorial',
    'Beige Simple',
    'Beige Turquoise',
    'Beige Arrondi',
    'Professionnel Noir et Blanc',
    'Rouge Professionnel',
    'Ressources Humaines',
    'Noir et Blanc Simple',
    'Étudiant Bleu',
  ],
  tags: ['sobre', 'éditorial', 'aéré'],
  palettes: [
    { primary: '#304b78', secondary: '#e8f1fb', text: '#202633', bg: '#ffffff' },
    { primary: '#17294c', secondary: '#e9eef6', text: '#17202e', bg: '#ffffff' },
    { primary: '#303030', secondary: '#efefed', text: '#202020', bg: '#ffffff' },
    { primary: '#9a7562', secondary: '#e6d6c4', text: '#302721', bg: '#fffdfa' },
    { primary: '#167f83', secondary: '#37d0d2', text: '#173b3b', bg: '#ffffff' },
    { primary: '#9a7562', secondary: '#f1e8dc', text: '#29231f', bg: '#fbf9f5' },
    { primary: '#343434', secondary: '#efeeec', text: '#202020', bg: '#ffffff' },
    { primary: '#8f343c', secondary: '#f2d9d9', text: '#2d2323', bg: '#ffffff' },
    { primary: '#8a6958', secondary: '#f0eeeb', text: '#2b2927', bg: '#ffffff' },
    { primary: '#262626', secondary: '#f0efed', text: '#171717', bg: '#ffffff' },
    { primary: '#315d91', secondary: '#e7f0fa', text: '#202a37', bg: '#ffffff' },
  ],
}

export default MINIMALISTE
