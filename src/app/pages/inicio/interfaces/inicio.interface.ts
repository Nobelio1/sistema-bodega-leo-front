export interface HeroHighlight {
  badge: string;
  title: string;
  subtitle: string;
  primaryCta: { label: string; route: string };
  secondaryCta: { label: string; route: string };
  advantages: string[];
}

export interface CategoryCard {
  id: string;
  name: string;
  description: string;
  icon: string;
  accent: string;
}

export interface FeaturedProduct {
  id: number;
  name: string;
  description: string;
  badge: string;
  price: number;
  unit: string;
  stock: number;
  category: string;
}

export interface Testimonial {
  id: number;
  author: string;
  detail: string;
  rating: number;
  orderFrequency: string;
}
