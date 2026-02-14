import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  companyName?: string;
  createdAt: string;
  plan?: 'starter' | 'professional' | 'enterprise';
  vehicleCount?: number;
}

interface HomepageStat {
  icon: string;
  value: string;
  label: string;
}

interface HomepageFeature {
  icon: string;
  title: string;
  description: string;
  image: string;
}

interface HomepageReview {
  name: string;
  role: string;
  company: string;
  location: string;
  image: string;
  text: string;
  rating: number;
}

interface HomepageFaq {
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

interface SiteSettings {
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
}

const defaultSettings: SiteSettings = {
  siteName: 'Fleet Guard',
  tagline: 'Protect Your Fleet',
  logo: '',
  favicon: '',
  fontFamily: 'System',

  homepageContent: {
    navHome: 'Home',
    navFeatures: 'Features',
    navHowItWorks: 'How It Works',
    navPricing: 'Pricing',
    navReviews: 'Reviews',
    navFaq: 'FAQ',
    navContact: 'Contact',
    navLoginCta: 'Login',
    navStartCta: 'Start Free →',

    trustBadge: 'Trusted by 800+ Fleet Operators Across India',
    heroTitleLine1: 'Protect Your',
    heroTitleLine2: 'Fleet Like Never Before',
    heroSubtitle:
      'The smartest way to manage vehicles. Track services, documents, and never miss a deadline. Built for Indian fleet operators.',
    heroPrimaryCta: '🚀 Start Free Trial',
    heroSecondaryCta: 'Login to Dashboard',
    heroScrollHint: 'Scroll to explore',

    featuresBadge: '✨ Powerful Features',
    featuresTitleLine1: 'Everything You Need to',
    featuresTitleLine2: 'Manage Your Fleet',
    featuresSubtitle: 'From document tracking to expense analytics, Fleet Guard has all the tools you need',

    howItWorksBadge: '🚀 Quick Setup',
    howItWorksTitle: 'Get Started in 3 Simple Steps',
    howItWorksSubtitle: 'Start managing your fleet in under 5 minutes',

    pricingBadge: '💰 Simple Pricing',
    pricingTitle: 'Choose Your Plan',
    pricingSubtitle: 'Start free, upgrade when you need more',

    reviewsBadge: '💬 Customer Love',
    reviewsTitle: 'What Our Customers Say',
    reviewsSubtitle: 'Join 800+ happy fleet operators across India',

    faqBadge: '❓ FAQ',
    faqTitle: 'Frequently Asked Questions',

    contactBadge: '📞 Get In Touch',
    contactTitle: "Let's Talk About Your Fleet",
    contactSubtitle:
      "Have questions? We'd love to hear from you. Send us a message and we'll respond within 24 hours.",

    ctaTitle: 'Ready to Guard Your Fleet?',
    ctaSubtitle:
      'Join 800+ fleet operators who trust Fleet Guard to manage their vehicles. Start your free trial today!',
    ctaPrimary: 'Start Free Trial →',
    ctaSecondary: 'View Pricing',

    footerDescription:
      'The smart way to manage your vehicle fleet. Track, protect, and grow with confidence.',
    footerMadeIn: 'Made with ❤️ in India',

    stats: [
      { icon: '🚗', value: '15,000+', label: 'Vehicles Managed' },
      { icon: '😊', value: '800+', label: 'Happy Customers' },
      { icon: '💰', value: '₹2 Crore+', label: 'Penalties Saved' },
      { icon: '⚡', value: '99.9%', label: 'Uptime Guarantee' },
    ],

    features: [
      {
        icon: '🏍️',
        title: 'Multi-Vehicle Support',
        description: 'Manage bikes, cars, trucks - all vehicle types in one place',
        image: 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=400&q=80',
      },
      {
        icon: '🔔',
        title: 'Smart Reminders',
        description: 'Never miss insurance, PUC, or service deadlines again',
        image: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400&q=80',
      },
      {
        icon: '📊',
        title: 'Analytics Dashboard',
        description: 'Track expenses, service history, and fleet health',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
      },
      {
        icon: '📄',
        title: 'Document Vault',
        description: 'Store and access all vehicle documents digitally',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80',
      },
      {
        icon: '🔧',
        title: 'Service Tracking',
        description: 'Complete maintenance history at your fingertips',
        image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&q=80',
      },
      {
        icon: '📱',
        title: 'Works Everywhere',
        description: 'Access from phone, tablet, or computer - anytime',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80',
      },
    ],

    brandLogos: [
      {
        name: 'Triumph',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Triumph_Motorcycles_logo.svg/256px-Triumph_Motorcycles_logo.svg.png',
      },
      {
        name: 'Harley-Davidson',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Harley-Davidson_logo.svg/256px-Harley-Davidson_logo.svg.png',
      },
      {
        name: 'Royal Enfield',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d7/Royal_Enfield_logo.svg/256px-Royal_Enfield_logo.svg.png',
      },
      {
        name: 'KTM',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/KTM-Logo.svg/256px-KTM-Logo.svg.png',
      },
      {
        name: 'Toyota',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toyota_carlogo.svg/256px-Toyota_carlogo.svg.png',
      },
      {
        name: 'Mahindra',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Mahindra_%26_Mahindra_Logo.svg/256px-Mahindra_%26_Mahindra_Logo.svg.png',
      },
      {
        name: 'Volvo',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Volvo_iron_mark.svg/256px-Volvo_iron_mark.svg.png',
      },
    ],

    reviews: [
      {
        name: 'Rajesh Kumar',
        role: 'Fleet Owner',
        company: 'Kumar Transport Services',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
        text: 'Fleet Guard has transformed how we manage our 50+ vehicle fleet. The reminders have saved us from countless penalty situations!',
        rating: 5,
      },
      {
        name: 'Priya Sharma',
        role: 'Operations Manager',
        company: 'Swift Bike Rentals',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
        text: 'Managing 30 rental bikes was a nightmare before Fleet Guard. Now everything is organized and automated. Highly recommended!',
        rating: 5,
      },
      {
        name: 'Amit Patel',
        role: 'Business Owner',
        company: 'Patel Logistics',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
        text: 'The analytics feature helps us understand our fleet costs better. We saved ₹2 lakhs in the first year by optimizing maintenance schedules.',
        rating: 5,
      },
      {
        name: 'Sneha Reddy',
        role: 'Founder',
        company: 'EcoRide Rentals',
        location: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
        text: 'As a startup, we needed something simple yet powerful. Fleet Guard is exactly that. The free tier is perfect for small fleets!',
        rating: 5,
      },
    ],

    faqs: [
      {
        question: 'How does Fleet Guard help manage my vehicles?',
        answer:
          'Fleet Guard provides a centralized dashboard to track all your vehicles, their documents, service history, and upcoming renewals. You get smart reminders before any document expires or service is due.',
      },
      {
        question: 'Is my data secure?',
        answer:
          'Absolutely! We use industry-standard encryption and your data is stored securely. You can also export backups anytime for extra peace of mind.',
      },
      {
        question: 'Can I try before I pay?',
        answer:
          'Yes! Our Starter plan is completely free for up to 5 vehicles. No credit card required. You can upgrade anytime as your fleet grows.',
      },
      {
        question: 'Does it work for both personal and commercial vehicles?',
        answer:
          'Yes! Fleet Guard supports both private and commercial vehicles with different document tracking requirements for each type.',
      },
      {
        question: 'Can I import my existing vehicle data?',
        answer:
          'Absolutely! We provide an Excel template that you can fill with your vehicle data and import in bulk. No need to enter everything manually.',
      },
    ],
  },

  heroBackgroundImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1920&h=1080&fit=crop&q=80',
  ctaBackgroundImage: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80',
  showcaseImage1: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&h=500&fit=crop',
  showcaseImage2: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop',
  showcaseImage3: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop',
  showcaseImage4: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=500&fit=crop',
  
  primaryColor: '#f59e0b',
  secondaryColor: '#1f2937',
  accentColor: '#10b981',
  backgroundColor: '#000000',
  textColor: '#ffffff',
  
  googleAnalyticsId: '',
  googleSearchConsoleId: '',
  metaTitle: 'Fleet Guard - Protect Your Fleet | Vehicle Management System',
  metaDescription: 'Manage your vehicle fleet with ease. Track services, documents, and maintenance for cars & bikes. Used by 800+ fleet operators in India.',
  metaKeywords: 'fleet management, vehicle tracking, service reminder, document management, car maintenance, bike maintenance',
  ogImage: '',
  
  facebook: '',
  twitter: '',
  instagram: '',
  linkedin: '',
  youtube: '',
  
  email: 'support@fleetguard.in',
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  address: 'Mumbai, Maharashtra, India',
  
  starterPrice: 0,
  starterVehicles: 5,
  proPrice: 2000,
  proVehicles: 30,
  enterprisePrice: 3500,
  
  showPricing: true,
  showReviews: true,
  showFaq: true,
  showContact: true,
  
  customCss: '',
  headerScripts: '',
  footerScripts: ''
};

interface AdminPanelProps {
  onClose: () => void;
  onSave: (settings: SiteSettings) => void;
  currentSettings: SiteSettings;
}

export function AdminPanel({ onClose, onSave, currentSettings }: AdminPanelProps) {
  const mergedInitial = {
    ...defaultSettings,
    ...(currentSettings || {}),
    homepageContent: {
      ...defaultSettings.homepageContent,
      ...((currentSettings as any)?.homepageContent || {}),
      stats: Array.isArray((currentSettings as any)?.homepageContent?.stats)
        ? (currentSettings as any).homepageContent.stats
        : defaultSettings.homepageContent.stats,
      features: Array.isArray((currentSettings as any)?.homepageContent?.features)
        ? (currentSettings as any).homepageContent.features
        : defaultSettings.homepageContent.features,
      reviews: Array.isArray((currentSettings as any)?.homepageContent?.reviews)
        ? (currentSettings as any).homepageContent.reviews
        : defaultSettings.homepageContent.reviews,
      faqs: Array.isArray((currentSettings as any)?.homepageContent?.faqs)
        ? (currentSettings as any).homepageContent.faqs
        : defaultSettings.homepageContent.faqs,
      brandLogos: Array.isArray((currentSettings as any)?.homepageContent?.brandLogos)
        ? (currentSettings as any).homepageContent.brandLogos
        : defaultSettings.homepageContent.brandLogos,
    },
  } as SiteSettings;

  const [settings, setSettings] = useState<SiteSettings>(mergedInitial);
  const [activeTab, setActiveTab] = useState<'branding' | 'content' | 'users' | 'payments' | 'seo' | 'analytics' | 'social' | 'contact' | 'pricing' | 'sections' | 'advanced'>('branding');
  const [saved, setSaved] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Payments UI state
  const [payPlan, setPayPlan] = useState<'professional' | 'enterprise'>('professional');
  const [payEmail, setPayEmail] = useState('');
  const [payStatus, setPayStatus] = useState<string>('');
  const [payLoading, setPayLoading] = useState(false);

  const handleSave = () => {
    onSave(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      setSettings(defaultSettings);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportName = `fleetguard-settings-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          setSettings({ ...defaultSettings, ...imported });
          alert('Settings imported successfully!');
        } catch {
          alert('Invalid settings file');
        }
      };
      reader.readAsText(file);
    }
  };

  const [users, setUsers] = useState<User[]>([]);
  const [usersError, setUsersError] = useState<string>('');
  const [usersLoading, setUsersLoading] = useState(false);

  const loadUsers = async () => {
    setUsersError('');
    setUsersLoading(true);

    // Try Supabase-backed profiles first via API (preferred for security)
    try {
      const resp = await fetch('/api/admin/users', {
        headers: {
          // Used by the serverless endpoint as a simple admin guard.
          // (In production you should validate JWT instead.)
          'x-admin-email': localStorage.getItem('fleet_current_user') ? (JSON.parse(localStorage.getItem('fleet_current_user') as string).email || '') : ''
        }
      });
      if (resp.ok) {
        const payload = await resp.json();
        if (Array.isArray(payload.users)) {
          setUsers(payload.users);
          setUsersLoading(false);
          return;
        }
      }
    } catch {
      // ignore
    }

    // Fallback: read localStorage demo users
    try {
      const usersJson = localStorage.getItem('fleet_users');
      if (usersJson) {
        const local = JSON.parse(usersJson);
        setUsers(Array.isArray(local) ? local : []);
      } else {
        setUsers([]);
      }
      setUsersError('Showing local users only (Supabase Admin API not configured).');
    } catch (e) {
      console.error('Error loading users:', e);
      setUsersError('Failed to load users list.');
      setUsers([]);
    }

    setUsersLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const tabs = [
    { id: 'branding', label: 'Branding', icon: '🎨' },
    { id: 'content', label: 'Homepage Text', icon: '✍️' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'social', label: 'Social Media', icon: '📱' },
    { id: 'contact', label: 'Contact', icon: '📞' },
    { id: 'pricing', label: 'Pricing', icon: '💰' },
    { id: 'sections', label: 'Sections', icon: '📋' },
    { id: 'advanced', label: 'Advanced', icon: '⚙️' }
  ];

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
            <span className="text-xl">🛡️</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Fleet Guard Admin</h1>
            <p className="text-xs text-gray-400">Website Settings & Configuration</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-green-400 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved!
            </span>
          )}
          
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              previewMode 
                ? 'bg-amber-500 text-black' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {previewMode ? '👁️ Preview On' : '👁️ Preview'}
          </button>
          
          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-medium hover:from-green-600 hover:to-emerald-700 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Changes
          </button>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-60px)]">
        {/* Sidebar */}
        <div className="w-56 bg-gray-900 border-r border-gray-800 p-4">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
          
          <div className="mt-8 pt-4 border-t border-gray-800 space-y-2">
            <button
              onClick={handleExport}
              className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Export Settings
            </button>
            
            <label className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg text-sm transition-colors cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Import Settings
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
            
            <button
              onClick={handleReset}
              className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset to Defaults
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-950">
          {/* Branding Tab */}
          {activeTab === 'branding' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Branding</h2>
                <p className="text-gray-400 text-sm">Customize your website's brand identity</p>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-6">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span className="text-amber-400">📝</span> Site Information
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Site Name</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Fleet Guard"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tagline</label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => setSettings({...settings, tagline: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Protect Your Fleet"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Logo URL</label>
                  <input
                    type="text"
                    value={settings.logo}
                    onChange={(e) => setSettings({...settings, logo: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="https://example.com/logo.png"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty to use default icon</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Font Family</label>
                    <select
                      value={settings.fontFamily}
                      onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value as SiteSettings['fontFamily'] })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="System">System</option>
                      <option value="Inter">Inter</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Montserrat">Montserrat</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Font is applied across the homepage and app UI.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Favicon URL</label>
                    <input
                      type="text"
                      value={settings.favicon}
                      onChange={(e) => setSettings({...settings, favicon: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="https://example.com/favicon.png"
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional. Leave blank to use default.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-6">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span className="text-amber-400">🖼️</span> Homepage Images (URLs)
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Hero Background Image</label>
                  <input
                    type="text"
                    value={settings.heroBackgroundImage}
                    onChange={(e) => setSettings({...settings, heroBackgroundImage: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">CTA Background Image</label>
                  <input
                    type="text"
                    value={settings.ctaBackgroundImage}
                    onChange={(e) => setSettings({...settings, ctaBackgroundImage: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Showcase Image 1</label>
                    <input
                      type="text"
                      value={settings.showcaseImage1}
                      onChange={(e) => setSettings({...settings, showcaseImage1: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Showcase Image 2</label>
                    <input
                      type="text"
                      value={settings.showcaseImage2}
                      onChange={(e) => setSettings({...settings, showcaseImage2: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Showcase Image 3</label>
                    <input
                      type="text"
                      value={settings.showcaseImage3}
                      onChange={(e) => setSettings({...settings, showcaseImage3: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Showcase Image 4</label>
                    <input
                      type="text"
                      value={settings.showcaseImage4}
                      onChange={(e) => setSettings({...settings, showcaseImage4: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500">Tip: Use direct image URLs. Unsplash links work well. After saving, refresh the homepage to see updates.</p>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-6">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span className="text-amber-400">🎨</span> Color Scheme
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Primary Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                        className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-700"
                      />
                      <input
                        type="text"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Secondary Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                        className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-700"
                      />
                      <input
                        type="text"
                        value={settings.secondaryColor}
                        onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Accent Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.accentColor}
                        onChange={(e) => setSettings({...settings, accentColor: e.target.value})}
                        className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-700"
                      />
                      <input
                        type="text"
                        value={settings.accentColor}
                        onChange={(e) => setSettings({...settings, accentColor: e.target.value})}
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Background Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.backgroundColor}
                        onChange={(e) => setSettings({...settings, backgroundColor: e.target.value})}
                        className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-700"
                      />
                      <input
                        type="text"
                        value={settings.backgroundColor}
                        onChange={(e) => setSettings({...settings, backgroundColor: e.target.value})}
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Text Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.textColor}
                        onChange={(e) => setSettings({...settings, textColor: e.target.value})}
                        className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-700"
                      />
                      <input
                        type="text"
                        value={settings.textColor}
                        onChange={(e) => setSettings({...settings, textColor: e.target.value})}
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-4 p-4 rounded-lg border border-gray-700" style={{ backgroundColor: settings.backgroundColor }}>
                  <p className="text-sm mb-2" style={{ color: settings.textColor }}>Preview:</p>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded text-sm font-medium text-black" style={{ backgroundColor: settings.primaryColor }}>Primary</span>
                    <span className="px-3 py-1 rounded text-sm font-medium text-white" style={{ backgroundColor: settings.secondaryColor }}>Secondary</span>
                    <span className="px-3 py-1 rounded text-sm font-medium text-white" style={{ backgroundColor: settings.accentColor }}>Accent</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Homepage Text Tab */}
          {activeTab === 'content' && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Homepage Text</h2>
                <p className="text-gray-400 text-sm">Edit the text and content shown on the public homepage</p>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-6">
                <h3 className="font-semibold text-white">Navigation</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'navHome', label: 'Home' },
                    { key: 'navFeatures', label: 'Features' },
                    { key: 'navHowItWorks', label: 'How It Works' },
                    { key: 'navPricing', label: 'Pricing' },
                    { key: 'navReviews', label: 'Reviews' },
                    { key: 'navFaq', label: 'FAQ' },
                    { key: 'navContact', label: 'Contact' },
                    { key: 'navLoginCta', label: 'Login button' },
                    { key: 'navStartCta', label: 'Start button' },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{f.label}</label>
                      <input
                        value={(settings.homepageContent as any)[f.key] || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            homepageContent: { ...settings.homepageContent, [f.key]: e.target.value },
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-6">
                <h3 className="font-semibold text-white">Hero</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Trust badge</label>
                  <input
                    value={settings.homepageContent.trustBadge}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        homepageContent: { ...settings.homepageContent, trustBadge: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Title line 1</label>
                    <input
                      value={settings.homepageContent.heroTitleLine1}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          homepageContent: { ...settings.homepageContent, heroTitleLine1: e.target.value },
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Title line 2</label>
                    <input
                      value={settings.homepageContent.heroTitleLine2}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          homepageContent: { ...settings.homepageContent, heroTitleLine2: e.target.value },
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subtitle</label>
                  <textarea
                    value={settings.homepageContent.heroSubtitle}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        homepageContent: { ...settings.homepageContent, heroSubtitle: e.target.value },
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Primary CTA</label>
                    <input
                      value={settings.homepageContent.heroPrimaryCta}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          homepageContent: { ...settings.homepageContent, heroPrimaryCta: e.target.value },
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Secondary CTA</label>
                    <input
                      value={settings.homepageContent.heroSecondaryCta}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          homepageContent: { ...settings.homepageContent, heroSecondaryCta: e.target.value },
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Scroll hint</label>
                  <input
                    value={settings.homepageContent.heroScrollHint}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        homepageContent: { ...settings.homepageContent, heroScrollHint: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-6">
                <h3 className="font-semibold text-white">Section headings</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'featuresBadge', label: 'Features badge' },
                    { key: 'featuresTitleLine1', label: 'Features title line 1' },
                    { key: 'featuresTitleLine2', label: 'Features title line 2' },
                    { key: 'featuresSubtitle', label: 'Features subtitle' },
                    { key: 'howItWorksBadge', label: 'How It Works badge' },
                    { key: 'howItWorksTitle', label: 'How It Works title' },
                    { key: 'howItWorksSubtitle', label: 'How It Works subtitle' },
                    { key: 'pricingBadge', label: 'Pricing badge' },
                    { key: 'pricingTitle', label: 'Pricing title' },
                    { key: 'pricingSubtitle', label: 'Pricing subtitle' },
                    { key: 'reviewsBadge', label: 'Reviews badge' },
                    { key: 'reviewsTitle', label: 'Reviews title' },
                    { key: 'reviewsSubtitle', label: 'Reviews subtitle' },
                    { key: 'faqBadge', label: 'FAQ badge' },
                    { key: 'faqTitle', label: 'FAQ title' },
                    { key: 'contactBadge', label: 'Contact badge' },
                    { key: 'contactTitle', label: 'Contact title' },
                    { key: 'contactSubtitle', label: 'Contact subtitle' },
                    { key: 'ctaTitle', label: 'CTA title' },
                    { key: 'ctaSubtitle', label: 'CTA subtitle' },
                    { key: 'ctaPrimary', label: 'CTA primary button' },
                    { key: 'ctaSecondary', label: 'CTA secondary button' },
                    { key: 'footerDescription', label: 'Footer description' },
                    { key: 'footerMadeIn', label: 'Footer "Made in"' },
                  ].map((f) => (
                    <div key={f.key} className={f.key.includes('Subtitle') || f.key.includes('Description') ? 'col-span-2' : ''}>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{f.label}</label>
                      {f.key.includes('Subtitle') || f.key.includes('Description') ? (
                        <textarea
                          value={(settings.homepageContent as any)[f.key] || ''}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              homepageContent: { ...settings.homepageContent, [f.key]: e.target.value },
                            })
                          }
                          rows={2}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white resize-none"
                        />
                      ) : (
                        <input
                          value={(settings.homepageContent as any)[f.key] || ''}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              homepageContent: { ...settings.homepageContent, [f.key]: e.target.value },
                            })
                          }
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">Stats (Hero)</h3>
                  <button
                    onClick={() =>
                      setSettings({
                        ...settings,
                        homepageContent: {
                          ...settings.homepageContent,
                          stats: [
                            ...settings.homepageContent.stats,
                            { icon: '⭐', value: '1+', label: 'New stat' },
                          ],
                        },
                      })
                    }
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm"
                  >
                    + Add Stat
                  </button>
                </div>
                <div className="space-y-3">
                  {settings.homepageContent.stats.map((s, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-3 items-center bg-gray-800/50 p-3 rounded-xl border border-gray-700">
                      <input
                        className="col-span-2 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                        value={s.icon}
                        onChange={(e) => {
                          const next = [...settings.homepageContent.stats];
                          next[idx] = { ...next[idx], icon: e.target.value };
                          setSettings({ ...settings, homepageContent: { ...settings.homepageContent, stats: next } });
                        }}
                        placeholder="Icon"
                      />
                      <input
                        className="col-span-3 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                        value={s.value}
                        onChange={(e) => {
                          const next = [...settings.homepageContent.stats];
                          next[idx] = { ...next[idx], value: e.target.value };
                          setSettings({ ...settings, homepageContent: { ...settings.homepageContent, stats: next } });
                        }}
                        placeholder="Value"
                      />
                      <input
                        className="col-span-6 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                        value={s.label}
                        onChange={(e) => {
                          const next = [...settings.homepageContent.stats];
                          next[idx] = { ...next[idx], label: e.target.value };
                          setSettings({ ...settings, homepageContent: { ...settings.homepageContent, stats: next } });
                        }}
                        placeholder="Label"
                      />
                      <button
                        onClick={() => {
                          const next = settings.homepageContent.stats.filter((_, i) => i !== idx);
                          setSettings({ ...settings, homepageContent: { ...settings.homepageContent, stats: next } });
                        }}
                        className="col-span-1 px-2 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">Brand Logos</h3>
                  <button
                    onClick={() =>
                      setSettings({
                        ...settings,
                        homepageContent: {
                          ...settings.homepageContent,
                          brandLogos: [
                            ...(settings.homepageContent.brandLogos || []),
                            { name: 'New Brand', logoUrl: '' },
                          ],
                        },
                      })
                    }
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm"
                  >
                    + Add Logo
                  </button>
                </div>

                <p className="text-sm text-gray-400">
                  These logos appear on the homepage under “Trusted by fleet operators managing these brands”. Use direct image URLs (PNG/SVG).
                </p>

                <div className="space-y-3">
                  {(settings.homepageContent.brandLogos || []).map((b, idx) => (
                    <div key={idx} className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 space-y-3">
                      <div className="grid grid-cols-12 gap-3 items-center">
                        <div className="col-span-3">
                          <label className="block text-xs text-gray-400 mb-1">Brand Name</label>
                          <input
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                            value={b.name}
                            onChange={(e) => {
                              const next = [...(settings.homepageContent.brandLogos || [])];
                              next[idx] = { ...next[idx], name: e.target.value };
                              setSettings({
                                ...settings,
                                homepageContent: { ...settings.homepageContent, brandLogos: next },
                              });
                            }}
                            placeholder="Triumph"
                          />
                        </div>
                        <div className="col-span-8">
                          <label className="block text-xs text-gray-400 mb-1">Logo URL</label>
                          <input
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                            value={b.logoUrl}
                            onChange={(e) => {
                              const next = [...(settings.homepageContent.brandLogos || [])];
                              next[idx] = { ...next[idx], logoUrl: e.target.value };
                              setSettings({
                                ...settings,
                                homepageContent: { ...settings.homepageContent, brandLogos: next },
                              });
                            }}
                            placeholder="https://.../logo.png"
                          />
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <button
                            onClick={() => {
                              const next = (settings.homepageContent.brandLogos || []).filter((_, i) => i !== idx);
                              setSettings({
                                ...settings,
                                homepageContent: { ...settings.homepageContent, brandLogos: next },
                              });
                            }}
                            className="px-2 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-28 h-10 bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                          {b.logoUrl ? (
                            <img src={b.logoUrl} alt={b.name} className="max-h-full max-w-full object-contain" />
                          ) : (
                            <span className="text-xs text-gray-600">Preview</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          Tip: SVG/PNG works best. If you use Wikipedia URLs, prefer direct image URLs.
                        </div>
                      </div>
                    </div>
                  ))}

                  {(settings.homepageContent.brandLogos || []).length === 0 && (
                    <div className="text-sm text-gray-500 bg-gray-800/40 border border-gray-700 rounded-xl p-4">
                      No brand logos yet. Click “Add Logo”.
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">Features</h3>
                  <button
                    onClick={() =>
                      setSettings({
                        ...settings,
                        homepageContent: {
                          ...settings.homepageContent,
                          features: [
                            ...settings.homepageContent.features,
                            { icon: '✨', title: 'New feature', description: 'Describe it...', image: '' },
                          ],
                        },
                      })
                    }
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm"
                  >
                    + Add Feature
                  </button>
                </div>
                <div className="space-y-3">
                  {settings.homepageContent.features.map((f, idx) => (
                    <div key={idx} className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 space-y-3">
                      <div className="grid grid-cols-12 gap-3 items-center">
                        <input
                          className="col-span-2 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                          value={f.icon}
                          onChange={(e) => {
                            const next = [...settings.homepageContent.features];
                            next[idx] = { ...next[idx], icon: e.target.value };
                            setSettings({ ...settings, homepageContent: { ...settings.homepageContent, features: next } });
                          }}
                          placeholder="Icon"
                        />
                        <input
                          className="col-span-9 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                          value={f.title}
                          onChange={(e) => {
                            const next = [...settings.homepageContent.features];
                            next[idx] = { ...next[idx], title: e.target.value };
                            setSettings({ ...settings, homepageContent: { ...settings.homepageContent, features: next } });
                          }}
                          placeholder="Title"
                        />
                        <button
                          onClick={() => {
                            const next = settings.homepageContent.features.filter((_, i) => i !== idx);
                            setSettings({ ...settings, homepageContent: { ...settings.homepageContent, features: next } });
                          }}
                          className="col-span-1 px-2 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg"
                          title="Remove"
                        >
                          ✕
                        </button>
                      </div>
                      <textarea
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white resize-none"
                        rows={2}
                        value={f.description}
                        onChange={(e) => {
                          const next = [...settings.homepageContent.features];
                          next[idx] = { ...next[idx], description: e.target.value };
                          setSettings({ ...settings, homepageContent: { ...settings.homepageContent, features: next } });
                        }}
                        placeholder="Description"
                      />
                      <input
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                        value={f.image}
                        onChange={(e) => {
                          const next = [...settings.homepageContent.features];
                          next[idx] = { ...next[idx], image: e.target.value };
                          setSettings({ ...settings, homepageContent: { ...settings.homepageContent, features: next } });
                        }}
                        placeholder="Image URL"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">Reviews</h3>
                  <button
                    onClick={() =>
                      setSettings({
                        ...settings,
                        homepageContent: {
                          ...settings.homepageContent,
                          reviews: [
                            ...settings.homepageContent.reviews,
                            {
                              name: 'New Customer',
                              role: 'Owner',
                              company: '',
                              location: '',
                              image: '',
                              text: 'Great app!',
                              rating: 5,
                            },
                          ],
                        },
                      })
                    }
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm"
                  >
                    + Add Review
                  </button>
                </div>
                <div className="space-y-3">
                  {settings.homepageContent.reviews.map((r, idx) => (
                    <div key={idx} className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { key: 'name', label: 'Name' },
                          { key: 'role', label: 'Role' },
                          { key: 'company', label: 'Company' },
                          { key: 'location', label: 'Location' },
                        ].map((f) => (
                          <div key={f.key}>
                            <label className="block text-xs text-gray-400 mb-1">{f.label}</label>
                            <input
                              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                              value={(r as any)[f.key]}
                              onChange={(e) => {
                                const next = [...settings.homepageContent.reviews];
                                next[idx] = { ...next[idx], [f.key]: e.target.value } as any;
                                setSettings({ ...settings, homepageContent: { ...settings.homepageContent, reviews: next } });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Image URL</label>
                          <input
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                            value={r.image}
                            onChange={(e) => {
                              const next = [...settings.homepageContent.reviews];
                              next[idx] = { ...next[idx], image: e.target.value };
                              setSettings({ ...settings, homepageContent: { ...settings.homepageContent, reviews: next } });
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Rating (1-5)</label>
                          <input
                            type="number"
                            min={1}
                            max={5}
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                            value={r.rating}
                            onChange={(e) => {
                              const next = [...settings.homepageContent.reviews];
                              next[idx] = { ...next[idx], rating: Math.max(1, Math.min(5, Number(e.target.value) || 5)) };
                              setSettings({ ...settings, homepageContent: { ...settings.homepageContent, reviews: next } });
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Review text</label>
                        <textarea
                          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white resize-none"
                          rows={2}
                          value={r.text}
                          onChange={(e) => {
                            const next = [...settings.homepageContent.reviews];
                            next[idx] = { ...next[idx], text: e.target.value };
                            setSettings({ ...settings, homepageContent: { ...settings.homepageContent, reviews: next } });
                          }}
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            const next = settings.homepageContent.reviews.filter((_, i) => i !== idx);
                            setSettings({ ...settings, homepageContent: { ...settings.homepageContent, reviews: next } });
                          }}
                          className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg text-sm"
                        >
                          Remove review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">FAQs</h3>
                  <button
                    onClick={() =>
                      setSettings({
                        ...settings,
                        homepageContent: {
                          ...settings.homepageContent,
                          faqs: [...settings.homepageContent.faqs, { question: 'New question?', answer: 'Answer...' }],
                        },
                      })
                    }
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm"
                  >
                    + Add FAQ
                  </button>
                </div>
                <div className="space-y-3">
                  {settings.homepageContent.faqs.map((fq, idx) => (
                    <div key={idx} className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 space-y-3">
                      <input
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                        value={fq.question}
                        onChange={(e) => {
                          const next = [...settings.homepageContent.faqs];
                          next[idx] = { ...next[idx], question: e.target.value };
                          setSettings({ ...settings, homepageContent: { ...settings.homepageContent, faqs: next } });
                        }}
                        placeholder="Question"
                      />
                      <textarea
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white resize-none"
                        rows={2}
                        value={fq.answer}
                        onChange={(e) => {
                          const next = [...settings.homepageContent.faqs];
                          next[idx] = { ...next[idx], answer: e.target.value };
                          setSettings({ ...settings, homepageContent: { ...settings.homepageContent, faqs: next } });
                        }}
                        placeholder="Answer"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            const next = settings.homepageContent.faqs.filter((_, i) => i !== idx);
                            setSettings({ ...settings, homepageContent: { ...settings.homepageContent, faqs: next } });
                          }}
                          className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg text-sm"
                        >
                          Remove FAQ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-sm text-gray-300">
                Tip: Click <strong>Save Changes</strong> in the header to apply these updates to the live homepage.
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Registered Users</h2>
                <p className="text-gray-400 text-sm">View all users who have signed up for Fleet Guard</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl p-4 border border-blue-500/30">
                  <p className="text-blue-400 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-white">{users.length}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl p-4 border border-green-500/30">
                  <p className="text-green-400 text-sm">Starter Plan</p>
                  <p className="text-3xl font-bold text-white">{users.filter(u => !u.plan || u.plan === 'starter').length}</p>
                </div>
                <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl p-4 border border-amber-500/30">
                  <p className="text-amber-400 text-sm">Professional</p>
                  <p className="text-3xl font-bold text-white">{users.filter(u => u.plan === 'professional').length}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl p-4 border border-purple-500/30">
                  <p className="text-purple-400 text-sm">Enterprise</p>
                  <p className="text-3xl font-bold text-white">{users.filter(u => u.plan === 'enterprise').length}</p>
                </div>
              </div>

              {/* Info Banner */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">ℹ️</span>
                  <div>
                    <h4 className="font-semibold text-amber-400">Users Source</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      This page tries to load users from a secure server endpoint (<code className="text-amber-300">/api/admin/users</code>). If not configured, it falls back to showing local demo users.
                    </p>
                    {usersError && (
                      <p className="text-sm text-amber-200 mt-2">
                        {usersError}
                      </p>
                    )}
                    <p className="text-sm text-gray-400 mt-2">
                      To enable global users list with Supabase, add a Vercel Serverless Function and set <code className="text-amber-300">SUPABASE_SERVICE_ROLE_KEY</code>.
                    </p>
                  </div>
                </div>
              </div>

              {usersLoading && (
                <div className="text-sm text-gray-400">Loading users…</div>
              )}

              {/* Users Table */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                  <h3 className="font-semibold text-white">User List ({users.length})</h3>
                  <button
                    onClick={loadUsers}
                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
                  >
                    🔄 Refresh
                  </button>
                </div>
                
                {users.length === 0 ? (
                  <div className="p-8 text-center">
                    <span className="text-4xl">👥</span>
                    <p className="text-gray-400 mt-2">No users registered yet</p>
                    <p className="text-gray-500 text-sm mt-1">Users will appear here after they sign up</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-800/50">
                        <tr>
                          <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">USER</th>
                          <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">EMAIL</th>
                          <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">PHONE</th>
                          <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">COMPANY</th>
                          <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">PLAN</th>
                          <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">JOINED</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {users.map((user, idx) => (
                          <tr key={user.id || idx} className="hover:bg-gray-800/50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                                  {(user.name || user.email || '?')[0].toUpperCase()}
                                </div>
                                <span className="text-white font-medium">{user.name || 'Unknown'}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-400 text-sm">{user.email || '-'}</td>
                            <td className="px-4 py-3 text-gray-400 text-sm">{user.phone || '-'}</td>
                            <td className="px-4 py-3 text-gray-400 text-sm">{user.companyName || '-'}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                user.plan === 'enterprise' ? 'bg-purple-500/20 text-purple-400' :
                                user.plan === 'professional' ? 'bg-amber-500/20 text-amber-400' :
                                'bg-gray-700 text-gray-400'
                              }`}>
                                {user.plan || 'Starter'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-500 text-sm">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="max-w-3xl space-y-6">
              {/* Test Checkout */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">Test Razorpay Checkout</h3>
                    <p className="text-sm text-gray-400">Creates a Razorpay order using your Vercel backend and opens checkout (UPI supported).</p>
                  </div>
                  <span className="text-xs text-gray-500">Server: /api/payments/*</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Plan</label>
                    <select
                      value={payPlan}
                      onChange={(e) => setPayPlan(e.target.value as any)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    >
                      <option value="professional">Professional (₹{settings.proPrice}/year)</option>
                      <option value="enterprise">Enterprise (₹{settings.enterprisePrice}/year)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Customer Email (optional)</label>
                    <input
                      value={payEmail}
                      onChange={(e) => setPayEmail(e.target.value)}
                      placeholder="customer@email.com"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                </div>

                {payStatus && (
                  <div className="text-sm text-amber-200 bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3">
                    {payStatus}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    disabled={payLoading}
                    onClick={async () => {
                      setPayStatus('');
                      setPayLoading(true);
                      try {
                        // 1) Create order on server
                        const resp = await fetch('/api/payments/create-order', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ plan: payPlan, email: payEmail }),
                        });
                        const payload = await resp.json();
                        if (!resp.ok) {
                          throw new Error(payload?.error || 'Failed to create order');
                        }

                        // 2) Load Razorpay checkout script
                        await new Promise<void>((resolve, reject) => {
                          const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
                          if (existing) return resolve();
                          const s = document.createElement('script');
                          s.src = 'https://checkout.razorpay.com/v1/checkout.js';
                          s.onload = () => resolve();
                          s.onerror = () => reject(new Error('Failed to load Razorpay script'));
                          document.body.appendChild(s);
                        });

                        // 3) Open checkout
                        const options: any = {
                          key: payload.keyId,
                          amount: payload.amount,
                          currency: payload.currency,
                          order_id: payload.orderId,
                          name: settings.siteName,
                          description: `Fleet Guard subscription: ${payload.plan}`,
                          prefill: {
                            email: payEmail || undefined,
                          },
                          theme: {
                            color: settings.primaryColor,
                          },
                          handler: async (response: any) => {
                            try {
                              setPayStatus('Verifying payment…');
                              const vr = await fetch('/api/payments/verify', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(response),
                              });
                              const vj = await vr.json();
                              if (!vr.ok || !vj.verified) {
                                throw new Error(vj?.error || 'Verification failed');
                              }
                              setPayStatus('✅ Payment verified. Next step: store subscription in DB.');
                            } catch (e: any) {
                              setPayStatus(`❌ Verification failed: ${e?.message || 'Unknown error'}`);
                            }
                          },
                        };

                        // @ts-ignore
                        const rz = new (window as any).Razorpay(options);
                        rz.on('payment.failed', (resp: any) => {
                          setPayStatus(`❌ Payment failed: ${resp?.error?.description || 'Unknown error'}`);
                        });
                        rz.open();
                      } catch (e: any) {
                        setPayStatus(`❌ ${e?.message || 'Payment init failed'}`);
                      } finally {
                        setPayLoading(false);
                      }
                    }}
                    className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all disabled:opacity-50"
                  >
                    {payLoading ? 'Working…' : 'Run Test Checkout'}
                  </button>

                  <div className="text-xs text-gray-500">
                    Requires Vercel env vars: <code className="text-amber-300">RAZORPAY_KEY_ID</code>, <code className="text-amber-300">RAZORPAY_KEY_SECRET</code>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Payment Gateway</h2>
                <p className="text-gray-400 text-sm">Configure payment methods for subscriptions</p>
              </div>

              {/* Info Banner */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">ℹ️</span>
                  <div>
                    <h4 className="font-semibold text-blue-400">Payment Integration</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      To enable payments, you need to integrate a payment gateway. We recommend <strong className="text-blue-400">Razorpay</strong> for Indian businesses (supports UPI, Cards, Netbanking).
                    </p>
                  </div>
                </div>
              </div>

              {/* Razorpay Setup */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <span className="text-2xl">💳</span> Razorpay
                  </h3>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-amber-500/20 text-amber-400">
                    Recommended
                  </span>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-white mb-3">Setup Steps:</h4>
                  <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
                    <li>Go to <a href="https://razorpay.com" target="_blank" rel="noopener" className="text-amber-400 hover:underline">razorpay.com</a> and create a business account</li>
                    <li>Complete KYC verification (takes 1-2 days)</li>
                    <li>Get your API keys from Dashboard → Settings → API Keys</li>
                    <li>Add keys to Vercel Environment Variables:
                      <code className="block mt-1 bg-gray-900 px-2 py-1 rounded text-xs text-green-400">
                        RAZORPAY_KEY_ID=rzp_live_xxxxx<br/>
                        RAZORPAY_KEY_SECRET=xxxxx
                      </code>
                    </li>
                    <li>Create subscription plans in Razorpay Dashboard</li>
                    <li>Contact us to integrate checkout flow</li>
                  </ol>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Razorpay Key ID</label>
                    <input
                      type="text"
                      placeholder="rzp_live_xxxxxxxxxxxxx"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-sm"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Set in Vercel Environment Variables</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                    <div className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-amber-400 text-sm">
                      ⏳ Not Configured
                    </div>
                  </div>
                </div>
              </div>

              {/* UPI */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span className="text-2xl">📱</span> UPI Payments
                </h3>
                <p className="text-sm text-gray-400">
                  UPI is automatically enabled when you integrate Razorpay. Your customers can pay using:
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'Amazon Pay', 'Any UPI App'].map(app => (
                    <span key={app} className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm text-gray-300">
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              {/* Other Gateways */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span className="text-2xl">🌐</span> Other Payment Options
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'Cashfree', status: 'Coming Soon' },
                    { name: 'PayU', status: 'Coming Soon' },
                    { name: 'Stripe', status: 'Coming Soon' },
                    { name: 'PhonePe PG', status: 'Coming Soon' },
                  ].map(gateway => (
                    <div key={gateway.name} className="p-4 bg-gray-800 rounded-lg flex items-center justify-between">
                      <span className="text-white font-medium">{gateway.name}</span>
                      <span className="text-xs text-gray-500">{gateway.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Plans Reference */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span className="text-2xl">💰</span> Current Pricing Plans
                </h3>
                <p className="text-sm text-gray-400">These prices will be used for checkout. Edit in the Pricing tab.</p>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="p-4 bg-gray-800 rounded-lg text-center">
                    <p className="text-gray-400 text-sm">Starter</p>
                    <p className="text-2xl font-bold text-white">₹{settings.starterPrice}</p>
                    <p className="text-gray-500 text-xs">Up to {settings.starterVehicles} vehicles</p>
                  </div>
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
                    <p className="text-amber-400 text-sm">Professional</p>
                    <p className="text-2xl font-bold text-white">₹{settings.proPrice}</p>
                    <p className="text-gray-500 text-xs">Up to {settings.proVehicles} vehicles</p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg text-center">
                    <p className="text-purple-400 text-sm">Enterprise</p>
                    <p className="text-2xl font-bold text-white">₹{settings.enterprisePrice}</p>
                    <p className="text-gray-500 text-xs">Unlimited vehicles</p>
                  </div>
                </div>
              </div>

              {/* Server-side Note */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h4 className="font-semibold text-red-400">Important: Server-Side Required</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Payment processing <strong>requires a backend server</strong> for security. This cannot be done in a pure frontend app.
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      You need to either:
                    </p>
                    <ul className="text-sm text-gray-400 mt-1 list-disc list-inside">
                      <li>Use <strong>Vercel Serverless Functions</strong> (recommended)</li>
                      <li>Or connect to a separate backend API</li>
                    </ul>
                    <p className="text-sm text-gray-400 mt-2">
                      Contact the developer to integrate payments securely.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">SEO Settings</h2>
                <p className="text-gray-400 text-sm">Optimize your website for search engines</p>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-6">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span className="text-amber-400">📄</span> Meta Information
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Meta Title</label>
                  <input
                    type="text"
                    value={settings.metaTitle}
                    onChange={(e) => setSettings({...settings, metaTitle: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Fleet Guard - Protect Your Fleet"
                  />
                  <p className="text-xs text-gray-500 mt-1">{settings.metaTitle.length}/60 characters recommended</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Meta Description</label>
                  <textarea
                    value={settings.metaDescription}
                    onChange={(e) => setSettings({...settings, metaDescription: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                    placeholder="Manage your vehicle fleet with ease..."
                  />
                  <p className="text-xs text-gray-500 mt-1">{settings.metaDescription.length}/160 characters recommended</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Meta Keywords</label>
                  <input
                    type="text"
                    value={settings.metaKeywords}
                    onChange={(e) => setSettings({...settings, metaKeywords: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="fleet management, vehicle tracking, service reminder"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate keywords with commas</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">OG Image URL</label>
                  <input
                    type="text"
                    value={settings.ogImage}
                    onChange={(e) => setSettings({...settings, ogImage: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="https://example.com/og-image.png"
                  />
                  <p className="text-xs text-gray-500 mt-1">Image shown when shared on social media (1200x630px recommended)</p>
                </div>
              </div>

              {/* Google Search Console */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span className="text-amber-400">🔍</span> Google Search Console
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Verification Code</label>
                  <input
                    type="text"
                    value={settings.googleSearchConsoleId}
                    onChange={(e) => setSettings({...settings, googleSearchConsoleId: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-sm"
                    placeholder="google-site-verification=xxxxx"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Get this from <a href="https://search.google.com/search-console" target="_blank" rel="noopener" className="text-amber-400 hover:underline">Google Search Console</a>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Analytics & Tracking</h2>
                <p className="text-gray-400 text-sm">Connect analytics tools to track website performance</p>
              </div>

              {/* Google Analytics */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <span className="text-2xl">📊</span> Google Analytics
                  </h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${settings.googleAnalyticsId ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                    {settings.googleAnalyticsId ? '✓ Connected' : 'Not Connected'}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Measurement ID</label>
                  <input
                    type="text"
                    value={settings.googleAnalyticsId}
                    onChange={(e) => setSettings({...settings, googleAnalyticsId: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono"
                    placeholder="G-XXXXXXXXXX"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Find your ID in <a href="https://analytics.google.com" target="_blank" rel="noopener" className="text-amber-400 hover:underline">Google Analytics</a> → Admin → Data Streams
                  </p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">How to set up:</h4>
                  <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
                    <li>Go to <a href="https://analytics.google.com" target="_blank" rel="noopener" className="text-amber-400 hover:underline">analytics.google.com</a></li>
                    <li>Create a new property for your website</li>
                    <li>Get your Measurement ID (starts with G-)</li>
                    <li>Paste it above and click Save</li>
                  </ol>
                </div>
              </div>

              {/* Facebook Pixel */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <span className="text-2xl">📘</span> Facebook Pixel
                  </h3>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-gray-700 text-gray-400">Coming Soon</span>
                </div>
                <p className="text-sm text-gray-400">Track conversions and create audiences for Facebook ads</p>
              </div>

              {/* Hotjar */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <span className="text-2xl">🔥</span> Hotjar
                  </h3>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-gray-700 text-gray-400">Coming Soon</span>
                </div>
                <p className="text-sm text-gray-400">Heatmaps and session recordings to understand user behavior</p>
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Social Media</h2>
                <p className="text-gray-400 text-sm">Connect your social media profiles</p>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
                {[
                  { key: 'facebook', label: 'Facebook', icon: '📘', placeholder: 'https://facebook.com/fleetguard' },
                  { key: 'twitter', label: 'Twitter / X', icon: '🐦', placeholder: 'https://twitter.com/fleetguard' },
                  { key: 'instagram', label: 'Instagram', icon: '📸', placeholder: 'https://instagram.com/fleetguard' },
                  { key: 'linkedin', label: 'LinkedIn', icon: '💼', placeholder: 'https://linkedin.com/company/fleetguard' },
                  { key: 'youtube', label: 'YouTube', icon: '📺', placeholder: 'https://youtube.com/@fleetguard' },
                ].map(social => (
                  <div key={social.key}>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <span>{social.icon}</span> {social.label}
                    </label>
                    <input
                      type="url"
                      value={(settings as any)[social.key]}
                      onChange={(e) => setSettings({...settings, [social.key]: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder={social.placeholder}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Contact Information</h2>
                <p className="text-gray-400 text-sm">Update your business contact details</p>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">📧 Email</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({...settings, email: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="support@fleetguard.in"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">📞 Phone</label>
                    <input
                      type="tel"
                      value={settings.phone}
                      onChange={(e) => setSettings({...settings, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">💬 WhatsApp</label>
                  <input
                    type="tel"
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({...settings, whatsapp: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">📍 Address</label>
                  <textarea
                    value={settings.address}
                    onChange={(e) => setSettings({...settings, address: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                    placeholder="123 Business Street, Mumbai, Maharashtra, India"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Pricing Plans</h2>
                <p className="text-gray-400 text-sm">Configure your subscription pricing</p>
              </div>

              {/* Starter Plan */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span className="text-green-400">🆓</span> Starter Plan
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Price (₹/year)</label>
                    <input
                      type="number"
                      value={settings.starterPrice}
                      onChange={(e) => setSettings({...settings, starterPrice: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Max Vehicles</label>
                    <input
                      type="number"
                      value={settings.starterVehicles}
                      onChange={(e) => setSettings({...settings, starterVehicles: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Plan */}
              <div className="bg-gray-900 rounded-xl p-6 border border-amber-500/30 space-y-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span className="text-amber-400">⭐</span> Professional Plan
                  <span className="ml-auto text-xs bg-amber-500 text-black px-2 py-0.5 rounded">Most Popular</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Price (₹/year)</label>
                    <input
                      type="number"
                      value={settings.proPrice}
                      onChange={(e) => setSettings({...settings, proPrice: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Max Vehicles</label>
                    <input
                      type="number"
                      value={settings.proVehicles}
                      onChange={(e) => setSettings({...settings, proVehicles: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span className="text-purple-400">🚀</span> Enterprise Plan
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Price (₹/year)</label>
                    <input
                      type="number"
                      value={settings.enterprisePrice}
                      onChange={(e) => setSettings({...settings, enterprisePrice: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Max Vehicles</label>
                    <div className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-400">
                      Unlimited
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sections Tab */}
          {activeTab === 'sections' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Homepage Sections</h2>
                <p className="text-gray-400 text-sm">Toggle visibility of homepage sections</p>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
                {[
                  { key: 'showPricing', label: 'Pricing Section', icon: '💰' },
                  { key: 'showReviews', label: 'Customer Reviews', icon: '⭐' },
                  { key: 'showFaq', label: 'FAQ Section', icon: '❓' },
                  { key: 'showContact', label: 'Contact Form', icon: '📞' },
                ].map(section => (
                  <label key={section.key} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750 transition-colors">
                    <span className="flex items-center gap-3 text-white">
                      <span className="text-xl">{section.icon}</span>
                      {section.label}
                    </span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={(settings as any)[section.key]}
                        onChange={(e) => setSettings({...settings, [section.key]: e.target.checked})}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full transition-colors ${(settings as any)[section.key] ? 'bg-amber-500' : 'bg-gray-600'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${(settings as any)[section.key] ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}></div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Advanced Settings</h2>
                <p className="text-gray-400 text-sm">Custom code and scripts</p>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span className="text-amber-400">📜</span> Header Scripts
                </h3>
                <textarea
                  value={settings.headerScripts}
                  onChange={(e) => setSettings({...settings, headerScripts: e.target.value})}
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-sm resize-none"
                  placeholder="<!-- Add scripts here that go in the <head> section -->"
                />
                <p className="text-xs text-gray-500">Scripts added here will be placed in the &lt;head&gt; section</p>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span className="text-amber-400">📜</span> Footer Scripts
                </h3>
                <textarea
                  value={settings.footerScripts}
                  onChange={(e) => setSettings({...settings, footerScripts: e.target.value})}
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-sm resize-none"
                  placeholder="<!-- Add scripts here that go before </body> -->"
                />
                <p className="text-xs text-gray-500">Scripts added here will be placed before the &lt;/body&gt; tag</p>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span className="text-amber-400">🎨</span> Custom CSS
                </h3>
                <textarea
                  value={settings.customCss}
                  onChange={(e) => setSettings({...settings, customCss: e.target.value})}
                  rows={8}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-sm resize-none"
                  placeholder="/* Add custom CSS styles here */"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
export type { SiteSettings };
