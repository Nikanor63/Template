import { FontName, type CategoryConfig } from '../cv-shared/category-config'

const MODERNE: CategoryConfig = {
  heading: FontName.montserrat,
  body: FontName.poppins,
  upper: true,
  headingVariant: 'bar',
  names: ['Pulse', 'Vector', 'Néon', 'Orbit', 'Flux', 'Prisme', 'Nova', 'Signal', 'Grid', 'Onde'],
  tags: ['tech', 'startup', 'dynamique'],
  palettes: [
    { primary: '#5CAFE7', secondary: '#0e2238' },
    { primary: '#82CEF9', secondary: '#13293d' },
    { primary: '#5CAFE7', secondary: '#eaf6fe' },
    { primary: '#6366f1', secondary: '#eef2ff' },
    { primary: '#0ea5e9', secondary: '#0b1726' },
    { primary: '#5CAFE7', secondary: '#FF679D' },
    { primary: '#14b8a6', secondary: '#f0fdfa' },
    { primary: '#3b82f6', secondary: '#0f172a' },
    { primary: '#5CAFE7', secondary: '#f4f9fd' },
    { primary: '#0891b2', secondary: '#0e2238' },
  ],
}

export default MODERNE
