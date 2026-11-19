import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { ProductCategory } from '../data/catalog';

export type AppView = 'home' | 'pdp';

interface HeaderProps {
  currentView: AppView;
  bagCount: number;
  onNavigateHome: (sectionId?: string, categoryFilter?: ProductCategory | 'all') => void;
  onNavigatePdp: () => void;
  onOpenBag: () => void;
}

export function Header({
  currentView,
  bagCount,
  onNavigateHome,
  onNavigatePdp,
  onOpenBag,
}: HeaderProps) {
  const [showPromo, setShowPromo] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (action: () => void) => {
    setMobileMenuOpen(false);
    action();
  };

  return (
    <div className="sticky top-0 z-40">
      {showPromo && (
        <div className="bg-[#1B1918] text-[#FAF9F6] text-xs px-4 py-2 flex items-center justify-between border-b border-white/10">
          <div className="w-6 shrink-0" aria-hidden="true" />
          <p className="text-center truncate font-medium tracking-wide">
            Complimentary delivery across Singapore on orders above SGD 80 · Same-day dispatch before 2:30 PM
          </p>
          <button
            type="button"
            onClick={() => setShowPromo(false)}
            className="text-[#FAF9F6]/70 hover:text-white p-1 transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-white"
            aria-label="Dismiss delivery notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <header className="bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E7E4DF]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand wordmark (single line, no adjacent pills/subtitles) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 -ml-2 text-[#1B1918] hover:text-[#9E7B4F] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <a
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(() => onNavigateHome('top', 'all'));
              }}
              className="font-serif text-2xl font-semibold tracking-[0.18em] text-[#1B1918] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#9E7B4F]"
            >
              NESPRESSO
            </a>
          </div>

          {/* Zone 2: 5 concise single-line text navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4A4642]"
          >
            <button
              type="button"
              onClick={() => onNavigateHome('catalog', 'capsules')}
              className="hover:text-[#1B1918] hover:underline underline-offset-4 decoration-[#9E7B4F] transition-colors whitespace-nowrap shrink-0 py-2 cursor-pointer"
            >
              Coffee
            </button>
            <button
              type="button"
              onClick={() => onNavigateHome('catalog', 'machines')}
              className="hover:text-[#1B1918] hover:underline underline-offset-4 decoration-[#9E7B4F] transition-colors whitespace-nowrap shrink-0 py-2 cursor-pointer"
            >
              Machines
            </button>
            <button
              type="button"
              onClick={() => onNavigateHome('catalog', 'accessories')}
              className="hover:text-[#1B1918] hover:underline underline-offset-4 decoration-[#9E7B4F] transition-colors whitespace-nowrap shrink-0 py-2 cursor-pointer"
            >
              Accessories
            </button>
            <button
              type="button"
              onClick={onNavigatePdp}
              className={`hover:text-[#1B1918] hover:underline underline-offset-4 decoration-[#9E7B4F] transition-colors whitespace-nowrap shrink-0 py-2 cursor-pointer ${
                currentView === 'pdp'
                  ? 'text-[#1B1918] underline decoration-[#9E7B4F] font-semibold'
                  : ''
              }`}
            >
              Swarovski Shine
            </button>
            <button
              type="button"
              onClick={() => onNavigateHome('catalog', 'bundles')}
              className="hover:text-[#1B1918] hover:underline underline-offset-4 decoration-[#9E7B4F] transition-colors whitespace-nowrap shrink-0 py-2 cursor-pointer"
            >
              Bundle Sets
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={onOpenBag}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1B1918] text-[#FAF9F6] text-xs font-semibold tracking-wider uppercase rounded-sm hover:bg-[#332F2D] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E7B4F]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="tabular-nums">Bag ({bagCount})</span>
            </button>
          </div>
        </div>

        {/* Mobile navigation drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FAF9F6] border-t border-[#E7E4DF] px-4 py-4 space-y-1">
            <button
              type="button"
              onClick={() => handleNavClick(() => onNavigateHome('catalog', 'capsules'))}
              className="block w-full text-left px-3 py-3 text-sm font-medium text-[#1B1918] hover:bg-[#F1EEE8] rounded-sm"
            >
              Coffee Capsules
            </button>
            <button
              type="button"
              onClick={() => handleNavClick(() => onNavigateHome('catalog', 'machines'))}
              className="block w-full text-left px-3 py-3 text-sm font-medium text-[#1B1918] hover:bg-[#F1EEE8] rounded-sm"
            >
              Machines
            </button>
            <button
              type="button"
              onClick={() => handleNavClick(() => onNavigateHome('catalog', 'accessories'))}
              className="block w-full text-left px-3 py-3 text-sm font-medium text-[#1B1918] hover:bg-[#F1EEE8] rounded-sm"
            >
              Accessories
            </button>
            <button
              type="button"
              onClick={() => handleNavClick(() => onNavigateHome('catalog', 'bundles'))}
              className="block w-full text-left px-3 py-3 text-sm font-medium text-[#1B1918] hover:bg-[#F1EEE8] rounded-sm"
            >
              Bundle Sets
            </button>
            <button
              type="button"
              onClick={() => handleNavClick(onNavigatePdp)}
              className="block w-full text-left px-3 py-3 text-sm font-semibold text-[#9E7B4F] hover:bg-[#F1EEE8] rounded-sm"
            >
              Nespresso × Swarovski Shine Bundle
            </button>
          </div>
        )}
      </header>
    </div>
  );
}
