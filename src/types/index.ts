export interface KmReading {
  id: string;
  date: string;
  kilometers: number;
}

export interface ServiceRecord {
  id: string;
  motorcycleId: string;
  date: string;
  kilometers: number;
  workDone: string;
  amount: number;
  mechanic?: string;
  garage?: string;
  notes?: string;
  partsReplaced?: string;
}

// Vehicle category: Bike or Car
export type VehicleCategory = 'Bike' | 'Car';

// Usage type: Private or Commercial
export type VehicleUsageType = 'Private' | 'Commercial';

export interface Motorcycle {
  id: string;
  make: string;
  model: string;

  // Vehicle category (Bike or Car)
  vehicleType?: VehicleCategory;

  // Usage type (Private or Commercial)
  vehicleUsage?: VehicleUsageType;

  // Ownership / Identification
  ownerName?: string;
  registrationNumber: string;
  chassisNumber: string;
  engineNumber?: string;

  // Document validity
  registrationValidity?: string; // for private vehicles
  insuranceValidity: string;
  pollutionValidity: string;
  fitnessValidity?: string; // for commercial vehicles
  roadTaxValidity?: string; // for commercial vehicles
  permitValidity?: string; // for commercial vehicles

  // Service
  serviceIntervalMonths: number;
  serviceIntervalKms: number;
  lastServiceDate: string;
  lastServiceKm: number;

  // Odometer readings
  kmReadings: KmReading[];
  currentOdometer?: number;

  createdAt: string;
}

export interface CompanySettings {
  companyName: string;
  logo: string; // base64 encoded
  tagline: string;
  email: string;
  phone: string;
  alternatePhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  website: string;
  gstNumber: string;
  panNumber: string;
  businessRegNumber: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface FleetData {
  motorcycles: Motorcycle[];
  makes: string[];
  models: Record<string, string[]>; // make -> models mapping
  serviceRecords: ServiceRecord[];
  companySettings: CompanySettings;
}

export type ServiceStatus = 'ok' | 'upcoming' | 'overdue';

export interface HomepageStat {
  icon: string;
  value: string;
  label: string;
}

export interface HomepageFeature {
  icon: string;
  title: string;
  description: string;
  image: string;
}

export interface HomepageReview {
  name: string;
  role: string;
  company: string;
  location: string;
  image: string;
  text: string;
  rating: number;
}

export interface HomepageFaq {
  question: string;
  answer: string;
}

export interface BrandLogo {
  name: string;
  logoUrl: string;
}

export interface HomepageContent {
  // Nav labels
  navHome: string;
  navFeatures: string;
  navHowItWorks: string;
  navPricing: string;
  navReviews: string;
  navFaq: string;
  navContact: string;
  navLoginCta: string;
  navStartCta: string;

  // Hero
  trustBadge: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroScrollHint: string;

  // Section headers
  featuresBadge: string;
  featuresTitleLine1: string;
  featuresTitleLine2: string;
  featuresSubtitle: string;

  howItWorksBadge: string;
  howItWorksTitle: string;
  howItWorksSubtitle: string;

  pricingBadge: string;
  pricingTitle: string;
  pricingSubtitle: string;

  reviewsBadge: string;
  reviewsTitle: string;
  reviewsSubtitle: string;

  faqBadge: string;
  faqTitle: string;

  contactBadge: string;
  contactTitle: string;
  contactSubtitle: string;

  ctaTitle: string;
  ctaSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;

  footerDescription: string;
  footerMadeIn: string;

  // Collections
  stats: HomepageStat[];
  features: HomepageFeature[];
  brandLogos: BrandLogo[];
  reviews: HomepageReview[];
  faqs: HomepageFaq[];
}

export interface VisualElementStyle {
  fontSize?: string;
  color?: string;
}

export interface SiteSettings {
  // Branding
  siteName: string;
  tagline: string;
  logo: string;
  favicon: string;
  fontFamily: 'System' | 'Inter' | 'Poppins' | 'Montserrat';

  // Homepage content
  homepageContent: HomepageContent;

  // Homepage Images
  heroBackgroundImage: string;
  ctaBackgroundImage: string;
  showcaseImage1: string;
  showcaseImage2: string;
  showcaseImage3: string;
  showcaseImage4: string;

  // Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
  spacingScale: number;

  // SEO
  googleAnalyticsId: string;
  googleSearchConsoleId: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;

  // Social Media
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;

  // Contact
  email: string;
  phone: string;
  whatsapp: string;
  address: string;

  // Pricing
  starterPrice: number;
  starterVehicles: number;
  proPrice: number;
  proVehicles: number;
  enterprisePrice: number;

  // Features Toggle
  showPricing: boolean;
  showReviews: boolean;
  showFaq: boolean;
  showContact: boolean;

  // Custom CSS
  customCss: string;

  // Scripts
  headerScripts: string;
  footerScripts: string;

  // Visual Editor Overrides
  visualOverrides?: Record<string, VisualElementStyle>;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  companyName?: string;
  createdAt: string;
  plan?: 'starter' | 'professional' | 'enterprise';
  vehicleCount?: number;
}
