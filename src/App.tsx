import { useEffect, useState } from 'react';
import { BagDrawer, BagItem } from './components/BagDrawer';
import { Footer } from './components/Footer';
import { AppView, Header } from './components/Header';
import { StorefrontHome } from './components/StorefrontHome';
import { SwarovskiBundlePDP } from './components/SwarovskiBundlePDP';
import { ProductCategory } from './data/catalog';

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
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [bagItems, setBagItems] = useState<BagItem[]>(() => {
    try {
      const saved = window.localStorage.getItem(BAG_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as BagItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(bagItems));
    } catch {
      // Ignore storage errors in restricted environments
    }
  }, [bagItems]);

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

  const handleAddToBag = (incoming: BagItem) => {
    setBagItems((prev) => {
      const existing = prev.find((i) => i.id === incoming.id);
      if (existing) {
        return prev.map((i) =>
          i.id === incoming.id ? { ...i, quantity: Math.min(10, i.quantity + incoming.quantity) } : i
        );
      }
      return [...prev, incoming];
    });
    setIsBagOpen(true);
  };

  const handleUpdateQuantity = (id: string, nextQty: number) => {
    if (nextQty <= 0) {
      setBagItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setBagItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.min(10, nextQty) } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setBagItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalBagCount = bagItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1B1918]">
      <Header
        currentView={view}
        bagCount={totalBagCount}
        onNavigateHome={navigateToHome}
        onNavigatePdp={navigateToSwarovskiPdp}
        onOpenBag={() => setIsBagOpen(true)}
      />

      <div className="flex-1">
        {view === 'home' ? (
          <StorefrontHome
            activeCategory={activeCategory}
            onChangeCategory={setActiveCategory}
            onOpenSwarovskiPdp={navigateToSwarovskiPdp}
            onAddToBag={handleAddToBag}
          />
        ) : (
          <SwarovskiBundlePDP
            onBackToStorefront={() => navigateToHome('top', 'all')}
            onAddToBag={handleAddToBag}
          />
        )}
      </div>

      <Footer
        onNavigateHome={() => navigateToHome('top', 'all')}
        onNavigatePdp={navigateToSwarovskiPdp}
      />

      <BagDrawer
        isOpen={isBagOpen}
        items={bagItems}
        onClose={() => setIsBagOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearBag={() => setBagItems([])}
        onBrowseSwarovski={navigateToSwarovskiPdp}
      />
    </div>
  );
}
