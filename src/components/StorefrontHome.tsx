import { useMemo, useState } from 'react';
import { ArrowRight, Check, Search, ShieldCheck, Sparkles, Truck, Recycle } from 'lucide-react';
import {
  CatalogItem,
  IMAGES,
  ProductCategory,
  STOREFRONT_CATALOG,
  formatSgd,
} from '../data/catalog';
import { ResilientImage } from './ResilientImage';

interface StorefrontHomeProps {
  activeCategory: ProductCategory | 'all';
  onChangeCategory: (category: ProductCategory | 'all') => void;
  onOpenSwarovskiPdp: () => void;
  onAddToBag: (item: {
    id: string;
    name: string;
    subtitle: string;
    priceSgd: number;
    image: string;
    quantity: number;
  }) => void;
}

const FILTER_TABS: { id: ProductCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Essentials' },
  { id: 'machines', label: 'Machines' },
  { id: 'capsules', label: 'Coffee Capsules' },
  { id: 'accessories', label: 'Accessories' },
];

export function StorefrontHome({
  activeCategory,
  onChangeCategory,
  onOpenSwarovskiPdp,
  onAddToBag,
}: StorefrontHomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [selectedSystemTab, setSelectedSystemTab] = useState<'original' | 'vertuo'>('original');

  const filteredCatalog = useMemo(() => {
    return STOREFRONT_CATALOG.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.shortDesc.toLowerCase().includes(q) ||
        item.line.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  const handleQuickAdd = (item: CatalogItem) => {
    onAddToBag({
      id: item.id,
      name: item.name,
      subtitle: `${item.line} Line`,
      priceSgd: item.priceSgd,
      image: item.image,
      quantity: 1,
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
          <div className="lg:col-span-5 px-6 sm:px-10 lg:px-12 py-12 lg:py-20 flex flex-col justify-between gap-10">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs tracking-[0.14em] uppercase text-[#C9A97E]">
                <span>Nespresso Singapore</span>
                <span aria-hidden="true">·</span>
                <span>Original Collection</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.06] font-medium text-[#FAF9F6] [text-wrap:balance]">
                Sculpted Brilliance. Crafted for Espresso.
              </h1>

              <p className="text-[15px] leading-relaxed text-[#D8D3CC] max-w-md">
                Introducing the limited-edition Nespresso × Swarovski Shine Bundle. A brushed
                stainless steel CitiZ Platinum machine accented with precision-cut Swarovski
                crystals, paired with the crystal Travel Mug, PIXIE Cups, and 62-facet Ornament.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={onOpenSwarovskiPdp}
                  className="inline-flex items-center gap-3 px-6 py-3.5 bg-[#9E7B4F] hover:bg-[#B28D5E] text-white text-xs font-semibold tracking-[0.12em] uppercase rounded-sm transition-colors cursor-pointer min-h-[44px]"
                >
                  <span>Shop Shine Bundle — SGD 499</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#catalog"
                  onClick={(e) => {
                    e.preventDefault();
                    onChangeCategory('machines');
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3.5 border border-white/25 hover:border-white/60 text-[#FAF9F6] text-xs font-medium tracking-[0.1em] uppercase rounded-sm transition-colors min-h-[44px]"
                >
                  Compare Machines
                </a>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-xs">
              <div>
                <div className="text-[#C9A97E] font-medium tabular-nums">19 Bar</div>
                <div className="text-[#A8A29B] mt-0.5">Extraction Pressure</div>
              </div>
              <div>
                <div className="text-[#C9A97E] font-medium tabular-nums">SGD 110 Off</div>
                <div className="text-[#A8A29B] mt-0.5">Holiday Bundle Value</div>
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

      {/* Section 2: Featured Collection Grid (Machines, Capsules & Accessories) */}
      <section id="catalog" className="max-w-[1320px] mx-auto px-4 sm:px-8 py-16 lg:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E7E4DF]">
          <div className="space-y-2">
            <div className="text-xs tracking-[0.14em] uppercase text-[#7A746E]">
              Curated Singapore Collection
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#1B1918] [text-wrap:balance]">
              Machines, Grand Cru Coffee &amp; Accessories
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
                    onClick={() => onChangeCategory(tab.id)}
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
                placeholder="Search blends or machines"
                aria-label="Search coffee machines, capsules, or accessories"
                className="w-full sm:w-56 pl-9 pr-3 py-2 text-xs bg-[#FFFFFF] border border-[#DDD8D0] rounded-sm text-[#1B1918] placeholder:text-[#8E8882] focus:outline-none focus:border-[#9E7B4F] min-h-[40px]"
              />
            </div>
          </div>
        </div>

        {filteredCatalog.length === 0 ? (
          <div className="py-16 text-center space-y-3 border-b border-[#E7E4DF]">
            <p className="text-base font-medium text-[#1B1918]">
              No items match &ldquo;{searchQuery}&rdquo; in this category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
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
                        <span className="uppercase tracking-[0.1em] font-medium">
                          {item.line} Line
                        </span>
                        {item.tag && (
                          <span className="text-[#9E7B4F] font-medium">{item.tag}</span>
                        )}
                        {!item.tag && item.intensity !== undefined && (
                          <span className="tabular-nums">Intensity {item.intensity}</span>
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

                      {item.cupSizes && (
                        <div className="text-xs text-[#7A746E] pt-1">{item.cupSizes}</div>
                      )}
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-4 border-t border-[#F0EDE7] flex items-center justify-between gap-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[15px] font-semibold text-[#1B1918] tabular-nums">
                        {formatSgd(item.priceSgd)}
                      </span>
                      {item.compareAtSgd && (
                        <span className="text-xs text-[#8E8882] line-through tabular-nums">
                          {formatSgd(item.compareAtSgd)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {item.isSwarovskiPdp ? (
                        <button
                          type="button"
                          onClick={onOpenSwarovskiPdp}
                          className="px-4 py-2 bg-[#1B1918] hover:bg-[#9E7B4F] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[38px]"
                        >
                          View Bundle
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(item)}
                          className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[38px] inline-flex items-center gap-1.5 ${
                            isAdded
                              ? 'bg-[#2C4C3E] text-white'
                              : 'bg-[#1B1918] hover:bg-[#332F2D] text-[#FAF9F6]'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added</span>
                            </>
                          ) : (
                            <span>Add to Bag</span>
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
              <div className="text-xs tracking-[0.14em] uppercase text-[#7A746E]">
                Two Precision Coffee Systems
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#1B1918] [text-wrap:balance]">
                Choose the Extraction Architecture That Fits Your Ritual
              </h2>

              <div className="inline-flex items-center gap-1 p-1 bg-[#E5E0D7] rounded-sm">
                <button
                  type="button"
                  onClick={() => setSelectedSystemTab('original')}
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer ${
                    selectedSystemTab === 'original'
                      ? 'bg-[#FFFFFF] text-[#1B1918] shadow-xs'
                      : 'text-[#57524E] hover:text-[#1B1918]'
                  }`}
                >
                  Original (19-Bar)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSystemTab('vertuo')}
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer ${
                    selectedSystemTab === 'vertuo'
                      ? 'bg-[#FFFFFF] text-[#1B1918] shadow-xs'
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
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={onOpenSwarovskiPdp}
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9E7B4F] hover:text-[#1B1918] transition-colors cursor-pointer"
                    >
                      <span>Explore CitiZ Platinum × Swarovski Shine Bundle</span>
                      <ArrowRight className="w-4 h-4" />
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
                  <div className="pt-2">
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
