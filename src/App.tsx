import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { ServiceHistory } from './components/ServiceHistory';
import Analytics from './components/Analytics';
import CompanySettings from './components/CompanySettings';
import AuthScreen from './components/AuthScreen';
import { HomePage } from './components/HomePage';
import { AdminPanel, SiteSettings } from './components/AdminPanel';
import { Motorcycle, ServiceRecord, CompanySettings as CompanySettingsType } from './types';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { TermsOfService } from './components/legal/TermsOfService';
import { RefundPolicy } from './components/legal/RefundPolicy';
import { CookiePolicy } from './components/legal/CookiePolicy';
import { loadPublicSiteSettings, savePublicSiteSettings } from './lib/supabaseSiteSettings';

import { loadFleetForCurrentUser, saveFleetForCurrentUser } from './lib/supabaseFleetStore';

const defaultSiteSettings: SiteSettings = {
  siteName: 'Fleet Guard 360 Everywhere',
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
  metaTitle: 'Fleet Guard 360 - Protect Your Fleet | Vehicle Management System',
  metaDescription: 'Manage your vehicle fleet with ease. Track services, documents, and maintenance for cars & bikes.',
  metaKeywords: 'fleet management, vehicle tracking, service reminder',
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

interface User {
  id: string;
  username: string;
  email: string;
  companyName: string;
  phone: string;
}

interface AppData {
  motorcycles: Motorcycle[];
  serviceRecords: ServiceRecord[];
  savedMakes: string[];
  savedModels: { [make: string]: string[] };
  companySettings: CompanySettingsType;
  lastBackup?: string;
}

const defaultData: AppData = {
  motorcycles: [],
  serviceRecords: [],
  savedMakes: ['Honda', 'Yamaha', 'Suzuki', 'Royal Enfield', 'Bajaj', 'TVS', 'KTM', 'Hero'],
  savedModels: {
    'Honda': ['Activa 6G', 'Shine', 'Unicorn', 'CB350', 'Hornet'],
    'Yamaha': ['FZ', 'R15', 'MT15', 'Fascino', 'Ray ZR'],
    'Suzuki': ['Access', 'Gixxer', 'Burgman'],
    'Royal Enfield': ['Classic 350', 'Bullet 350', 'Meteor', 'Hunter 350'],
    'Bajaj': ['Pulsar', 'Avenger', 'Dominar', 'Platina'],
    'TVS': ['Apache', 'Jupiter', 'Ntorq', 'Raider'],
    'KTM': ['Duke 200', 'Duke 390', 'RC 200', 'Adventure 390'],
    'Hero': ['Splendor', 'HF Deluxe', 'Passion', 'Glamour']
  },
  companySettings: {
    companyName: 'Fleet Guard 360',
    tagline: 'Protect Your Fleet',
    logo: '',
    email: '',
    phone: '',
    alternatePhone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gstNumber: '',
    panNumber: '',
    businessRegNumber: '',
    primaryColor: '#F59E0B',
    secondaryColor: '#D97706'
  }
};

type AppView = 'home' | 'auth' | 'dashboard' | 'admin' | 'privacy' | 'terms' | 'refund' | 'cookie';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [data, setData] = useState<AppData>(defaultData);
  const [activeTab, setActiveTab] = useState<'fleet' | 'service' | 'analytics' | 'settings'>('fleet');
  const [isLoading, setIsLoading] = useState(true);
  const [openVehicleId, setOpenVehicleId] = useState<string | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [pendingAdminOpen, setPendingAdminOpen] = useState(false);

  // Helper: hidden admin backend URL
  // Visit /admin in the browser to request backend access (admin-only).

  // Load site settings (local first, then Supabase if configured)
  useEffect(() => {
    const load = async () => {
      // Local cache first (fast)
      try {
        const savedSiteSettings = localStorage.getItem('fleet_site_settings');
        if (savedSiteSettings) {
          setSiteSettings({ ...defaultSiteSettings, ...JSON.parse(savedSiteSettings) });
        }
      } catch (e) {
        console.error('Error loading site settings (local):', e);
      }

      // Supabase public settings (shared for all users)
      if (isSupabaseConfigured) {
        try {
          const remote = await loadPublicSiteSettings();
          if (remote) {
            const merged = { ...defaultSiteSettings, ...remote };
            setSiteSettings(merged);
            localStorage.setItem('fleet_site_settings', JSON.stringify(merged));
          }
        } catch (e) {
          console.warn('Could not load site settings from Supabase. Using local settings.', e);
        }
      }
    };

    load();
  }, []);

  // Apply site settings whenever they change
  useEffect(() => {
    applySiteSettings(siteSettings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteSettings]);

  // Apply site settings to document (CSS + analytics)
  const applySiteSettings = (settings: SiteSettings) => {
    // Apply favicon if provided
    if (settings.favicon) {
      let link = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = settings.favicon;
    }

    // Apply Google Analytics if provided
    if (settings.googleAnalyticsId && !document.querySelector(`script[src*="googletagmanager"]`)) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`;
      document.head.appendChild(script);

      const inlineScript = document.createElement('script');
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${settings.googleAnalyticsId}');
      `;
      document.head.appendChild(inlineScript);
    }

    // Apply custom CSS
    let styleEl = document.getElementById('custom-site-styles');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'custom-site-styles';
      document.head.appendChild(styleEl);
    }
    styleEl.innerHTML = settings.customCss || '';

    // Title/meta
    if (settings.metaTitle) document.title = settings.metaTitle;
  };

  // Save site settings (local + Supabase if configured)
  const handleSaveSiteSettings = async (settings: SiteSettings) => {
    setSiteSettings(settings);
    localStorage.setItem('fleet_site_settings', JSON.stringify(settings));

    applySiteSettings(settings);

    if (isSupabaseConfigured) {
      try {
        await savePublicSiteSettings(settings);
      } catch (e) {
        console.warn('Failed saving site settings to Supabase. Saved locally only.', e);
        // Non-blocking message
        alert('Saved locally, but could not save to Supabase. Please ensure the "site_settings" table exists and RLS policies are correct.');
      }
    }
  };

  // Check if user is admin (simple check - case-insensitive)
  const isAdmin = (() => {
    if (!currentUser) return false;
    const email = (currentUser.email || '').toLowerCase().trim();
    const username = (currentUser.username || '').toLowerCase().trim();

    const envAdminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    return (
      username === 'admin' ||
      envAdminEmails.includes(email) ||
      email === 'admin@fleetguard.in' ||
      email === 'admin@fleetguard.com'
    );
  })();

  // Handle URL routing on load and popstate
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const search = window.location.search;

      // Admin routes
      if (path === '/admin') {
        setShowAdminPanel(true);
        return;
      }

      // Legal pages
      if (path === '/privacy') {
        setCurrentView('privacy');
        return;
      }
      if (path === '/terms') {
        setCurrentView('terms');
        return;
      }
      if (path === '/refund') {
        setCurrentView('refund');
        return;
      }
      if (path === '/cookie' || path === '/cookies') {
        setCurrentView('cookie');
        return;
      }

      // Default to home if no other route matches
      if (path === '/') {
        setCurrentView('home');
      }
    };

    window.addEventListener('popstate', handleLocationChange);

    // Check initial route
    handleLocationChange();

    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo(0, 0);

    // Update URL history
    const path = view === 'home' ? '/' : `/${view}`;
    window.history.pushState({ view }, '', path);
  };

  // Check for existing session + route (supports hidden /admin backend entry)
  useEffect(() => {
    let unsub: { data?: { subscription?: { unsubscribe?: () => void } } } | null = null;

    const applyRoute = (user: User | null) => {
      const path = window.location.pathname;

      // Check for legal pages
      if (path === '/privacy') {
        setCurrentView('privacy');
        return;
      }
      if (path === '/terms') {
        setCurrentView('terms');
        return;
      }
      if (path === '/refund') {
        setCurrentView('refund');
        return;
      }
      if (path === '/cookie') {
        setCurrentView('cookie');
        return;
      }

      const wantsAdmin = path === '/admin' || path.startsWith('/admin/');

      if (!wantsAdmin) return;

      // If user is already admin, open backend directly
      if (isAdminUser(user)) {
        setCurrentView('dashboard');
        setShowAdminPanel(true);
        setPendingAdminOpen(false);
        return;
      }

      // Otherwise require login; if they login as admin, backend will open
      setPendingAdminOpen(true);
      setAuthMode('login');
      setCurrentView('auth');
    };

    const userFromSupabaseSession = async (): Promise<User | null> => {
      if (!isSupabaseConfigured || !supabase) return null;
      const { data: sessionData } = await supabase.auth.getSession();
      const u = sessionData.session?.user;
      if (!u) return null;
      const meta = (u.user_metadata || {}) as Record<string, unknown>;
      return {
        id: u.id,
        username: String(meta.name || u.email || 'User'),
        email: u.email || String(meta.email || ''),
        companyName: String(meta.companyName || ''),
        phone: String(meta.phone || ''),
      };
    };

    const init = async () => {
      try {
        // IMPORTANT: If Supabase is configured, we must require a real Supabase session.
        // Otherwise the UI may appear logged-in but saves will never reach Supabase.
        if (isSupabaseConfigured && supabase) {
          const supaUser = await userFromSupabaseSession();
          if (supaUser) {
            setCurrentUser(supaUser);
            localStorage.setItem('fleet_current_user', JSON.stringify(supaUser));
            setCurrentView('dashboard');
            applyRoute(supaUser);
          } else {
            localStorage.removeItem('fleet_current_user');
            setCurrentUser(null);
            applyRoute(null);
            // If user was trying to access /admin, route handler will move to auth.
            if (window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/')) {
              setPendingAdminOpen(true);
              setAuthMode('login');
              setCurrentView('auth');
            }
          }
        } else {
          // Local-only mode
          const savedUser = localStorage.getItem('fleet_current_user');
          if (savedUser) {
            const user = JSON.parse(savedUser);
            setCurrentUser(user);
            setCurrentView('dashboard');
            applyRoute(user);
          } else {
            applyRoute(null);
          }
        }
      } catch (e) {
        console.error('Error loading user session:', e);
        applyRoute(null);
      }

      // Keep UI in sync with Supabase auth changes (sign-in/sign-out)
      if (isSupabaseConfigured && supabase) {
        unsub = supabase.auth.onAuthStateChange(async (_event, session) => {
          const u = session?.user;
          if (!u) {
            localStorage.removeItem('fleet_current_user');
            setCurrentUser(null);
            setShowAdminPanel(false);
            setCurrentView('home');
            return;
          }
          const meta = (u.user_metadata || {}) as Record<string, unknown>;
          const nextUser: User = {
            id: u.id,
            username: String(meta.name || u.email || 'User'),
            email: u.email || '',
            companyName: String(meta.companyName || ''),
            phone: String(meta.phone || ''),
          };
          localStorage.setItem('fleet_current_user', JSON.stringify(nextUser));
          setCurrentUser(nextUser);
          setCurrentView('dashboard');
        });
      }

      setIsLoading(false);
    };

    init();

    const onPopState = () => {
      applyRoute(currentUser);
    };
    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
      unsub?.data?.subscription?.unsubscribe?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load data (local first, then Supabase per-user if configured and logged in)
  useEffect(() => {
    const load = async () => {
      // Local cache first
      try {
        const saved = localStorage.getItem('motorcycle_fleet_data');
        if (saved) {
          const parsed = JSON.parse(saved);
          setData({
            ...defaultData,
            ...parsed,
            motorcycles: Array.isArray(parsed.motorcycles) ? parsed.motorcycles : [],
            serviceRecords: Array.isArray(parsed.serviceRecords) ? parsed.serviceRecords : [],
            savedMakes: Array.isArray(parsed.savedMakes) ? parsed.savedMakes : defaultData.savedMakes,
            savedModels: parsed.savedModels || defaultData.savedModels,
            companySettings: { ...defaultData.companySettings, ...parsed.companySettings }
          });
        }
      } catch (e) {
        console.error('Error loading data (local):', e);
      }

      if (isSupabaseConfigured && currentUser) {
        try {
          const remote = await loadFleetForCurrentUser();
          if (remote) {
            const merged: AppData = {
              ...defaultData,
              ...remote,
              motorcycles: Array.isArray(remote.motorcycles) ? remote.motorcycles : [],
              serviceRecords: Array.isArray(remote.serviceRecords) ? remote.serviceRecords : [],
              savedMakes: Array.isArray(remote.savedMakes) ? remote.savedMakes : defaultData.savedMakes,
              savedModels: remote.savedModels || defaultData.savedModels,
              companySettings: { ...defaultData.companySettings, ...(remote.companySettings || {}) },
              lastBackup: remote.lastBackup,
            };
            setData(merged);
            localStorage.setItem('motorcycle_fleet_data', JSON.stringify(merged));
          }
        } catch (e) {
          console.warn('Could not load fleet data from Supabase. Using local data.', e);
        }
      }
    };

    load();
  }, [currentUser]);

  // Save data (local + Supabase per-user when configured)
  const saveData = (updater: AppData | ((prev: AppData) => AppData)) => {
    setData(prev => {
      const next = typeof updater === 'function' ? (updater as (p: AppData) => AppData)(prev) : updater;
      try {
        localStorage.setItem('motorcycle_fleet_data', JSON.stringify(next));
      } catch (e) {
        console.error('Error saving data:', e);
      }

      // Fire-and-forget cloud save
      // IMPORTANT: only attempt cloud save if we have a Supabase session-backed user.
      if (isSupabaseConfigured && supabase && currentUser) {
        saveFleetForCurrentUser(next).catch((e) => {
          console.warn('Failed saving fleet data to Supabase. Saved locally only.', e);
        });
      }

      return next;
    });
  };

  const isAdminUser = (user: User | null) => {
    if (!user) return false;
    const email = (user.email || '').toLowerCase().trim();
    const username = (user.username || '').toLowerCase().trim();

    const envAdminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    return username === 'admin' || envAdminEmails.includes(email) || email === 'admin@fleetguard.in' || email === 'admin@fleetguard.com';
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('dashboard');

    // If user requested admin access from the homepage, open backend right after login
    if (pendingAdminOpen && isAdminUser(user)) {
      setShowAdminPanel(true);
    }
    setPendingAdminOpen(false);
  };

  const handleLogout = async () => {
    localStorage.removeItem('fleet_current_user');
    setCurrentUser(null);
    setShowAdminPanel(false);
    setCurrentView('home');

    // Also sign out from Supabase so server session is cleared
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signOut failed:', e);
      }
    }
  };

  const handleGetStarted = () => {
    setAuthMode('signup');
    setCurrentView('auth');
  };

  const handleGoToLogin = () => {
    setPendingAdminOpen(false);
    setAuthMode('login');
    setCurrentView('auth');
  };

  // Admin route handling is implemented in the mount effect (supports hidden /admin entry)

  // Motorcycle handlers
  const handleAddBike = (bike: Motorcycle) => {
    saveData(prev => ({
      ...prev,
      motorcycles: [...(Array.isArray(prev.motorcycles) ? prev.motorcycles : []), bike],
    }));
  };

  const handleUpdateBike = (updatedBike: Motorcycle) => {
    saveData(prev => ({
      ...prev,
      motorcycles: (Array.isArray(prev.motorcycles) ? prev.motorcycles : []).map(b =>
        b.id === updatedBike.id ? updatedBike : b
      ),
    }));
  };

  const handleDeleteBike = (bikeId: string) => {
    saveData(prev => ({
      ...prev,
      motorcycles: (Array.isArray(prev.motorcycles) ? prev.motorcycles : []).filter(b => b.id !== bikeId),
      serviceRecords: (Array.isArray(prev.serviceRecords) ? prev.serviceRecords : []).filter(r => r.motorcycleId !== bikeId),
    }));
  };

  const handleAddMake = (make: string) => {
    const trimmed = make.trim();
    if (!trimmed) return;
    saveData(prev => {
      const existing = Array.isArray(prev.savedMakes) ? prev.savedMakes : [];
      if (existing.includes(trimmed)) return prev;
      return {
        ...prev,
        savedMakes: [...existing, trimmed],
      };
    });
  };

  const handleAddModel = (make: string, model: string) => {
    const mk = make.trim();
    const md = model.trim();
    if (!mk || !md) return;
    saveData(prev => {
      const current = prev.savedModels?.[mk] || [];
      if (current.includes(md)) return prev;
      return {
        ...prev,
        savedModels: {
          ...(prev.savedModels || {}),
          [mk]: [...current, md],
        },
      };
    });
  };

  // Service record handlers
  const handleAddServiceRecord = (record: ServiceRecord) => {
    saveData(prev => ({
      ...prev,
      serviceRecords: [...(Array.isArray(prev.serviceRecords) ? prev.serviceRecords : []), record],
    }));
  };

  const handleUpdateServiceRecord = (record: ServiceRecord) => {
    saveData(prev => ({
      ...prev,
      serviceRecords: (Array.isArray(prev.serviceRecords) ? prev.serviceRecords : []).map(r => (r.id === record.id ? record : r)),
    }));
  };

  const handleDeleteServiceRecord = (recordId: string) => {
    saveData(prev => ({
      ...prev,
      serviceRecords: (Array.isArray(prev.serviceRecords) ? prev.serviceRecords : []).filter(r => r.id !== recordId),
    }));
  };

  // Settings handlers
  const handleUpdateSettings = (settings: CompanySettingsType) => {
    saveData(prev => ({ ...prev, companySettings: settings }));
  };

  // Restore data handler
  const handleRestoreData = (restoredData: AppData) => {
    saveData({
      ...defaultData,
      ...restoredData,
      motorcycles: Array.isArray(restoredData.motorcycles) ? restoredData.motorcycles : [],
      serviceRecords: Array.isArray(restoredData.serviceRecords) ? restoredData.serviceRecords : []
    });
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    window.history.pushState({ view: 'home' }, '', '/');
    window.scrollTo(0, 0);
  };

  // Show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-4xl">🛡️</span>
          </div>
          <p className="text-xl text-amber-400 font-semibold">Fleet Guard 360 Everywhere</p>
          <p className="text-gray-400 mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (currentView === 'privacy') {
    return <PrivacyPolicy onBack={handleBackToHome} />;
  }

  if (currentView === 'terms') {
    return <TermsOfService onBack={handleBackToHome} />;
  }

  if (currentView === 'refund') {
    return <RefundPolicy onBack={handleBackToHome} />;
  }

  if (currentView === 'cookie') {
    return <CookiePolicy onBack={handleBackToHome} />;
  }

  // Show Admin Panel
  if (showAdminPanel && isAdmin) {
    return (
      <AdminPanel
        onClose={() => setShowAdminPanel(false)}
        onSave={handleSaveSiteSettings}
        currentSettings={siteSettings}
      />
    );
  }

  // Show Homepage
  if (currentView === 'home') {
    return (
      <HomePage
        onGetStarted={handleGetStarted}
        onLogin={handleGoToLogin}
        siteSettings={siteSettings}
        onNavigate={(view) => handleNavigate(view as AppView)}
      />
    );
  }

  // Show Auth Screen
  if (currentView === 'auth') {
    return (
      <AuthScreen
        onLogin={handleLogin}
        companySettings={data.companySettings}
        initialMode={authMode}
        onBack={() => setCurrentView('home')}
      />
    );
  }

  // Show Dashboard (authenticated)
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Sticky Back to Home Button - Always Visible */}
      <button
        onClick={handleLogout}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 rounded-full text-white font-medium shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 group"
      >
        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span>Back to Home</span>
      </button>

      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg sticky top-0 z-40 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {data.companySettings.logo ? (
                <img
                  src={data.companySettings.logo}
                  alt="Logo"
                  className="w-10 h-10 rounded-xl bg-white p-1"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🛡️</span>
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                  {data.companySettings.companyName || 'Fleet Guard'}
                </h1>
                <p className="text-xs text-gray-400 hidden sm:block">
                  {data.companySettings.tagline || 'Protect Your Fleet'}
                </p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {isAdmin && (
                <button
                  onClick={() => setShowAdminPanel(true)}
                  className="px-3 py-2 bg-gradient-to-r from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 border border-purple-400/30 rounded-lg text-sm font-semibold text-purple-200 transition-colors flex items-center gap-2"
                  title="Admin Backend"
                >
                  <span className="hidden sm:inline">Admin</span>
                  <span>⚙️</span>
                </button>
              )}
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white">{currentUser?.username}</p>
                <p className="text-xs text-gray-400">{currentUser?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-sm font-medium text-red-400 transition-colors flex items-center gap-1"
              >
                <span className="hidden sm:inline">Logout</span>
                <span>🚪</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-gray-900 shadow-md sticky top-[60px] z-30 overflow-x-auto border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex min-w-max">
            {[
              { id: 'fleet', label: 'Fleet & Vehicles', icon: '🚗' },
              { id: 'service', label: 'Service Records', icon: '🔧' },
              { id: 'analytics', label: 'Analytics', icon: '📊' },
              { id: 'settings', label: 'Settings', icon: '⚙️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-3 font-medium transition-colors whitespace-nowrap flex items-center gap-2 border-b-2 ${activeTab === tab.id
                  ? 'border-amber-500 text-amber-500 bg-amber-500/10'
                  : 'border-transparent text-gray-400 hover:text-amber-400 hover:bg-gray-800'
                  }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'fleet' && (
          <Dashboard
            motorcycles={data.motorcycles}
            makes={data.savedMakes}
            models={data.savedModels}
            onAddBike={handleAddBike}
            onUpdateBike={handleUpdateBike}
            onDeleteBike={handleDeleteBike}
            onAddMake={handleAddMake}
            onAddModel={handleAddModel}
            openVehicleId={openVehicleId}
            onOpenVehicleHandled={() => setOpenVehicleId(null)}
          />
        )}

        {activeTab === 'service' && (
          <ServiceHistory
            motorcycles={data.motorcycles}
            serviceRecords={data.serviceRecords}
            onAddServiceRecord={handleAddServiceRecord}
            onUpdateServiceRecord={handleUpdateServiceRecord}
            onDeleteServiceRecord={handleDeleteServiceRecord}
            onUpdateBike={handleUpdateBike}
          />
        )}

        {activeTab === 'analytics' && (
          <Analytics
            motorcycles={data.motorcycles}
            serviceRecords={data.serviceRecords}
            companySettings={data.companySettings}
            onOpenVehicle={(vehicleId) => {
              setActiveTab('fleet');
              setOpenVehicleId(vehicleId);
            }}
          />
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <CompanySettings
              settings={data.companySettings}
              onUpdate={handleUpdateSettings}
            />

            {/* Data Backup Section */}
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                💾 Data Backup & Security
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <p className="text-sm text-amber-400 font-medium">Total Vehicles</p>
                  <p className="text-2xl font-bold text-white">{data.motorcycles.length}</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <p className="text-sm text-green-400 font-medium">Service Records</p>
                  <p className="text-2xl font-bold text-white">{data.serviceRecords.length}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    const exportData = {
                      ...data,
                      exportDate: new Date().toISOString(),
                      version: '1.0'
                    };
                    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `fleet-guard-backup-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    saveData({ ...data, lastBackup: new Date().toISOString() });
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:from-amber-400 hover:to-amber-500 transition-colors flex items-center gap-2"
                >
                  📥 Download Backup
                </button>

                <label className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-500 transition-colors cursor-pointer flex items-center gap-2">
                  📤 Restore Backup
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const restored = JSON.parse(event.target?.result as string);
                            if (window.confirm('This will replace all current data. Are you sure?')) {
                              handleRestoreData(restored);
                              alert('Data restored successfully!');
                            }
                          } catch {
                            alert('Invalid backup file');
                          }
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </label>
              </div>

              {data.lastBackup && (
                <p className="mt-4 text-sm text-gray-500">
                  Last backup: {new Date(data.lastBackup).toLocaleString()}
                </p>
              )}
            </div>

            {/* Danger Zone */}
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-red-500/30">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                ⚠️ Danger Zone
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                Reset your inventory by deleting all vehicles and service records for this account.
              </p>
              <button
                onClick={() => {
                  const confirmText = window.prompt(
                    'This will permanently delete ALL vehicles and service records.\n\nType DELETE to confirm.'
                  );
                  if (confirmText !== 'DELETE') return;
                  saveData((prev) => ({
                    ...prev,
                    motorcycles: [],
                    serviceRecords: [],
                  }));
                  alert('Inventory reset complete.');
                }}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                Delete All Vehicles (Reset Inventory)
              </button>
              <p className="text-xs text-gray-500 mt-3">
                Tip: Download a backup first if you might need to restore later.
              </p>
            </div>

            {/* User Info Section */}
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                👤 Account Information
              </h2>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <span className="text-2xl">👤</span>
                  <div>
                    <p className="text-sm text-gray-400">Username</p>
                    <p className="font-medium text-white">{currentUser?.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-medium text-white">{currentUser?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <span className="text-2xl">🏢</span>
                  <div>
                    <p className="text-sm text-gray-400">Company</p>
                    <p className="font-medium text-white">{currentUser?.companyName || 'Not set'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-4 mt-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>© 2026 {data.companySettings.companyName || 'Fleet Guard 360'}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
