export type ProductCategory = 'machines' | 'capsules' | 'accessories';

export interface CatalogItem {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  line: 'Original' | 'Vertuo' | 'Accessories';
  priceSgd: number;
  compareAtSgd?: number;
  tag?: string;
  shortDesc: string;
  image: string;
  isSwarovskiPdp?: boolean;
  intensity?: number;
  cupSizes?: string;
}

export interface SwarovskiVariant {
  id: string;
  label: string;
  subtitle: string;
  priceSgd: number;
  compareAtSgd: number;
  sku: string;
  inStock: boolean;
  includes: string[];
}

export interface BrewMode {
  id: string;
  name: string;
  volumeMl: number;
  brewTimeSec: number;
  temperatureC: number;
  description: string;
}

export const IMAGES = {
  swarovskiHero: '/src/assets/images/hero_swarovski_shine_bundle_1795070435988.jpg',
  swarovskiMachine: '/src/assets/images/product_swarovski_citiz_detail_1795070439037.jpg',
  swarovskiAccessories: '/src/assets/images/product_swarovski_travel_mug_1795070445623.jpg',
  vertuoMachine: '/src/assets/images/product_vertuo_machine_1795070438409.jpg',
  originalCapsules: '/src/assets/images/product_original_capsules_1795070438590.jpg',
  aeroccinoAccessories: '/src/assets/images/product_aeroccino_accessories_1795070450549.jpg',
} as const;

export const STOREFRONT_CATALOG: CatalogItem[] = [
  {
    id: 'swarovski-shine-bundle',
    slug: 'swarovski-shine-bundle',
    name: 'Nespresso × Swarovski Shine Bundle',
    category: 'machines',
    line: 'Original',
    priceSgd: 499,
    compareAtSgd: 609,
    tag: 'Limited Holiday Edition',
    shortDesc: 'CitiZ Platinum Crystal Edition paired with crystal-embellished Travel Mug, PIXIE Cups, and 62-facet Ornament.',
    image: IMAGES.swarovskiMachine,
    isSwarovskiPdp: true,
    cupSizes: 'Ristretto · Espresso · Lungo · Americano',
  },
  {
    id: 'citiz-platinum-stainless',
    slug: 'citiz-platinum-stainless',
    name: 'CitiZ Platinum Stainless Steel',
    category: 'machines',
    line: 'Original',
    priceSgd: 399,
    shortDesc: '19-bar high-pressure extraction in an iconic retro-modern silhouette with dedicated Americano and hot water modes.',
    image: IMAGES.vertuoMachine,
    cupSizes: 'Espresso · Lungo · Americano · XL',
  },
  {
    id: 'vertuo-next-matte',
    slug: 'vertuo-next-matte',
    name: 'Vertuo Next & Aeroccino3 Bundle',
    category: 'machines',
    line: 'Vertuo',
    priceSgd: 358,
    compareAtSgd: 428,
    tag: 'Complimentary Tasting Box',
    shortDesc: 'Centrifusion extraction reading each capsule barcode for rich crema across five cup sizes up to Carafe.',
    image: IMAGES.vertuoMachine,
    cupSizes: 'Espresso · Double · Gran Lungo · Mug',
  },
  {
    id: 'ispirazione-arpeggio',
    slug: 'ispirazione-firenze-arpeggio',
    name: 'Ispirazione Firenze Arpeggio (10 Capsules)',
    category: 'capsules',
    line: 'Original',
    priceSgd: 9.5,
    shortDesc: 'Intense, creamy dark-roast Arabica blend inspired by Florence with deep cocoa and roasted malt notes.',
    image: IMAGES.originalCapsules,
    intensity: 9,
    cupSizes: 'Ristretto 25 ml · Espresso 40 ml',
  },
  {
    id: 'ristretto-italiano',
    slug: 'ristretto-italiano',
    name: 'Ispirazione Ristretto Italiano (10 Capsules)',
    category: 'capsules',
    line: 'Original',
    priceSgd: 9.5,
    shortDesc: 'Full-bodied, contrasting roast balancing fruity acidity with rich chocolate and subtle berry undertones.',
    image: IMAGES.originalCapsules,
    intensity: 10,
    cupSizes: 'Ristretto 25 ml · Espresso 40 ml',
  },
  {
    id: 'aeroccino-4-frother',
    slug: 'aeroccino-4-milk-frother',
    name: 'Aeroccino 4 Milk Frother & Glass Set',
    category: 'accessories',
    line: 'Accessories',
    priceSgd: 168,
    shortDesc: 'Four one-touch milk textures from airy cold foam to dense cappuccino froth, dishwasher-safe stainless jug.',
    image: IMAGES.aeroccinoAccessories,
  },
];

export const SWAROVSKI_VARIANTS: SwarovskiVariant[] = [
  {
    id: 'shine-bundle',
    label: 'Swarovski Shine Bundle',
    subtitle: 'Machine + Crystal Travel Mug + PIXIE Cups + Ornament',
    priceSgd: 499,
    compareAtSgd: 609,
    sku: 'SG-OL-SWA-BUNDLE-26',
    inStock: true,
    includes: [
      'Nespresso × Swarovski CitiZ Platinum Machine',
      'Nespresso × Swarovski Travel Mug with Crystal Holder',
      'PIXIE Espresso & Lungo Stainless Cups Set',
      'Festive 62-Facet Crystal Capsule Ornament',
      'Complimentary 14-Capsule Original Tasting Box',
    ],
  },
  {
    id: 'machine-only',
    label: 'CitiZ Platinum × Swarovski',
    subtitle: 'Crystal-Embellished Machine Only',
    priceSgd: 429,
    compareAtSgd: 469,
    sku: 'SG-OL-SWA-MACH-26',
    inStock: true,
    includes: [
      'Nespresso × Swarovski CitiZ Platinum Machine',
      'Complimentary 14-Capsule Original Tasting Box',
      '2-Year Official Nespresso Singapore Warranty',
    ],
  },
  {
    id: 'milk-bundle',
    label: 'CitiZ Platinum & Milk × Swarovski',
    subtitle: 'Machine + Integrated Milk Frother Bundle',
    priceSgd: 509,
    compareAtSgd: 619,
    sku: 'SG-OL-SWA-MILK-26',
    inStock: true,
    includes: [
      'Nespresso × Swarovski CitiZ Platinum & Milk Machine',
      'Integrated Aeroccino Hot & Cold Milk Frother',
      'Festive 62-Facet Crystal Capsule Ornament',
      'Complimentary 14-Capsule Original Tasting Box',
    ],
  },
];

export const SWAROVSKI_GALLERY = [
  {
    id: 'bundle-hero',
    src: IMAGES.swarovskiHero,
    label: 'Complete Shine Bundle',
    caption: 'CitiZ Platinum Crystal Edition extracting crema beside the Travel Mug & Crystal Ornament',
  },
  {
    id: 'machine-profile',
    src: IMAGES.swarovskiMachine,
    label: 'CitiZ Platinum Crystal Band',
    caption: 'Brushed stainless steel chassis accented with precision-cut Swarovski crystal pavé',
  },
  {
    id: 'accessories-set',
    src: IMAGES.swarovskiAccessories,
    label: 'Travel Mug, PIXIE Cups & Ornament',
    caption: 'Includes the crystal-collar Travel Mug, PIXIE Cups, and 62-facet Swarovski capsule ornament',
  },
  {
    id: 'coffee-pairing',
    src: IMAGES.originalCapsules,
    label: '14-Capsule Tasting Assortment',
    caption: 'Complimentary Original Line aluminium capsules included with every Singapore machine order',
  },
];

export const BUNDLE_INCLUSIONS = [
  {
    index: '01',
    title: 'CitiZ Platinum Crystal Edition',
    detail: 'Brushed stainless steel Original machine hand-accented with shimmering Swarovski crystals and five one-touch cup buttons.',
    image: IMAGES.swarovskiMachine,
  },
  {
    index: '02',
    title: 'Swarovski Travel Mug & Holder',
    detail: 'Double-walled insulated champagne tumbler paired with a detachable crystal-pavé collar for luminous coffee rituals on the move.',
    image: IMAGES.swarovskiAccessories,
  },
  {
    index: '03',
    title: 'PIXIE Espresso & Lungo Cups',
    detail: 'Double-walled stainless steel cups keeping espresso and lungo aromatic and warm at the ideal tasting temperature.',
    image: IMAGES.swarovskiAccessories,
  },
  {
    index: '04',
    title: '62-Facet Crystal Capsule Ornament',
    detail: 'Sculpted Original capsule keepsake crafted by Swarovski with 62 precision facets and a luminous shimmer finish.',
    image: IMAGES.swarovskiHero,
  },
];

export const BREW_MODES: BrewMode[] = [
  {
    id: 'espresso',
    name: 'Espresso',
    volumeMl: 40,
    brewTimeSec: 22,
    temperatureC: 86,
    description: 'High-pressure 19-bar extraction yielding a dense, hazelnut-tinted crema and concentrated aromatics.',
  },
  {
    id: 'lungo',
    name: 'Lungo',
    volumeMl: 110,
    brewTimeSec: 42,
    temperatureC: 85,
    description: 'Extended water flow engineered for Original Lungo blends, preserving clarity without over-extraction.',
  },
  {
    id: 'americano',
    name: 'Americano',
    volumeMl: 150,
    brewTimeSec: 48,
    temperatureC: 84,
    description: 'Dedicated two-stage cycle: 25 ml ristretto extraction followed automatically by 125 ml of pure hot water.',
  },
  {
    id: 'americano-xl',
    name: 'Americano XL',
    volumeMl: 200,
    brewTimeSec: 56,
    temperatureC: 84,
    description: 'Generous café-style long black combining a 40 ml espresso base with 160 ml tempered water.',
  },
  {
    id: 'hot-water',
    name: 'Hot Water',
    volumeMl: 200,
    brewTimeSec: 32,
    temperatureC: 88,
    description: 'Clean, instant hot water spout for pre-warming cups or preparing loose-leaf tea.',
  },
];

export const TECHNICAL_SPECS = [
  { label: 'Pump Pressure', value: '19 bar' },
  { label: 'Heat-Up Time', value: '25 seconds' },
  { label: 'Water Tank Capacity', value: '1.0 L removable' },
  { label: 'Dimensions (W × D × H)', value: '130 × 389 × 277 mm' },
  { label: 'Machine Weight', value: '4.0 kg' },
  { label: 'Used Capsule Container', value: '9–14 capsules' },
  { label: 'Power Rating (SG 230V)', value: '1,260 W · Type G Plug' },
  { label: 'Auto Power-Off', value: 'Eco mode after 2 min' },
];

export const PAIRING_SLEEVES = [
  {
    id: 'sleeve-arpeggio',
    name: 'Ispirazione Firenze Arpeggio',
    notes: 'Intensity 9 · Intense & Creamy · Cocoa',
    priceSgd: 9.5,
    image: IMAGES.originalCapsules,
  },
  {
    id: 'sleeve-ristretto',
    name: 'Ispirazione Ristretto Italiano',
    notes: 'Intensity 10 · Dark Roast · Berry & Chocolate',
    priceSgd: 9.5,
    image: IMAGES.originalCapsules,
  },
  {
    id: 'sleeve-volluto',
    name: 'Volluto',
    notes: 'Intensity 4 · Sweet & Light · Biscuit & Fruit',
    priceSgd: 9.2,
    image: IMAGES.originalCapsules,
  },
];

export const SG_BOUTIQUES = [
  { name: 'ION Orchard Flagship', address: '2 Orchard Turn, #01-14', hours: '10:00 – 21:30' },
  { name: 'Takashimaya S.C.', address: '391 Orchard Road, B1-33', hours: '10:00 – 21:30' },
  { name: 'Raffles City', address: '252 North Bridge Road, #01-16', hours: '10:00 – 21:30' },
  { name: 'Jewel Changi Airport', address: '78 Airport Boulevard, #01-244', hours: '10:00 – 22:00' },
];

export function formatSgd(amount: number): string {
  return `SGD ${amount.toFixed(2)}`;
}
