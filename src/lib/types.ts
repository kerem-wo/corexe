export interface SiteSettings {
  name: string;
  whatsapp: string;
  email: string;
  address: string;
}

export interface SliderItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link: string;
  order: number;
}

export interface DiscountBanner {
  id: string;
  title: string;
  subtitle: string;
  discount: string;
  image: string;
  link: string;
  order: number;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  category: string;
  featured: boolean;
  order: number;
}

export interface AboutContent {
  title: string;
  content: string;
}

export interface ContactContent {
  title: string;
  description: string;
  whatsapp: string;
  email: string;
  address: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  order: number;
}

export interface SiteData {
  site: SiteSettings;
  sliders: SliderItem[];
  discountBanners: DiscountBanner[];
  products: Product[];
  ucProducts: Product[];
  socialLinks: SocialLink[];
  about: AboutContent;
  contact: ContactContent;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}
