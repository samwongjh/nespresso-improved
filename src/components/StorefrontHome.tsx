import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  GitCompareArrows,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  Recycle,
  Zap,
} from 'lucide-react';
import {
  BundleProfile,
  CatalogItem,
  IMAGES,
  ProductCategory,
  STOREFRONT_CATALOG,
  formatSgd,
  getSavingsPercent,
} from '../data/catalog';
import { OfferCountdown } from './OfferCountdown';
import { ResilientImage } from './ResilientImage';

interface StorefrontHomeProps {
  activeCategory: ProductCategory | 'all';
  compareIds: string[];
  onChangeCategory: (category: ProductCategory | 'all') => void;
  onToggleCompare: (machineId: string) => void;
  onOpenCompare: () => void;
  onClearCompare: () => void;
  onOpenSwarovskiPdp: () => void;
  onAddToBag: (item: {
    id: string;
    name: string;
    subtitle: string;
    priceSgd: number;
    image: string;
    quantity: number;
    itemType?: 'machine' | 'capsule' | 'accessory' | 'bundle';
    line?: 'Original' | 'Vertuo' | 'Accessories';
  }) => void;
}

const FILTER_TABS: { id: ProductCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Essentials' },
  { id: 'bundles', label: 'Bundle Sets' },
  { id: 'capsules', label: 'Coffee Capsules' },
  { id: 'machines', label: 'Machines' },
  { id: 'accessories', label: 'Accessories' },
];

const BUNDLE_PROFILE_TABS: { id: BundleProfile | 'all'; label: string; hint: string }[] = [
  { id: 'all', label: 'All Profiles', hint: 'Curated Singapore sets' },
  { id: 'first-timers', label: 'First Timers', hint: 'New to coffee' },
  { id: 'casual-drinkers', label: 'Casual Drinkers', hint: 'Daily milk & iced café' },
  { id: 'connoisseurs', label: 'Coffee Connoisseurs', hint: 'Intense espresso & collector editions' },
];

export function StorefrontHome({
  activeCategory,
  compareIds,
  onChangeCategory,
  onToggleCompare,
  onOpenCompare,
  onClearCompare,
  onOpenSwarovskiPdp,
  onAddToBag,
}: StorefrontHomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [bundleProfileFilter, setBundleProfileFilter] = useState<BundleProfile | 'all'>('all');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [selectedSystemTab, setSelectedSystemTab] = useState<'original' | 'vertuo'>('original');

  const filteredCatalog = useMemo(() => {
    return STOREFRONT_CATALOG.filter((item) => {
      // "All Essentials" and "Machines" show individual items only; bundles live exclusively under "Bundle Sets"
      const matchesCategory =
        activeCategory === 'all'
          ? item.category !== 'bundles'
          : item.category === activeCategory;

      const matchesProfile =
        activeCategory !== 'bundles' ||
        bundleProfileFilter === 'all' ||
        item.bundleProfile === bundleProfileFilter;

      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.shortDesc.toLowerCase().includes(q) ||
        item.line.toLowerCase().includes(q) ||
        (item.bundleProfileLabel && item.bundleProfileLabel.toLowerCase().includes(q));

      return matchesCategory && matchesProfile && matchesQuery;
    });
  }, [activeCategory, bundleProfileFilter, searchQuery]);

  const handleQuickAdd = (item: CatalogItem) => {
    const itemType: 'machine' | 'capsule' | 'accessory' | 'bundle' =
      item.category === 'machines'
        ? 'machine'
        : item.category === 'capsules'
          ? 'capsule'
          : item.category === 'bundles'
            ? 'bundle'
            : 'accessory';

    onAddToBag({
      id: item.id,
      name: item.name,
      subtitle: item.bundleProfileLabel ? `${item.bundleProfileLabel} · ${item.line} Line` : `${item.line} Line`,
      priceSgd: item.priceSgd,
      image: item.image,
      quantity: 1,
      itemType,
      line: item.line,
    });
    setJustAddedId(item.id);
    window.setTimeout(() => {
      setJustAddedId((curr) => (curr === item.id ? null : curr));
    }, 1600);
  };

  return (
    <main id="top" className="bg-[#FAF9F6]">
      {/* Section 1: Flagship Campaign Hero (Split Editorial Spotlight) */}
      <section className="bg-[#1B1918] text-[#FAF9F6] border-b border-[#2D2A28]">
        <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-5 px-6 sm:px-10 lg:px-12 py-12 lg:py-16 flex flex-col justify-between gap-8">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2 text-xs tracking-[0.14em] uppercase">
                <span className="text-[#FAF9F6] font-semibold">Limited Edition</span>
                <span className="text-[#C9A97E]" aria-hidden="true">·</span>
                <span className="text-[#C9A97E]">Nespresso × Swarovski</span>
                <span className="text-[#C9A97E]" aria-hidden="true">·</span>
                <span className="text-[#A8A29B]">Singapore</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.06] font-medium text-[#FAF9F6] [text-wrap:balance]">
                Sculpted Brilliance. Crafted for Espresso.
              </h1>

              <p className="text-[15px] leading-relaxed text-[#D8D3CC] max-w-md">
                Limited-edition Nespresso × Swarovski Shine Bundle. A brushed stainless steel CitiZ
                Platinum machine accented with precision-cut Swarovski crystals, paired with the
                crystal Travel Mug, PIXIE Cups, and 62-facet Ornament.
              </p>

              <OfferCountdown
                variant="dark"
                label="Limited-Edition Offer Ends In"
                compact
              />

              <div className="pt-1 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={onOpenSwarovskiPdp}
                  className="inline-flex items-center gap-3 px-6 py-3.5 bg-[#9E7B4F] hover:bg-[#B28D5E] text-white text-xs font-semibold tracking-[0.12em] uppercase rounded-sm transition-colors cursor-pointer min-h-[44px]"
                >
                  <span>Shop Limited-Edition Shine — SGD 499</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#catalog"
                  onClick={(e) => {
                    e.preventDefault();
                    onChangeCategory('bundles');
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3.5 border border-white/25 hover:border-white/60 text-[#FAF9F6] text-xs font-semibold tracking-[0.12em] uppercase rounded-sm transition-colors min-h-[44px]"
                >
                  Explore Bundle Sets
                </a>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-xs">
              <div>
                <div className="text-[#C9A97E] font-medium tabular-nums">Limited Release</div>
                <div className="text-[#A8A29B] mt-0.5">Holiday Collector Allocation</div>
              </div>
              <div>
                <div className="text-[#C9A97E] font-medium tabular-nums">SGD 110 Off</div>
                <div className="text-[#A8A29B] mt-0.5">Shine Bundle Savings</div>
              </div>
              <div>
                <div className="text-[#C9A97E] font-medium">Same-Day SG</div>
                <div className="text-[#A8A29B] mt-0.5">Complimentary Delivery</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 relative min-h-[340px] lg:min-h-[560px] bg-[#141312]">
            <ResilientImage
              src={IMAGES.swarovskiHero}
              alt="Nespresso x Swarovski Shine Bundle featuring CitiZ Platinum crystal machine, Travel Mug, and 62-facet Ornament"
              className="w-full h-full lg:h-full object-cover object-center"
              fallbackTitle="Nespresso × Swarovski Shine Bundle"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#1B1918]/45 via-transparent to-transparent lg:block hidden"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      {/* Section 2: Featured Collection Grid (Machines, Capsules, Accessories & Bundle Sets) */}
      <section id="catalog" className="max-w-[1320px] mx-auto px-4 sm:px-8 py-16 lg:py-20">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-8 border-b border-[#E7E4DF]">
          <div className="space-y-2">
            <div className="text-xs tracking-[0.14em] uppercase text-[#7A746E]">
              Curated Singapore Collection
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#1B1918] [text-wrap:balance]">
              {activeCategory === 'bundles'
                ? 'Curated Bundle Sets by Coffee Ritual'
                : 'Machines, Grand Cru Coffee & Accessories'}
            </h2>
          </div>

          {/* Interactive Filter Controls & Catalog Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div
              role="tablist"
              aria-label="Filter collection by category"
              className="inline-flex items-center gap-1 p-1 bg-[#EFECE6] rounded-sm overflow-x-auto"
            >
              {FILTER_TABS.map((tab) => {
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      onChangeCategory(tab.id);
                      if (tab.id !== 'bundles') {
                        setBundleProfileFilter('all');
                      }
                    }}
                    className={`px-3.5 py-2 text-xs font-medium rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[36px] ${
                      isActive
                        ? 'bg-[#FFFFFF] text-[#1B1918] shadow-xs'
                        : 'text-[#57524E] hover:text-[#1B1918]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-[#7A746E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blends, machines, or sets"
                aria-label="Search coffee machines, capsules, accessories, or bundle sets"
                className="w-full sm:w-56 pl-9 pr-3 py-2 text-xs bg-[#FFFFFF] border border-[#DDD8D0] rounded-sm text-[#1B1918] placeholder:text-[#8E8882] focus:outline-none focus:border-[#9E7B4F] min-h-[40px]"
              />
            </div>
          </div>
        </div>

        {/* Prominent Flash Deal Showcase */}
        <div
          role="region"
          aria-label="Limited-Time Flash Deal"
          className="mt-8 bg-[#1B1918] text-[#FAF9F6] border border-[#9E7B4F]/50 rounded-sm p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-md"
        >
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-[#C9A97E] shrink-0" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C9A97E]">
                Flash Deal · Limited-Edition Singapore Release
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#FAF9F6] leading-snug [text-wrap:balance]">
              Save SGD 110 on the Nespresso × Swarovski Shine Bundle Before This Offer Ends
            </h3>
            <p className="text-sm text-[#D8D3CC] leading-relaxed">
              Exclusive seasonal pricing across our limited-edition Swarovski Shine collection and
              curated coffee machine sets while Singapore boutique allocation remains.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-4 shrink-0">
            <OfferCountdown variant="dark" label="Flash Deal Ends In" compact />
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenSwarovskiPdp}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#9E7B4F] hover:bg-[#B28D5E] text-white text-xs font-semibold uppercase tracking-[0.12em] rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[42px]"
              >
                <span>Shop Swarovski Shine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {activeCategory !== 'bundles' && (
                <button
                  type="button"
                  onClick={() => onChangeCategory('bundles')}
                  className="inline-flex items-center justify-center px-5 py-3 border border-white/25 hover:border-white/60 text-[#FAF9F6] text-xs font-semibold uppercase tracking-[0.12em] rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[42px]"
                >
                  View Bundle Sets
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Machine Comparison Quick Action Bar */}
        {(activeCategory === 'machines' || activeCategory === 'all') && (
          <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-[#57524E]">
              {compareIds.length > 0
                ? `${compareIds.length} machine${compareIds.length > 1 ? 's' : ''} selected for comparison`
                : 'Check "Select to Compare" on any machine below, or compare all models directly.'}
            </p>
            <div className="flex items-center gap-3">
              {compareIds.length > 0 && (
                <button
                  type="button"
                  onClick={onClearCompare}
                  className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B655F] hover:text-[#1B1918] transition-colors cursor-pointer"
                >
                  Clear Selection
                </button>
              )}
              <button
                type="button"
                onClick={onOpenCompare}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFFFFF] border border-[#DDD8D0] hover:border-[#1B1918] text-xs font-semibold uppercase tracking-[0.12em] text-[#1B1918] rounded-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                <GitCompareArrows className="w-3.5 h-3.5 text-[#9E7B4F]" />
                <span>
                  {compareIds.length > 0
                    ? 'Compared Selected Machines'
                    : 'Compare All Machines'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Drinker Profile Filter Bar (shown when Bundle Sets tab is selected) */}
        {activeCategory === 'bundles' && (
          <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-[#57524E]">
              Tailored sets combining a machine, tasting sleeves, and glassware for every palate:
            </div>
            <div
              role="group"
              aria-label="Filter bundle sets by coffee experience"
              className="inline-flex flex-wrap items-center gap-2"
            >
              {BUNDLE_PROFILE_TABS.map((profile) => {
                const isSelected = bundleProfileFilter === profile.id;
                return (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => setBundleProfileFilter(profile.id)}
                    className={`px-3.5 py-2 text-xs rounded-sm border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#1B1918] text-[#FAF9F6] border-[#1B1918] font-semibold'
                        : 'bg-[#FFFFFF] text-[#4A4642] border-[#DDD8D0] hover:border-[#1B1918] font-medium'
                    }`}
                  >
                    <span>{profile.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {filteredCatalog.length === 0 ? (
          <div className="py-16 text-center space-y-3 border-b border-[#E7E4DF]">
            <p className="text-base font-medium text-[#1B1918]">
              No items match &ldquo;{searchQuery}&rdquo; in this category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setBundleProfileFilter('all');
                onChangeCategory('all');
              }}
              className="text-xs font-semibold uppercase tracking-wider text-[#9E7B4F] hover:underline cursor-pointer"
            >
              Reset Catalog Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-10">
            {filteredCatalog.map((item) => {
              const isAdded = justAddedId === item.id;
              const savingsPct = getSavingsPercent(item.priceSgd, item.compareAtSgd);
              return (
                <article
                  key={item.id}
                  className="group bg-[#FFFFFF] border border-[#E7E4DF] rounded-sm flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div>
                    <div
                      onClick={() => {
                        if (item.isSwarovskiPdp) onOpenSwarovskiPdp();
                      }}
                      className={`aspect-[4/3] w-full overflow-hidden bg-[#F2EFE9] ${
                        item.isSwarovskiPdp ? 'cursor-pointer' : ''
                      }`}
                    >
                      <ResilientImage
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        fallbackTitle={item.name}
                      />
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between gap-2 text-xs text-[#7A746E]">
                        <span className="uppercase tracking-[0.12em] font-medium">
                          {item.line} Line
                        </span>
                        {item.tag && (
                          <span className="text-[#9E7B4F] font-semibold uppercase tracking-[0.08em]">
                            {item.tag}
                          </span>
                        )}
                        {!item.tag && item.intensity !== undefined && (
                          <span className="tabular-nums font-medium">Intensity {item.intensity}</span>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-[#1B1918] leading-snug">
                        {item.isSwarovskiPdp ? (
                          <button
                            type="button"
                            onClick={onOpenSwarovskiPdp}
                            className="text-left hover:text-[#9E7B4F] transition-colors cursor-pointer"
                          >
                            {item.name}
                          </button>
                        ) : (
                          item.name
                        )}
                      </h3>

                      <p className="text-sm text-[#57524E] leading-relaxed line-clamp-2">
                        {item.shortDesc}
                      </p>

                      {item.bundleIncludes && (
                        <ul className="pt-2 space-y-1.5 border-t border-[#F2EFE9]">
                          {item.bundleIncludes.map((inc) => (
                            <li
                              key={inc}
                              className="flex items-start gap-2 text-xs text-[#4A4642]"
                            >
                              <Check className="w-3.5 h-3.5 text-[#9E7B4F] shrink-0 mt-0.5" />
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {item.cupSizes && !item.bundleIncludes && (
                        <div className="text-xs text-[#7A746E] pt-1">{item.cupSizes}</div>
                      )}
                    </div>

                    {item.category === 'machines' && (
                      <div className="px-6 pb-3">
                        <label className="inline-flex items-center gap-2 text-xs font-medium text-[#4A4642] hover:text-[#1B1918] cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={compareIds.includes(item.id)}
                            onChange={() => onToggleCompare(item.id)}
                            className="w-4 h-4 rounded-xs border-[#C7C0B6] accent-[#9E7B4F] cursor-pointer"
                          />
                          <span>Select to Compare</span>
                        </label>
                      </div>
                    )}
                  </div>

                  <div className="px-6 pb-6 pt-4 border-t border-[#F0EDE7] flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="text-[15px] font-semibold text-[#1B1918] tabular-nums">
                        {formatSgd(item.priceSgd)}
                      </span>
                      {item.compareAtSgd && (
                        <span className="text-xs text-[#8E8882] line-through tabular-nums">
                          {formatSgd(item.compareAtSgd)}
                        </span>
                      )}
                      {savingsPct !== null && (
                        <span className="text-xs font-semibold text-[#9E7B4F] tabular-nums">
                          Save {savingsPct}%
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.isSwarovskiPdp && item.category === 'bundles' ? (
                        <button
                          type="button"
                          onClick={onOpenSwarovskiPdp}
                          className="px-4 py-2 bg-[#1B1918] hover:bg-[#9E7B4F] text-[#FAF9F6] text-xs font-semibold uppercase tracking-[0.12em] rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[38px]"
                        >
                          VIEW BUNDLE
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(item)}
                          className={`px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[38px] inline-flex items-center gap-1.5 ${
                            isAdded
                              ? 'bg-[#2C4C3E] text-white'
                              : 'bg-[#1B1918] hover:bg-[#332F2D] text-[#FAF9F6]'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>ADDED</span>
                            </>
                          ) : (
                            <span>ADD TO CART</span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Section 3: Original vs Vertuo Systems + Singapore Privileges Strip */}
      <section id="systems" className="bg-[#F2EFE9] border-y border-[#E7E4DF]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-16 lg:py-20 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="text-xs font-medium tracking-[0.14em] uppercase text-[#7A746E]">
                Two Precision Coffee Systems
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#1B1918] [text-wrap:balance]">
                Choose the Extraction Architecture That Fits Your Ritual
              </h2>

              <div className="inline-flex items-center gap-1 p-1 bg-[#E5E0D7] rounded-sm">
                <button
                  type="button"
                  onClick={() => setSelectedSystemTab('original')}
                  className={`px-4 py-2 text-xs font-medium rounded-sm transition-colors cursor-pointer ${
                    selectedSystemTab === 'original'
                      ? 'bg-[#FFFFFF] text-[#1B1918] font-semibold shadow-xs'
                      : 'text-[#57524E] hover:text-[#1B1918]'
                  }`}
                >
                  Original (19-Bar)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSystemTab('vertuo')}
                  className={`px-4 py-2 text-xs font-medium rounded-sm transition-colors cursor-pointer ${
                    selectedSystemTab === 'vertuo'
                      ? 'bg-[#FFFFFF] text-[#1B1918] font-semibold shadow-xs'
                      : 'text-[#57524E] hover:text-[#1B1918]'
                  }`}
                >
                  Vertuo (Centrifusion)
                </button>
              </div>

              {selectedSystemTab === 'original' ? (
                <div className="space-y-4 pt-2">
                  <p className="text-[15px] leading-relaxed text-[#4A4642]">
                    Engineered around a classic 19-bar high-pressure pump, Original delivers
                    authentic Italian-style Ristretto (25 ml), Espresso (40 ml), and Lungo (110 ml)
                    crowned with dense, aromatic crema—ideal for purists and velvety milk recipes.
                  </p>
                  <div className="flex flex-wrap items-center gap-6 text-xs text-[#57524E] pt-1">
                    <span>19-bar high pressure</span>
                    <span aria-hidden="true">·</span>
                    <span>25-second heat-up</span>
                    <span aria-hidden="true">·</span>
                    <span>30+ Original blends</span>
                  </div>
                  <div className="pt-2 flex flex-wrap items-center gap-6">
                    <button
                      type="button"
                      onClick={onOpenSwarovskiPdp}
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9E7B4F] hover:text-[#1B1918] transition-colors cursor-pointer"
                    >
                      <span>Explore CitiZ Platinum × Swarovski Shine Bundle</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={onOpenCompare}
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B1918] hover:text-[#9E7B4F] transition-colors cursor-pointer"
                    >
                      <GitCompareArrows className="w-4 h-4" />
                      <span>Compare Original &amp; Vertuo Machines</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  <p className="text-[15px] leading-relaxed text-[#4A4642]">
                    Vertuo pairs intelligent barcode recognition with Centrifusion rotation up to
                    7,000 RPM, calibrating temperature, infusion, and flow for five cup sizes from
                    Espresso (40 ml) to Mug (230 ml) and Carafe (535 ml).
                  </p>
                  <div className="flex flex-wrap items-center gap-6 text-xs text-[#57524E] pt-1">
                    <span>Centrifusion extraction</span>
                    <span aria-hidden="true">·</span>
                    <span>Barcode auto-calibration</span>
                    <span aria-hidden="true">·</span>
                    <span>Five cup sizes</span>
                  </div>
                  <div className="pt-2 flex flex-wrap items-center gap-6">
                    <a
                      href="#catalog"
                      onClick={(e) => {
                        e.preventDefault();
                        onChangeCategory('machines');
                        document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9E7B4F] hover:text-[#1B1918] transition-colors"
                    >
                      <span>Browse Vertuo Machines</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      onClick={onOpenCompare}
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B1918] hover:text-[#9E7B4F] transition-colors cursor-pointer"
                    >
                      <GitCompareArrows className="w-4 h-4" />
                      <span>Compare Original &amp; Vertuo Machines</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-6">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-sm border border-[#DFDAD1] bg-[#FFFFFF]">
                <ResilientImage
                  src={
                    selectedSystemTab === 'original'
                      ? IMAGES.swarovskiMachine
                      : IMAGES.vertuoMachine
                  }
                  alt={
                    selectedSystemTab === 'original'
                      ? 'Nespresso Original 19-Bar Machine'
                      : 'Nespresso Vertuo Centrifusion Machine'
                  }
                  className="w-full h-full object-cover"
                  fallbackTitle="Nespresso Precision Brewing"
                />
              </div>
            </div>
          </div>

          {/* 4-Column Singapore Member Privileges Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-[#DFDAD1]">
            <div className="flex items-start gap-3.5">
              <Truck className="w-5 h-5 text-[#9E7B4F] shrink-0 mt-0.5 stroke-[1.6]" />
              <div>
                <h3 className="text-sm font-semibold text-[#1B1918]">Complimentary SG Delivery</h3>
                <p className="text-xs text-[#57524E] mt-1 leading-relaxed">
                  Free island-wide courier delivery on orders above SGD 80 and same-day dispatch before 2:30 PM.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <ShieldCheck className="w-5 h-5 text-[#9E7B4F] shrink-0 mt-0.5 stroke-[1.6]" />
              <div>
                <h3 className="text-sm font-semibold text-[#1B1918]">2-Year Official Warranty</h3>
                <p className="text-xs text-[#57524E] mt-1 leading-relaxed">
                  Comprehensive Singapore warranty with loan machine assistance during servicing.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Sparkles className="w-5 h-5 text-[#9E7B4F] shrink-0 mt-0.5 stroke-[1.6]" />
              <div>
                <h3 className="text-sm font-semibold text-[#1B1918]">Complimentary Tasting Kit</h3>
                <p className="text-xs text-[#57524E] mt-1 leading-relaxed">
                  Every machine includes a starter box of Grand Cru capsules to explore your palate.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Recycle className="w-5 h-5 text-[#9E7B4F] shrink-0 mt-0.5 stroke-[1.6]" />
              <div>
                <h3 className="text-sm font-semibold text-[#1B1918]">100% Recyclable Aluminium</h3>
                <p className="text-xs text-[#57524E] mt-1 leading-relaxed">
                  Drop off used capsules at any Singapore Boutique or schedule complimentary doorstep collection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
