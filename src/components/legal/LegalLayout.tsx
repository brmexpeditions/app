import { ReactNode } from 'react';

interface LegalLayoutProps {
  children: ReactNode;
  title: string;
  onBack: () => void;
}

export function LegalLayout({ children, title, onBack }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onBack}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-lg">🛡️</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-white">Fleet Guard 360 Everywhere</span>
          </div>
          <button
            onClick={onBack}
            className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            ← Back to Home
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8 sm:mb-12 border-b border-gray-800 pb-8">
          {title}
        </h1>
        <div className="prose prose-invert prose-amber max-w-none">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Fleet Guard 360 Everywhere. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
