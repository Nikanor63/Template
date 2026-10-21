import { enrichCvContent, SAMPLE_CONTENT } from '../cv-shared/sample'
import type { CategoryConfig } from '../cv-shared/category-config'
import type { CvContent } from '../cv-shared/types'
import { FontName } from '../cv-shared/category-config'

const ETUDIANT: CategoryConfig = {
  heading: FontName.poppins,
  body: FontName.lato,
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
}

export const STUDENT_CONTENT: CvContent = {
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
    
  ],
  education: [
    { degree: 'Master Marketing digital', school: 'KEDGE Business School', period: '2024 — 2026' },
    { degree: 'Licence Économie-Gestion', school: 'Université de Bordeaux', period: '2021 — 2024' },
  ],
  skills: ['Réseaux sociaux', 'Google Analytics', 'Canva', 'Rédaction web', 'SEO', 'Pack Office'],
}

/** Profils étudiants attribués à tour de rôle aux modèles de cette catégorie. */
export const STUDENT_CONTENTS: CvContent[] = [
  STUDENT_CONTENT,
  {
    ...STUDENT_CONTENT, fullName: 'Guehi Moricette', title: 'Étudiante en gestion des ressources humaines',
    email: 'moricette.guehi@mail.fr', website: 'moricette-guehi.ci',
    summary: 'Étudiante en ressources humaines, organisée et à l’écoute, à la recherche d’une alternance en recrutement et gestion du personnel.',
    skills: ['Sourcing de candidats', 'Entretiens de recrutement', 'Administration du personnel', 'Droit du travail', 'SIRH', 'Communication interne'],
    experiences: [{ role: 'Assistante ressources humaines', company: 'Groupe Ivoire Services', period: '2025 — 6 mois', description: 'Préparation des dossiers du personnel, suivi des absences et participation aux recrutements.' }, { role: 'Assistante administrative', company: 'Cabinet Avenir', period: '2024 — 4 mois', description: 'Accueil des candidats, organisation des rendez-vous et mise à jour des dossiers.' }],
    education: [{ degree: 'Master Gestion des ressources humaines', school: 'Université Félix Houphouët-Boigny', period: '2024 — 2026' }, { degree: 'Licence Gestion', school: 'Université Nangui Abrogoua', period: '2021 — 2024' }],
  },
  {
    ...STUDENT_CONTENT, fullName: 'Loua Ange Emmanuel', title: 'Étudiant ingénieur en mines',
    email: 'ange.loua@mail.fr', website: 'ange-loua.ci',
    summary: 'Élève ingénieur en mines intéressé par la géologie et l’exploitation responsable des ressources, en recherche d’un stage de fin d’études.',
    skills: ['Géologie minière', 'Cartographie géologique', 'Échantillonnage', 'Topographie', 'Sécurité HSE', 'QGIS'],
    experiences: [{ role: 'Stagiaire géologie', company: 'SODEMI', period: '2025 — 3 mois', description: 'Collecte et description d’échantillons, relevés de terrain et mise à jour de cartes géologiques.' }, { role: 'Assistant de laboratoire', company: 'Laboratoire des géosciences', period: '2024 — 2 mois', description: 'Préparation d’échantillons et consignation des résultats d’analyses.' }],
    education: [{ degree: 'Cycle ingénieur des mines', school: 'INP-HB', period: '2023 — 2026' }, { degree: 'Classes préparatoires scientifiques', school: 'INP-HB', period: '2021 — 2023' }],
  },
  {
    ...STUDENT_CONTENT, fullName: 'Soro Christelle', title: 'Étudiante en journalisme',
    email: 'christelle.soro@mail.fr', website: 'christelle-soro.ci',
    summary: 'Étudiante en journalisme, curieuse et rigoureuse, attirée par le reportage, l’actualité sociale et les formats numériques.',
    skills: ['Enquête et reportage', 'Interview', 'Vérification des sources', 'Rédaction d’articles', 'Montage audio', 'Réseaux sociaux'],
    experiences: [{ role: 'Stagiaire rédactrice', company: 'Le Quotidien d’Abidjan', period: '2025 — 4 mois', description: 'Rédaction de brèves, préparation d’interviews et suivi de sujets d’actualité locale.' }, { role: 'Chroniqueuse bénévole', company: 'Radio Campus', period: '2024 — 1 an', description: 'Préparation et animation d’une chronique hebdomadaire consacrée à la vie étudiante.' }],
    education: [{ degree: 'Master Journalisme et médias numériques', school: 'Université Félix Houphouët-Boigny', period: '2024 — 2026' }, { degree: 'Licence Information-Communication', school: 'Université Félix Houphouët-Boigny', period: '2021 — 2024' }],
  },
  {
    ...STUDENT_CONTENT, fullName: 'Zrangba David', title: 'Étudiant en développement logiciel',
    email: 'david.zrangba@mail.fr', website: 'david-zrangba.dev',
    summary: 'Étudiant développeur attiré par la création d’applications utiles, à la recherche d’un stage en développement web.',
    skills: ['JavaScript et TypeScript', 'React', 'Node.js', 'API REST', 'Git', 'Bases de données SQL'],
    experiences: [{ role: 'Développeur web stagiaire', company: 'Digital Abidjan', period: '2025 — 5 mois', description: 'Développement d’interfaces web adaptatives et intégration d’API REST.' }, { role: 'Projet étudiant — gestion de bibliothèque', company: 'Projet universitaire', period: '2024', description: 'Conception d’une application de gestion des emprunts avec base de données relationnelle.' }],
    education: [{ degree: 'Licence Développement d’applications', school: 'ESATIC', period: '2023 — 2026' }, { degree: 'Baccalauréat scientifique', school: 'Lycée moderne', period: '2022' }],
  },
  {
    ...STUDENT_CONTENT, fullName: 'Aïcha Koné', title: 'Étudiante en comptabilité et finance',
    email: 'aicha.kone@mail.fr', website: 'aicha-kone.ci',
    summary: 'Étudiante en finance appliquée, méthodique et à l’aise avec les chiffres, en recherche d’une alternance en comptabilité.',
    skills: ['Comptabilité générale', 'Saisie et rapprochement', 'Excel', 'Analyse financière', 'Fiscalité', 'Sage 100'],
    experiences: [{ role: 'Assistante comptable stagiaire', company: 'Cabinet K&A', period: '2025 — 4 mois', description: 'Saisie des pièces comptables, rapprochements bancaires et préparation des déclarations.' }],
    education: [{ degree: 'Master Comptabilité, contrôle et audit', school: 'Université Jean Lorougnon Guédé', period: '2024 — 2026' }, { degree: 'Licence Finance-Comptabilité', school: 'Université Jean Lorougnon Guédé', period: '2021 — 2024' }],
  },
  {
    ...STUDENT_CONTENT, fullName: 'Koffi Nadia', title: 'Étudiante en génie civil',
    email: 'nadia.koffi@mail.fr', website: 'nadia-koffi.ci',
    summary: 'Étudiante en génie civil souhaitant contribuer au suivi de chantiers et à la conception d’ouvrages durables.',
    skills: ['Lecture de plans', 'AutoCAD', 'Suivi de chantier', 'Métrés', 'Matériaux de construction', 'Sécurité chantier'],
    experiences: [{ role: 'Assistante conductrice de travaux', company: 'Bati Ivoire', period: '2025 — 3 mois', description: 'Suivi quotidien du chantier, contrôle des livraisons et mise à jour des comptes rendus.' }],
    education: [{ degree: 'Master Génie civil', school: 'INP-HB', period: '2024 — 2026' }, { degree: 'Licence Sciences et technologies', school: 'INP-HB', period: '2021 — 2024' }],
  },
  {
    ...STUDENT_CONTENT, fullName: 'Koffi Armel', title: 'Étudiant en agronomie',
    email: 'armel.koffi@mail.fr', website: 'armel-koffi.ci',
    summary: 'Étudiant en agronomie intéressé par les cultures vivrières et les pratiques agricoles durables.',
    skills: ['Conduite de cultures', 'Diagnostic phytosanitaire', 'Irrigation', 'Essais agronomiques', 'Collecte de données terrain', 'Agroécologie'],
    experiences: [{ role: 'Assistant technicien agricole', company: 'Coopérative des producteurs', period: '2025 — 4 mois', description: 'Suivi de parcelles, appui aux producteurs et collecte des données de rendement.' }],
    education: [{ degree: 'Master Agronomie et développement rural', school: 'Université Jean Lorougnon Guédé', period: '2024 — 2026' }, { degree: 'Licence Sciences agronomiques', school: 'Université Nangui Abrogoua', period: '2021 — 2024' }],
  },
  {
    ...STUDENT_CONTENT, fullName: 'Yao Grâce', title: 'Étudiante en pharmacie',
    email: 'grace.yao@mail.fr', website: 'grace-yao.ci',
    summary: 'Étudiante en pharmacie rigoureuse, attentive au conseil et à la sécurité dans la délivrance des médicaments.',
    skills: ['Pharmacologie', 'Dispensation', 'Conseil au patient', 'Gestion des stocks pharmaceutiques', 'Calcul de doses', 'Bonnes pratiques'],
    experiences: [{ role: 'Stagiaire en officine', company: 'Pharmacie du Centre', period: '2025 — 3 mois', description: 'Accueil des patients, rangement des produits et observation des procédures de dispensation.' }],
    education: [{ degree: 'Doctorat en pharmacie', school: 'Université Félix Houphouët-Boigny', period: '2021 — 2027' }],
  },
  {
    ...STUDENT_CONTENT, fullName: 'Bamba Serge', title: 'Étudiant en marketing et commerce',
    email: 'serge.bamba@mail.fr', website: 'serge-bamba.ci',
    summary: 'Étudiant en marketing orienté terrain, attiré par l’étude des marchés et le développement commercial.',
    skills: ['Études de marché', 'Prospection', 'Négociation commerciale', 'CRM', 'Merchandising', 'Analyse des ventes'],
    experiences: [{ role: 'Assistant commercial', company: 'Africashop', period: '2025 — 5 mois', description: 'Qualification de prospects, suivi des commandes et mise à jour du CRM.' }],
    education: [{ degree: 'Master Marketing et stratégie commerciale', school: 'Pigier Côte d’Ivoire', period: '2024 — 2026' }, { degree: 'Licence Commerce', school: 'Pigier Côte d’Ivoire', period: '2021 — 2024' }],
  },
  {
    ...STUDENT_CONTENT, fullName: 'Kassi Ruth', title: 'Étudiante en droit des affaires',
    email: 'ruth.kassi@mail.fr', website: 'ruth-kassi.ci',
    summary: 'Étudiante en droit des affaires, précise dans ses recherches et motivée par le conseil juridique aux entreprises.',
    skills: ['Droit des sociétés', 'Recherche juridique', 'Rédaction de contrats', 'Veille réglementaire', 'Droit OHADA', 'Classement juridique'],
    experiences: [{ role: 'Assistante juridique stagiaire', company: 'Cabinet Juris Conseil', period: '2025 — 4 mois', description: 'Recherches juridiques, préparation de projets d’actes et suivi de formalités.' }],
    education: [{ degree: 'Master Droit des affaires', school: 'Université Félix Houphouët-Boigny', period: '2024 — 2026' }, { degree: 'Licence Droit privé', school: 'Université Félix Houphouët-Boigny', period: '2021 — 2024' }],
  },
  {
    ...STUDENT_CONTENT, fullName: 'Diomandé Youssouf', title: 'Étudiant en réseaux et télécommunications',
    email: 'youssouf.diomande@mail.fr', website: 'youssouf-diomande.ci',
    summary: 'Étudiant technicien en réseaux, intéressé par les infrastructures fiables et la sécurité des systèmes.',
    skills: ['Routage et commutation', 'Cisco Packet Tracer', 'Adressage IP', 'Câblage réseau', 'Linux', 'Sécurité réseau'],
    experiences: [{ role: 'Technicien réseau stagiaire', company: 'Ivoire Télécom', period: '2025 — 4 mois', description: 'Assistance au déploiement de points d’accès et diagnostic des incidents réseau.' }],
    education: [{ degree: 'Licence Réseaux et télécommunications', school: 'ESATIC', period: '2023 — 2026' }, { degree: 'Baccalauréat scientifique', school: 'Lycée municipal', period: '2022' }],
  },
  {
    ...STUDENT_CONTENT, fullName: 'Aka Prisca', title: 'Étudiante en communication visuelle',
    email: 'prisca.aka@mail.fr', website: 'priscaaka.design',
    summary: 'Étudiante en design graphique créative et attentive aux détails, à la recherche d’un stage en studio de création.',
    skills: ['Identité visuelle', 'Illustrator', 'Photoshop', 'InDesign', 'Maquette éditoriale', 'Préparation des fichiers print'],
    experiences: [{ role: 'Assistante graphiste', company: 'Studio Pixel', period: '2025 — 3 mois', description: 'Déclinaison de supports de communication et préparation de maquettes pour impression.' }],
    education: [{ degree: 'Licence Communication visuelle', school: 'Académie des Beaux-Arts', period: '2023 — 2026' }, { degree: 'Baccalauréat artistique', school: 'Lycée artistique', period: '2022' }],
  },
].map((profile) => {
  const completed = enrichCvContent(profile)
  if (completed.experiences.length >= 2) return completed

  const [firstSkill, secondSkill, thirdSkill] = completed.skills
  const school = completed.education[0]?.school ?? 'Projet de formation'
  return {
    ...completed,
    experiences: [
      ...completed.experiences,
      {
        role: `Projet de formation — ${firstSkill} et ${secondSkill}`,
        company: school,
        period: 'Projet académique',
        description: `Réalisation d’un livrable appliqué autour de ${firstSkill}, ${secondSkill} et ${thirdSkill}. Présentation de la démarche, justification des choix et prise en compte des retours reçus.`,
      },
    ],
  }
})

export default ETUDIANT
