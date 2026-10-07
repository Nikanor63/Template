import type { CvContent } from './types'

export const PORTRAITS = [
  '/portraits/portrait-1.png',
  '/portraits/portrait-2.png',
  '/portraits/portrait-3.png',
  '/portraits/portrait-4.png',
]

export const SAMPLE_CONTENT: CvContent = {
  fullName: 'Camille Laurent',
  title: 'Chef de projet digital',
  summary:
    'Chef de projet passionnée avec 7 ans d’expérience dans la conduite de produits numériques. J’aime fédérer des équipes pluridisciplinaires autour d’objectifs clairs et livrer des expériences utiles et mesurables.',
  email: 'camille.laurent@mail.fr',
  phone: '+33 6 12 34 56 78',
  location: 'Lyon, France',
  website: 'camillelaurent.fr',
  photo: PORTRAITS[0],
  experiences: [
    {
      role: 'Chef de projet digital senior',
      company: 'Studio Horizon',
      period: '2021 — Aujourd’hui',
      description:
        'Pilotage de 12 projets web et mobile par an, coordination de 8 personnes et hausse de 35 % de la satisfaction client.',
    },
    {
      role: 'Chef de projet web',
      company: 'Agence Nova',
      period: '2018 — 2021',
      description:
        'Gestion du cycle complet des projets e-commerce, de la conception au lancement, pour des clients nationaux.',
    },
    {
      role: 'Assistante chef de projet',
      company: 'Groupe Atlas',
      period: '2017 — 2018',
      description: 'Suivi des plannings, rédaction des spécifications et animation des ateliers utilisateurs.',
    },
  ],
  education: [
    { degree: 'Master Management de projet', school: 'IAE Lyon', period: '2015 — 2017' },
    { degree: 'Licence Communication', school: 'Université Lumière Lyon 2', period: '2012 — 2015' },
  ],
  skills: ['Gestion de projet', 'Méthodes agiles', 'UX design', 'Figma', 'Jira & Notion', 'Analyse de données'],
  languages: ['Français — natif', 'Anglais — courant', 'Espagnol — intermédiaire'],
  interests: ['Photographie', 'Randonnée', 'Céramique', 'Podcasts'],
}
