import { MapPin, Phone } from 'lucide-react';
import { SG_BOUTIQUES } from '../data/catalog';

interface FooterProps {
  onNavigateHome: () => void;
  onNavigatePdp: () => void;
}

export function Footer({ onNavigateHome, onNavigatePdp }: FooterProps) {
  return (
    <footer className="bg-[#1B1918] text-[#D8D3CC] border-t border-[#2D2A28]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-14 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4 space-y-4">
            <div className="font-serif text-2xl font-semibold tracking-[0.18em] text-[#FAF9F6]">
              NESPRESSO
            </div>
            <p className="text-xs text-[#A8A29B] leading-relaxed max-w-sm">
              Official Singapore Digital Boutique. Precision Swiss extraction engineering,
              sustainably sourced AAA coffees, and recyclable aluminium capsules.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#C9A97E] pt-1">
              <Phone className="w-3.5 h-3.5" />
              <span className="tabular-nums">Nespresso Singapore Club · 1800 888 8000</span>
            </div>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FAF9F6]">
              Singapore Boutiques
            </h3>
            <ul className="space-y-2.5 text-xs text-[#A8A29B]">
              {SG_BOUTIQUES.map((boutique) => (
                <li key={boutique.name} className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#9E7B4F] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#FAF9F6] font-medium">{boutique.name}</span>
                    <span> · {boutique.address}</span>
                    <span className="text-[#7A746E] tabular-nums"> ({boutique.hours})</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FAF9F6]">
              Explore Flagship
            </h3>
            <ul className="space-y-2 text-xs text-[#A8A29B]">
              <li>
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="hover:text-[#FAF9F6] transition-colors cursor-pointer"
                >
                  Nespresso Singapore Storefront
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onNavigatePdp}
                  className="hover:text-[#FAF9F6] transition-colors cursor-pointer"
                >
                  Nespresso × Swarovski Shine Bundle
                </button>
              </li>
              <li>
                <span className="text-[#7A746E]">2-Year Machine Warranty &amp; Loan Service</span>
              </li>
              <li>
                <span className="text-[#7A746E]">Free Delivery on Orders ≥ SGD 80</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8E8882]">
          <span>Nestlé Nespresso Singapore Pte Ltd · All prices inclusive of 9% GST</span>
          <span>Singapore (EN / SGD)</span>
        </div>
      </div>
    </footer>
  );
}
