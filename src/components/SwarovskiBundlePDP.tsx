import { useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Truck,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  BREW_MODES,
  BUNDLE_INCLUSIONS,
  PAIRING_SLEEVES,
  SWAROVSKI_GALLERY,
  SWAROVSKI_VARIANTS,
  TECHNICAL_SPECS,
  formatSgd,
} from '../data/catalog';
import { ResilientImage } from './ResilientImage';

interface SwarovskiBundlePDPProps {
  onBackToStorefront: () => void;
  onAddToBag: (item: {
    id: string;
    name: string;
    subtitle: string;
    priceSgd: number;
    image: string;
    quantity: number;
  }) => void;
}

export function SwarovskiBundlePDP({
  onBackToStorefront,
  onAddToBag,
}: SwarovskiBundlePDPProps) {
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(SWAROVSKI_VARIANTS[0].id);
  const [quantity, setQuantity] = useState(1);
  const [addedToBag, setAddedToBag] = useState(false);
  const [activeBrewModeId, setActiveBrewModeId] = useState(BREW_MODES[0].id);
  const [addedSleeveId, setAddedSleeveId] = useState<string | null>(null);

  const selectedVariant =
    SWAROVSKI_VARIANTS.find((v) => v.id === selectedVariantId) ?? SWAROVSKI_VARIANTS[0];
  const activeGallery = SWAROVSKI_GALLERY[selectedGalleryIndex] ?? SWAROVSKI_GALLERY[0];
  const activeBrewMode = BREW_MODES.find((m) => m.id === activeBrewModeId) ?? BREW_MODES[0];

  const savingsSgd = selectedVariant.compareAtSgd - selectedVariant.priceSgd;

  const handleAddBundle = () => {
    onAddToBag({
      id: selectedVariant.id,
      name: selectedVariant.label,
      subtitle: `${selectedVariant.subtitle} · SKU ${selectedVariant.sku}`,
      priceSgd: selectedVariant.priceSgd,
      image: SWAROVSKI_GALLERY[0].src,
      quantity,
    });
    setAddedToBag(true);
    window.setTimeout(() => setAddedToBag(false), 1800);
  };

  const handleAddSleeve = (sleeve: (typeof PAIRING_SLEEVES)[number]) => {
    onAddToBag({
      id: sleeve.id,
      name: `${sleeve.name} (10 Capsules)`,
      subtitle: 'Original Line Sleeve',
      priceSgd: sleeve.priceSgd,
      image: sleeve.image,
      quantity: 1,
    });
    setAddedSleeveId(sleeve.id);
    window.setTimeout(() => {
      setAddedSleeveId((curr) => (curr === sleeve.id ? null : curr));
    }, 1500);
  };

  return (
    <main className="bg-[#FAF9F6] pb-24 md:pb-16">
      {/* Breadcrumb Bar */}
      <div className="border-b border-[#E7E4DF] bg-[#FFFFFF]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs text-[#6B655F]">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={onBackToStorefront}
              className="hover:text-[#1B1918] transition-colors cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#A8A29B]" />
            <button
              type="button"
              onClick={onBackToStorefront}
              className="hover:text-[#1B1918] transition-colors cursor-pointer"
            >
              Machines
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#A8A29B]" />
            <span>Original</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#A8A29B]" />
            <span className="text-[#1B1918] font-medium">Swarovski Shine Bundle</span>
          </nav>

          <button
            type="button"
            onClick={onBackToStorefront}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1B1918] hover:text-[#9E7B4F] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Nespresso Singapore</span>
          </button>
        </div>
      </div>

      {/* Contiguous Sticky Purchase Module */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-8 pt-8 lg:pt-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left: Sticky Multi-Angle Gallery */}
          <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-[#E7E4DF] bg-[#F2EFE9]">
              <ResilientImage
                src={activeGallery.src}
                alt={activeGallery.caption}
                className={`w-full h-full object-cover transition-transform duration-300 ${
                  isZoomed ? 'scale-125 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
                }`}
                fallbackTitle={activeGallery.label}
              />

              <button
                type="button"
                onClick={() => setIsZoomed((prev) => !prev)}
                aria-label={isZoomed ? 'Reset image zoom' : 'Zoom in on product image'}
                className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3 py-2 bg-[#1B1918]/85 hover:bg-[#1B1918] text-white text-xs font-medium rounded-sm backdrop-blur-xs transition-colors cursor-pointer"
              >
                {isZoomed ? (
                  <>
                    <ZoomOut className="w-3.5 h-3.5" />
                    <span>Reset Zoom</span>
                  </>
                ) : (
                  <>
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Inspect Finish</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 text-xs text-[#6B655F]">
              <span>{activeGallery.caption}</span>
              <span className="tabular-nums shrink-0">
                0{selectedGalleryIndex + 1} / 0{SWAROVSKI_GALLERY.length}
              </span>
            </div>

            {/* Thumbnail Strip */}
            <div className="grid grid-cols-4 gap-3 pt-1">
              {SWAROVSKI_GALLERY.map((media, idx) => {
                const isSelected = idx === selectedGalleryIndex;
                return (
                  <button
                    key={media.id}
                    type="button"
                    onClick={() => {
                      setSelectedGalleryIndex(idx);
                      setIsZoomed(false);
                    }}
                    className={`aspect-[4/3] overflow-hidden rounded-sm border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#9E7B4F] ring-1 ring-[#9E7B4F]'
                        : 'border-[#E7E4DF] opacity-75 hover:opacity-100'
                    }`}
                    aria-label={`View ${media.label}`}
                  >
                    <ResilientImage
                      src={media.src}
                      alt={media.label}
                      className="w-full h-full object-cover"
                      fallbackTitle={media.label}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Sticky Contiguous Purchase Panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 bg-[#FFFFFF] border border-[#E7E4DF] rounded-sm p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#7A746E] tracking-wide">
                <span className="uppercase tracking-[0.12em] font-medium text-[#9E7B4F]">
                  Original Line
                </span>
                <span aria-hidden="true">·</span>
                <span>Limited Holiday Edition</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#2C4C3E] font-medium">In Stock in Singapore</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#1B1918] leading-tight [text-wrap:balance]">
                {selectedVariant.label}
              </h1>

              <p className="text-sm text-[#57524E] leading-relaxed">
                Brushed stainless steel CitiZ Platinum espresso craftsmanship elevated with
                hand-applied Swarovski crystal brilliance—designed for festive hosting and timeless
                daily espresso rituals.
              </p>
            </div>

            {/* Price & Savings Block */}
            <div className="pt-4 border-t border-[#F0EDE7] flex items-baseline justify-between gap-4">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-semibold text-[#1B1918] tabular-nums">
                  {formatSgd(selectedVariant.priceSgd)}
                </span>
                <span className="text-sm text-[#8E8882] line-through tabular-nums">
                  {formatSgd(selectedVariant.compareAtSgd)}
                </span>
              </div>
              <span className="text-xs font-semibold text-[#9E7B4F] tabular-nums">
                Save {formatSgd(savingsSgd)}
              </span>
            </div>

            {/* Variant Selector */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-[#1B1918]">
                  Select Edition
                </span>
                <span className="text-[#7A746E] font-mono text-[11px]">{selectedVariant.sku}</span>
              </div>

              <div className="space-y-2">
                {SWAROVSKI_VARIANTS.map((variant) => {
                  const isActive = variant.id === selectedVariantId;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`w-full text-left px-4 py-3 rounded-sm border transition-colors cursor-pointer flex items-center justify-between gap-4 ${
                        isActive
                          ? 'border-[#1B1918] bg-[#FAF9F6]'
                          : 'border-[#E7E4DF] bg-[#FFFFFF] hover:border-[#C7C0B6]'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[#1B1918] truncate">
                          {variant.label}
                        </div>
                        <div className="text-xs text-[#6B655F] truncate mt-0.5">
                          {variant.subtitle}
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-[#1B1918] tabular-nums shrink-0">
                        {formatSgd(variant.priceSgd)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Variant Inclusions List */}
            <div className="bg-[#FAF9F6] border border-[#EDEAE3] rounded-sm p-4 space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#57524E]">
                Included in Your Box
              </div>
              <ul className="space-y-1.5">
                {selectedVariant.includes.map((line) => (
                  <li key={line} className="flex items-start gap-2 text-xs text-[#3B3734]">
                    <Check className="w-3.5 h-3.5 text-[#9E7B4F] shrink-0 mt-0.5" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity Stepper + Primary Add to Bag CTA */}
            <div className="flex items-stretch gap-3 pt-1">
              <div
                className="inline-flex items-center border border-[#DDD8D0] rounded-sm bg-[#FFFFFF]"
                aria-label="Quantity selector"
              >
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-3 text-[#4A4642] hover:text-[#1B1918] transition-colors cursor-pointer min-h-[44px]"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-[#1B1918] tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="px-3 py-3 text-[#4A4642] hover:text-[#1B1918] transition-colors cursor-pointer min-h-[44px]"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddBundle}
                className={`flex-1 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] rounded-sm transition-colors cursor-pointer min-h-[44px] inline-flex items-center justify-center gap-2 ${
                  addedToBag
                    ? 'bg-[#2C4C3E] text-white'
                    : 'bg-[#1B1918] hover:bg-[#9E7B4F] text-[#FAF9F6]'
                }`}
              >
                {addedToBag ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <span className="tabular-nums">
                    Add to Bag — {formatSgd(selectedVariant.priceSgd * quantity)}
                  </span>
                )}
              </button>
            </div>

            {/* Singapore Fulfillment & Warranty Guarantees */}
            <div className="pt-4 border-t border-[#F0EDE7] space-y-2.5 text-xs text-[#57524E]">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#9E7B4F] shrink-0" />
                <span>Complimentary same-day Singapore delivery (orders before 2:30 PM)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#9E7B4F] shrink-0" />
                <span>2-year official Nespresso Singapore warranty &amp; Type G 230V plug</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#9E7B4F] shrink-0" />
                <span>Includes 14-capsule Original tasting assortment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bundle Breakdown (01–04 Architectural Cards) */}
      <section className="bg-[#FFFFFF] border-y border-[#E7E4DF] py-16 lg:py-20">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 space-y-10">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs tracking-[0.14em] uppercase text-[#9E7B4F]">
              Curated Four-Piece Ensemble
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#1B1918] [text-wrap:balance]">
              Inside the Nespresso × Swarovski Shine Bundle
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BUNDLE_INCLUSIONS.map((item) => (
              <div
                key={item.index}
                className="bg-[#FAF9F6] border border-[#E7E4DF] rounded-sm overflow-hidden flex flex-col"
              >
                <div className="aspect-[4/3] w-full bg-[#EFECE6]">
                  <ResilientImage
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    fallbackTitle={item.title}
                  />
                </div>
                <div className="p-5 space-y-2 flex-1">
                  <div className="text-xs font-medium text-[#9E7B4F] tabular-nums">
                    {item.index}. Bundle Piece
                  </div>
                  <h3 className="text-base font-semibold text-[#1B1918] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#57524E] leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Cup Size Explorer & Technical Specifications */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Interactive 5-Mode Extraction Explorer */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="text-xs tracking-[0.14em] uppercase text-[#7A746E]">
                One-Touch Versatility
              </div>
              <h2 className="font-serif text-3xl font-medium text-[#1B1918] [text-wrap:balance]">
                Five Programmable Extraction Profiles
              </h2>
              <p className="text-sm text-[#57524E] leading-relaxed">
                Select a preparation button on the CitiZ Platinum chassis to inspect its calibrated
                volume, brew duration, and thermal target.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {BREW_MODES.map((mode) => {
                const active = mode.id === activeBrewModeId;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setActiveBrewModeId(mode.id)}
                    className={`px-4 py-2 text-xs font-semibold rounded-sm border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-[#1B1918] text-[#FAF9F6] border-[#1B1918]'
                        : 'bg-[#FFFFFF] text-[#4A4642] border-[#DDD8D0] hover:border-[#1B1918]'
                    }`}
                  >
                    {mode.name} ({mode.volumeMl} ml)
                  </button>
                );
              })}
            </div>

            <div className="bg-[#FFFFFF] border border-[#E7E4DF] rounded-sm p-6 space-y-5">
              <div className="flex items-baseline justify-between border-b border-[#F0EDE7] pb-4">
                <h3 className="font-serif text-2xl font-medium text-[#1B1918]">
                  {activeBrewMode.name}
                </h3>
                <span className="text-sm font-semibold text-[#9E7B4F] tabular-nums">
                  {activeBrewMode.volumeMl} ml Output
                </span>
              </div>

              <p className="text-sm text-[#4A4642] leading-relaxed">
                {activeBrewMode.description}
              </p>

              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-[#F0EDE7]">
                <div>
                  <div className="text-xs text-[#7A746E]">Cup Volume</div>
                  <div className="text-base font-semibold text-[#1B1918] tabular-nums mt-0.5">
                    {activeBrewMode.volumeMl} ml
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#7A746E]">Brew Time</div>
                  <div className="text-base font-semibold text-[#1B1918] tabular-nums mt-0.5">
                    {activeBrewMode.brewTimeSec} sec
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#7A746E]">Extraction Temp</div>
                  <div className="text-base font-semibold text-[#1B1918] tabular-nums mt-0.5">
                    {activeBrewMode.temperatureC} °C
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Technical Specifications Table */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="text-xs tracking-[0.14em] uppercase text-[#7A746E]">
                Engineering &amp; Dimensions
              </div>
              <h2 className="font-serif text-3xl font-medium text-[#1B1918]">
                Technical Specifications
              </h2>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E7E4DF] rounded-sm divide-y divide-[#F0EDE7]">
              {TECHNICAL_SPECS.map((spec) => (
                <div
                  key={spec.label}
                  className="px-5 py-3.5 flex items-center justify-between gap-4 text-sm"
                >
                  <span className="text-[#57524E]">{spec.label}</span>
                  <span className="font-medium text-[#1B1918] tabular-nums text-right">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Original Coffee Sleeves Pairing */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-8 pt-4">
        <div className="border-t border-[#E7E4DF] pt-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="text-xs tracking-[0.14em] uppercase text-[#7A746E]">
                Complete Your Tasting
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1B1918]">
                Recommended Original Coffee Sleeves
              </h2>
            </div>
            <span className="text-xs text-[#6B655F]">10 recyclable aluminium capsules per sleeve</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PAIRING_SLEEVES.map((sleeve) => {
              const isAdded = addedSleeveId === sleeve.id;
              return (
                <div
                  key={sleeve.id}
                  className="bg-[#FFFFFF] border border-[#E7E4DF] rounded-sm p-5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-16 h-16 rounded-sm overflow-hidden bg-[#F2EFE9] shrink-0">
                      <ResilientImage
                        src={sleeve.image}
                        alt={sleeve.name}
                        className="w-full h-full object-cover"
                        fallbackTitle={sleeve.name}
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-[#1B1918] truncate">
                        {sleeve.name}
                      </h3>
                      <p className="text-xs text-[#6B655F] truncate mt-0.5">{sleeve.notes}</p>
                      <div className="text-xs font-semibold text-[#1B1918] tabular-nums mt-1.5">
                        {formatSgd(sleeve.priceSgd)}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddSleeve(sleeve)}
                    className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors shrink-0 cursor-pointer min-h-[38px] ${
                      isAdded
                        ? 'bg-[#2C4C3E] text-white'
                        : 'bg-[#FAF9F6] border border-[#DDD8D0] hover:border-[#1B1918] text-[#1B1918]'
                    }`}
                  >
                    {isAdded ? 'Added' : 'Add'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mobile Sticky Bottom Buy Bar (<= 15% mobile viewport height) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#E7E4DF] px-4 py-3 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs text-[#6B655F] truncate">{selectedVariant.label}</div>
          <div className="text-sm font-semibold text-[#1B1918] tabular-nums">
            {formatSgd(selectedVariant.priceSgd * quantity)}
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddBundle}
          className="px-5 py-2.5 bg-[#1B1918] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-sm shrink-0 min-h-[42px]"
        >
          {addedToBag ? 'Added to Bag' : 'Add to Bag'}
        </button>
      </div>
    </main>
  );
}
