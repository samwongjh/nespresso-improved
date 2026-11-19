import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Coffee,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { PAIRING_SLEEVES, VERTUO_PAIRING_SLEEVES, formatSgd } from '../data/catalog';
import { ResilientImage } from './ResilientImage';

export interface BagItem {
  id: string;
  name: string;
  subtitle: string;
  priceSgd: number;
  image: string;
  quantity: number;
  itemType?: 'machine' | 'capsule' | 'accessory' | 'bundle';
  line?: 'Original' | 'Vertuo' | 'Accessories';
}

interface BagDrawerProps {
  isOpen: boolean;
  items: BagItem[];
  highlightedMachineLine?: 'Original' | 'Vertuo' | null;
  onClose: () => void;
  onAddToCart: (item: BagItem) => void;
  onUpdateQuantity: (id: string, nextQuantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearBag: () => void;
  onBrowseSwarovski: () => void;
  onOrderCompleted?: (orderTotalSgd: number) => void;
}

type DrawerStep = 'cart' | 'checkout' | 'confirmed';
type PaymentMethod = 'Card' | 'PayNow' | 'Cash on Delivery';

const FREE_DELIVERY_THRESHOLD = 80;
const STANDARD_DELIVERY_FEE = 10;

export function BagDrawer({
  isOpen,
  items,
  highlightedMachineLine,
  onClose,
  onAddToCart,
  onUpdateQuantity,
  onRemoveItem,
  onClearBag,
  onBrowseSwarovski,
  onOrderCompleted,
}: BagDrawerProps) {
  const [step, setStep] = useState<DrawerStep>('cart');
  const [capsuleTab, setCapsuleTab] = useState<'Original' | 'Vertuo'>('Original');
  const [justAddedCapsuleId, setJustAddedCapsuleId] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PayNow');
  const [formError, setFormError] = useState('');
  const [orderSnapshot, setOrderSnapshot] = useState<{
    orderNumber: string;
    totalSgd: number;
    payment: PaymentMethod;
    postal: string;
  } | null>(null);

  useEffect(() => {
    if (highlightedMachineLine === 'Vertuo' || highlightedMachineLine === 'Original') {
      setCapsuleTab(highlightedMachineLine);
    }
  }, [highlightedMachineLine]);

  if (!isOpen) return null;

  const subtotalSgd = items.reduce((sum, item) => sum + item.priceSgd * item.quantity, 0);
  const qualifiesFreeDelivery = subtotalSgd >= FREE_DELIVERY_THRESHOLD || subtotalSgd === 0;
  const deliveryFeeSgd = qualifiesFreeDelivery ? 0 : STANDARD_DELIVERY_FEE;
  const totalSgd = subtotalSgd + deliveryFeeSgd;
  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotalSgd);
  const progressPct = Math.min(100, (subtotalSgd / FREE_DELIVERY_THRESHOLD) * 100);

  const hasMachineInCart =
    Boolean(highlightedMachineLine) ||
    items.some(
      (item) =>
        item.itemType === 'machine' ||
        item.name.toLowerCase().includes('machine') ||
        item.name.toLowerCase().includes('citiz') ||
        item.name.toLowerCase().includes('vertuo next') ||
        item.name.toLowerCase().includes('swarovski shine bundle')
    );

  const suggestedCapsules = capsuleTab === 'Vertuo' ? VERTUO_PAIRING_SLEEVES : PAIRING_SLEEVES;

  const handleClose = () => {
    if (step === 'confirmed') {
      setStep('cart');
    }
    onClose();
  };

  const handleAddCompatibleCapsule = (sleeve: (typeof PAIRING_SLEEVES)[number] | (typeof VERTUO_PAIRING_SLEEVES)[number]) => {
    onAddToCart({
      id: sleeve.id,
      name: `${sleeve.name} (10 Capsules)`,
      subtitle: `${sleeve.line} Line Sleeve`,
      priceSgd: sleeve.priceSgd,
      image: sleeve.image,
      quantity: 1,
      itemType: 'capsule',
      line: sleeve.line,
    });
    setJustAddedCapsuleId(sleeve.id);
    window.setTimeout(() => {
      setJustAddedCapsuleId((curr) => (curr === sleeve.id ? null : curr));
    }, 1400);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim() || !/^\d{6}$/.test(postalCode.trim())) {
      setFormError('Please enter your full name, Singapore mobile number, street address, and 6-digit postal code.');
      return;
    }
    setFormError('');
    const orderNumber = `SG-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderSnapshot({
      orderNumber,
      totalSgd,
      payment: paymentMethod,
      postal: postalCode.trim(),
    });
    onClearBag();
    onOrderCompleted?.(totalSgd);
    setStep('confirmed');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#1B1918]/50 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
    >
      <div className="absolute inset-0" onClick={handleClose} aria-hidden="true" />

      <aside className="relative z-10 w-full max-w-md bg-[#FAF9F6] h-full flex flex-col border-l border-[#E7E4DF] shadow-2xl">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-[#FFFFFF] border-b border-[#E7E4DF] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="p-1.5 -ml-1.5 text-[#57524E] hover:text-[#1B1918] transition-colors cursor-pointer"
                aria-label="Back to shopping cart"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="font-serif text-xl font-medium text-[#1B1918]">
              {step === 'cart' && 'Your Shopping Cart'}
              {step === 'checkout' && 'Singapore Delivery & Payment'}
              {step === 'confirmed' && 'Order Confirmed'}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-2 -mr-2 text-[#57524E] hover:text-[#1B1918] transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Close shopping cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Cart Items */}
        {step === 'cart' && (
          <>
            {/* Free Delivery Threshold Banner */}
            {items.length > 0 && (
              <div className="px-6 py-3 bg-[#F2EFE9] border-b border-[#E7E4DF] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#1B1918]">
                    {qualifiesFreeDelivery
                      ? 'You qualify for Complimentary Singapore Delivery'
                      : `Add ${formatSgd(amountToFreeDelivery)} more for Complimentary Delivery`}
                  </span>
                  <span className="text-[#7A746E] tabular-nums">
                    {formatSgd(FREE_DELIVERY_THRESHOLD)}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#DFDAD1] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#9E7B4F] transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                  <ShoppingBag className="w-10 h-10 text-[#9E7B4F] stroke-[1.4]" />
                  <div className="space-y-1.5">
                    <p className="text-base font-medium text-[#1B1918]">
                      Your shopping cart is currently empty.
                    </p>
                    <p className="text-xs text-[#6B655F] max-w-xs leading-relaxed">
                      Explore the limited-edition Nespresso × Swarovski Shine Bundle or Original
                      Grand Cru sleeves.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                      onBrowseSwarovski();
                    }}
                    className="px-5 py-2.5 bg-[#1B1918] hover:bg-[#9E7B4F] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                  >
                    Explore Swarovski Shine Bundle
                  </button>
                </div>
              ) : (
                <>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#FFFFFF] border border-[#E7E4DF] rounded-sm p-4 flex gap-4"
                    >
                      <div className="w-20 h-20 rounded-sm overflow-hidden bg-[#F2EFE9] shrink-0">
                        <ResilientImage
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          fallbackTitle={item.name}
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-[#1B1918] leading-snug truncate">
                              {item.name}
                            </h3>
                            <p className="text-xs text-[#6B655F] truncate mt-0.5">
                              {item.subtitle}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            className="text-[#8E8882] hover:text-[#1B1918] p-1 transition-colors cursor-pointer shrink-0"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-3">
                          <div className="inline-flex items-center border border-[#DDD8D0] rounded-sm">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 text-[#57524E] hover:text-[#1B1918] cursor-pointer"
                              aria-label="Decrease item quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center text-xs font-semibold text-[#1B1918] tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 text-[#57524E] hover:text-[#1B1918] cursor-pointer"
                              aria-label="Increase item quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="text-sm font-semibold text-[#1B1918] tabular-nums">
                            {formatSgd(item.priceSgd * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Compatible Capsule Pairing Prompt when a Machine is Added */}
                  {hasMachineInCart && (
                    <div className="bg-[#FFFFFF] border border-[#DDD3C3] rounded-sm p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <Coffee className="w-4 h-4 text-[#9E7B4F] shrink-0 mt-0.5" />
                          <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1B1918]">
                              Add Capsules for Your Machine
                            </h3>
                            <p className="text-xs text-[#57524E] mt-0.5">
                              Pair your machine with 10-capsule sleeves so you can brew immediately.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="inline-flex items-center gap-1 p-1 bg-[#F2EFE9] rounded-sm">
                        {(['Original', 'Vertuo'] as const).map((line) => (
                          <button
                            key={line}
                            type="button"
                            onClick={() => setCapsuleTab(line)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors cursor-pointer ${
                              capsuleTab === line
                                ? 'bg-[#FFFFFF] text-[#1B1918] font-semibold shadow-xs'
                                : 'text-[#57524E] hover:text-[#1B1918]'
                            }`}
                          >
                            {line} Capsules
                          </button>
                        ))}
                      </div>

                      <div className="space-y-2">
                        {suggestedCapsules.map((sleeve) => {
                          const isAdded = justAddedCapsuleId === sleeve.id;
                          return (
                            <div
                              key={sleeve.id}
                              className="flex items-center justify-between gap-3 py-2 border-t border-[#F2EFE9] first:border-t-0 first:pt-0"
                            >
                              <div className="min-w-0">
                                <div className="text-xs font-semibold text-[#1B1918] truncate">
                                  {sleeve.name}
                                </div>
                                <div className="text-xs text-[#6B655F] truncate">
                                  {sleeve.notes} · <span className="tabular-nums font-medium text-[#1B1918]">{formatSgd(sleeve.priceSgd)}</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleAddCompatibleCapsule(sleeve)}
                                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] rounded-sm transition-colors shrink-0 cursor-pointer inline-flex items-center gap-1 ${
                                  isAdded
                                    ? 'bg-[#2C4C3E] text-white'
                                    : 'bg-[#FAF9F6] border border-[#DDD8D0] hover:border-[#1B1918] text-[#1B1918]'
                                }`}
                              >
                                {isAdded ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    <span>ADDED</span>
                                  </>
                                ) : (
                                  <span>ADD TO CART</span>
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {items.length > 0 && (
              <div className="bg-[#FFFFFF] border-t border-[#E7E4DF] p-6 space-y-4">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-[#57524E]">
                    <span>Subtotal</span>
                    <span className="tabular-nums">{formatSgd(subtotalSgd)}</span>
                  </div>
                  <div className="flex justify-between text-[#57524E]">
                    <span>Singapore Delivery</span>
                    <span className="tabular-nums">
                      {deliveryFeeSgd === 0 ? 'Complimentary' : formatSgd(deliveryFeeSgd)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-[#1B1918] pt-2 border-t border-[#F0EDE7]">
                    <span>Total (incl. GST)</span>
                    <span className="tabular-nums">{formatSgd(totalSgd)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="w-full py-3.5 bg-[#1B1918] hover:bg-[#9E7B4F] text-[#FAF9F6] text-xs font-semibold uppercase tracking-[0.12em] rounded-sm transition-colors cursor-pointer min-h-[44px]"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
        )}

        {/* Step 2: Checkout Verification Form */}
        {step === 'checkout' && (
          <form onSubmit={handlePlaceOrder} className="flex-1 flex flex-col justify-between overflow-y-auto">
            <div className="p-6 space-y-5">
              <div className="bg-[#FFFFFF] border border-[#E7E4DF] rounded-sm p-4 flex items-center justify-between text-sm">
                <span className="text-[#57524E]">Order Total (incl. GST)</span>
                <span className="font-semibold text-[#1B1918] tabular-nums">
                  {formatSgd(totalSgd)}
                </span>
              </div>

              {formError && (
                <div
                  role="alert"
                  className="bg-[#FDF4F2] border border-[#E3B5AA] text-[#8C2D19] text-xs p-3 rounded-sm"
                >
                  {formError}
                </div>
              )}

              <div className="space-y-3.5">
                <div>
                  <label htmlFor="sg-fullname" className="block text-xs font-medium text-[#4A4642] mb-1">
                    Full Name
                  </label>
                  <input
                    id="sg-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Cheryl Tan"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DDD8D0] rounded-sm focus:outline-none focus:border-[#9E7B4F]"
                  />
                </div>

                <div>
                  <label htmlFor="sg-phone" className="block text-xs font-medium text-[#4A4642] mb-1">
                    Singapore Mobile (+65)
                  </label>
                  <input
                    id="sg-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9123 4567"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DDD8D0] rounded-sm focus:outline-none focus:border-[#9E7B4F]"
                  />
                </div>

                <div>
                  <label htmlFor="sg-address" className="block text-xs font-medium text-[#4A4642] mb-1">
                    Street Address &amp; Unit Number
                  </label>
                  <input
                    id="sg-address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 2 Orchard Turn, #12-08"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DDD8D0] rounded-sm focus:outline-none focus:border-[#9E7B4F]"
                  />
                </div>

                <div>
                  <label htmlFor="sg-postal" className="block text-xs font-medium text-[#4A4642] mb-1">
                    Singapore Postal Code (6 Digits)
                  </label>
                  <input
                    id="sg-postal"
                    type="text"
                    maxLength={6}
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 238801"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DDD8D0] rounded-sm tabular-nums focus:outline-none focus:border-[#9E7B4F]"
                  />
                </div>

                <div className="pt-1">
                  <span className="block text-xs font-medium text-[#4A4642] mb-2">
                    Payment Method
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['PayNow', 'Card', 'Cash on Delivery'] as PaymentMethod[]).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`px-2.5 py-2.5 text-xs font-medium rounded-sm border transition-colors cursor-pointer text-center ${
                          paymentMethod === method
                            ? 'bg-[#1B1918] text-white border-[#1B1918]'
                            : 'bg-[#FFFFFF] text-[#4A4642] border-[#DDD8D0] hover:border-[#1B1918]'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#FFFFFF] border-t border-[#E7E4DF]">
              <button
                type="submit"
                className="w-full py-3.5 bg-[#9E7B4F] hover:bg-[#876740] text-white text-xs font-semibold uppercase tracking-[0.12em] rounded-sm transition-colors cursor-pointer min-h-[44px]"
              >
                Confirm Order — {formatSgd(totalSgd)}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Post-Order Confirmation Receipt */}
        {step === 'confirmed' && orderSnapshot && (
          <div className="flex-1 p-6 flex flex-col justify-center items-center text-center space-y-6">
            <CheckCircle2 className="w-12 h-12 text-[#2C4C3E] stroke-[1.5]" />
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9E7B4F] tabular-nums">
                Order #{orderSnapshot.orderNumber} Confirmed
              </div>
              <h3 className="font-serif text-2xl font-medium text-[#1B1918]">
                Preparing Same-Day Singapore Dispatch
              </h3>
              <p className="text-xs text-[#57524E] max-w-xs leading-relaxed">
                Thank you for ordering with Nespresso Singapore. Your courier tracking link will
                arrive via SMS shortly.
              </p>
            </div>

            <div className="w-full bg-[#FFFFFF] border border-[#E7E4DF] rounded-sm p-4 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-[#6B655F]">Amount Paid ({orderSnapshot.payment})</span>
                <span className="font-semibold text-[#1B1918] tabular-nums">
                  {formatSgd(orderSnapshot.totalSgd)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B655F]">Destination Postal Code</span>
                <span className="font-medium text-[#1B1918] tabular-nums">
                  Singapore {orderSnapshot.postal}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B655F]">Warranty Registration</span>
                <span className="font-medium text-[#2C4C3E]">Active (2 Years)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-3 bg-[#1B1918] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-sm cursor-pointer"
            >
              Continue Exploring Nespresso SG
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
