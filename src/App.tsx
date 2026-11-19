import { useEffect, useState } from 'react';
import { BagDrawer, BagItem } from './components/BagDrawer';
import { Footer } from './components/Footer';
import { AppView, Header } from './components/Header';
import { MachineCompareModal } from './components/MachineCompareModal';
import { StorefrontHome } from './components/StorefrontHome';
import { SwarovskiBundlePDP } from './components/SwarovskiBundlePDP';
import { MachineComparisonSpec, ProductCategory } from './data/catalog';

const BAG_STORAGE_KEY = 'nespresso_sg_bag_v1';

function getInitialViewFromHash(): AppView {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash;
    if (hash.includes('swarovski-shine-bundle')) {
      return 'pdp';
    }
  }
  return 'home';
}

export default function App() {
  const [view, setView] = useState<AppView>(getInitialViewFromHash);
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [highlightedMachineLine, setHighlightedMachineLine] = useState<'Original' | 'Vertuo' | null>(null);
  const [cartItems, setCartItems] = useState<BagItem[]>(() => {
    try {
      const saved = window.localStorage.getItem(BAG_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as BagItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage errors in restricted environments
    }
  }, [cartItems]);

  useEffect(() => {
    const handleHashChange = () => {
      setView(getInitialViewFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToHome = (sectionId?: string, categoryFilter?: ProductCategory | 'all') => {
    if (categoryFilter) {
      setActiveCategory(categoryFilter);
    }
    setView('home');
    window.location.hash = '/';
    window.requestAnimationFrame(() => {
      if (sectionId && sectionId !== 'top') {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  const navigateToSwarovskiPdp = () => {
    setView('pdp');
    window.location.hash = '/order/machines/original/swarovski-shine-bundle';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (incoming: BagItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === incoming.id);
      if (existing) {
        return prev.map((i) =>
          i.id === incoming.id ? { ...i, quantity: Math.min(10, i.quantity + incoming.quantity) } : i
        );
      }
      return [...prev, incoming];
    });

    if (
      incoming.itemType === 'machine' &&
      (incoming.line === 'Original' || incoming.line === 'Vertuo')
    ) {
      setHighlightedMachineLine(incoming.line);
    }
    setIsCartOpen(true);
  };

  const handleAddManyToCart = (incomingItems: BagItem[]) => {
    if (incomingItems.length === 0) return;

    setCartItems((prev) => {
      let next = [...prev];
      for (const incoming of incomingItems) {
        const existingIdx = next.findIndex((i) => i.id === incoming.id);
        if (existingIdx >= 0) {
          const existing = next[existingIdx];
          next[existingIdx] = {
            ...existing,
            quantity: Math.min(10, existing.quantity + incoming.quantity),
          };
        } else {
          next.push(incoming);
        }
      }
      return next;
    });

    const machineItem = incomingItems.find(
      (i) => i.itemType === 'machine' && (i.line === 'Original' || i.line === 'Vertuo')
    );
    if (machineItem && (machineItem.line === 'Original' || machineItem.line === 'Vertuo')) {
      setHighlightedMachineLine(machineItem.line);
    }
    setIsCartOpen(true);
  };

  const handleAddComparedMachineToCart = (machine: MachineComparisonSpec) => {
    handleAddToCart({
      id: machine.id,
      name: machine.name,
      subtitle: `${machine.line} Line`,
      priceSgd: machine.priceSgd,
      image: machine.image,
      quantity: 1,
      itemType: 'machine',
      line: machine.line,
    });
  };

  const handleToggleCompare = (machineId: string) => {
    setCompareIds((prev) =>
      prev.includes(machineId) ? prev.filter((id) => id !== machineId) : [...prev, machineId]
    );
  };

  const handleUpdateQuantity = (id: string, nextQty: number) => {
    if (nextQty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.min(10, nextQty) } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1B1918]">
      <Header
        currentView={view}
        bagCount={totalCartCount}
        onNavigateHome={navigateToHome}
        onNavigatePdp={navigateToSwarovskiPdp}
        onOpenBag={() => setIsCartOpen(true)}
      />

      <div className="flex-1">
        {view === 'home' ? (
          <StorefrontHome
            activeCategory={activeCategory}
            compareIds={compareIds}
            onChangeCategory={setActiveCategory}
            onToggleCompare={handleToggleCompare}
            onOpenCompare={() => setIsCompareOpen(true)}
            onClearCompare={() => setCompareIds([])}
            onOpenSwarovskiPdp={navigateToSwarovskiPdp}
            onAddToBag={handleAddToCart}
          />
        ) : (
          <SwarovskiBundlePDP
            onBackToStorefront={() => navigateToHome('top', 'all')}
            onAddToBag={handleAddToCart}
            onAddManyToBag={handleAddManyToCart}
          />
        )}
      </div>

      <Footer
        onNavigateHome={() => navigateToHome('top', 'all')}
        onNavigatePdp={navigateToSwarovskiPdp}
      />

      <MachineCompareModal
        isOpen={isCompareOpen}
        selectedIds={compareIds}
        onSetSelectedIds={setCompareIds}
        onClose={() => setIsCompareOpen(false)}
        onAddToCart={handleAddComparedMachineToCart}
        onOpenSwarovskiPdp={navigateToSwarovskiPdp}
      />

      <BagDrawer
        isOpen={isCartOpen}
        items={cartItems}
        highlightedMachineLine={highlightedMachineLine}
        onClose={() => setIsCartOpen(false)}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearBag={() => {
          setCartItems([]);
          setHighlightedMachineLine(null);
        }}
        onBrowseSwarovski={navigateToSwarovskiPdp}
      />
    </div>
  );
}
