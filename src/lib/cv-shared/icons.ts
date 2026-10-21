/**
 * # Leçon icônes
 *
 * Les layouts enregistrent un nom stable (par exemple `mail`) plutôt qu'un
 * composant React. Le rendu cherche ensuite le composant correspondant ici.
 * Pour utiliser une autre icône Lucide, importe-la en haut du fichier et ajoute
 * son nom à cette table ; le layout peut alors appeler `makeIcon({ icon: 'mail' })`.
 */
import {
  Award,
  Briefcase,
  Calendar,
  Camera,
  Code,
  Globe,
  GraduationCap,
  Heart,
  Languages,
  Lightbulb,
  Mail,
  MapPin,
  Music,
  Phone,
  Plane,
  Star,
  Target,
  User,
  type LucideIcon,
} from 'lucide-react'

/** Noms d'icônes utilisables dans les données `IconElement`. */
export const ICONS: Record<string, LucideIcon> = {
  mail: Mail,
  phone: Phone,
  'map-pin': MapPin,
  globe: Globe,
  briefcase: Briefcase,
  'graduation-cap': GraduationCap,
  star: Star,
  heart: Heart,
  award: Award,
  user: User,
  code: Code,
  languages: Languages,
  camera: Camera,
  music: Music,
  plane: Plane,
  target: Target,
  lightbulb: Lightbulb,
  calendar: Calendar,
}
