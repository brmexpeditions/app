import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

interface RegisteredUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  user_metadata?: {
    full_name?: string;
    phone?: string;
    company_name?: string;
  };
}

interface SiteSettings {
  // Branding
  siteName: string;
  tagline: string;
  logo: string;
  favicon: string;
  fontFamily: 'System' | 'Inter' | 'Poppins' | 'Montserrat';

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
  const [settings, setSettings] = useState<SiteSettings>(currentSettings || defaultSettings);
  const [activeTab, setActiveTab] = useState<'branding' | 'seo' | 'analytics' | 'social' | 'contact' | 'pricing' | 'sections' | 'users' | 'payments' | 'advanced'>('branding');
  const [saved, setSaved] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  // Load users from localStorage (simulated - in production use Supabase admin API)
  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    }
  }, [activeTab]);
  
  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      // Get users from localStorage (for demo purposes)
      const storedUsers = localStorage.getItem('fleetguard_users');
      if (storedUsers) {
        const parsed = JSON.parse(storedUsers);
        setUsers(Array.isArray(parsed) ? parsed : []);
      }
      
      // If Supabase is configured, try to get users from there
      if (supabase.url) {
        const token = localStorage.getItem('supabase_access_token');
        if (token) {
          const supabaseUsers = await supabase.getUsers(token);
          if (supabaseUsers.length > 0) {
            setUsers(supabaseUsers);
          }
        }
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
    setLoadingUsers(false);
  };

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

  const tabs = [
    { id: 'branding', label: 'Branding', icon: '🎨' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'social', label: 'Social Media', icon: '📱' },
    { id: 'contact', label: 'Contact', icon: '📞' },
    { id: 'pricing', label: 'Pricing', icon: '💰' },
    { id: 'sections', label: 'Sections', icon: '📋' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'payments', label: 'Payments', icon: '💳' },
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

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Registered Users</h2>
                  <p className="text-gray-400 text-sm">View and manage all registered users</p>
                </div>
                <button
                  onClick={loadUsers}
                  className="px-4 py-2 bg-amber-500 text-black rounded-lg font-medium hover:bg-amber-400 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <div className="text-3xl font-bold text-white">{users.length}</div>
                  <div className="text-sm text-gray-400">Total Users</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <div className="text-3xl font-bold text-green-400">
                    {users.filter(u => {
                      const lastWeek = new Date();
                      lastWeek.setDate(lastWeek.getDate() - 7);
                      return new Date(u.created_at) > lastWeek;
                    }).length}
                  </div>
                  <div className="text-sm text-gray-400">New This Week</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <div className="text-3xl font-bold text-cyan-400">
                    {users.filter(u => {
                      if (!u.last_sign_in_at) return false;
                      const lastWeek = new Date();
                      lastWeek.setDate(lastWeek.getDate() - 7);
                      return new Date(u.last_sign_in_at) > lastWeek;
                    }).length}
                  </div>
                  <div className="text-sm text-gray-400">Active This Week</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <div className="text-3xl font-bold text-amber-400">0</div>
                  <div className="text-sm text-gray-400">Paid Users</div>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  {loadingUsers ? (
                    <div className="p-8 text-center text-gray-400">
                      <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      Loading users...
                    </div>
                  ) : users.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="text-4xl mb-4">👥</div>
                      <p className="text-gray-400 mb-2">No users registered yet</p>
                      <p className="text-xs text-gray-500">Users will appear here when they sign up</p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-800">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">#</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Phone</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Company</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Joined</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Last Active</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Plan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {users.map((user, index) => (
                          <tr key={user.id} className="hover:bg-gray-800/50">
                            <td className="px-4 py-3 text-sm text-gray-400">{index + 1}</td>
                            <td className="px-4 py-3">
                              <span className="text-white font-medium">
                                {user.user_metadata?.full_name || 'Unknown'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-300">{user.email}</td>
                            <td className="px-4 py-3 text-sm text-gray-400">
                              {user.user_metadata?.phone || '-'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-400">
                              {user.user_metadata?.company_name || '-'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-400">
                              {new Date(user.created_at).toLocaleDateString('en-IN')}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-400">
                              {user.last_sign_in_at 
                                ? new Date(user.last_sign_in_at).toLocaleDateString('en-IN')
                                : 'Never'}
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                                Free
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Export Users */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-amber-400">📥</span> Export Users
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const csv = [
                        ['Name', 'Email', 'Phone', 'Company', 'Joined', 'Plan'].join(','),
                        ...users.map(u => [
                          u.user_metadata?.full_name || '',
                          u.email,
                          u.user_metadata?.phone || '',
                          u.user_metadata?.company_name || '',
                          new Date(u.created_at).toLocaleDateString('en-IN'),
                          'Free'
                        ].join(','))
                      ].join('\n');
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `fleetguard-users-${new Date().toISOString().split('T')[0]}.csv`;
                      a.click();
                    }}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    📄 Export as CSV
                  </button>
                  <button
                    onClick={() => {
                      const json = JSON.stringify(users, null, 2);
                      const blob = new Blob([json], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `fleetguard-users-${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                    }}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    📋 Export as JSON
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Payment Gateway</h2>
                <p className="text-gray-400 text-sm">Configure payment options for subscriptions</p>
              </div>

              {/* Razorpay Integration */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <span className="text-2xl">💳</span> Razorpay (Recommended for India)
                  </h3>
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-medium">
                    UPI Supported ✓
                  </span>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="text-blue-400 font-medium mb-2">📘 How to set up Razorpay:</h4>
                  <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                    <li>Create a Razorpay account at <a href="https://razorpay.com" target="_blank" rel="noopener" className="text-amber-400 hover:underline">razorpay.com</a></li>
                    <li>Complete KYC verification (takes 1-2 days)</li>
                    <li>Go to Settings → API Keys → Generate Key</li>
                    <li>Copy the Key ID and Key Secret</li>
                    <li>Paste them below</li>
                    <li>Create subscription plans in Razorpay Dashboard</li>
                  </ol>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Razorpay Key ID</label>
                    <input
                      type="text"
                      placeholder="rzp_live_xxxxxxxxxxxxxxx"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Razorpay Key Secret</label>
                    <input
                      type="password"
                      placeholder="••••••••••••••••"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Webhook Secret (for subscription events)</label>
                  <input
                    type="password"
                    placeholder="whsec_xxxxxxxxxxxxxxx"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Webhook URL: <code className="bg-gray-800 px-2 py-0.5 rounded">https://yourdomain.com/api/razorpay-webhook</code>
                  </p>
                </div>

                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-amber-500 text-black rounded-lg font-medium hover:bg-amber-400 transition-colors">
                    Save Razorpay Settings
                  </button>
                  <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                    Test Connection
                  </button>
                </div>
              </div>

              {/* Subscription Plans Mapping */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span className="text-amber-400">📋</span> Subscription Plan IDs
                </h3>
                <p className="text-sm text-gray-400">
                  Create plans in Razorpay Dashboard and paste the Plan IDs here
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <div className="text-white font-medium">Professional Plan</div>
                      <div className="text-sm text-gray-400">₹{settings.proPrice}/year • Up to {settings.proVehicles} vehicles</div>
                    </div>
                    <input
                      type="text"
                      placeholder="plan_xxxxxxxxxxxxxxx"
                      className="w-64 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-sm"
                    />
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <div className="text-white font-medium">Enterprise Plan</div>
                      <div className="text-sm text-gray-400">₹{settings.enterprisePrice}/year • Unlimited vehicles</div>
                    </div>
                    <input
                      type="text"
                      placeholder="plan_xxxxxxxxxxxxxxx"
                      className="w-64 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span className="text-amber-400">💵</span> Accepted Payment Methods
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: 'UPI', icon: '📱', enabled: true },
                    { name: 'Credit/Debit Cards', icon: '💳', enabled: true },
                    { name: 'Net Banking', icon: '🏦', enabled: true },
                    { name: 'Wallets', icon: '👛', enabled: true },
                    { name: 'EMI', icon: '📅', enabled: false },
                    { name: 'Pay Later', icon: '⏰', enabled: false },
                  ].map(method => (
                    <label key={method.name} className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750 transition-colors">
                      <input type="checkbox" defaultChecked={method.enabled} className="w-4 h-4 rounded border-gray-600 text-amber-500 focus:ring-amber-500 bg-gray-700" />
                      <span className="text-xl">{method.icon}</span>
                      <span className="text-white text-sm">{method.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Revenue Dashboard Coming Soon */}
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-500/30">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center text-3xl">
                    📊
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Revenue Dashboard</h3>
                    <p className="text-sm text-gray-400">
                      Once Razorpay is connected, you'll see real-time revenue, subscription analytics, and payment history here.
                    </p>
                  </div>
                </div>
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
