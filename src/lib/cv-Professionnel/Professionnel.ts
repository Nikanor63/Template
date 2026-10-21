import { FontName, type CategoryConfig } from '../cv-shared/category-config'

const PROFESSIONNEL: CategoryConfig = {
  heading: FontName.lora,
  body: FontName.lato,
  upper: false,
  headingVariant: 'underline',
  names: ['Direction', 'Cabinet', 'Consul', 'Bureau', 'Expert', 'Manager', 'Conseil', 'Notaire', 'Finance', 'Exécutif'],
  tags: ['corporate', 'sérieux', 'finance'],
  palettes: [
    { primary: '#1e3a5f', secondary: '#1e3a5f' },
    { primary: '#0f4c81', secondary: '#eef4fa' },
    { primary: '#1f2937', secondary: '#1f2937' },
    { primary: '#14532d', secondary: '#f0f7f2' },
    { primary: '#2b4c7e', secondary: '#e9eef5' },
    { primary: '#7f1d1d', secondary: '#fbf3f3' },
    { primary: '#1e40af', secondary: '#f2f5fd' },
    { primary: '#334155', secondary: '#f1f5f9' },
    { primary: '#0c4a6e', secondary: '#0c4a6e' },
    { primary: '#3f3f46', secondary: '#27272a' },
  ],
}

export default PROFESSIONNEL
