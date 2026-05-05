// Lucide icons can't be stored in Firestore (they're React components).
// Seed/edit/render flows store the icon NAME as a string; this map looks up
// the component on read. New icons: import + add to the map.

import {
  GraduationCap,
  ShieldCheck,
  FlaskConical,
  BookOpen,
  Users2,
  HeartHandshake,
  Sparkles,
  Target,
  Briefcase,
  Calendar,
  Heart,
  Globe2,
  Trophy,
  Lightbulb,
  Building2,
  School,
  Library,
  Computer,
  Award,
  TrendingUp,
  Users,
  Newspaper,
  type LucideIcon,
} from 'lucide-react';

export const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  ShieldCheck,
  FlaskConical,
  BookOpen,
  Users2,
  HeartHandshake,
  Sparkles,
  Target,
  Briefcase,
  Calendar,
  Heart,
  Globe2,
  Trophy,
  Lightbulb,
  Building2,
  School,
  Library,
  Computer,
  Award,
  TrendingUp,
  Users,
  Newspaper,
};

export const iconNames = Object.keys(iconMap);

export const getIcon = (name?: string): LucideIcon =>
  (name && iconMap[name]) || Sparkles;
