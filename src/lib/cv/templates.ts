import { buildLayout, LAYOUTS, type TemplateStyle } from './builder'
import { PORTRAITS, SAMPLE_CONTENT } from './sample'
import type { CvContent, CvTemplate, TemplateCategory } from './types'
import { PAGE_HEIGHT, PAGE_WIDTH } from './types'

export const CATEGORIES: TemplateCategory[] = [
  'Minimaliste',
  'Professionnel',
  'Moderne',
  'Créatif',
  'Élégant',
  'Étudiant',
]

interface CategoryConfig {
  heading: string
  body: string
  upper: boolean
  headingVariant: TemplateStyle['headingVariant']
  names: string[]
  palettes: { primary: string; secondary: string; text?: string; bg?: string }[]
  tags: string[]
}

const F = {
  inter: 'var(--font-inter)',
  playfair: 'var(--font-playfair)',
  montserrat: 'var(--font-montserrat)',
  lora: 'var(--font-lora)',
  poppins: 'var(--font-poppins)',
  raleway: 'var(--font-raleway)',
  space: 'var(--font-space)',
  dmserif: 'var(--font-dmserif)',
  jakarta: 'var(--font-jakarta)',
}

const CONFIG: Record<TemplateCategory, CategoryConfig> = {
  Minimaliste: {
    heading: F.inter,
    body: F.inter,
    upper: true,
    headingVariant: 'underline',
    names: ['Épure', 'Blanc', 'Ligne', 'Silence', 'Essentiel', 'Fragment', 'Air', 'Neutre', 'Trait', 'Simple'],
    tags: ['sobre', 'clair', 'aéré'],
    palettes: [
      { primary: '#1f2937', secondary: '#f3f4f6' },
      { primary: '#5CAFE7', secondary: '#f4f8fb' },
      { primary: '#111827', secondary: '#111827' },
      { primary: '#6b7280', secondary: '#f5f5f4' },
      { primary: '#0f766e', secondary: '#f0fdfa' },
      { primary: '#334155', secondary: '#e2e8f0' },
      { primary: '#18181b', secondary: '#fafafa' },
      { primary: '#475569', secondary: '#1e293b' },
      { primary: '#78716c', secondary: '#fafaf9' },
      { primary: '#0e2238', secondary: '#eef2f6' },
    ],
  },
  Professionnel: {
    heading: F.lora,
    body: F.inter,
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
  },
  Moderne: {
    heading: F.montserrat,
    body: F.poppins,
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
  },
  Créatif: {
    heading: F.space,
    body: F.poppins,
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
  },
  Élégant: {
    heading: F.playfair,
    body: F.raleway,
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
  },
  Étudiant: {
    heading: F.poppins,
    body: F.inter,
    upper: false,
    headingVariant: 'bar',
    names: ['Campus', 'Premier pas', 'Stage', 'Junior', 'Licence', 'Alternance', 'Promo', 'Tremplin', 'Envol', 'Découverte'],
    tags: ['débutant', 'stage', 'jeune diplômé'],
    palettes: [
      { primary: '#5CAFE7', secondary: '#eaf6fe' },
      { primary: '#22c55e', secondary: '#f0fdf4' },
      { primary: '#FF679D', secondary: '#fff1f6' },
      { primary: '#f59e0b', secondary: '#fffbeb' },
      { primary: '#82CEF9', secondary: '#0e2238' },
      { primary: '#6366f1', secondary: '#eef2ff' },
      { primary: '#5CAFE7', secondary: '#FFE361' },
      { primary: '#10b981', secondary: '#0f2a24' },
      { primary: '#0ea5e9', secondary: '#f0f9ff' },
      { primary: '#FF679D', secondary: '#FFE361' },
    ],
  },
}

const STUDENT_CONTENT: CvContent = {
  ...SAMPLE_CONTENT,
  fullName: 'Lucas Martin',
  title: 'Étudiant en marketing digital',
  summary:
    'Étudiant curieux et motivé en dernière année de master, à la recherche d’un stage de 6 mois en marketing digital. À l’aise avec les outils d’analyse et les réseaux sociaux.',
  email: 'lucas.martin@mail.fr',
  website: 'lucasmartin.fr',
  experiences: [
    {
      role: 'Stagiaire marketing',
      company: 'Maison Ébène',
      period: '2025 — 6 mois',
      description: 'Création de campagnes social media et suivi des indicateurs de performance.',
    },
    {
      role: 'Responsable communication',
      company: 'BDE de l’école',
      period: '2023 — 2025',
      description: 'Organisation de 15 événements et animation d’une communauté de 2 000 étudiants.',
    },
    {
      role: 'Vendeur saisonnier',
      company: 'Décathlon',
      period: 'Été 2022',
      description: 'Conseil client et mise en rayon dans un magasin à fort trafic.',
    },
  ],
  education: [
    { degree: 'Master Marketing digital', school: 'KEDGE Business School', period: '2024 — 2026' },
    { degree: 'Licence Économie-Gestion', school: 'Université de Bordeaux', period: '2021 — 2024' },
  ],
  skills: ['Réseaux sociaux', 'Google Analytics', 'Canva', 'Rédaction web', 'SEO', 'Pack Office'],
}

function hash(str: string) {
  let h = 0
  for (const ch of str) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return h
}

function slugify(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function buildTemplates(): CvTemplate[] {
  const list: CvTemplate[] = []
  CATEGORIES.forEach((category, ci) => {
    const cfg = CONFIG[category]
    LAYOUTS.forEach((layout, li) => {
      const palette = cfg.palettes[li]
      const name = cfg.names[li]
      const slug = `${slugify(category)}-${String(li + 1).padStart(2, '0')}`
      const style: TemplateStyle = {
        heading: cfg.heading,
        body: cfg.body,
        primary: palette.primary,
        secondary: palette.secondary,
        text: palette.text ?? '#14202e',
        muted: '#4b5a6a',
        bg: palette.bg ?? '#ffffff',
        upper: cfg.upper,
        headingVariant: cfg.headingVariant,
      }
      const base = category === 'Étudiant' ? STUDENT_CONTENT : SAMPLE_CONTENT
      const withPhoto = category !== 'Minimaliste' || li % 2 === 0
      const content: CvContent = {
        ...base,
        photo: withPhoto ? PORTRAITS[(ci + li) % PORTRAITS.length] : undefined,
      }
      const { background, elements } = buildLayout(layout.key, style, content)
      const h = hash(slug)
      list.push({
        id: slug,
        slug,
        name: `${name}`,
        category,
        tags: [...cfg.tags, layout.label.toLowerCase()],
        popularity: 40 + (h % 960),
        createdAt: Date.UTC(2025, h % 12, (h % 27) + 1),
        accent: palette.primary,
        design: {
          name: `CV ${name}`,
          templateId: slug,
          width: PAGE_WIDTH,
          height: PAGE_HEIGHT,
          background,
          elements: elements.map((el, i) => ({ ...el, id: `${slug}-${i}` })),
        },
      })
    })
  })
  return list
}

export const TEMPLATES: CvTemplate[] = buildTemplates()

export function getTemplate(id: string) {
  return TEMPLATES.find((t) => t.id === id)
}
