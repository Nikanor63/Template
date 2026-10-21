import type { CvContent } from './types'

/** Complète les exemples courts avec des détails tirés de leurs compétences réelles. */
export function enrichCvContent(profile: CvContent): CvContent {
  const skills = profile.skills.filter(Boolean)
  if (!skills.length) return profile

  const title = profile.title.toLocaleLowerCase('fr-FR')
  const focus = /santé|médecin|infirm|pharmacie|soins/.test(title)
    ? 'la qualité du suivi et l’application attentive des protocoles'
    : /droit|juriste|avocat|conformité/.test(title)
      ? 'la fiabilité des dossiers et la maîtrise des risques'
      : /développeur|informatique|réseau|cloud|data|cybersécurité/.test(title)
        ? 'la fiabilité des systèmes, la résolution des incidents et la documentation des solutions'
        : /communication|journal|marketing|graphique|design/.test(title)
          ? 'la cohérence des supports et l’adaptation aux publics visés'
          : /génie civil|bâtiment|mine|agronom|logistique|supply/.test(title)
            ? 'la préparation des opérations, la qualité du suivi et le respect des règles de sécurité'
            : /ressources humaines|rh|administratif|juriste/.test(title)
              ? 'la fiabilité des dossiers, le respect des procédures et la qualité du service'
              : 'la qualité des livrables, le respect des priorités et la satisfaction des personnes concernées'

  const summaryAddition = `Je mobilise ${skills.slice(0, 3).join(', ')} pour ${focus}.`
  const completedSummary = profile.summary.length < 170 && !profile.summary.includes(skills[0])
    ? `${profile.summary.trim()} ${summaryAddition}`
    : profile.summary

  const experiences = profile.experiences.map((experience, index) => {
    if (experience.description.length >= 150) return experience
    const firstSkill = skills[(index * 2) % skills.length]
    const secondSkill = skills[(index * 2 + 1) % skills.length] ?? firstSkill
    const addition = ` Cette mission mobilise ${firstSkill} et ${secondSkill} au quotidien.`
    return { ...experience, description: `${experience.description.trim()}${addition}` }
  })

  return { ...profile, summary: completedSummary, experiences }
}

/** Un profil complet et unique est attribué à chaque modèle non étudiant. */
export const Sample_CamilleLaurent: CvContent = {
  "fullName": "Camille Laurent",
  "title": "Chef de projet digital",
  "summary": "Chef de projet passionnée avec 7 ans d’expérience dans la conduite de produits numériques. J’aime fédérer des équipes pluridisciplinaires autour d’objectifs clairs et livrer des expériences utiles et mesurables.",
  "email": "camille.laurent@mail.fr",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "camillelaurent.fr",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Chef de projet digital senior",
      "company": "Studio Horizon",
      "period": "2021 — Aujourd’hui",
      "description": "Pilotage de 12 projets web et mobile par an, coordination de 8 personnes et hausse de 35 % de la satisfaction client."
    },
    {
      "role": "Chef de projet web",
      "company": "Agence Nova",
      "period": "2018 — 2021",
      "description": "Gestion du cycle complet des projets e-commerce, de la conception au lancement, pour des clients nationaux."
    },
    {
      "role": "Assistante chef de projet",
      "company": "Groupe Atlas",
      "period": "2017 — 2018",
      "description": "Suivi des plannings, rédaction des spécifications et animation des ateliers utilisateurs."
    }
  ],
  "education": [
    {
      "degree": "Master Management de projet",
      "school": "IAE Lyon",
      "period": "2015 — 2017"
    },
    {
      "degree": "Licence Communication",
      "school": "Université Lumière Lyon 2",
      "period": "2012 — 2015"
    }
  ],
  "skills": [
    "Gestion de projet",
    "Méthodes agiles",
    "UX design",
    "Figma",
    "Jira & Notion",
    "Analyse de données"
  ],
  "languages": [
    "Français — natif",
    "Anglais — courant",
    "Espagnol — intermédiaire"
  ],
  "interests": [
    "Photographie",
    "Randonnée",
    "Céramique",
    "Podcasts"
  ]
}

export const Sample_SoroJustine: CvContent = {
  "fullName": "Soro Justine",
  "title": "Juriste d'entreprise",
  "summary": "Juriste d'entreprise | Droit des affaires, contrats et conformité. \n    Je sécurise l'activité et protège les intérêts de l'entreprise.",
  "email": "JustineSoro@mail.fr",
  "phone": "+225 05 12 34 56 78",
  "location": "Abidjan, Côte d'Ivoire",
  "website": "JuristeEntreprise.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Juriste d'entreprise",
      "company": "Cabinet & Groupes Associés",
      "period": "2024 — Aujourd’hui",
      "description": "Rédaction et négociation de plus de 40 contrats commerciaux par an, gestion du contentieux des affaires et mise en conformité RGPD/protection des données."
    },
    {
      "role": "Juriste Junior / Assistant Juridique",
      "company": "Horizon West Africa",
      "period": "2021 — 2023",
      "description": "Veille juridique régulière, secrétariat juridique des sociétés du groupe et audit des risques contractuels sur les partenariats fournisseurs."
    }
  ],
  "education": [
    {
      "degree": "Master 2 Droit des affaires et de l'entreprise",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2019 — 2021"
    },
    {
      "degree": "Licence en Droit Privé",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2016 — 2019"
    }
  ],
  "skills": [
    "Droit des contrats",
    "Droit des affaires & OHADA",
    "Conformité & RGPD",
    "Gestion du contentieux",
    "Propriété intellectuelle",
    "Veille & Audit juridique"
  ],
  "languages": [
    "Français — natif",
    "Anglais — juridique / courant"
  ],
  "interests": [
    "Veille réglementaire",
    "Lecture spécialisée",
    "Éthique & RSE",
    "Échecs"
  ]
}

export const Sample_JamesKater: CvContent = {
  "fullName": "James Kater",
  "title": "Développeur Full Stack",
  "summary": "Développeur Full Stack passionné | React, Node.js, TypeScript & Cloud. \n    Conception et déploiement d'applications web performantes, scalables et sécurisées.",
  "email": "james.kater@email.com",
  "phone": "+225 07 12 34 56 78",
  "location": "Abidjan, Côte d'Ivoire",
  "website": "jameskater.dev",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Développeur Full Stack Senior",
      "company": "Tech Studio Horizon",
      "period": "2024 — Aujourd’hui",
      "description": "Conception et développement de microservices REST/GraphQL. Optimisation des performances front-end (React/Next.js) et hausse de 40 % de la vitesse de chargement des applications."
    },
    {
      "role": "Développeur Full Stack",
      "company": "Digital Solutions WA",
      "period": "2021 — 2023",
      "description": "Développement d'interfaces utilisateur dynamiques, création d'API Node.js/Express, intégration de bases de données PostgreSQL et mise en place de pipelines CI/CD (Docker, GitHub Actions)."
    }
  ],
  "education": [
    {
      "degree": "Master Informatique & Génie Logiciel",
      "school": "ESATIC Abidjan",
      "period": "2019 — 2021"
    },
    {
      "degree": "Licence Informatique & Systèmes d’Information",
      "school": "Université Virtuelle de Côte d'Ivoire",
      "period": "2016 — 2019"
    }
  ],
  "skills": [
    "TypeScript & JavaScript",
    "React.js / Next.js",
    "Node.js / Express",
    "PostgreSQL & MongoDB",
    "Docker & CI/CD",
    "Git & Architectures REST/GraphQL"
  ],
  "languages": [
    "Français — natif",
    "Anglais — technique / courant"
  ],
  "interests": [
    "Open Source",
    "Veille technologique",
    "Gaming",
    "Hackathons"
  ]
}

export const Sample_OunaTresor: CvContent = {
  "fullName": "Ouna Trésor",
  "title": "Ingénieur Bâtiment & Génie Civil",
  "summary": "Ingénieur Bâtiment & Génie Civil | Structuration, gestion de chantier et BIM. \n    Je pilote des projets de construction complexes du dimensionnement à la livraison dans le respect des normes.",
  "email": "ouna.tresor@email.com",
  "phone": "+225 07 98 76 54 32",
  "location": "Abidjan, Côte d'Ivoire",
  "website": "ounatresor-btp.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Ingénieur Bâtiment / Chef de Projet BTP",
      "company": "Horizon Construction & BTP",
      "period": "2023 — Aujourd’hui",
      "description": "Direction technique et supervision de 5 chantiers de bâtiments résidentiels et tertiaires, coordination des corps d'état secondaires et optimisation des coûts de construction de 15 %."
    },
    {
      "role": "Ingénieur Etudes Structures & Calculs",
      "company": "BUREAU D’ÉTUDES BATI-CONCEPT",
      "period": "2020 — 2023",
      "description": "Dimensionnement de structures en béton armé et charpentes métalliques, modélisation BIM 3D et suivi de la conformité aux normes Eurocodes/BAEL."
    }
  ],
  "education": [
    {
      "degree": "Diplôme d’Ingénieur de Conception en Génie Civil",
      "school": "INPHB (Yamoussoukro)",
      "period": "2017 — 2020"
    },
    {
      "degree": "Licence en Sciences Physiques & Technologie",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Calcul de structures (Béton armé & Métal)",
    "Gestion de chantier & Planification",
    "Modélisation BIM & AutoCAD / Revit",
    "Robot Structural Analysis",
    "Chiffrage & Métré de projets",
    "Normes de sécurité & Qualité (HSE)"
  ],
  "languages": [
    "Français — natif",
    "Anglais — technique / professionnel"
  ],
  "interests": [
    "Architecture contemporaine",
    "Éco-construction",
    "Randonnée",
    "Échecs"
  ]
}

export const Sample_KouadioRodolphe: CvContent = {
  "fullName": "Kouadio Rodolphe",
  "title": "Data Analyst & BI Specialist",
  "summary": "Data Analyst & BI Specialist | Big Data, SQL, Python & Data Visualization. \n    Transforme les données brutes en insights stratégiques pour guider les décisions business et optimiser la performance.",
  "email": "rodolphe.kouadio@email.com",
  "phone": "+225 05 87 65 43 21",
  "location": "Abidjan, Côte d'Ivoire",
  "website": "rodolphe-growth.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Data Analyst Senior",
      "company": "Data Insights Africa",
      "period": "2023 — Aujourd’hui",
      "description": "Conception de tableaux de bord interactifs (Power BI / Tableau), analyse prédictive du churn client et modélisation de données ayant permis une hausse de 20 % de la rétention."
    },
    {
      "role": "Business Intelligence Analyst",
      "company": "Fintech West Africa",
      "period": "2020 — 2023",
      "description": "Optimisation des requêtes SQL complexes sur entrepôts BigQuery, automatisation de la collecte de données via des pipelines Python et création de KPI financiers pour le CODIR."
    }
  ],
  "education": [
    {
      "degree": "Master Statistique & Econométrie",
      "school": "ENSEA Abidjan",
      "period": "2018 — 2020"
    },
    {
      "degree": "Licence Mathématiques & Informatique",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2015 — 2018"
    }
  ],
  "skills": [
    "SQL & PostgreSQL",
    "Python (Pandas, NumPy, Scikit-learn)",
    "Power BI & Tableau",
    "Modélisation & Data Mining",
    "ETL & Data Warehousing",
    "A/B Testing & Analyse statistique"
  ],
  "languages": [
    "Français — natif",
    "Anglais — courant / professionnel"
  ],
  "interests": [
    "Machine Learning",
    "Échecs",
    "Visualisation créative",
    "Podcast Tech"
  ]
}

export const Sample_TokpaInnes: CvContent = {
  "fullName": "Tokpa Innès",
  "title": "Responsable Marketing Digital & Growth",
  "summary": "Responsable Marketing Digital | Acquisition, SEO/SEA, CRM & Growth Hacking. \n    J'élabore et déploie des stratégies d'acquisition multicanales pour accélérer la croissance et la notoriété des marques.",
  "email": "innes.tokpa@email.com",
  "phone": "+225 07 45 67 89 01",
  "location": "Abidjan, Côte d'Ivoire",
  "website": "innestokpa-data.ci",
  "photo": "/portraits/portrait-2.png",
  "experiences": [
    {
      "role": "Head of Digital Marketing",
      "company": "Brand & Media Agency",
      "period": "2023 — Aujourd’hui",
      "description": "Gestion d'un budget publicitaire annuel de 50M FCFA, pilotage des campagnes Google Ads & Meta, et augmentation du ROI global de 45 % en un an."
    },
    {
      "role": "Growth Marketer & SEO Specialist",
      "company": "E-Commerce Solutions CI",
      "period": "2021 — 2023",
      "description": "Optimisation du référencement naturel (+120 % de trafic organique en 18 mois), mise en place de flux d'inbound marketing automatisés sur HubSpot et gestion des réseaux sociaux."
    }
  ],
  "education": [
    {
      "degree": "Master Marketing & Communication Digitale",
      "school": "PIGIER Abidjan",
      "period": "2019 — 2021"
    },
    {
      "degree": "Licence Sciences de Gestion",
      "school": "IUGB Grand-Bassam",
      "period": "2016 — 2019"
    }
  ],
  "skills": [
    "Inbound & Growth Marketing",
    "SEO / SEA & Google Ads / Meta Ads",
    "Google Analytics 4 & Tag Manager",
    "CRM & Email Automation (HubSpot, Mailchimp)",
    "Social Media Strategy & Copywriting",
    "Analyse ROI & Conversion Rate Optimization (CRO)"
  ],
  "languages": [
    "Français — natif",
    "Anglais — bilingue"
  ],
  "interests": [
    "Nouvelles tendances Web3",
    "Création de contenu",
    "Photographie urbaine",
    "Basket-ball"
  ]
}

export const Sample_DohoBenedicte: CvContent = {
  "fullName": "Doho Bénédicte",
  "title": "Consultante / Experte en Cybersécurité",
  "summary": "Experte en Cybersécurité | Audit, Pentesting, Sécurité Cloud & Conformité ISO 27001. \n    Je sécurise les infrastructures critiques, préviens les cybermenaces et garantis la résilience des systèmes d'information.",
  "email": "benedicte.doho@email.com",
  "phone": "+225 07 65 43 21 09",
  "location": "Abidjan, Côte d'Ivoire",
  "website": "doho-security.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Consultante Senior en Cybersécurité",
      "company": "CyberShield Africa",
      "period": "2023 — Aujourd’hui",
      "description": "Réalisation de tests d'intrusion (Pentesting), déploiement de solutions SOC/SIEM et gestion des incidents de sécurité pour des institutions financières."
    },
    {
      "role": "Analyste Sécurité des SI",
      "company": "Telecom West Africa",
      "period": "2020 — 2023",
      "description": "Audits de vulnérabilités, mise en conformité ISO 27001 / RGPD et sensibilisation des collaborateurs aux risques de phishing et d'ingénierie sociale."
    }
  ],
  "education": [
    {
      "degree": "Master Sécurité des Systèmes d’Information & Réseaux",
      "school": "ESATIC Abidjan",
      "period": "2018 — 2020"
    },
    {
      "degree": "Licence Informatique & Télécommunications",
      "school": "INPHB Yamoussoukro",
      "period": "2015 — 2018"
    }
  ],
  "skills": [
    "Audit de sécurité & Pentesting",
    "Normes ISO 27001 & NIST",
    "SIEM, SOC & Analyse de logs",
    "Sécurité Cloud (AWS / Azure)",
    "Gestion des incidents & Cryptographie",
    "Réseaux & Pare-feu (Fortinet, Palo Alto)"
  ],
  "languages": [
    "Français — natif",
    "Anglais — courant / technique"
  ],
  "interests": [
    "CTF (Capture The Flag)",
    "Veille en Threat Intelligence",
    "Échecs",
    "Course à pied"
  ]
}

export const Sample_InagoEunice: CvContent = {
  "fullName": "Inago Eunice",
  "title": "Avocate d’Affaires & Droit des Sociétés",
  "summary": "Avocate d'Affaires | Droit OHADA, M&A, Contentieux & Droit du Travail. \n    Accompagnement stratégique des entreprises et investisseurs dans la défense de leurs intérêts et la sécurisation de leurs opérations juridiques.",
  "email": "eunice.inago@cabinet-avocats.ci",
  "phone": "+225 05 12 89 76 54",
  "location": "Abidjan, Côte d'Ivoire",
  "website": "inago-avocat.ci",
  "photo": "/portraits/portrait-2.png",
  "experiences": [
    {
      "role": "Avocate Collaboratrice Senior",
      "company": "Cabinet d’Avocats & Associés",
      "period": "2022 — Aujourd’hui",
      "description": "Représentation devant les juridictions civiles et commerciales, rédaction d'actes complexes, et conseil en restructuration d'entreprises et fusions-acquisitions."
    },
    {
      "role": "Avocate Stagiaire",
      "company": "Juridique & Conseil International",
      "period": "2019 — 2022",
      "description": "Assistance aux plaidoiries, rédaction de conclusions, audits juridiques préalable aux investissements et gestion de dossiers précontentieux."
    }
  ],
  "education": [
    {
      "degree": "Certificat d’Aptitude à la Profession d’Avocat (CAPA)",
      "school": "Barreau de Côte d’Ivoire",
      "period": "2019"
    },
    {
      "degree": "Master 2 Droit Général & Carrières Judiciaires",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2018"
    }
  ],
  "skills": [
    "Contentieux civil & commercial",
    "Droit des affaires & Espace OHADA",
    "Droit du travail & Droit social",
    "Négociation & Stratégie précontentieuse",
    "Rédaction d’actes & Plidoirie",
    "Audit juridique & Due Diligence"
  ],
  "languages": [
    "Français — natif",
    "Anglais — juridique / professionnel"
  ],
  "interests": [
    "Plaidoirie & Éloquence",
    "Lecture juridique & Historique",
    "Piano",
    "Engagement associatif"
  ]
}

export const Sample_SadiaGrace: CvContent = {
  "fullName": "Sadia Grace",
  "title": "Responsable Supply Chain & Logistique",
  "summary": "Responsable Supply Chain & Logistique | Optimisation des flux, gestion des stocks et transit. \n    Je sécurise la chaîne d'approvisionnement et rationalise les coûts logistiques pour garantir des livraisons dans les délais.",
  "email": "grace.sadia@email.com",
  "phone": "+225 07 23 45 67 89",
  "location": "Abidjan, Côte d'Ivoire",
  "website": "sadiagrace-logistics.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Responsable Logistique & Supply Chain",
      "company": "Global Logistics & Transit West Africa",
      "period": "2023 — Aujourd’hui",
      "description": "Pilotage des opérations d'import-export, gestion de l'entrepôt principal et réduction des coûts de transport de 18 % grâce à la réorganisation des tournées."
    },
    {
      "role": "Gestionnaire de Stocks & Approvisionnements",
      "company": "SOCIÉTÉ D’IMPORT-EXPORT CI",
      "period": "2020 — 2023",
      "description": "Suivi des commandes fournisseurs, coordination des opérations de dédouanement au Port Autonome d'Abidjan et optimisation de la rotation des stocks (-25 % d'impayés/ruptures)."
    }
  ],
  "education": [
    {
      "degree": "Master Transport & Logistique Internationale",
      "school": "Académie Régionale des Sciences et Techniques de la Mer (ARSTM)",
      "period": "2018 — 2020"
    },
    {
      "degree": "Licence Gestion Logistique & Transport",
      "school": "Institut National Polytechnique Félix Houphouët-Boigny (INPHB)",
      "period": "2015 — 2018"
    }
  ],
  "skills": [
    "Gestion de la Supply Chain (Inbound / Outbound)",
    "Gestion d’entrepôt (WMS) & ERP (SAP / Odoo)",
    "Procédures de dédouanement & Transit Portuaire",
    "Gestion des stocks & Inventaires",
    "Négociation fournisseurs & Transporteurs",
    "Réglementation transport & Normes Incoterms"
  ],
  "languages": [
    "Français — natif",
    "Anglais — courant / professionnel"
  ],
  "interests": [
    "Commerce international",
    "Éco-logistique & Green Supply Chain",
    "Voyages",
    "Tennis"
  ]
}

export const Sample_SolouAngeJunior: CvContent = {
  "fullName": "Solou Ange Junior",
  "title": "Médecin Généraliste / Docteur en Médecine",
  "summary": "Docteur en Médecine | Consultation, urgences médicales et santé publique. \n    Dévoué à la prise en charge globale des patients, au diagnostic précis et à l'amélioration de la qualité des soins.",
  "email": "solou.ange@sante.ci",
  "phone": "+225 01 23 45 67 89",
  "location": "Abidjan, Côte d'Ivoire",
  "website": "dr-solou-ange.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Médecin Généraliste",
      "company": "Polyclinique Sainte-Anne",
      "period": "2023 — Aujourd’hui",
      "description": "Prise en charge des consultations générales, suivi des pathologies chroniques, gestion des urgences médicales et coordination avec les spécialistes."
    },
    {
      "role": "Médecin Interne / Résident",
      "company": "CHU de Yopougon / CHU de Cocody",
      "period": "2020 — 2023",
      "description": "Unité de soins d'urgence et pédiatrie : réalisation de diagnostics, prescriptions thérapeutiques, gestes d'urgence et rédaction des comptes rendus médicaux."
    }
  ],
  "education": [
    {
      "degree": "Diplôme d’État de Docteur en Médecine",
      "school": "UFR Sciences Médicales - Université Félix Houphouët-Boigny",
      "period": "2015 — 2023"
    },
    {
      "degree": "Certificat de Synthèse Clinique et Thérapeutique",
      "school": "UFHB Abidjan",
      "period": "2022"
    }
  ],
  "skills": [
    "Diagnostic & Prise en charge clinique",
    "Soins d’urgence & Réanimation de base",
    "Suivi des maladies chroniques (Diabète, HTA)",
    "Médecine préventive & Dépistage",
    "Gestion du dossier médical informatisé",
    "Infection control & Respect des normes OMS"
  ],
  "languages": [
    "Français — natif",
    "Anglais — médical / courant"
  ],
  "interests": [
    "Santé publique & Prévention",
    "Veille scientifique médicale",
    "Lecture",
    "Football"
  ]
}

export const Sample_NitiemaAllassane: CvContent = {
  "fullName": "Nitiema Allassane",
  "title": "Ingénieur Cloud & DevOps",
  "summary": "Ingénieur Cloud & DevOps | AWS, Kubernetes, Terraform & CI/CD. \n    Spécialiste de la conception d'architectures Cloud hautement disponibles, de l'automatisation des déploiements et de la sécurisation des infrastructures.",
  "email": "allassane.nitiema@tech.ci",
  "phone": "+225 07 54 32 10 98",
  "location": "Abidjan, Côte d'Ivoire",
  "website": "allassane-cloud.dev",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Ingénieur Cloud & DevOps Senior",
      "company": "Africa Cloud Infrastructure",
      "period": "2023 — Aujourd’hui",
      "description": "Conception et gestion d'infrastructures Cloud sur AWS/Azure, automatisation des déploiements avec Terraform et réduction du temps de mise en production de 50 %."
    },
    {
      "role": "Administrateur Systèmes & Cloud",
      "company": "Tech Innovate WA",
      "period": "2020 — 2023",
      "description": "Mise en place de pipelines CI/CD sous GitLab CI, conteneurisation des applications avec Docker/Kubernetes et surveillance continue des performances (Prometheus/Grafana)."
    }
  ],
  "education": [
    {
      "degree": "Master Génie Informatique & Réseaux",
      "school": "ESATIC Abidjan",
      "period": "2018 — 2020"
    },
    {
      "degree": "Licence Informatique & Télécoms",
      "school": "INPHB Yamoussoukro",
      "period": "2015 — 2018"
    }
  ],
  "skills": [
    "Cloud Computing (AWS / Azure / GCP)",
    "Infrastructure as Code (Terraform, Ansible)",
    "Conteneurisation (Docker, Kubernetes)",
    "CI/CD (GitLab CI, GitHub Actions, Jenkins)",
    "Scripting (Python, Bash)",
    "Monitoring & Logs (Prometheus, Grafana, ELK)"
  ],
  "languages": [
    "Français — natif",
    "Anglais — technique / courant"
  ],
  "interests": [
    "Open Source",
    "Sécurité Cloud",
    "Échecs",
    "Veille technologique"
  ]
}

export const Sample_KouameAline: CvContent = {
  "fullName": "Kouamé Aline",
  "title": "Architecte d’intérieur",
  "summary": "Architecte d’intérieur spécialisée dans les espaces de vie fonctionnels, du premier croquis au suivi de réalisation.",
  "email": "aline.kouame@mail.fr",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "alinekouame.design",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Architecte d’intérieur",
      "company": "Atelier Espace & Matière",
      "period": "2022 — Aujourd’hui",
      "description": "Conception de projets résidentiels, production de plans 3D et coordination des artisans jusqu’à la livraison."
    },
    {
      "role": "Assistante architecte",
      "company": "Studio Ligne Claire",
      "period": "2019 — 2022",
      "description": "Réalisation de plans, choix des matériaux et préparation de dossiers de présentation client."
    }
  ],
  "education": [
    {
      "degree": "Master Architecture d’intérieur",
      "school": "École Supérieure de Design",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence Design d’espace",
      "school": "École Supérieure de Design",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "AutoCAD",
    "SketchUp",
    "Enscape",
    "Conception d’espace",
    "Choix des matériaux",
    "Suivi de chantier"
  ],
  "languages": [
    "Français — natif",
    "Anglais — courant",
    "Espagnol — intermédiaire"
  ],
  "interests": [
    "Photographie",
    "Randonnée",
    "Céramique",
    "Podcasts"
  ]
}

export const Sample_TraBiKevin: CvContent = {
  "fullName": "Tra Bi Kevin",
  "title": "Contrôleur de gestion",
  "summary": "Contrôleur de gestion orienté vers l’analyse des résultats et l’amélioration du pilotage financier des activités.",
  "email": "kevin.trabi@mail.fr",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "kevintrabi.pro",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Contrôleur de gestion",
      "company": "Ivoire Distribution",
      "period": "2022 — Aujourd’hui",
      "description": "Suivi budgétaire de 6 directions, analyse des écarts et création de tableaux de bord mensuels."
    },
    {
      "role": "Analyste financier junior",
      "company": "Cabinet Conseil Plus",
      "period": "2019 — 2022",
      "description": "Préparation de reportings, collecte des données et participation aux clôtures mensuelles."
    }
  ],
  "education": [
    {
      "degree": "Master Contrôle de gestion et audit",
      "school": "INPHB",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence Finance-Comptabilité",
      "school": "INPHB",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Budgets et prévisions",
    "Analyse des écarts",
    "Tableaux de bord",
    "Power BI",
    "Excel avancé",
    "Comptabilité analytique"
  ],
  "languages": [
    "Français — natif",
    "Anglais — courant",
    "Espagnol — intermédiaire"
  ],
  "interests": [
    "Photographie",
    "Randonnée",
    "Céramique",
    "Podcasts"
  ]
}

export const Sample_NDriMariam: CvContent = {
  "fullName": "N’Dri Mariam",
  "title": "Infirmière diplômée d’État",
  "summary": "Infirmière attentive et rigoureuse, engagée dans la qualité des soins, l’éducation des patients et le travail en équipe.",
  "email": "mariam.ndri@mail.fr",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "mariamndri.sante.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Infirmière",
      "company": "Clinique Sainte-Marie",
      "period": "2022 — Aujourd’hui",
      "description": "Accueil et suivi des patients, réalisation des soins prescrits et transmissions avec l’équipe médicale."
    },
    {
      "role": "Infirmière stagiaire",
      "company": "CHU de Treichville",
      "period": "2019 — 2022",
      "description": "Stages en médecine générale, pédiatrie et urgences, avec prise en charge supervisée des patients."
    }
  ],
  "education": [
    {
      "degree": "Diplôme d’État d’infirmier",
      "school": "INFAS Abidjan",
      "period": "2016 — 2019"
    }
  ],
  "skills": [
    "Soins infirmiers",
    "Surveillance clinique",
    "Dossier patient",
    "Éducation thérapeutique",
    "Hygiène hospitalière",
    "Gestion des urgences"
  ],
  "languages": [
    "Français — natif",
    "Anglais — courant",
    "Espagnol — intermédiaire"
  ],
  "interests": [
    "Photographie",
    "Randonnée",
    "Céramique",
    "Podcasts"
  ]
}

export const Sample_AdjouaAmani: CvContent = {
  "fullName": "Adjoua Amani",
  "title": "Chargé de communication",
  "summary": "Chargé de communication expérimenté(e), spécialisé(e) en communication de crise, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.1@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-1.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Chargé de communication",
      "company": "Groupe Amani",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de communication de crise, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) chargé de communication",
      "company": "Services Adjoua",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de communication de crise et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Chargé de communication",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Stratégie éditoriale",
    "Relations presse",
    "Rédaction",
    "Canva",
    "Réseaux sociaux",
    "Communication de crise"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Communication de crise",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AdjouaAssi: CvContent = {
  "fullName": "Adjoua Assi",
  "title": "Gestionnaire commercial",
  "summary": "Gestionnaire commercial expérimenté(e), spécialisé(e) en développement b2b, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.2@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-2.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Gestionnaire commercial",
      "company": "Groupe Assi",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de développement b2b, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) gestionnaire commercial",
      "company": "Services Adjoua",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de développement b2b et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Gestionnaire commercial",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Prospection",
    "Négociation",
    "Suivi de portefeuille",
    "CRM",
    "Fidélisation client",
    "Développement B2B"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Développement B2B",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AdjouaBamba: CvContent = {
  "fullName": "Adjoua Bamba",
  "title": "Responsable logistique",
  "summary": "Responsable logistique expérimenté(e), spécialisé(e) en transit maritime, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.3@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-3.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Responsable logistique",
      "company": "Groupe Bamba",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de transit maritime, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) responsable logistique",
      "company": "Services Adjoua",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de transit maritime et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Responsable logistique",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Gestion des stocks",
    "Planification",
    "Transport",
    "Approvisionnement",
    "Excel",
    "Transit maritime"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Transit maritime",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AdjouaCoulibaly: CvContent = {
  "fullName": "Adjoua Coulibaly",
  "title": "Chargé de projets",
  "summary": "Chargé de projets expérimenté(e), spécialisé(e) en projets éducatifs, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.4@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-4.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Chargé de projets",
      "company": "Groupe Coulibaly",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de projets éducatifs, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) chargé de projets",
      "company": "Services Adjoua",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de projets éducatifs et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Chargé de projets",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Planification",
    "Gestion de budget",
    "Coordination d’équipe",
    "Reporting",
    "Suivi des indicateurs",
    "Projets éducatifs"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Projets éducatifs",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AdjouaDiabate: CvContent = {
  "fullName": "Adjoua Diabaté",
  "title": "Analyste de données",
  "summary": "Analyste de données expérimenté(e), spécialisé(e) en analyse marketing, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.5@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-5.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Analyste de données",
      "company": "Groupe Diabaté",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de analyse marketing, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) analyste de données",
      "company": "Services Adjoua",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de analyse marketing et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Analyste de données",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "SQL",
    "Excel avancé",
    "Power BI",
    "Nettoyage de données",
    "Visualisation",
    "Analyse marketing"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Analyse marketing",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AdjouaAudrey: CvContent = {
  "fullName": "Adjoua Audrey",
  "title": "Technicien informatique",
  "summary": "Technicien informatique expérimenté(e), spécialisé(e) en administration système, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.6@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-6.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Technicien informatique",
      "company": "Groupe Audrey",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de administration système, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) technicien informatique",
      "company": "Services Adjoua",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de administration système et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Technicien informatique",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Support utilisateur",
    "Maintenance informatique",
    "Windows",
    "Réseaux",
    "Gestion de parc",
    "Administration système"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Administration système",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AdjouaGnahore: CvContent = {
  "fullName": "Adjoua Gnahoré",
  "title": "Assistant administratif",
  "summary": "Assistant administratif expérimenté(e), spécialisé(e) en gestion des marchés, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.7@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-7.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Assistant administratif",
      "company": "Groupe Gnahoré",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de gestion des marchés, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) assistant administratif",
      "company": "Services Adjoua",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de gestion des marchés et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Assistant administratif",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Gestion documentaire",
    "Accueil",
    "Rédaction professionnelle",
    "Organisation",
    "Suite Office",
    "Gestion des marchés"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Gestion des marchés",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AdjouaKacou: CvContent = {
  "fullName": "Adjoua Kacou",
  "title": "Chargé de communication",
  "summary": "Chargé de communication expérimenté(e), spécialisé(e) en communication institutionnelle, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.8@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-8.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Chargé de communication",
      "company": "Groupe Kacou",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de communication institutionnelle, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) chargé de communication",
      "company": "Services Adjoua",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de communication institutionnelle et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Chargé de communication",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Stratégie éditoriale",
    "Relations presse",
    "Rédaction",
    "Canva",
    "Réseaux sociaux",
    "Communication institutionnelle"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Communication institutionnelle",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AdjouaKouadio: CvContent = {
  "fullName": "Adjoua Kouadio",
  "title": "Gestionnaire commercial",
  "summary": "Gestionnaire commercial expérimenté(e), spécialisé(e) en vente de solutions numériques, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.9@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-9.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Gestionnaire commercial",
      "company": "Groupe Kouadio",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de vente de solutions numériques, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) gestionnaire commercial",
      "company": "Services Adjoua",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de vente de solutions numériques et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Gestionnaire commercial",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Prospection",
    "Négociation",
    "Suivi de portefeuille",
    "CRM",
    "Fidélisation client",
    "Vente de solutions numériques"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Vente de solutions numériques",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AdjouaKouame: CvContent = {
  "fullName": "Adjoua Kouamé",
  "title": "Responsable logistique",
  "summary": "Responsable logistique expérimenté(e), spécialisé(e) en logistique humanitaire, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.10@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-10.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Responsable logistique",
      "company": "Groupe Kouamé",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de logistique humanitaire, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) responsable logistique",
      "company": "Services Adjoua",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de logistique humanitaire et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Responsable logistique",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Gestion des stocks",
    "Planification",
    "Transport",
    "Approvisionnement",
    "Excel",
    "Logistique humanitaire"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Logistique humanitaire",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AdjouaKonan: CvContent = {
  "fullName": "Adjoua Konan",
  "title": "Chargé de projets",
  "summary": "Chargé de projets expérimenté(e), spécialisé(e) en projets numériques, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.11@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-11.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Chargé de projets",
      "company": "Groupe Konan",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de projets numériques, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) chargé de projets",
      "company": "Services Adjoua",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de projets numériques et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Chargé de projets",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Planification",
    "Gestion de budget",
    "Coordination d’équipe",
    "Reporting",
    "Suivi des indicateurs",
    "Projets numériques"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Projets numériques",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AdjouaNGuessan: CvContent = {
  "fullName": "Adjoua N’Guessan",
  "title": "Analyste de données",
  "summary": "Analyste de données expérimenté(e), spécialisé(e) en analyse financière, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.12@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-12.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Analyste de données",
      "company": "Groupe N’Guessan",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de analyse financière, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) analyste de données",
      "company": "Services Adjoua",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de analyse financière et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Analyste de données",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "SQL",
    "Excel avancé",
    "Power BI",
    "Nettoyage de données",
    "Visualisation",
    "Analyse financière"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Analyse financière",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AdjouaOuattara: CvContent = {
  "fullName": "Adjoua Ouattara",
  "title": "Technicien informatique",
  "summary": "Technicien informatique expérimenté(e), spécialisé(e) en cybersécurité, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.13@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-13.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Technicien informatique",
      "company": "Groupe Ouattara",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de cybersécurité, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) technicien informatique",
      "company": "Services Adjoua",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de cybersécurité et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Technicien informatique",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Support utilisateur",
    "Maintenance informatique",
    "Windows",
    "Réseaux",
    "Gestion de parc",
    "Cybersécurité"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Cybersécurité",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AdjouaToure: CvContent = {
  "fullName": "Adjoua Touré",
  "title": "Assistant administratif",
  "summary": "Assistant administratif expérimenté(e), spécialisé(e) en secrétariat juridique, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.14@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-14.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Assistant administratif",
      "company": "Groupe Touré",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de secrétariat juridique, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) assistant administratif",
      "company": "Services Adjoua",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de secrétariat juridique et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Assistant administratif",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Gestion documentaire",
    "Accueil",
    "Rédaction professionnelle",
    "Organisation",
    "Suite Office",
    "Secrétariat juridique"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Secrétariat juridique",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AhouAmani: CvContent = {
  "fullName": "Ahou Amani",
  "title": "Chargé de communication",
  "summary": "Chargé de communication expérimenté(e), spécialisé(e) en campagnes de sensibilisation, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.15@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-15.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Chargé de communication",
      "company": "Groupe Amani",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de campagnes de sensibilisation, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) chargé de communication",
      "company": "Services Ahou",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de campagnes de sensibilisation et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Chargé de communication",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Stratégie éditoriale",
    "Relations presse",
    "Rédaction",
    "Canva",
    "Réseaux sociaux",
    "Campagnes de sensibilisation"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Campagnes de sensibilisation",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AhouAssi: CvContent = {
  "fullName": "Ahou Assi",
  "title": "Gestionnaire commercial",
  "summary": "Gestionnaire commercial expérimenté(e), spécialisé(e) en grands comptes, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.16@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-16.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Gestionnaire commercial",
      "company": "Groupe Assi",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de grands comptes, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) gestionnaire commercial",
      "company": "Services Ahou",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de grands comptes et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Gestionnaire commercial",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Prospection",
    "Négociation",
    "Suivi de portefeuille",
    "CRM",
    "Fidélisation client",
    "Grands comptes"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Grands comptes",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AhouBamba: CvContent = {
  "fullName": "Mm Bella",
  "title": "Responsable logistique",
  "summary": "Responsable logistique expérimenté(e), spécialisé(e) en chaîne du froid, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.17@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-17.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Responsable logistique",
      "company": "Groupe Bamba",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de chaîne du froid, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) responsable logistique",
      "company": "Services Ahou",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de chaîne du froid et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Responsable logistique",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Gestion des stocks",
    "Planification",
    "Transport",
    "Approvisionnement",
    "Excel",
    "Chaîne du froid"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Chaîne du froid",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AhouCoulibaly: CvContent = {
  "fullName": "Ahou Coulibaly",
  "title": "Chargé de projets",
  "summary": "Chargé de projets expérimenté(e), spécialisé(e) en développement local, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.18@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-18.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Chargé de projets",
      "company": "Groupe Coulibaly",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de développement local, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) chargé de projets",
      "company": "Services Ahou",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de développement local et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Chargé de projets",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Planification",
    "Gestion de budget",
    "Coordination d’équipe",
    "Reporting",
    "Suivi des indicateurs",
    "Développement local"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Développement local",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AhouDiabate: CvContent = {
  "fullName": "Ahou Diabaté",
  "title": "Analyste de données",
  "summary": "Analyste de données expérimenté(e), spécialisé(e) en données de santé, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.19@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-19.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Analyste de données",
      "company": "Groupe Diabaté",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de données de santé, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) analyste de données",
      "company": "Services Ahou",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de données de santé et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Analyste de données",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "SQL",
    "Excel avancé",
    "Power BI",
    "Nettoyage de données",
    "Visualisation",
    "Données de santé"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Données de santé",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AhouAudrey: CvContent = {
  "fullName": "Ahou Audrey",
  "title": "Technicien informatique",
  "summary": "Technicien informatique expérimenté(e), spécialisé(e) en support applicatif, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.20@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-20.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Technicien informatique",
      "company": "Groupe Audrey",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de support applicatif, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) technicien informatique",
      "company": "Services Ahou",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de support applicatif et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Technicien informatique",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Support utilisateur",
    "Maintenance informatique",
    "Windows",
    "Réseaux",
    "Gestion de parc",
    "Support applicatif"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Support applicatif",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AhouGnahore: CvContent = {
  "fullName": "Ahou Gnahoré",
  "title": "Assistant administratif",
  "summary": "Assistant administratif expérimenté(e), spécialisé(e) en administration scolaire, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.21@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-21.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Assistant administratif",
      "company": "Groupe Gnahoré",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de administration scolaire, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) assistant administratif",
      "company": "Services Ahou",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de administration scolaire et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Assistant administratif",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Gestion documentaire",
    "Accueil",
    "Rédaction professionnelle",
    "Organisation",
    "Suite Office",
    "Administration scolaire"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Administration scolaire",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AhouKacou: CvContent = {
  "fullName": "Ahou Kacou",
  "title": "Chargé de communication",
  "summary": "Chargé de communication expérimenté(e), spécialisé(e) en communication événementielle, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.22@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-22.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Chargé de communication",
      "company": "Groupe Kacou",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de communication événementielle, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) chargé de communication",
      "company": "Services Ahou",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de communication événementielle et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Chargé de communication",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Stratégie éditoriale",
    "Relations presse",
    "Rédaction",
    "Canva",
    "Réseaux sociaux",
    "Communication événementielle"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Communication événementielle",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AhouKouadio: CvContent = {
  "fullName": "Ahou Kouadio",
  "title": "Gestionnaire commercial",
  "summary": "Gestionnaire commercial expérimenté(e), spécialisé(e) en commerce de détail, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.23@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-23.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Gestionnaire commercial",
      "company": "Groupe Kouadio",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de commerce de détail, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) gestionnaire commercial",
      "company": "Services Ahou",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de commerce de détail et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Gestionnaire commercial",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Prospection",
    "Négociation",
    "Suivi de portefeuille",
    "CRM",
    "Fidélisation client",
    "Commerce de détail"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Commerce de détail",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AhouKouame: CvContent = {
  "fullName": "Ahou Kouamé",
  "title": "Responsable logistique",
  "summary": "Responsable logistique expérimenté(e), spécialisé(e) en gestion d’entrepôt, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.24@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-24.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Responsable logistique",
      "company": "Groupe Kouamé",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de gestion d’entrepôt, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) responsable logistique",
      "company": "Services Ahou",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de gestion d’entrepôt et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Responsable logistique",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Gestion des stocks",
    "Planification",
    "Transport",
    "Approvisionnement",
    "Excel",
    "Gestion d’entrepôt"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Gestion d’entrepôt",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AhouKonan: CvContent = {
  "fullName": "Ahou Konan",
  "title": "Chargé de projets",
  "summary": "Chargé de projets expérimenté(e), spécialisé(e) en projets culturels, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.25@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-25.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Chargé de projets",
      "company": "Groupe Konan",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de projets culturels, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) chargé de projets",
      "company": "Services Ahou",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de projets culturels et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Chargé de projets",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Planification",
    "Gestion de budget",
    "Coordination d’équipe",
    "Reporting",
    "Suivi des indicateurs",
    "Projets culturels"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Projets culturels",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AhouNGuessan: CvContent = {
  "fullName": "Ahou N’Guessan",
  "title": "Analyste de données",
  "summary": "Analyste de données expérimenté(e), spécialisé(e) en études de marché, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.26@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-26.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Analyste de données",
      "company": "Groupe N’Guessan",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de études de marché, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) analyste de données",
      "company": "Services Ahou",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de études de marché et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Analyste de données",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "SQL",
    "Excel avancé",
    "Power BI",
    "Nettoyage de données",
    "Visualisation",
    "Études de marché"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Études de marché",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AhouOuattara: CvContent = {
  "fullName": "Ahou Ouattara",
  "title": "Technicien informatique",
  "summary": "Technicien informatique expérimenté(e), spécialisé(e) en réseaux locaux, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.27@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-27.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Technicien informatique",
      "company": "Groupe Ouattara",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de réseaux locaux, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) technicien informatique",
      "company": "Services Ahou",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de réseaux locaux et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Technicien informatique",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Support utilisateur",
    "Maintenance informatique",
    "Windows",
    "Réseaux",
    "Gestion de parc",
    "Réseaux locaux"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Réseaux locaux",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AhouToure: CvContent = {
  "fullName": "Ahou Touré",
  "title": "Assistant administratif",
  "summary": "Assistant administratif expérimenté(e), spécialisé(e) en gestion des dossiers clients, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.28@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-28.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Assistant administratif",
      "company": "Groupe Touré",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de gestion des dossiers clients, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) assistant administratif",
      "company": "Services Ahou",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de gestion des dossiers clients et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Assistant administratif",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Gestion documentaire",
    "Accueil",
    "Rédaction professionnelle",
    "Organisation",
    "Suite Office",
    "Gestion des dossiers clients"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Gestion des dossiers clients",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AkissiAmani: CvContent = {
  "fullName": "Akissi Amani",
  "title": "Chargé de communication",
  "summary": "Chargé de communication expérimenté(e), spécialisé(e) en communication interne, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.29@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-29.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Chargé de communication",
      "company": "Groupe Amani",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de communication interne, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) chargé de communication",
      "company": "Services Akissi",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de communication interne et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Chargé de communication",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Stratégie éditoriale",
    "Relations presse",
    "Rédaction",
    "Canva",
    "Réseaux sociaux",
    "Communication interne"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Communication interne",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AkissiAssi: CvContent = {
  "fullName": "Akissi Assi",
  "title": "Gestionnaire commercial",
  "summary": "Gestionnaire commercial expérimenté(e), spécialisé(e) en partenariats commerciaux, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.30@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-30.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Gestionnaire commercial",
      "company": "Groupe Assi",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de partenariats commerciaux, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) gestionnaire commercial",
      "company": "Services Akissi",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de partenariats commerciaux et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Gestionnaire commercial",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Prospection",
    "Négociation",
    "Suivi de portefeuille",
    "CRM",
    "Fidélisation client",
    "Partenariats commerciaux"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Partenariats commerciaux",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AkissiBamba: CvContent = {
  "fullName": "Akissi Bamba",
  "title": "Responsable logistique",
  "summary": "Responsable logistique expérimenté(e), spécialisé(e) en transport routier, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.31@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-31.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Responsable logistique",
      "company": "Groupe Bamba",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de transport routier, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) responsable logistique",
      "company": "Services Akissi",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de transport routier et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Responsable logistique",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Gestion des stocks",
    "Planification",
    "Transport",
    "Approvisionnement",
    "Excel",
    "Transport routier"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Transport routier",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AkissiCoulibaly: CvContent = {
  "fullName": "Akissi Coulibaly",
  "title": "Chargé de projets",
  "summary": "Chargé de projets expérimenté(e), spécialisé(e) en transformation organisationnelle, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.32@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-32.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Chargé de projets",
      "company": "Groupe Coulibaly",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de transformation organisationnelle, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) chargé de projets",
      "company": "Services Akissi",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de transformation organisationnelle et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Chargé de projets",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Planification",
    "Gestion de budget",
    "Coordination d’équipe",
    "Reporting",
    "Suivi des indicateurs",
    "Transformation organisationnelle"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Transformation organisationnelle",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AkissiDiabate: CvContent = {
  "fullName": "Akissi Diabaté",
  "title": "Analyste de données",
  "summary": "Analyste de données expérimenté(e), spécialisé(e) en indicateurs rh, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.33@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-33.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Analyste de données",
      "company": "Groupe Diabaté",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de indicateurs rh, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) analyste de données",
      "company": "Services Akissi",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de indicateurs rh et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Analyste de données",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "SQL",
    "Excel avancé",
    "Power BI",
    "Nettoyage de données",
    "Visualisation",
    "Indicateurs RH"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Indicateurs RH",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AkissiAudrey: CvContent = {
  "fullName": "Akissi Audrey",
  "title": "Technicien informatique",
  "summary": "Technicien informatique expérimenté(e), spécialisé(e) en cloud et sauvegardes, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.34@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-34.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Technicien informatique",
      "company": "Groupe Audrey",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de cloud et sauvegardes, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) technicien informatique",
      "company": "Services Akissi",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de cloud et sauvegardes et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Technicien informatique",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Support utilisateur",
    "Maintenance informatique",
    "Windows",
    "Réseaux",
    "Gestion de parc",
    "Cloud et sauvegardes"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Cloud et sauvegardes",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AkissiGnahore: CvContent = {
  "fullName": "Akissi Gnahoré",
  "title": "Assistant administratif",
  "summary": "Assistant administratif expérimenté(e), spécialisé(e) en organisation de direction, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.35@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-35.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Assistant administratif",
      "company": "Groupe Gnahoré",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de organisation de direction, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) assistant administratif",
      "company": "Services Akissi",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de organisation de direction et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Assistant administratif",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Gestion documentaire",
    "Accueil",
    "Rédaction professionnelle",
    "Organisation",
    "Suite Office",
    "Organisation de direction"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Organisation de direction",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AkissiKacou: CvContent = {
  "fullName": "Akissi Kacou",
  "title": "Chargé de communication",
  "summary": "Chargé de communication expérimenté(e), spécialisé(e) en communication de marque, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.36@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-36.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Chargé de communication",
      "company": "Groupe Kacou",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de communication de marque, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) chargé de communication",
      "company": "Services Akissi",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de communication de marque et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Chargé de communication",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Stratégie éditoriale",
    "Relations presse",
    "Rédaction",
    "Canva",
    "Réseaux sociaux",
    "Communication de marque"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Communication de marque",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AkissiKouadio: CvContent = {
  "fullName": "Akissi Kouadio",
  "title": "Gestionnaire commercial",
  "summary": "Gestionnaire commercial expérimenté(e), spécialisé(e) en analyse des ventes, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.37@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-37.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Gestionnaire commercial",
      "company": "Groupe Kouadio",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de analyse des ventes, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) gestionnaire commercial",
      "company": "Services Akissi",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de analyse des ventes et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Gestionnaire commercial",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Prospection",
    "Négociation",
    "Suivi de portefeuille",
    "CRM",
    "Fidélisation client",
    "Analyse des ventes"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Analyse des ventes",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AkissiKouame: CvContent = {
  "fullName": "Akissi Kouamé",
  "title": "Responsable logistique",
  "summary": "Responsable logistique expérimenté(e), spécialisé(e) en achats internationaux, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.38@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-38.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Responsable logistique",
      "company": "Groupe Kouamé",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de achats internationaux, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) responsable logistique",
      "company": "Services Akissi",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de achats internationaux et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Responsable logistique",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Gestion des stocks",
    "Planification",
    "Transport",
    "Approvisionnement",
    "Excel",
    "Achats internationaux"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Achats internationaux",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AkissiKonan: CvContent = {
  "fullName": "Akissi Konan",
  "title": "Chargé de projets",
  "summary": "Chargé de projets expérimenté(e), spécialisé(e) en suivi-évaluation, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.39@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-39.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Chargé de projets",
      "company": "Groupe Konan",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de suivi-évaluation, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) chargé de projets",
      "company": "Services Akissi",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de suivi-évaluation et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Chargé de projets",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Planification",
    "Gestion de budget",
    "Coordination d’équipe",
    "Reporting",
    "Suivi des indicateurs",
    "Suivi-évaluation"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Suivi-évaluation",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AkissiNGuessan: CvContent = {
  "fullName": "Akissi N’Guessan",
  "title": "Analyste de données",
  "summary": "Analyste de données expérimenté(e), spécialisé(e) en prévisions de ventes, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.40@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-40.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Analyste de données",
      "company": "Groupe N’Guessan",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de prévisions de ventes, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) analyste de données",
      "company": "Services Akissi",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de prévisions de ventes et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Analyste de données",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "SQL",
    "Excel avancé",
    "Power BI",
    "Nettoyage de données",
    "Visualisation",
    "Prévisions de ventes"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Prévisions de ventes",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AkissiOuattara: CvContent = {
  "fullName": "Akissi Ouattara",
  "title": "Technicien informatique",
  "summary": "Technicien informatique expérimenté(e), spécialisé(e) en déploiement de postes, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.41@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-41.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Technicien informatique",
      "company": "Groupe Ouattara",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de déploiement de postes, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) technicien informatique",
      "company": "Services Akissi",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de déploiement de postes et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Technicien informatique",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Support utilisateur",
    "Maintenance informatique",
    "Windows",
    "Réseaux",
    "Gestion de parc",
    "Déploiement de postes"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Déploiement de postes",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AkissiToure: CvContent = {
  "fullName": "Akissi Touré",
  "title": "Assistant administratif",
  "summary": "Assistant administratif expérimenté(e), spécialisé(e) en gestion des archives, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.42@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-42.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Assistant administratif",
      "company": "Groupe Touré",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de gestion des archives, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) assistant administratif",
      "company": "Services Akissi",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de gestion des archives et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Assistant administratif",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Gestion documentaire",
    "Accueil",
    "Rédaction professionnelle",
    "Organisation",
    "Suite Office",
    "Gestion des archives"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Gestion des archives",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AminataAmani: CvContent = {
  "fullName": "Aminata Amani",
  "title": "Chargé de communication",
  "summary": "Chargé de communication expérimenté(e), spécialisé(e) en communication digitale, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.43@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-43.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Chargé de communication",
      "company": "Groupe Amani",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de communication digitale, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) chargé de communication",
      "company": "Services Aminata",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de communication digitale et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Chargé de communication",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Stratégie éditoriale",
    "Relations presse",
    "Rédaction",
    "Canva",
    "Réseaux sociaux",
    "Communication digitale"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Communication digitale",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AminataAssi: CvContent = {
  "fullName": "Aminata Assi",
  "title": "Gestionnaire commercial",
  "summary": "Gestionnaire commercial expérimenté(e), spécialisé(e) en service après-vente, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.44@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-44.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Gestionnaire commercial",
      "company": "Groupe Assi",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de service après-vente, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) gestionnaire commercial",
      "company": "Services Aminata",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de service après-vente et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Gestionnaire commercial",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Prospection",
    "Négociation",
    "Suivi de portefeuille",
    "CRM",
    "Fidélisation client",
    "Service après-vente"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Service après-vente",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AminataBamba: CvContent = {
  "fullName": "Aminata Bamba",
  "title": "Responsable logistique",
  "summary": "Responsable logistique expérimenté(e), spécialisé(e) en distribution urbaine, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.45@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-45.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Responsable logistique",
      "company": "Groupe Bamba",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de distribution urbaine, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) responsable logistique",
      "company": "Services Aminata",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de distribution urbaine et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Responsable logistique",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Gestion des stocks",
    "Planification",
    "Transport",
    "Approvisionnement",
    "Excel",
    "Distribution urbaine"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Distribution urbaine",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AminataCoulibaly: CvContent = {
  "fullName": "Aminata Coulibaly",
  "title": "Chargé de projets",
  "summary": "Chargé de projets expérimenté(e), spécialisé(e) en projets environnementaux, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.46@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-46.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Chargé de projets",
      "company": "Groupe Coulibaly",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de projets environnementaux, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) chargé de projets",
      "company": "Services Aminata",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de projets environnementaux et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Chargé de projets",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Planification",
    "Gestion de budget",
    "Coordination d’équipe",
    "Reporting",
    "Suivi des indicateurs",
    "Projets environnementaux"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Projets environnementaux",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AminataDiabate: CvContent = {
  "fullName": "Aminata Diabaté",
  "title": "Analyste de données",
  "summary": "Analyste de données expérimenté(e), spécialisé(e) en données logistiques, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.47@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-47.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Analyste de données",
      "company": "Groupe Diabaté",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de données logistiques, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) analyste de données",
      "company": "Services Aminata",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de données logistiques et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Analyste de données",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "SQL",
    "Excel avancé",
    "Power BI",
    "Nettoyage de données",
    "Visualisation",
    "Données logistiques"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Données logistiques",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AminataAudrey: CvContent = {
  "fullName": "Aminata Audrey",
  "title": "Technicien informatique",
  "summary": "Technicien informatique expérimenté(e), spécialisé(e) en assistance de proximité, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.48@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-48.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Technicien informatique",
      "company": "Groupe Audrey",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de assistance de proximité, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) technicien informatique",
      "company": "Services Aminata",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de assistance de proximité et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Technicien informatique",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Support utilisateur",
    "Maintenance informatique",
    "Windows",
    "Réseaux",
    "Gestion de parc",
    "Assistance de proximité"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Assistance de proximité",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

export const Sample_AminataGnahore: CvContent = {
  "fullName": "Aminata Gnahoré",
  "title": "Assistant administratif",
  "summary": "Assistant administratif expérimenté(e), spécialisé(e) en administration médicale, avec une approche rigoureuse et orientée résultats.",
  "email": "profil.49@exemple.ci",
  "phone": "+33 6 12 34 56 78",
  "location": "Lyon, France",
  "website": "profil-49.ci",
  "photo": "/portraits/portrait-1.png",
  "experiences": [
    {
      "role": "Assistant administratif",
      "company": "Groupe Gnahoré",
      "period": "2022 — Aujourd’hui",
      "description": "Pilotage des activités de administration médicale, coordination des interlocuteurs et suivi des objectifs de qualité."
    },
    {
      "role": "Assistant(e) assistant administratif",
      "company": "Services Aminata",
      "period": "2019 — 2022",
      "description": "Contribution aux opérations de administration médicale et amélioration des procédures de travail."
    }
  ],
  "education": [
    {
      "degree": "Master Assistant administratif",
      "school": "Université Félix Houphouët-Boigny",
      "period": "2017 — 2019"
    },
    {
      "degree": "Licence professionnelle",
      "school": "Université Nangui Abrogoua",
      "period": "2014 — 2017"
    }
  ],
  "skills": [
    "Gestion documentaire",
    "Accueil",
    "Rédaction professionnelle",
    "Organisation",
    "Suite Office",
    "Administration médicale"
  ],
  "languages": [
    "Français — courant",
    "Anglais — professionnel"
  ],
  "interests": [
    "Administration médicale",
    "Veille professionnelle",
    "Bénévolat"
  ]
}

/** Profils attribués dans le même ordre que les modèles de la galerie. */
const RAW_SAMPLE_CONTENTS: CvContent[] = [Sample_CamilleLaurent, Sample_SoroJustine, Sample_JamesKater, Sample_OunaTresor, Sample_KouadioRodolphe, Sample_TokpaInnes, Sample_DohoBenedicte, Sample_InagoEunice, Sample_SadiaGrace, Sample_SolouAngeJunior, Sample_NitiemaAllassane, Sample_KouameAline, Sample_TraBiKevin, Sample_NDriMariam, Sample_AdjouaAmani, Sample_AdjouaAssi, Sample_AdjouaBamba, Sample_AdjouaCoulibaly, Sample_AdjouaDiabate, Sample_AdjouaAudrey, Sample_AdjouaGnahore, Sample_AdjouaKacou, Sample_AdjouaKouadio, Sample_AdjouaKouame, Sample_AdjouaKonan, Sample_AdjouaNGuessan, Sample_AdjouaOuattara, Sample_AdjouaToure, Sample_AhouAmani, Sample_AhouAssi, Sample_AhouBamba, Sample_AhouCoulibaly, Sample_AhouDiabate, Sample_AhouAudrey, Sample_AhouGnahore, Sample_AhouKacou, Sample_AhouKouadio, Sample_AhouKouame, Sample_AhouKonan, Sample_AhouNGuessan, Sample_AhouOuattara, Sample_AhouToure, Sample_AkissiAmani, Sample_AkissiAssi, Sample_AkissiBamba, Sample_AkissiCoulibaly, Sample_AkissiDiabate, Sample_AkissiAudrey, Sample_AkissiGnahore, Sample_AkissiKacou, Sample_AkissiKouadio, Sample_AkissiKouame, Sample_AkissiKonan, Sample_AkissiNGuessan, Sample_AkissiOuattara, Sample_AkissiToure, Sample_AminataAmani, Sample_AminataAssi, Sample_AminataBamba, Sample_AminataCoulibaly, Sample_AminataDiabate, Sample_AminataAudrey, Sample_AminataGnahore]
export const SAMPLE_CONTENTS: CvContent[] = RAW_SAMPLE_CONTENTS.map(enrichCvContent)
export const SAMPLE_CONTENT = SAMPLE_CONTENTS[0]
