import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Home, 
  Package, 
  Receipt, 
  Settings, 
  HelpCircle, 
  LayoutDashboard,
  ShieldCheck,
  Shield,
  Bell,
  ShoppingBag,
  ShoppingCart,
  Star,
  ThumbsUp,
  ArrowRight,
  Filter,
  Map as MapIcon,
  Menu,
  X,
  Plus,
  Minus,
  Clock,
  Calendar,
  CreditCard,
  Landmark,
  CheckCircle2,
  ChevronRight,
  Info,
  Heart,
  Eye,
  EyeOff,
  Trash2,
  Tv,
  Monitor,
  Lamp,
  Wind,
  Coffee,
  Archive,
  Smartphone,
  Cpu,
  History,
  User,
  Mail,
  Edit2,
  Camera,
  LogOut,
  AlertCircle,
  MessageSquare,
  Store,
  TrendingUp,
  Truck,
  Wrench,
  DollarSign,
  Users,
  MapPin,
  Navigation
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

// Types
interface Variant {
  type: string;
  options: string[];
}

interface Product {
  id: number;
  category: string;
  image: string;
  title: string;
  vendor: string;
  price: number;
  deposit: number;
  status: string;
  statusColor?: string;
  rating?: number;
  reviewCount?: number;
  variants?: Variant[];
}

interface CartItem {
  id: number;
  selectedVariants: Record<string, string>;
  quantity: number;
}

const getFallbackImage = (title: string, options: ImageOptions = {}) => {
  const { width = 800, height, quality = 80, fit = 'crop', format = 'auto' } = options;
  const tl = title.toLowerCase();
  const hash = title.split('').reduce((acc, char, i) => ((acc << 5) - acc) + char.charCodeAt(0) + i, 0);
  const salt = Math.abs(hash) % 1000;
  
  const baseParams = `auto=${format === 'auto' ? 'format' : format}&fit=${fit}&q=${quality}&w=${width}${height ? `&h=${height}` : ''}&sig=${salt}`;
  
  let baseUrl = '';
  if (tl.includes('washing machine') || tl.includes('washer') || tl.includes('laundry')) baseUrl = 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1';
  else if (tl.includes('chair') || tl.includes('seat') || tl.includes('stool')) baseUrl = 'https://images.unsplash.com/photo-1541558869434-2839b321b424';
    
  else if (tl.includes('desk') || tl.includes('table') || tl.includes('workstation')) baseUrl = 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd';
    
  else if (tl.includes('fridge') || tl.includes('refriger') || tl.includes('freezer')) baseUrl = 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30';
    
  else if (tl.includes('bed') || tl.includes('mattress') || tl.includes('sleep')) 
    baseUrl = 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85';
    
  else if (tl.includes('ac ') || tl.includes('air cond') || tl.includes('cooler') || tl.includes('climate')) baseUrl = 'https://images.unsplash.com/photo-1527344073380-49638706d87f';
  else if (tl.includes('cook') || tl.includes('induc') || tl.includes('stove') || tl.includes('hob')) baseUrl = 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078';
  else if (tl.includes('micro') || tl.includes('oven') || tl.includes('grill')) baseUrl = 'https://images.unsplash.com/photo-1585659722983-38ca6114bcfe';
    
  else if (tl.includes('wardrobe') || tl.includes('closet') || tl.includes('cupboard') || tl.includes('cabinet')) baseUrl = 'https://plus.unsplash.com/premium_photo-1681412205562-b1319b2a7590';
    
  else if (tl.includes('fan') || tl.includes('ventil')) baseUrl = 'https://images.unsplash.com/photo-1565022513478-f79a9cdce8df';
    
  else if (tl.includes('iron') || tl.includes('steam')) baseUrl = 'https://images.unsplash.com/photo-1586041857948-438914619d85';
    
  else if (tl.includes('purifi') || tl.includes('water') || tl.includes('filter')) baseUrl = 'https://images.unsplash.com/photo-1549488344-c10444fc4fb7';
    
  else if (tl.includes('shelf') || tl.includes('book') || tl.includes('rack') || tl.includes('storage')) baseUrl = 'https://images.unsplash.com/photo-1594620302200-9a762244a156';
    
  else if (tl.includes('sofa') || tl.includes('couch') || tl.includes('lounge')) baseUrl = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc';


  else if (tl.includes('lamp') || tl.includes('light')) baseUrl = 'https://images.unsplash.com/photo-1534073828943-f801091bb18c';

  else if (tl.includes('mirror')) baseUrl = 'https://images.unsplash.com/photo-1618220179428-22790b461013';

  if (!baseUrl) {
    // Fallback to hashed generic images for uniqueness per title
    const generic = [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126',
      'https://images.unsplash.com/photo-1505693314120-0d443867891c',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858',
      'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85'
    ];
    baseUrl = generic[Math.abs(hash) % generic.length];
  }
  return `${baseUrl}?${baseParams}`;
};

interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  fit?: 'crop' | 'max' | 'clamp' | 'facearea' | 'fill' | 'fillmax' | 'scale';
  format?: 'webp' | 'jpg' | 'png' | 'avif';
}

const getProductImage = (title: string, image: string, options: ImageOptions = {}) => {
  if (image && (image.startsWith('http') || image.startsWith('/'))) {
    if (image.includes('unsplash.com') && !image.includes('?')) {
      const { width = 800, height, quality = 80, fit = 'crop', format = 'auto' } = options;
      return `${image}?auto=${format === 'auto' ? 'format' : format}&fit=${fit}&q=${quality}&w=${width}${height ? `&h=${height}` : ''}`;
    }
    return image;
  }
  return getFallbackImage(title, options);
};

const getPasswordStrength = (password: string) => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const getPasswordStrengthLabel = (score: number) => {
  if (score <= 1) return { label: 'Weak', color: 'text-red-500', barColor: 'bg-red-500' };
  if (score === 2) return { label: 'Fair', color: 'text-orange-500', barColor: 'bg-orange-500' };
  if (score === 3) return { label: 'Good', color: 'text-blue-500', barColor: 'bg-blue-500' };
  return { label: 'Strong', color: 'text-emerald-500', barColor: 'bg-emerald-500' };
};

const ProductSkeleton = () => (
  <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
    <div className="aspect-[4/3] bg-slate-100 animate-pulse relative" />
    <div className="p-5 space-y-3">
      <div className="flex justify-between items-start">
        <div className="h-4 w-2/3 bg-slate-100 animate-pulse rounded-md" />
        <div className="h-6 w-16 bg-slate-100 animate-pulse rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-1/3 bg-slate-50 animate-pulse rounded-md" />
        <div className="h-8 w-full bg-slate-50 animate-pulse rounded-xl" />
      </div>
    </div>
  </div>
);

const RatingStars = ({ rating, count, size = 14 }: { rating: number, count?: number, size?: number }) => (
  <div className="flex items-center gap-1">
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star 
          key={s} 
          size={size} 
          className={s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}
        />
      ))}
    </div>
    {count !== undefined && <span className="text-[10px] font-bold text-slate-400 mt-0.5">({count})</span>}
  </div>
);

const FilterDrawer = ({ isOpen, onClose, priceRange, setPriceRange, minRating, setMinRating, onReset }: any) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
        />
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-[70] p-8 flex flex-col"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-slate-900">Advanced Filters</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 space-y-10 overflow-y-auto no-scrollbar">
            {/* Price Range */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <h3 className="font-bold text-slate-900 text-sm">Max Price per Month</h3>
                <span className="text-[#2563eb] font-bold text-lg">${priceRange}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5"
                value={priceRange} 
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#2563eb]"
              />
              <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase">
                <span>$0</span>
                <span>$100+</span>
              </div>
            </div>

            {/* Minimum Rating */}
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-4">Minimum Rating</h3>
              <div className="grid grid-cols-2 gap-3">
                {[0, 3, 4, 4.5].map((r) => (
                  <button 
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`px-4 py-3 rounded-xl border font-bold text-xs transition-all flex items-center justify-center gap-2 ${minRating === r ? 'bg-[#2563eb] border-[#2563eb] text-white shadow-lg shadow-blue-500/20 scale-105' : 'bg-white border-slate-200 text-slate-600 hover:border-[#2563eb]/20'}`}
                  >
                    {r === 0 ? 'Any' : (
                      <>
                        {r}+ <Star size={12} className="fill-current" />
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 mt-auto space-y-3">
            <button 
              onClick={onReset}
              className="w-full py-4 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all text-sm"
            >
              Reset Filters
            </button>
            <button 
              onClick={onClose}
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all text-sm shadow-xl"
            >
              Show Results
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const MY_RENTALS = [
  { id: 101, title: 'Blue Star Portable AC', price: 40, startDate: 'Feb 12, 2024', status: 'Active', image: 'https://images.unsplash.com/photo-1527344073380-49638706d87f' /* CHANGE_IMAGE_SOURCE_HERE */ },
  { id: 102, title: 'Single Folding Bed', price: 18, startDate: 'Jan 05, 2024', status: 'Maintenance', image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c' /* CHANGE_IMAGE_SOURCE_HERE */ },
];

const ORDER_HISTORY = [
  { id: 201, title: 'Minimalist Study Desk', price: 15, duration: '6 Months', endDate: 'Dec 15, 2023', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd' /* CHANGE_IMAGE_SOURCE_HERE */, total: 90 },
  { id: 202, title: 'Haier 50L Mini Fridge', price: 20, duration: '3 Months', endDate: 'Nov 02, 2023', image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30' /* CHANGE_IMAGE_SOURCE_HERE */, total: 60 },
  { id: 203, title: 'Crompton Table Fan', price: 4, duration: '12 Months', endDate: 'Aug 24, 2023', image: 'https://images.unsplash.com/photo-1565022513478-f79a9cdce8df' /* CHANGE_IMAGE_SOURCE_HERE */, total: 48 },
];

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, category: 'Appliances', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a', title: 'Whirlpool 7kg Washing Machine', vendor: 'Home Appliances Co.', price: 25, deposit: 100, status: 'Available', rating: 4.8, reviewCount: 124, variants: [{ type: 'Color', options: ['White', 'Silver', 'Slate'] }, { type: 'Capacity', options: ['7kg', '8kg', '9kg'] }] },
  { id: 2, category: 'Office', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1', title: 'Ergonomic Study Chair', vendor: 'Student Essentials', price: 10, deposit: 25, status: 'Low Stock', statusColor: 'text-orange-500 bg-orange-50', rating: 4.5, reviewCount: 89, variants: [{ type: 'Color', options: ['Black', 'Blue', 'Grey', 'Orange'] }] },
  { id: 3, category: 'Living Room', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd', title: 'Minimalist Study Desk', vendor: 'IKEA Rentals', price: 15, deposit: 40, status: 'Available', rating: 4.7, reviewCount: 56, variants: [{ type: 'Finish', options: ['Oak', 'White', 'Walnut'] }] },
  { id: 4, category: 'Appliances', image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30', title: 'Haier 50L Mini Fridge', vendor: 'Campus Appliances', price: 20, deposit: 50, status: 'Available', rating: 4.9, reviewCount: 203 },
  { id: 5, category: 'Living Room', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85', title: 'Single Folding Bed', vendor: 'SleepWell', price: 18, deposit: 60, status: 'Available', rating: 4.2, reviewCount: 45 },
  { id: 6, category: 'Appliances', image: 'https://images.unsplash.com/photo-1527344073380-49638706d87f', title: 'Blue Star Portable AC', vendor: 'CoolBreeze', price: 40, deposit: 150, status: 'Available', rating: 4.6, reviewCount: 78 },
  { id: 7, category: 'Appliances', image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078', title: 'Prestige Induction Cooktop', vendor: 'Campus Appliances', price: 8, deposit: 20, status: 'Available', rating: 4.4, reviewCount: 32 },
  { id: 14, category: 'Living Room', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc', title: 'Modern Gray Sofa', vendor: 'Living Space', price: 45, deposit: 200, status: 'Available', rating: 4.9, reviewCount: 88 },
];

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, title: string, options: ImageOptions = {}) => {
  const target = e.currentTarget;
  const fallbackSrc = getFallbackImage(title, options);
  if (target.src !== fallbackSrc) {
    target.src = fallbackSrc;
  }
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [resetEmail, setResetEmail] = useState('');
  const [resetStep, setResetStep] = useState<'email' | 'success' | 'new-password'>('email');
  const [newPassword, setNewPassword] = useState('');
  
  const [activeTab, setActiveTab] = useState('Featured');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Custom states for cancellation and tracking
  const [myRentals, setMyRentals] = useState<any[]>(MY_RENTALS);
  const [orderHistory, setOrderHistory] = useState<any[]>(ORDER_HISTORY);
  const [rentalToCancel, setRentalToCancel] = useState<number | null>(null);
  const [showDeliveryTracking, setShowDeliveryTracking] = useState(false);
  const [deliveryTrackingId, setDeliveryTrackingId] = useState<number | null>(null);
  const [isVerifiedVendor, setIsVerifiedVendor] = useState(false);
  const [tickets, setTickets] = useState([
    { id: 1001, title: 'Logistics Request: Samsung Refrigerator', status: 'Processing', date: 'Today, 10:30 AM' }
  ]);

  // Products State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high'>('default');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Available' | 'Low Stock'>('all');
  const [priceRange, setPriceRange] = useState<number>(100);
  const [minRating, setMinRating] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showSettingsPassword, setShowSettingsPassword] = useState(false);
  const [showVendorPassword, setShowVendorPassword] = useState(false);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<{id: number, message: string, time: string, read: boolean}[]>([
    { id: 1, message: 'Welcome to RentEase! Start exploring trending products.', time: '2 mins ago', read: false }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleCart = (productId: number, title: string, selectedVariants: Record<string, string> = {}) => {
    setCart((prev) => {
      const matchIndex = prev.findIndex(item => 
        item.id === productId && 
        JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)
      );
      
      if (matchIndex > -1) {
        showToast(`Removed "${title}" from cart!`);
        return prev.filter((_, i) => i !== matchIndex);
      } else {
        showToast(`Added "${title}" to cart!`);
        return [...prev, { id: productId, selectedVariants, quantity: 1 }];
      }
    });
  };

  const updateCartQuantity = (productId: number, variants: Record<string, string>, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === productId && JSON.stringify(item.selectedVariants) === JSON.stringify(variants)) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Rating and Reviews State
  const [productReviews, setProductReviews] = useState<Record<number, { id: string, rating: number, comment: string, date: string, user: string }[]>>({});
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products from /api/products...');
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Products fetched successfully:', data.length);
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      // We don't set error here if we already have INITIAL_PRODUCTS and the fetch just failed
      if (products.length === 0) {
        setError('Could not load products. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  // Interaction States
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isCartCheckout, setIsCartCheckout] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationDetails, setConfirmationDetails] = useState<any>(null);
  const [rentalDuration, setRentalDuration] = useState(3);
  const [deliverySpeed, setDeliverySpeed] = useState<'Standard' | 'Express'>('Standard');
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('Morning (9 AM - 12 PM)');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedQuickViewVariants, setSelectedQuickViewVariants] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedProduct && selectedProduct.variants) {
      const initialVariants: Record<string, string> = {};
      selectedProduct.variants.forEach((v: any) => {
        initialVariants[v.type] = v.options[0];
      });
      setSelectedQuickViewVariants(initialVariants);
    } else {
      setSelectedQuickViewVariants({});
    }
  }, [selectedProduct]);
  const [isListing, setIsListing] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [vendorPassword, setVendorPassword] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [user, setUser] = useState({
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 0123-4567',
    kycStatus: 'Verified', // Verified, Pending, Rejected, Not Started
    avatar: 'JS',
    address: {
      street: '123 Rental Avenue',
      city: 'Tech City',
      state: 'CA',
      zip: '90210'
    },
    paymentMethods: [
      { id: 1, type: 'Visa', last4: '4242', expiry: '12/26', isDefault: true },
      { id: 2, type: 'Mastercard', last4: '8812', expiry: '05/25', isDefault: false }
    ],
    preferences: {
      autoRenewal: true,
      damageProtection: true,
      paperlessBilling: true
    },
    banking: {
      accountHolder: 'John Smith',
      bankName: 'Innovate Bank',
      accountNumber: '123456789012',
      routingNumber: '987654321'
    }
  });

  const [tempBanking, setTempBanking] = useState({ ...user.banking });
  const [showSettingsAccountNumber, setShowSettingsAccountNumber] = useState(false);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState({ name: user.name, email: user.email, phone: user.phone });

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState({ ...user.address });

  const [isEditingPayments, setIsEditingPayments] = useState(false);

  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [tempPreferences, setTempPreferences] = useState({ ...user.preferences });

  const [tempPaymentMethods, setTempPaymentMethods] = useState([...user.paymentMethods]);
  const [settingsPassword, setSettingsPassword] = useState('');
  const [activeSettingsSection, setActiveSettingsSection] = useState<string | null>(null);

  const navigateToTab = (tab: string) => {
    setActiveTab(tab);
    setSearchQuery('');
    setAppliedSearch('');
    setSortBy('default');
    setStatusFilter('all');
    setIsSidebarOpen(false);
  };

  // Close sidebar on window resize if switching to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const executeSearch = () => {
    setAppliedSearch(searchQuery);
    if (searchQuery.trim()) {
      setActiveTab('Search Results');
    }
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (activeTab === 'Appliances') list = list.filter(p => p.category === 'Appliances');
    if (activeTab === 'Living Room') list = list.filter(p => p.category === 'Living Room');
    if (activeTab === 'Office') list = list.filter(p => p.category === 'Office');
    
    if (appliedSearch) {
      list = list.filter(p => 
        p.title.toLowerCase().includes(appliedSearch.toLowerCase()) || 
        p.category.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        p.vendor.toLowerCase().includes(appliedSearch.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      list = list.filter(p => p.status === statusFilter);
    }

    // Price Filter
    list = list.filter(p => p.price <= priceRange);

    // Rating Filter
    if (minRating > 0) {
      list = list.filter(p => (p.rating || 0) >= minRating);
    }

    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [activeTab, appliedSearch, sortBy, statusFilter, priceRange, minRating, products]);

  const [selectedCheckoutVariants, setSelectedCheckoutVariants] = useState<Record<string, string>>({});

  const handleRentClick = (product: any, variants: Record<string, string> = {}) => {
    setSelectedProduct(product);
    setIsCartCheckout(false);
    setSelectedCheckoutVariants(variants);
    setRentalDuration(3);
    setShowCheckout(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center p-4 h-screen w-full overflow-hidden font-sans text-slate-900">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#2563eb] rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
                <LayoutDashboard size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Lease<span className="text-[#2563eb]">Ease</span></span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {authMode === 'login' ? 'Welcome back' : authMode === 'forgot' ? 'Reset Password' : 'Create an account'}
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              {authMode === 'login' ? 'Enter your details to access your account' : 
               authMode === 'forgot' ? 'Recover access to your account' :
               'Sign up to start renting premium goods'}
            </p>
          </div>

          <div className="space-y-4">
            {authMode === 'forgot' ? (
              <div className="space-y-4">
                {resetStep === 'email' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="you@example.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <button 
                      onClick={() => {
                        if (resetEmail) {
                          setResetStep('success');
                          showToast(`Reset link sent to ${resetEmail}`);
                        } else {
                          showToast('Please enter your email address');
                        }
                      }}
                      className="w-full bg-[#2563eb] hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]"
                    >
                      Send Reset Link
                    </button>
                  </>
                )}

                {resetStep === 'success' && (
                  <div className="text-center py-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-2" />
                    <h3 className="font-bold text-emerald-900">Email Sent!</h3>
                    <p className="text-emerald-700 text-xs px-4 mt-1">Check your inbox for the reset link.</p>
                    <button 
                      onClick={() => setResetStep('new-password')}
                      className="mt-4 text-emerald-600 font-bold text-sm hover:underline"
                    >
                      (Demo: Click to set new password)
                    </button>
                  </div>
                )}

                {resetStep === 'new-password' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">New Password</label>
                      <div className="relative">
                        <input 
                          type={showResetPassword ? "text" : "password"} 
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowResetPassword(!showResetPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showResetPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        if (newPassword.length >= 6) {
                          setAuthMode('login');
                          setResetStep('email');
                          showToast('Password updated successfully! Please login.');
                        } else {
                          showToast('Password must be at least 6 characters');
                        }
                      }}
                      className="w-full bg-[#2563eb] hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]"
                    >
                      Update Password
                    </button>
                  </>
                )}

                <button 
                  onClick={() => {
                    setAuthMode('login');
                    setResetStep('email');
                  }}
                  className="w-full text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors py-2"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <>
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Alex Johnson"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="you@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-sm font-bold text-slate-700">Password</label>
                    {authMode === 'login' && (
                      <button 
                        onClick={() => setAuthMode('forgot')}
                        className="text-xs font-bold text-[#2563eb] hover:underline"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input 
                      type={authMode === 'login' ? (showLoginPassword ? "text" : "password") : (showSignupPassword ? "text" : "password")} 
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                    <button 
                      type="button"
                      onClick={() => authMode === 'login' ? setShowLoginPassword(!showLoginPassword) : setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {authMode === 'login' 
                        ? (showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />)
                        : (showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />)
                      }
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => setIsAuthenticated(true)}
                  className="w-full bg-[#2563eb] hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] mt-2"
                >
                  {authMode === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              </>
            )}
          </div>

          <div className="mt-6 text-center">
            {authMode !== 'forgot' && (
              <button 
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                {authMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-50 transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-2 text-[#2563eb] font-bold text-xl cursor-pointer" onClick={() => navigateToTab('Featured')}>
            <Home className="w-6 h-6" />
            <span>RentEase</span>
          </div>
          <button 
            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 overflow-y-auto no-scrollbar">
          <div className="mb-6">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Marketplace</p>
            <NavItem icon={<LayoutDashboard size={18} />} label="Featured Products" active={activeTab === 'Featured'} onClick={() => navigateToTab('Featured')} />
            <NavItem icon={<Package size={18} />} label="Appliances" active={activeTab === 'Appliances'} onClick={() => navigateToTab('Appliances')} />
            <NavItem icon={<Package size={18} />} label="Living Room" active={activeTab === 'Living Room'} onClick={() => navigateToTab('Living Room')} />
            <NavItem icon={<Package size={18} />} label="Office Setup" active={activeTab === 'Office'} onClick={() => navigateToTab('Office')} />
          </div>

          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">My Account</p>
            <NavItem icon={<User size={18} />} label="Profile" active={activeTab === 'Profile'} onClick={() => navigateToTab('Profile')} />
            <NavItem icon={<Receipt size={18} />} label="Active Rentals" active={activeTab === 'Rentals'} onClick={() => navigateToTab('Rentals')} />
            <NavItem icon={<History size={18} />} label="Order History" active={activeTab === 'History'} onClick={() => navigateToTab('History')} />
            <NavItem icon={<Heart size={18} />} label="Wishlist" active={activeTab === 'Wishlist'} onClick={() => navigateToTab('Wishlist')} />
            <NavItem icon={<ShoppingCart size={18} />} label="My Cart" active={activeTab === 'Cart'} onClick={() => navigateToTab('Cart')} />
            <NavItem icon={<Receipt size={18} />} label="Maintenance Tickets" active={activeTab === 'Tickets'} onClick={() => navigateToTab('Tickets')} />
            <NavItem icon={<Settings size={18} />} label="Settings" active={activeTab === 'Settings'} onClick={() => navigateToTab('Settings')} />
          </div>

          <div className="mt-8">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">For Partners</p>
            <NavItem icon={<Store size={18} />} label="Vendor Dashboard" active={activeTab === 'Vendor Dashboard'} onClick={() => navigateToTab('Vendor Dashboard')} />
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100 mt-auto">
          <div className="bg-slate-50 rounded-xl p-4 mb-4">
             <p className="text-xs font-semibold text-slate-900 mb-1 text-center">Become a Vendor</p>
             <p className="text-[10px] text-slate-500 mb-3 text-center">Start listing your products to millions of users.</p>
             <button 
              onClick={() => {
                if (isVerifiedVendor) {
                  showToast('Opening New Product Listing Form...');
                  navigateToTab('Vendor Dashboard');
                } else {
                  setIsListing(true);
                }
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#2563eb] text-white py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-all active:scale-95"
             >
               <Plus size={14} /> List Item
             </button>
          </div>
          <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#2563eb] p-2 w-full transition-colors">
            <HelpCircle size={18} />
            <span>Help Center</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 flex-shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button 
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className={`
              hidden sm:flex items-center bg-slate-100 rounded-lg px-4 py-2 transition-all border
              ${searchFocused ? 'border-[#2563eb] bg-white shadow-sm' : 'border-transparent'} w-full max-w-[400px]
            `}>
              <Search size={18} onClick={executeSearch} className={`cursor-pointer ${searchFocused ? 'text-[#2563eb]' : 'text-slate-400'}`} />
              <input 
                type="text" 
                placeholder="Search for furniture, appliances..." 
                className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full text-slate-600 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-all border ${showFilters ? 'bg-[#2563eb] text-white border-[#2563eb]' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'} shadow-sm flex items-center justify-center`}
              title="Advanced Filters"
            >
              <Filter size={20} />
            </button>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden xs:flex items-center gap-4 text-slate-400">
              <div className="relative">
                <Bell 
                  size={20} 
                  className={`cursor-pointer hover:text-slate-600 transition-colors ${showNotifications ? 'text-[#2563eb]' : ''}`} 
                  onClick={() => setShowNotifications(!showNotifications)}
                />
                {notifications.some(n => !n.read) && (
                  <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full border-2 border-white pointer-events-none"></span>
                )}
                
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                        <span className="font-bold text-slate-900 text-sm">Notifications</span>
                        <button 
                          onClick={() => setNotifications(prev => prev.map(n => ({...n, read: true})))}
                          className="text-[10px] font-bold text-[#2563eb] uppercase tracking-wider hover:underline"
                        >
                          Mark all as read
                        </button>
                      </div>
                      <div className="max-h-64 overflow-y-auto no-scrollbar">
                        {notifications.length > 0 ? (
                          notifications.map((n) => (
                            <div key={n.id} className={`p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-blue-50/50' : ''}`}>
                              <p className="text-xs text-slate-800 font-medium leading-relaxed">{n.message}</p>
                              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{n.time}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center">
                            <p className="text-xs text-slate-400 font-medium">No notifications yet</p>
                          </div>
                        )}
                      </div>
                      <div className="p-3 bg-slate-50 text-center">
                         <button className="text-[10px] font-bold text-slate-500 uppercase tracking-wider hover:text-[#2563eb]">View All Activity</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="relative">
                <ShoppingBag size={20} className="cursor-pointer hover:text-slate-600 transition-colors" onClick={() => navigateToTab('Cart')} />
                 {cart.length > 0 && (
                   <span className="absolute -top-1.5 -right-1.5 bg-[#2563eb] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center pointer-events-none">
                     {cart.length}
                   </span>
                 )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`hidden md:flex px-3 py-1 rounded-full text-xs font-semibold items-center gap-1 border ${
                user.kycStatus === 'Verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                user.kycStatus === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {user.kycStatus === 'Verified' ? <ShieldCheck size={14} /> : <AlertCircle size={14} />}
                KYC {user.kycStatus}
              </span>
              <div 
                className="w-8 h-8 rounded-full bg-[#2563eb] flex items-center justify-center text-white text-xs font-bold ring-2 ring-[#2563eb]/10 cursor-pointer hover:ring-[#2563eb]/30 transition-all font-sans"
                onClick={() => navigateToTab('Profile')}
              >
                {user.avatar}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar">
          <AnimatePresence mode="wait">
            {/* Dashboard View */}
            {(activeTab === 'Featured' || activeTab === 'Appliances' || activeTab === 'Living Room' || activeTab === 'Office' || activeTab === 'Search Results') && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard label="Active Rentals" value="04" icon={<Clock size={16} />} onClick={() => navigateToTab('Rentals')} />
                  <StatCard label="Security Deposits" value="1,240" icon={<CreditCard size={16} />} onClick={() => {}} />
                  <StatCard label="Upcoming Dues" value="185" icon={<Calendar size={16} />} onClick={() => {}} />
                  <StatCard label="Tickets" value="01" icon={<HelpCircle size={16} />} onClick={() => navigateToTab('Tickets')} />
                </div>

                {/* Grid Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                      {appliedSearch ? `Results for "${appliedSearch}"` : (activeTab === 'Featured' ? 'Trending Near You' : activeTab)}
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">
                      {appliedSearch ? `Showing ${filteredProducts.length} items found` : 'Handpicked premium rentals for you.'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-white border border-slate-200 rounded-lg text-sm font-semibold px-3 py-2 outline-none focus:ring-2 focus:ring-[#2563eb]/20 transition-all cursor-pointer shadow-sm hover:bg-slate-50"
                    >
                      <option value="default">Sort by: Default</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>

                    <select 
                      value={statusFilter} 
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="bg-white border border-slate-200 rounded-lg text-sm font-semibold px-3 py-2 outline-none focus:ring-2 focus:ring-[#2563eb]/20 transition-all cursor-pointer shadow-sm hover:bg-slate-50"
                    >
                      <option value="all">Status: All</option>
                      <option value="Available">Available</option>
                      <option value="Low Stock">Low Stock</option>
                    </select>

                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#2563eb] text-white rounded-lg text-sm font-semibold hover:opacity-90 shadow-md transition-all active:scale-95">
                      <MapIcon size={16} /> Map
                    </button>
                  </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 pb-20">
                  {isLoading ? (
                    Array(6).fill(0).map((_, i) => <ProductSkeleton key={i} />)
                  ) : error ? (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center">
                      <AlertCircle size={48} className="mb-4 text-red-500" />
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Oops! Something went wrong</h3>
                      <p className="text-slate-500 font-medium text-center mb-6 max-w-md">{error}</p>
                      <button 
                        onClick={fetchProducts} 
                        className="px-6 py-3 bg-[#2563eb] text-white rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 active:scale-95"
                      >
                        Retry Fetch
                      </button>
                    </div>
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product, idx) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <ProductCard 
                          {...product}
                          reviews={productReviews[product.id] || []}
                          isWishlisted={wishlist.includes(product.id)}
                          isInCart={cart.some(item => item.id === product.id)}
                          onAddToCart={(variants: any) => {
                            toggleCart(product.id, product.title, variants);
                          }}
                          onWishlist={() => {
                            setWishlist(prev => 
                              prev.includes(product.id) 
                                ? prev.filter(id => id !== product.id) 
                                : [...prev, product.id]
                            );
                          }}
                          onQuickView={() => {
                            setSelectedProduct(product);
                            setShowQuickView(true);
                          }}
                          onRent={(variants: any) => {
                            handleRentClick(product, variants);
                          }}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center text-slate-400">
                      <Search size={48} className="mb-4 opacity-10" />
                      <p className="text-lg font-bold">No items match your search</p>
                      <button onClick={() => navigateToTab('Featured')} className="mt-4 text-[#2563eb] font-bold hover:underline transition-all">Back to Trending</button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Profile View */}
            {activeTab === 'Profile' && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="max-w-4xl mx-auto pb-20 space-y-8"
              >
                {/* Profile Navigation Breadcrumbs/Buttons */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                  <button onClick={() => navigateToTab('Rentals')} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-[#2563eb]/20 transition-all shadow-sm">
                    <ShoppingBag size={14} /> My Rentals
                  </button>
                  <button onClick={() => navigateToTab('History')} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-[#2563eb]/20 transition-all shadow-sm">
                    <History size={14} /> Orders
                  </button>
                  <button onClick={() => navigateToTab('Wishlist')} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-[#2563eb]/20 transition-all shadow-sm">
                    <Heart size={14} /> Saved
                  </button>
                  <button onClick={() => navigateToTab('Settings')} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-[#2563eb]/20 transition-all shadow-sm">
                    <Settings size={14} /> Privacy
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[#2563eb]/10 to-transparent" />
                  
                  <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center">
                    <div className="relative">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-[#2563eb] flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-xl">
                        {user.avatar}
                      </div>
                      <button className="absolute -bottom-2 -right-2 p-2 bg-white border border-slate-200 rounded-xl text-slate-600 shadow-sm hover:bg-slate-50 transition-all">
                        <Camera size={18} />
                      </button>
                    </div>
                    
                    <div className="flex-1">
                      {isEditingProfile ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="col-span-full">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Full Name</label>
                            <input 
                              type="text" 
                              value={tempProfile.name} 
                              onChange={(e) => setTempProfile(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full text-xl font-bold bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#2563eb]/20 transition-all text-slate-900"
                              placeholder="Your name"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Email Address</label>
                            <input 
                              type="email" 
                              value={tempProfile.email} 
                              onChange={(e) => setTempProfile(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#2563eb]/20 transition-all text-slate-600"
                              placeholder="Email address"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Phone Number</label>
                            <input 
                              type="tel" 
                              value={tempProfile.phone} 
                              onChange={(e) => setTempProfile(prev => ({ ...prev, phone: e.target.value }))}
                              className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#2563eb]/20 transition-all text-slate-600"
                              placeholder="Phone number"
                            />
                          </div>
                          <div className="flex gap-2 pt-2 col-span-full">
                            <button 
                              onClick={() => {
                                setUser(prev => ({ 
                                  ...prev, 
                                  name: tempProfile.name, 
                                  email: tempProfile.email,
                                  phone: tempProfile.phone,
                                  avatar: tempProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                                }));
                                setIsEditingProfile(false);
                              }}
                              className="bg-[#2563eb] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-600 active:scale-95 transition-all"
                            >
                              Save Basic Info
                            </button>
                            <button 
                              onClick={() => setIsEditingProfile(false)}
                              className="bg-white text-slate-600 border border-slate-200 px-6 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 active:scale-95 transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
                            <button 
                              onClick={() => {
                                setIsEditingProfile(true);
                                setTempProfile({ name: user.name, email: user.email, phone: user.phone });
                              }}
                              className="p-2 text-slate-400 hover:text-[#2563eb] transition-colors bg-slate-50 rounded-xl border border-slate-100"
                            >
                              <Edit2 size={18} />
                            </button>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500 font-medium">
                            <div className="flex items-center gap-2">
                              <Mail size={16} />
                              {user.email}
                            </div>
                            <div className="flex items-center gap-2">
                              <Smartphone size={16} />
                              {user.phone}
                            </div>
                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                              user.kycStatus === 'Verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                              user.kycStatus === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                              'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              {user.kycStatus === 'Verified' ? <ShieldCheck size={14} /> : <AlertCircle size={14} />}
                              KYC {user.kycStatus}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex md:flex-col gap-2 w-full md:w-auto">
                      {user.kycStatus !== 'Verified' && (
                        <button 
                          onClick={() => setUser(prev => ({ ...prev, kycStatus: 'Pending' }))}
                          className="flex-1 bg-[#2563eb] text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all"
                        >
                          {user.kycStatus === 'Pending' ? 'Resume Verification' : 'Verify Identity'}
                        </button>
                      )}
                      <button 
                         onClick={() => setIsAuthenticated(false)}
                         className="flex-1 border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                         <LogOut size={18} /> Logout
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Delivery Address Section */}
                  <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-slate-50 rounded-lg text-[#2563eb]">
                          <MapIcon size={18} />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900">Delivery Address</h3>
                      </div>
                      {!isEditingAddress ? (
                        <button 
                          onClick={() => {
                            setIsEditingAddress(true);
                            setTempAddress({ ...user.address });
                          }}
                          className="p-2 text-slate-400 hover:text-[#2563eb] transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            setUser(prev => ({ ...prev, address: tempAddress }));
                            setIsEditingAddress(false);
                          }}
                          className="text-xs font-bold text-[#2563eb] hover:underline"
                        >
                          Save Address
                        </button>
                      )}
                    </div>
                    {isEditingAddress ? (
                      <div className="space-y-3">
                        <input 
                          type="text" 
                          value={tempAddress.street} 
                          onChange={(e) => setTempAddress(prev => ({ ...prev, street: e.target.value }))}
                          className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                          placeholder="Street Address"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="text" 
                            value={tempAddress.city} 
                            onChange={(e) => setTempAddress(prev => ({ ...prev, city: e.target.value }))}
                            className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none"
                            placeholder="City"
                          />
                          <input 
                            type="text" 
                            value={tempAddress.state} 
                            onChange={(e) => setTempAddress(prev => ({ ...prev, state: e.target.value }))}
                            className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none"
                            placeholder="State"
                          />
                        </div>
                        <input 
                          type="text" 
                          value={tempAddress.zip} 
                          onChange={(e) => setTempAddress(prev => ({ ...prev, zip: e.target.value }))}
                          className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none "
                          placeholder="ZIP Code"
                        />
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 italic">
                        <p className="text-sm font-semibold text-slate-700">{user.address.street}</p>
                        <p className="text-xs text-slate-500">{user.address.city}, {user.address.state} {user.address.zip}</p>
                      </div>
                    )}
                  </div>

                  {/* Payment Methods Section */}
                  <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-slate-50 rounded-lg text-[#2563eb]">
                          <CreditCard size={18} />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900">Payment Methods</h3>
                      </div>
                      <button className="text-xs font-bold text-[#2563eb] hover:underline flex items-center gap-1">
                        <Plus size={14} /> Add New
                      </button>
                    </div>
                    <div className="space-y-3">
                      {user.paymentMethods.map(method => (
                        <div key={method.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:border-[#2563eb]/20">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-7 bg-white rounded border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:text-[#2563eb]">
                              {method.type}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-700">•••• {method.last4}</p>
                              <p className="text-[10px] text-slate-400 font-bold tracking-wider">Expires {method.expiry}</p>
                            </div>
                          </div>
                          {method.isDefault && (
                            <span className="text-[10px] font-black text-[#2563eb] bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-widest">Main</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rental Agreements & Preferences */}
                  <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm col-span-full">
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-slate-50 rounded-lg text-[#2563eb]">
                          <Receipt size={18} />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900">Rental Preferences & Agreements</h3>
                      </div>
                      {!isEditingPreferences ? (
                        <button 
                          onClick={() => {
                            setIsEditingPreferences(true);
                            setTempPreferences({ ...user.preferences });
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-[#2563eb] transition-all"
                        >
                          <Edit2 size={14} /> Edit Logic
                        </button>
                      ) : (
                        <div className="flex gap-4">
                           <button onClick={() => setIsEditingPreferences(false)} className="text-xs font-bold text-slate-400 hover:underline">Discard</button>
                           <button 
                              onClick={() => {
                                setUser(prev => ({ ...prev, preferences: tempPreferences }));
                                setIsEditingPreferences(false);
                              }}
                              className="text-xs font-bold text-[#2563eb] hover:underline"
                           >
                            Save Settings
                           </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <PreferenceToggle 
                        icon={<Plus size={18} />} 
                        label="Auto-Renew Rentals" 
                        description="Automatically extend your rentals at end of term."
                        active={isEditingPreferences ? tempPreferences.autoRenewal : user.preferences.autoRenewal}
                        onChange={(v) => isEditingPreferences && setTempPreferences(prev => ({...prev, autoRenewal: v}))}
                        disabled={!isEditingPreferences}
                      />
                      <PreferenceToggle 
                        icon={<ShieldCheck size={18} />} 
                        label="Damage Protection" 
                        description="Opt-in to daily insurance for all future items."
                        active={isEditingPreferences ? tempPreferences.damageProtection : user.preferences.damageProtection}
                        onChange={(v) => isEditingPreferences && setTempPreferences(prev => ({...prev, damageProtection: v}))}
                        disabled={!isEditingPreferences}
                      />
                      <PreferenceToggle 
                        icon={<Mail size={18} />} 
                        label="Paperless Billing" 
                        description="Receive all invoices via email or app notifications."
                        active={isEditingPreferences ? tempPreferences.paperlessBilling : user.preferences.paperlessBilling}
                        onChange={(v) => isEditingPreferences && setTempPreferences(prev => ({...prev, paperlessBilling: v}))}
                        disabled={!isEditingPreferences}
                      />
                    </div>

                    <div className="mt-8 p-6 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm">
                           <Plus size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Signed Master Rental Agreement</p>
                          <p className="text-xs text-slate-500 font-medium tracking-tight">Last version signed on <span className="font-bold text-slate-700">Feb 01, 2024</span>.</p>
                        </div>
                      </div>
                      <button className="bg-white px-6 py-3 rounded-2xl text-xs font-bold text-slate-700 border border-slate-100 shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                        <Eye size={16} /> View/Sign Again
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-slate-900">Activity Stats</h3>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Rentals</p>
                      <p className="text-3xl font-black text-slate-900 tracking-tighter">12</p>
                    </div>
                    <div className="text-center p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Months Active</p>
                      <p className="text-3xl font-black text-slate-900 tracking-tighter">07</p>
                    </div>
                    <div className="text-center p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Items Saved</p>
                      <p className="text-3xl font-black text-[#2563eb] tracking-tighter">{wishlist.length}</p>
                    </div>
                    <div className="text-center p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Trust Score</p>
                      <p className="text-3xl font-black text-emerald-500 tracking-tighter">98%</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Rentals View */}
            {activeTab === 'Rentals' && (
              <motion.div 
                key="rentals"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 max-w-4xl mx-auto"
              >
                <h1 className="text-2xl font-bold text-slate-900 mb-8">Management Center</h1>
                <div className="grid gap-6">
                  {myRentals.map((rental, idx) => (
                    <motion.div 
                      key={rental.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-[#2563eb]/20 transition-all shadow-sm"
                    >
                      <div className="w-20 h-20 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden flex items-center justify-center">
                         <img 
                            {...getResponsiveImageAttributes(rental.title, rental.image, 100, 200)}
                            alt={rental.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => handleImageError(e, rental.title)}
                         />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                          <h3 className="font-bold text-slate-900 text-lg">{rental.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            rental.status === 'Active' || rental.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 
                            rental.status === 'Cancelled' ? 'bg-red-50 text-red-600' : 
                            'bg-amber-50 text-amber-600'
                          }`}>
                            {rental.status}
                          </span>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">
                          Rental ID: #{rental.id} • Started {rental.startDate}
                          {rental.quantity > 1 && <span className="ml-2 bg-blue-100 text-[#2563eb] px-2 py-0.5 rounded-full text-[10px] font-black">×{rental.quantity}</span>}
                        </p>
                        {rental.selectedVariants && Object.entries(rental.selectedVariants).length > 0 && (
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 mt-2">
                            {Object.entries(rental.selectedVariants).map(([type, option]: [string, any]) => (
                              <span key={type} className="text-[8px] font-black uppercase bg-blue-50 text-[#2563eb] border border-blue-100/50 px-1.5 py-0.5 rounded flex items-center gap-1">
                                <CheckCircle2 size={8} /> {option}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap justify-center gap-3">
                        {rental.status !== 'Cancelled' && (
                           <>
                             <button onClick={() => { setDeliveryTrackingId(rental.id); setShowDeliveryTracking(true); }} className="px-4 py-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 text-sm font-bold transition-colors flex items-center gap-2"><Navigation size={14} /> Track</button>
                             <button onClick={() => setRentalToCancel(rental.id)} className="px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 text-sm font-bold transition-colors">Cancel</button>
                           </>
                        )}
                        <button onClick={() => showToast(`Rental for ${rental.title} extended by 1 month!`)} className="px-4 py-2 rounded-lg bg-slate-50 text-slate-600 text-sm font-bold border border-slate-200 hover:bg-slate-100 transition-colors">Extend</button>
                        <button onClick={() => navigateToTab('Tickets')} className="px-4 py-2 rounded-lg bg-[#2563eb] text-white text-sm font-bold shadow-md hover:opacity-90 transition-all active:scale-95">Support</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Order History View */}
            {activeTab === 'History' && (
              <motion.div 
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 max-w-4xl mx-auto pb-20"
              >
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-2xl font-bold text-slate-900">Order History</h1>
                  <button className="flex items-center gap-2 text-[#2563eb] text-sm font-bold hover:underline">
                    <Receipt size={16} /> Download Tax Statement
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item & ID</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total Paid</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {orderHistory.map((order, idx) => (
                        <motion.tr 
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="hover:bg-slate-50/50 transition-colors group"
                        >
                          <td className="px-6 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center border border-slate-100 group-hover:bg-white transition-colors">
                                <img 
                                  src={getProductImage(order.title, order.image)} 
                                  alt={order.title}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => handleImageError(e, order.title)}
                                />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 leading-none mb-1">{order.title}</p>
                                <p className="text-xs text-slate-500 font-medium">#{order.id}</p>
                                {order.selectedVariants && Object.entries(order.selectedVariants).length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1.5">
                                    {Object.entries(order.selectedVariants).map(([type, option]: [string, any]) => (
                                      <span key={type} className="text-[7px] font-black uppercase bg-slate-100 text-slate-400 px-1 py-0.5 rounded border border-slate-200">
                                        {option}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6 font-semibold text-slate-600 text-sm">{order.duration}</td>
                          <td className="px-6 py-6">
                            <div className="flex items-center gap-2">
                               <CheckCircle2 size={14} className="text-emerald-500" />
                               <span className="text-sm font-bold text-slate-700">{order.endDate}</span>
                            </div>
                          </td>
                          <td className="px-6 py-6 text-right">
                             <p className="font-bold text-slate-900 font-mono">${order.total}.00</p>
                             <button className="text-[10px] font-bold text-[#2563eb] uppercase tracking-wider hover:underline mt-1">Invoice</button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#2563eb] shadow-sm">
                       <ShieldCheck size={24} />
                     </div>
                     <div>
                       <p className="font-bold text-slate-900">Total Savings Breakdown</p>
                       <p className="text-xs text-slate-500 font-medium tracking-tight">You've saved approximately <span className="text-[#2563eb] font-bold">$2,840</span> by renting instead of buying.</p>
                     </div>
                  </div>
                  <button onClick={() => showToast('Opening savings breakdown details...')} className="bg-white px-4 py-2 rounded-xl text-xs font-bold text-slate-700 border border-slate-100 shadow-sm hover:bg-slate-50 transition-all">View Details</button>
                </div>
              </motion.div>
            )}

            {/* Wishlist View */}
            {activeTab === 'Wishlist' && (
              <motion.div 
                key="wishlist"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Your Saved Items</h1>
                    <p className="text-slate-500 mt-1 font-medium">Quickly access items you're interested in.</p>
                  </div>
                  <div className="text-sm font-bold text-[#2563eb] bg-blue-50 px-4 py-2 rounded-xl">
                    {wishlist.length} Items Total
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 pb-20">
                  {isLoading ? (
                     <div className="col-span-full py-32 flex flex-col items-center justify-center text-slate-400">
                     <div className="w-12 h-12 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin mb-4" />
                     <p className="text-lg font-bold">Loading your favorites...</p>
                   </div>
                  ) : wishlist.length > 0 ? (
                    products.filter(p => wishlist.includes(p.id)).map((product, idx) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <ProductCard 
                          {...product}
                          reviews={productReviews[product.id] || []}
                          isWishlisted={true}
                          isInCart={cart.some(item => item.id === product.id)}
                          onAddToCart={(variants: any) => {
                            toggleCart(product.id, product.title, variants);
                          }}
                          onWishlist={() => {
                            setWishlist(prev => prev.filter(id => id !== product.id));
                          }}
                          onRemove={() => {
                            setWishlist(prev => prev.filter(id => id !== product.id));
                          }}
                          onQuickView={() => {
                            setSelectedProduct(product);
                            setShowQuickView(true);
                          }}
                          onRent={(variants: any) => {
                            handleRentClick(product, variants);
                          }}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center text-slate-400">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <Heart size={40} className="opacity-10" />
                      </div>
                      <p className="text-lg font-bold">Your wishlist is empty</p>
                      <p className="text-sm font-medium mt-1">Start saving items you'd like to rent later.</p>
                      <button onClick={() => navigateToTab('Featured')} className="mt-6 bg-[#2563eb] text-white px-6 py-3 rounded-2xl font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg">Browse Trending</button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Cart View */}
            {activeTab === 'Cart' && (
              <motion.div 
                key="cart"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Your Cart</h1>
                    <p className="text-slate-500 mt-1 font-medium">Review your selected items before checking out.</p>
                  </div>
                  <div className="text-sm font-bold text-[#2563eb] bg-blue-50 px-4 py-2 rounded-xl">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} Items Total
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 pb-32">
                  {isLoading ? (
                     <div className="col-span-full py-32 flex flex-col items-center justify-center text-slate-400">
                     <div className="w-12 h-12 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin mb-4" />
                     <p className="text-lg font-bold">Loading your cart...</p>
                   </div>
                  ) : cart.length > 0 ? (
                    cart.map((cartItem, idx) => {
                      const product = products.find(p => p.id === cartItem.id);
                      if (!product) return null;
                      return (
                        <motion.div
                          key={`${cartItem.id}-${idx}-${JSON.stringify(cartItem.selectedVariants)}`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <ProductCard 
                            {...product}
                            reviews={productReviews[product.id] || []}
                            isWishlisted={wishlist.includes(product.id)}
                            isInCart={true}
                            selectedVariants={cartItem.selectedVariants}
                            quantity={cartItem.quantity}
                            onUpdateQuantity={(delta: number) => updateCartQuantity(product.id, cartItem.selectedVariants, delta)}
                            onAddToCart={(variants: any) => toggleCart(product.id, product.title, variants || cartItem.selectedVariants)}
                            onWishlist={() => {
                              setWishlist(prev => 
                                prev.includes(product.id) 
                                  ? prev.filter(id => id !== product.id) 
                                  : [...prev, product.id]
                              );
                            }}
                            onQuickView={() => {
                              setSelectedProduct(product);
                              setShowQuickView(true);
                            }}
                            onRemove={() => toggleCart(product.id, product.title, cartItem.selectedVariants)}
                            onRent={(variants: any) => handleRentClick(product, variants || cartItem.selectedVariants)}
                          />
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center text-slate-400">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <ShoppingCart size={40} className="opacity-10" />
                      </div>
                      <p className="text-lg font-bold">Your cart is empty</p>
                      <p className="text-sm font-medium mt-1">Add items to your cart to review them here.</p>
                      <button onClick={() => navigateToTab('Featured')} className="mt-6 bg-[#2563eb] text-white px-6 py-3 rounded-2xl font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg">Start Shopping</button>
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="fixed bottom-0 right-0 left-0 bg-white/80 backdrop-blur-md border-t border-slate-100 p-6 z-40 md:left-64 lg:left-72">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                       <div className="hidden sm:block">
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Subtotal</p>
                          <p className="text-2xl font-black text-slate-900">${cart.reduce((total, item) => {
                            const product = products.find(p => p.id === item.id);
                            return total + (product ? product.price * item.quantity : 0);
                          }, 0)}<span className="text-sm font-bold text-slate-400">/mo</span></p>
                       </div>
                       <button 
                         onClick={() => {
                           if (cart.length > 0) {
                             setIsCartCheckout(true);
                             setShowCheckout(true);
                             setRentalDuration(3);
                           }
                         }}
                         className="bg-[#2563eb] text-white px-8 py-4 rounded-2xl font-bold font-display shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all flex items-center gap-3 w-full sm:w-auto justify-center group"
                       >
                         Proceed to Checkout 
                         <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                       </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Tickets View */}
            {activeTab === 'Tickets' && (
               <motion.div 
                key="tickets"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-3xl mx-auto py-8 space-y-6"
               >
                 <div className="flex items-center justify-between">
                   <div>
                     <h1 className="text-2xl font-bold text-slate-900">Support Tickets</h1>
                     <p className="text-slate-500 font-medium">Manage your service and maintenance requests.</p>
                   </div>
                   <button 
                     onClick={() => {
                        const newId = Math.floor(Math.random() * 9000) + 1000;
                        setTickets([{id: newId, title: 'General Support Request', status: 'Pending', date: new Date().toLocaleDateString()}, ...tickets]);
                        showToast('New support ticket created!');
                     }} 
                     className="bg-[#2563eb] text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-[#1d4ed8] transition-all flex items-center gap-2 active:scale-95"
                   >
                     <Plus size={18} /> New Ticket
                   </button>
                 </div>

                 <div className="space-y-4">
                   {tickets.length > 0 ? tickets.map(ticket => (
                     <div key={ticket.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-sm hover:border-slate-300 transition-colors">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#2563eb]">
                           <HelpCircle size={24} />
                         </div>
                         <div>
                           <div className="flex items-center gap-2 mb-1">
                             <h3 className="font-bold text-slate-900">{ticket.title}</h3>
                             <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${ticket.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-[#2563eb]'}`}>
                               {ticket.status}
                             </span>
                           </div>
                           <p className="text-xs text-slate-500 font-medium pb-1">Ticket #{ticket.id} • {ticket.date}</p>
                         </div>
                       </div>
                       <button 
                         onClick={() => {
                           setTickets(tickets.filter(t => t.id !== ticket.id));
                           showToast(`Ticket #${ticket.id} deleted.`);
                         }}
                         className="text-red-500 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                       >
                         Delete
                       </button>
                     </div>
                   )) : (
                     <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl">
                       <HelpCircle size={48} className="mx-auto text-slate-300 mb-4" />
                       <h3 className="text-lg font-bold text-slate-900">No active tickets</h3>
                       <p className="text-slate-500">You don't have any support tickets at the moment.</p>
                     </div>
                   )}
                 </div>
               </motion.div>
            )}

            {activeTab === 'Vendor Dashboard' && (
               <motion.div 
                key="vendor-dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto space-y-8 pb-20"
              >
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Vendor Dashboard</h2>
                  <p className="text-slate-500 font-medium">Overview of your business</p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-3xl p-6 border border-slate-200">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                      <DollarSign size={24} />
                    </div>
                    <p className="text-sm text-slate-500 font-bold mb-1">Total Revenue</p>
                    <p className="text-3xl font-black text-slate-900">$12,450</p>
                  </div>
                  <div className="bg-white rounded-3xl p-6 border border-slate-200">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                      <ShoppingBag size={24} />
                    </div>
                    <p className="text-sm text-slate-500 font-bold mb-1">Active Rentals</p>
                    <p className="text-3xl font-black text-slate-900">45</p>
                  </div>
                  <div className="bg-white rounded-3xl p-6 border border-slate-200">
                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
                      <Wrench size={24} />
                    </div>
                    <p className="text-sm text-slate-500 font-bold mb-1">Pending Maintenance</p>
                    <p className="text-3xl font-black text-slate-900">3</p>
                  </div>
                  <div className="bg-white rounded-3xl p-6 border border-slate-200">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                      <Users size={24} />
                    </div>
                    <p className="text-sm text-slate-500 font-bold mb-1">Total Customers</p>
                    <p className="text-3xl font-black text-slate-900">38</p>
                  </div>
                </div>

                {/* Orders / Rentals */}
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">Recent Orders & Rentals</h3>
                      <p className="text-sm text-slate-500">Track and manage your customer orders.</p>
                    </div>
                    <button className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-white border border-slate-200 px-4 py-2 rounded-xl border-slate-200 hover:border-blue-200">View All</button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {[
                      { id: 'ORD-8921', item: 'Whirlpool 7kg Washing Machine', customer: 'Alex Johnson', date: 'Oct 24, 2023', status: 'Delivering', amount: '$150/mo' },
                      { id: 'ORD-8920', item: 'Minimalist Study Desk', customer: 'Sarah Miller', date: 'Oct 22, 2023', status: 'Active', amount: '$45/mo' },
                      { id: 'ORD-8919', item: 'Ergonomic Study Chair', customer: 'David Chen', date: 'Oct 20, 2023', status: 'Active', amount: '$25/mo' },
                      { id: 'ORD-8918', item: 'Haier 50L Mini Fridge', customer: 'Emma Davis', date: 'Oct 15, 2023', status: 'Completed', amount: '$80/mo' },
                    ].map((order) => (
                      <div key={order.id} className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="flex gap-4 items-center">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold shrink-0">
                            <ShoppingBag size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{order.item}</p>
                            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                              <span className="flex items-center"><User size={14} className="inline mr-1" />{order.customer}</span>
                              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                              <span>{order.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="text-left sm:text-right">
                            <p className="font-bold font-mono text-slate-900">{order.amount}</p>
                            <p className="text-xs text-slate-500">{order.id}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold leading-none ${
                            order.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                            order.status === 'Delivering' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Maintenance Requests */}
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">Maintenance Requests</h3>
                      <p className="text-sm text-slate-500">Service tickets requiring your attention.</p>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {[
                      { id: 'TKT-104', item: 'Blue Star Portable AC', customer: 'Mike Ross', issue: 'Not cooling effectively', severity: 'High', date: 'Today, 10:30 AM' },
                      { id: 'TKT-103', item: 'Whirlpool 7kg Washing Machine', customer: 'Lisa Wang', issue: 'Making loud noise during spin cycle', severity: 'Medium', date: 'Yesterday' },
                    ].map((ticket) => (
                      <div key={ticket.id} className="p-4 sm:p-6 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="flex gap-4 items-center w-full xl:w-auto">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${ticket.severity === 'High' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>
                            <AlertCircle size={24} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{ticket.issue}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-slate-500">
                              <span className="font-medium text-slate-700">{ticket.item}</span>
                              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                              <span className="flex items-center"><User size={12} className="inline mr-1" />{ticket.customer}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 w-full xl:w-auto justify-between xl:justify-end pt-2 xl:pt-0">
                          <p className="text-sm text-slate-500 font-medium">{ticket.date}</p>
                          <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors whitespace-nowrap">
                            Schedule Service
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {activeTab === 'Settings' && (
               <motion.div 
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto space-y-8 pb-20"
               >
                 <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900">Account Preferences</h1>
                      <p className="text-slate-500 font-medium text-sm">Manage your account settings, privacy, and billing information.</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <button onClick={() => navigateToTab('Profile')} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-slate-300 transition-all flex items-center gap-2">
                         <User size={14} /> Back to Profile
                       </button>
                    </div>
                 </div>

                 <div className="space-y-6">
                    {/* Profile Information Block */}
                    <div className={`bg-white border rounded-[2.5rem] overflow-hidden transition-all duration-300 ${activeSettingsSection === 'profile' ? 'border-[#2563eb] shadow-xl shadow-blue-500/5' : 'border-slate-200 shadow-sm'}`}>
                      <div 
                        className={`p-8 flex items-center justify-between cursor-pointer group ${activeSettingsSection === 'profile' ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                        onClick={() => setActiveSettingsSection(activeSettingsSection === 'profile' ? null : 'profile')}
                      >
                         <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl transition-colors ${activeSettingsSection === 'profile' ? 'bg-[#2563eb] text-white' : 'bg-slate-50 text-slate-400 group-hover:text-slate-600'}`}>
                              <User size={24} />
                            </div>
                            <div>
                               <h3 className="font-bold text-lg text-slate-900">Profile Information</h3>
                               <p className="text-sm text-slate-500 font-medium">Name, email, and contact details</p>
                            </div>
                         </div>
                         <ChevronRight size={20} className={activeSettingsSection === 'profile' ? 'rotate-90 text-[#2563eb]' : 'text-slate-300'} />
                      </div>
                      
                      <AnimatePresence>
                        {activeSettingsSection === 'profile' && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                          >
                            <div className="p-8 border-t border-slate-100 space-y-6 bg-white">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                                     <input 
                                        type="text" 
                                        value={tempProfile.name}
                                        onChange={(e) => setTempProfile(prev => ({...prev, name: e.target.value}))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                                     />
                                  </div>
                                  <div className="space-y-2">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                                     <input 
                                        type="email" 
                                        value={tempProfile.email}
                                        onChange={(e) => setTempProfile(prev => ({...prev, email: e.target.value}))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                                     />
                                  </div>
                                  <div className="space-y-2">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                                     <input 
                                        type="tel" 
                                        value={tempProfile.phone}
                                        onChange={(e) => setTempProfile(prev => ({...prev, phone: e.target.value}))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                                     />
                                  </div>
                               </div>
                               <button 
                                  onClick={() => {
                                    setUser(prev => ({...prev, ...tempProfile}));
                                    setActiveSettingsSection(null);
                                  }}
                                  className="bg-[#2563eb] text-white px-8 py-3 rounded-2xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
                               >
                                 Save Changes
                               </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Payment Methods Block */}
                    <div className={`bg-white border rounded-[2.5rem] overflow-hidden transition-all duration-300 ${activeSettingsSection === 'payments' ? 'border-[#2563eb] shadow-xl shadow-blue-500/5' : 'border-slate-200 shadow-sm'}`}>
                      <div 
                        className={`p-8 flex items-center justify-between cursor-pointer group ${activeSettingsSection === 'payments' ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                        onClick={() => {
                          setActiveSettingsSection(activeSettingsSection === 'payments' ? null : 'payments');
                          setTempPaymentMethods([...user.paymentMethods]);
                        }}
                      >
                         <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl transition-colors ${activeSettingsSection === 'payments' ? 'bg-[#2563eb] text-white' : 'bg-slate-50 text-slate-400 group-hover:text-slate-600'}`}>
                              <CreditCard size={24} />
                            </div>
                            <div>
                               <h3 className="font-bold text-lg text-slate-900">Payment Methods</h3>
                               <p className="text-sm text-slate-500 font-medium">Manage cards and banking info</p>
                            </div>
                         </div>
                         <ChevronRight size={20} className={activeSettingsSection === 'payments' ? 'rotate-90 text-[#2563eb]' : 'text-slate-300'} />
                      </div>
                      
                      <AnimatePresence>
                        {activeSettingsSection === 'payments' && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                          >
                            <div className="p-8 border-t border-slate-100 space-y-6 bg-white">
                               <div className="space-y-4">
                                  {tempPaymentMethods.map((method, idx) => (
                                    <div key={method.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100">
                                       <div className="w-12 h-8 bg-white border border-slate-200 rounded flex items-center justify-center font-black text-[10px] text-slate-400">
                                          {method.type}
                                       </div>
                                       <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                            <input 
                                              type="text" 
                                              value={`•••• ${method.last4}`}
                                              readOnly
                                              className="bg-transparent border-none text-sm font-bold text-slate-700 w-24 outline-none"
                                            />
                                            {method.isDefault && <span className="text-[10px] font-black text-[#2563eb] bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-widest">Default</span>}
                                          </div>
                                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Expires {method.expiry}</p>
                                       </div>
                                       <div className="flex gap-2">
                                          <button className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Edit</button>
                                          <button 
                                            className="text-xs font-bold text-red-400 hover:text-red-500 flex items-center gap-1"
                                            onClick={() => setTempPaymentMethods(prev => prev.filter(m => m.id !== method.id))}
                                          >
                                            <Trash2 size={12} /> Remove
                                          </button>
                                       </div>
                                    </div>
                                  ))}
                                  <button onClick={() => {}} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-sm font-bold text-slate-400 hover:border-[#2563eb]/20 hover:text-[#2563eb] transition-all flex items-center justify-center gap-2">
                                    <Plus size={18} /> Add Payment Method
                                  </button>
                               </div>
                               <button 
                                  onClick={() => {
                                    setUser(prev => ({...prev, paymentMethods: tempPaymentMethods}));
                                    setActiveSettingsSection(null);
                                  }}
                                  className="bg-[#2563eb] text-white px-8 py-3 rounded-2xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
                               >
                                 Save Payments
                               </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Vendor Payout Block */}
                    <div className={`bg-white border rounded-[2.5rem] overflow-hidden transition-all duration-300 ${activeSettingsSection === 'payouts' ? 'border-[#2563eb] shadow-xl shadow-blue-500/5' : 'border-slate-200 shadow-sm'}`}>
                      <div 
                        className={`p-8 flex items-center justify-between cursor-pointer group ${activeSettingsSection === 'payouts' ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                        onClick={() => {
                          setActiveSettingsSection(activeSettingsSection === 'payouts' ? null : 'payouts');
                          setTempBanking({ ...user.banking });
                        }}
                      >
                         <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl transition-colors ${activeSettingsSection === 'payouts' ? 'bg-[#2563eb] text-white' : 'bg-slate-50 text-slate-400 group-hover:text-slate-600'}`}>
                              <Landmark size={24} />
                            </div>
                            <div>
                               <h3 className="font-bold text-lg text-slate-900">Vendor Payout Settings</h3>
                               <p className="text-sm text-slate-500 font-medium">Manage where you receive your earnings</p>
                            </div>
                         </div>
                         <ChevronRight size={20} className={activeSettingsSection === 'payouts' ? 'rotate-90 text-[#2563eb]' : 'text-slate-300'} />
                      </div>
                      
                      <AnimatePresence>
                        {activeSettingsSection === 'payouts' && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                          >
                            <div className="p-8 border-t border-slate-100 space-y-6 bg-white">
                               <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Bank Name</label>
                                        <input 
                                           type="text" 
                                           value={tempBanking.bankName}
                                           onChange={(e) => setTempBanking(prev => ({...prev, bankName: e.target.value}))}
                                           className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                                        />
                                     </div>
                                     <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Account Holder</label>
                                        <input 
                                           type="text" 
                                           value={tempBanking.accountHolder}
                                           onChange={(e) => setTempBanking(prev => ({...prev, accountHolder: e.target.value}))}
                                           className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                                        />
                                     </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Account Number</label>
                                        <div className="relative">
                                          <input 
                                            type={showSettingsAccountNumber ? "text" : "password"} 
                                            value={tempBanking.accountNumber}
                                            onChange={(e) => setTempBanking(prev => ({...prev, accountNumber: e.target.value}))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 pr-12 text-sm font-bold outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                                          />
                                          <button 
                                            type="button"
                                            onClick={() => setShowSettingsAccountNumber(!showSettingsAccountNumber)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                          >
                                            {showSettingsAccountNumber ? <EyeOff size={18} /> : <Eye size={18} />}
                                          </button>
                                        </div>
                                     </div>
                                     <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Routing Number</label>
                                        <input 
                                           type="text" 
                                           value={tempBanking.routingNumber}
                                           onChange={(e) => setTempBanking(prev => ({...prev, routingNumber: e.target.value}))}
                                           className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                                        />
                                     </div>
                                  </div>
                               </div>
                               <button 
                                  onClick={() => {
                                    setUser(prev => ({...prev, banking: tempBanking}));
                                    setActiveSettingsSection(null);
                                    showToast('Payout settings updated successfully!');
                                  }}
                                  className="bg-[#2563eb] text-white px-8 py-3 rounded-2xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
                               >
                                 Save Payout Info
                               </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Delivery Address Block */}
                    <div className={`bg-white border rounded-[2.5rem] overflow-hidden transition-all duration-300 ${activeSettingsSection === 'address' ? 'border-[#2563eb] shadow-xl shadow-blue-500/5' : 'border-slate-200 shadow-sm'}`}>
                      <div 
                        className={`p-8 flex items-center justify-between cursor-pointer group ${activeSettingsSection === 'address' ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                        onClick={() => setActiveSettingsSection(activeSettingsSection === 'address' ? null : 'address')}
                      >
                         <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl transition-colors ${activeSettingsSection === 'address' ? 'bg-[#2563eb] text-white' : 'bg-slate-50 text-slate-400 group-hover:text-slate-600'}`}>
                              <MapIcon size={24} />
                            </div>
                            <div>
                               <h3 className="font-bold text-lg text-slate-900">Delivery Address</h3>
                               <p className="text-sm text-slate-500 font-medium">Verify your shipping details</p>
                            </div>
                         </div>
                         <ChevronRight size={20} className={activeSettingsSection === 'address' ? 'rotate-90 text-[#2563eb]' : 'text-slate-300'} />
                      </div>
                      
                      <AnimatePresence>
                        {activeSettingsSection === 'address' && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                          >
                            <div className="p-8 border-t border-slate-100 space-y-6 bg-white">
                               <div className="space-y-4">
                                  <div className="space-y-2">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Street Address</label>
                                     <input 
                                        type="text" 
                                        value={tempAddress.street}
                                        onChange={(e) => setTempAddress(prev => ({...prev, street: e.target.value}))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                                     />
                                  </div>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                     <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">City</label>
                                        <input 
                                           type="text" 
                                           value={tempAddress.city}
                                           onChange={(e) => setTempAddress(prev => ({...prev, city: e.target.value}))}
                                           className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none"
                                        />
                                     </div>
                                     <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">State</label>
                                        <input 
                                           type="text" 
                                           value={tempAddress.state}
                                           onChange={(e) => setTempAddress(prev => ({...prev, state: e.target.value}))}
                                           className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none"
                                        />
                                     </div>
                                     <div className="space-y-2 col-span-2 md:col-span-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">ZIP Code</label>
                                        <input 
                                           type="text" 
                                           value={tempAddress.zip}
                                           onChange={(e) => setTempAddress(prev => ({...prev, zip: e.target.value}))}
                                           className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none"
                                        />
                                     </div>
                                  </div>
                               </div>
                               <button 
                                  onClick={() => {
                                    setUser(prev => ({...prev, address: tempAddress}));
                                    setActiveSettingsSection(null);
                                  }}
                                  className="bg-[#2563eb] text-white px-8 py-3 rounded-2xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
                               >
                                 Save Address
                               </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Rental Preferences Block */}
                    <div className={`bg-white border rounded-[2.5rem] overflow-hidden transition-all duration-300 ${activeSettingsSection === 'preferences' ? 'border-[#2563eb] shadow-xl shadow-blue-500/5' : 'border-slate-200 shadow-sm'}`}>
                      <div 
                        className={`p-8 flex items-center justify-between cursor-pointer group ${activeSettingsSection === 'preferences' ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                        onClick={() => {
                          setActiveSettingsSection(activeSettingsSection === 'preferences' ? null : 'preferences');
                          setTempPreferences({ ...user.preferences });
                        }}
                      >
                         <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl transition-colors ${activeSettingsSection === 'preferences' ? 'bg-[#2563eb] text-white' : 'bg-slate-50 text-slate-400 group-hover:text-slate-600'}`}>
                              <Receipt size={24} />
                            </div>
                            <div>
                               <h3 className="font-bold text-lg text-slate-900">Rental Preferences</h3>
                               <p className="text-sm text-slate-500 font-medium">Auto-renew, damage protection, and billing</p>
                            </div>
                         </div>
                         <ChevronRight size={20} className={activeSettingsSection === 'preferences' ? 'rotate-90 text-[#2563eb]' : 'text-slate-300'} />
                      </div>
                      
                      <AnimatePresence>
                        {activeSettingsSection === 'preferences' && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                          >
                            <div className="p-8 border-t border-slate-100 space-y-6 bg-white">
                               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                  <PreferenceToggle 
                                    icon={<Plus size={18} />} 
                                    label="Auto-Renew" 
                                    description="Automatically extend rentals"
                                    active={tempPreferences.autoRenewal}
                                    onChange={(v: boolean) => setTempPreferences(prev => ({...prev, autoRenewal: v}))}
                                  />
                                  <PreferenceToggle 
                                    icon={<ShieldCheck size={18} />} 
                                    label="Damage Protection" 
                                    description="Opt-in to daily insurance"
                                    active={tempPreferences.damageProtection}
                                    onChange={(v: boolean) => setTempPreferences(prev => ({...prev, damageProtection: v}))}
                                  />
                                  <PreferenceToggle 
                                    icon={<Mail size={18} />} 
                                    label="Paperless Billing" 
                                    description="Digital invoices only"
                                    active={tempPreferences.paperlessBilling}
                                    onChange={(v: boolean) => setTempPreferences(prev => ({...prev, paperlessBilling: v}))}
                                  />
                               </div>
                               <button 
                                  onClick={() => {
                                    setUser(prev => ({...prev, preferences: tempPreferences}));
                                    setActiveSettingsSection(null);
                                  }}
                                  className="bg-[#2563eb] text-white px-8 py-3 rounded-2xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
                               >
                                 Save Preferences
                               </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Security & Password Block */}
                    <div className={`bg-white border rounded-[2.5rem] overflow-hidden transition-all duration-300 ${activeSettingsSection === 'security' ? 'border-[#2563eb] shadow-xl shadow-blue-500/5' : 'border-slate-200 shadow-sm'}`}>
                      <div 
                        className={`p-8 flex items-center justify-between cursor-pointer group ${activeSettingsSection === 'security' ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                        onClick={() => setActiveSettingsSection(activeSettingsSection === 'security' ? null : 'security')}
                      >
                         <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl transition-colors ${activeSettingsSection === 'security' ? 'bg-[#2563eb] text-white' : 'bg-slate-50 text-slate-400 group-hover:text-slate-600'}`}>
                              <Shield size={24} />
                            </div>
                            <div>
                               <h3 className="font-bold text-lg text-slate-900">Security & Password</h3>
                               <p className="text-sm text-slate-500 font-medium">Update password and security settings</p>
                            </div>
                         </div>
                         <ChevronRight size={20} className={activeSettingsSection === 'security' ? 'rotate-90 text-[#2563eb]' : 'text-slate-300'} />
                      </div>
                      
                      <AnimatePresence>
                        {activeSettingsSection === 'security' && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                          >
                            <div className="p-8 border-t border-slate-100 space-y-6 bg-white">
                               <div className="space-y-4">
                                  <div className="space-y-2">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">New Password</label>
                                     <div className="relative">
                                        <input 
                                           type={showSettingsPassword ? "text" : "password"} 
                                           placeholder="Enter new password"
                                           value={settingsPassword}
                                           onChange={(e) => setSettingsPassword(e.target.value)}
                                           className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 pr-12 text-sm font-bold outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                                        />
                                        <button 
                                          type="button"
                                          onClick={() => setShowSettingsPassword(!showSettingsPassword)}
                                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                          {showSettingsPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                     </div>
                                     {settingsPassword && (
                                        <div className="mt-2 px-1">
                                          <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                                              Strength: <span className={getPasswordStrengthLabel(getPasswordStrength(settingsPassword)).color}>
                                                {getPasswordStrengthLabel(getPasswordStrength(settingsPassword)).label}
                                              </span>
                                            </span>
                                          </div>
                                          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5 mb-2">
                                            {[1, 2, 3, 4].map((step) => (
                                              <div 
                                                key={step}
                                                className={`h-full flex-1 transition-all duration-500 ${
                                                  getPasswordStrength(settingsPassword) >= step 
                                                    ? getPasswordStrengthLabel(getPasswordStrength(settingsPassword)).barColor 
                                                    : 'bg-slate-200'
                                                }`} 
                                              />
                                            ))}
                                          </div>
                                          <p className="text-[9px] text-slate-400 font-medium">
                                            Tip: Use 8+ characters with mixed case, numbers, and symbols.
                                          </p>
                                        </div>
                                      )}
                                  </div>
                               </div>
                               <button 
                                  onClick={() => {
                                    setSettingsPassword('');
                                    setActiveSettingsSection(null);
                                    showToast('Security settings updated successfully!');
                                  }}
                                  className="bg-[#2563eb] text-white px-8 py-3 rounded-2xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
                               >
                                 Update Security
                               </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Rental Support Block */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                          <Wind size={160} />
                       </div>
                       <div className="relative">
                          <h2 className="text-2xl font-bold mb-2">Need a custom plan?</h2>
                          <p className="text-slate-400 text-sm max-w-sm mb-6 font-medium">Our enterprise team handles bulk rentals and office setups with dedicated support managers.</p>
                          <button className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-bold shadow-xl hover:bg-slate-100 transition-all active:scale-95">
                             Contact Support
                          </button>
                       </div>
                    </div>
                 </div>
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* MODALS / OVERLAYS */}
        
        {/* Quick View Modal */}
        <AnimatePresence>
          {showQuickView && selectedProduct && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
                onClick={() => setShowQuickView(false)} 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
              >
                <button 
                  onClick={() => setShowQuickView(false)}
                  className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md hover:bg-slate-200 rounded-full transition-colors shadow-sm"
                >
                  <X size={20} />
                </button>

                <div className="w-full md:w-1/2 bg-slate-50 flex items-center justify-center p-0 border-b md:border-b-0 md:border-r border-slate-100 relative overflow-hidden">
                  <img 
                    {...getResponsiveImageAttributes(selectedProduct.title, selectedProduct.image, 400, 600)}
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => handleImageError(e, selectedProduct.title)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none" />
                  <div className="absolute bottom-6 left-6 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold shadow-sm border border-white/20 uppercase tracking-widest text-slate-800">Premium Quality</span>
                  </div>
                </div>

                <div className="flex-1 p-8 overflow-y-auto no-scrollbar">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-md tracking-wider mb-2 inline-block ${selectedProduct.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {selectedProduct.status}
                      </span>
                      <h2 className="text-3xl font-bold text-slate-900 leading-tight mb-2">{selectedProduct.title}</h2>
                      <p className="text-slate-500 flex items-center gap-1.5 font-medium mb-3">
                        <Home size={16} className="text-[#2563eb]" /> Hosted by <span className="font-bold text-slate-700">{selectedProduct.vendor}</span>
                      </p>
                      <div className="flex items-center gap-1 text-sm font-bold text-slate-700">
                        <Star size={16} className={productReviews[selectedProduct.id] && productReviews[selectedProduct.id].length > 0 ? "text-amber-400 fill-amber-400" : "text-slate-300"} />
                        {productReviews[selectedProduct.id] && productReviews[selectedProduct.id].length > 0 
                          ? (productReviews[selectedProduct.id].reduce((a, b) => a + b.rating, 0) / productReviews[selectedProduct.id].length).toFixed(1)
                          : "New"
                        }
                        <span className="text-slate-400 font-medium ml-1">
                          ({productReviews[selectedProduct.id] ? productReviews[selectedProduct.id].length : 0} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 mb-8">
                    <p className="text-slate-500 leading-relaxed font-medium">
                      High-end {selectedProduct.title.toLowerCase()} curated for comfort and durability. This product undergoes a 12-point quality check before delivery. Ideal for modern urban living spaces.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Monthly Rent</p>
                        <p className="text-2xl font-bold text-slate-900">${selectedProduct.price}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Security Deposit</p>
                        <p className="text-2xl font-bold text-slate-900">${selectedProduct.deposit}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                        <CheckCircle2 size={18} className="text-emerald-500" />
                        <span>Professional Installation Included</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                        <CheckCircle2 size={18} className="text-emerald-500" />
                        <span>24/7 Priority Support</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                        <CheckCircle2 size={18} className="text-emerald-500" />
                        <span>Cancel or Swap anytime</span>
                      </div>
                    </div>

                    {/* Variant Selection */}
                    {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                      <div className="space-y-6 pt-2 pb-2">
                        {selectedProduct.variants.map((variant: any) => (
                          <div key={variant.type} className="space-y-3">
                            <div className="flex justify-between items-center">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{variant.type}</h4>
                              <span className="text-xs font-bold text-[#2563eb]">{selectedQuickViewVariants[variant.type]}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {variant.options.map((option: string) => (
                                <button
                                  key={option}
                                  onClick={() => setSelectedQuickViewVariants(prev => ({ ...prev, [variant.type]: option }))}
                                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                                    selectedQuickViewVariants[variant.type] === option
                                      ? 'bg-slate-900 border-slate-900 text-white shadow-lg scale-105'
                                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-6 border-t border-slate-100">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Specifications</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {['Energy Efficient', 'Compact Design', 'Premium Build', 'Smart Integration'].map((spec) => (
                          <div key={spec} className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                             <div className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" /> {spec}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Reviews Section */}
                  <div className="border-t border-slate-100 pt-6 mb-8 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <MessageSquare size={18} className="text-[#2563eb]" /> Reviews
                      </h3>
                      <button 
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="text-xs font-bold text-[#2563eb] hover:underline"
                      >
                        {showReviewForm ? 'Cancel' : 'Write a Review'}
                      </button>
                    </div>

                    <AnimatePresence>
                      {showReviewForm && (
                         <motion.div
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: 'auto', opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           className="overflow-hidden"
                         >
                           <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 mb-4">
                             <div>
                               <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Rating</p>
                               <div className="flex gap-1">
                                 {[1, 2, 3, 4, 5].map(star => (
                                   <button 
                                     key={star} 
                                     onClick={() => setNewReviewRating(star)}
                                     className="hover:scale-110 active:scale-95 transition-transform"
                                   >
                                     <Star size={20} className={star <= newReviewRating ? "text-amber-400 fill-amber-400" : "text-slate-300"} />
                                   </button>
                                 ))}
                               </div>
                             </div>
                             <div>
                               <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Comment</p>
                               <textarea 
                                 value={newReviewComment}
                                 onChange={(e) => setNewReviewComment(e.target.value)}
                                 className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2563eb]/20 resize-none h-20"
                                 placeholder="Share your experience..."
                               />
                             </div>
                             <button
                               onClick={() => {
                                 if(!newReviewComment.trim()) return;
                                 setProductReviews(prev => ({
                                   ...prev,
                                   [selectedProduct.id]: [
                                     ...(prev[selectedProduct.id] || []),
                                     { id: Date.now().toString(), rating: newReviewRating, comment: newReviewComment, date: new Date().toLocaleDateString(), user: user.name }
                                   ]
                                 }));
                                 setNewReviewComment('');
                                 setNewReviewRating(5);
                                 setShowReviewForm(false);
                               }}
                               className="w-full bg-slate-900 text-white font-bold text-xs py-2 rounded-xl hover:bg-slate-800 transition-colors"
                             >
                               Submit Review
                             </button>
                           </div>
                         </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-4 max-h-48 overflow-y-auto pr-2 no-scrollbar">
                       {productReviews[selectedProduct.id] && productReviews[selectedProduct.id].length > 0 ? (
                         productReviews[selectedProduct.id].map(review => (
                           <div key={review.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                             <div className="flex justify-between items-start">
                               <div>
                                 <p className="font-bold text-sm text-slate-900">{review.user}</p>
                                 <div className="flex gap-0.5 mt-1">
                                   {[1, 2, 3, 4, 5].map(star => (
                                      <Star key={star} size={10} className={star <= review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
                                   ))}
                                 </div>
                               </div>
                               <span className="text-[10px] text-slate-400 font-bold">{review.date}</span>
                             </div>
                             <p className="text-sm text-slate-600 leading-relaxed font-medium">{review.comment}</p>
                           </div>
                         ))
                       ) : (
                         <div className="text-center py-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                           <MessageSquare size={24} className="mx-auto text-slate-300 mb-2" />
                           <p className="text-sm font-bold text-slate-500">No reviews yet</p>
                           <p className="text-xs text-slate-400 font-medium mt-1">Be the first to review this product!</p>
                         </div>
                       )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                    <button 
                      onClick={() => {
                        setShowQuickView(false);
                        handleRentClick(selectedProduct, selectedQuickViewVariants);
                      }}
                      className="flex-[2] bg-[#2563eb] text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-600 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      Rent Now <ArrowRight size={20} />
                    </button>
                    <button 
                      onClick={() => toggleCart(selectedProduct.id, selectedProduct.title, selectedQuickViewVariants)}
                      className={`flex-1 py-4 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${
                        cart.some(item => item.id === selectedProduct.id && JSON.stringify(item.selectedVariants) === JSON.stringify(selectedQuickViewVariants))
                          ? 'bg-slate-100 text-slate-900 border border-slate-200'
                          : 'bg-white text-slate-900 border border-slate-200 shadow-sm hover:border-slate-300'
                      }`}
                    >
                      <ShoppingCart size={20} /> {cart.some(item => item.id === selectedProduct.id && JSON.stringify(item.selectedVariants) === JSON.stringify(selectedQuickViewVariants)) ? 'Added' : 'Add to Cart'}
                    </button>
                    <button 
                       onClick={() => {
                        const id = selectedProduct.id;
                        setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
                       }}
                       className={`p-4 rounded-2xl border transition-all active:scale-95 flex items-center justify-center shadow-sm ${wishlist.includes(selectedProduct.id) ? 'bg-red-50 border-red-100 text-red-500 ring-2 ring-red-500/10' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'}`}
                    >
                      <Heart size={24} fill={wishlist.includes(selectedProduct.id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Checkout Modal */}
        <AnimatePresence>
          {showCheckout && (selectedProduct || isCartCheckout) && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
                onClick={() => setShowCheckout(false)} 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
              >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="font-bold text-xl">{isCartCheckout ? 'Checkout Your Cart' : 'Confirm Rental'}</h2>
                <button onClick={() => setShowCheckout(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                {/* Product Summary */}
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <ShoppingCart size={16} className="text-[#2563eb]" /> {isCartCheckout ? 'Items to Rent' : 'Product Summary'}
                  </h4>
                  <div className="space-y-3">
                    {isCartCheckout ? (
                      cart.map((item, idx) => {
                        const product = products.find(p => p.id === item.id);
                        if (!product) return null;
                        return (
                          <div key={`${item.id}-${idx}`} className="flex gap-4 items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <div className="w-12 h-12 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                              <img 
                                {...getResponsiveImageAttributes(product.title, product.image, 80, 150)}
                                alt={product.title} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-sm truncate">{product.title}</h5>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.quantity} × ${product.price}/mo</p>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-sm text-slate-900">${product.price * item.quantity}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      selectedProduct && (
                        <div className="flex gap-4 items-center">
                          <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-100">
                            <img 
                              src={getProductImage(selectedProduct.title, selectedProduct.image)} 
                              alt={selectedProduct.title}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              onError={(e) => handleImageError(e, selectedProduct.title)}
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg leading-none mb-1">{selectedProduct.title}</h3>
                            <p className="text-slate-500 text-sm font-medium mb-2">by {selectedProduct.vendor}</p>
                            {Object.entries(selectedCheckoutVariants).length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {Object.entries(selectedCheckoutVariants).map(([type, option]) => (
                                  <span key={type} className="text-[9px] font-black uppercase bg-blue-50 text-[#2563eb] border border-blue-100 px-2 py-0.5 rounded-full">
                                    {option}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Duration Selection */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-900">Select Rental Duration</h4>
                  <div className="flex gap-3">
                    {[3, 6, 12].map(duration => (
                      <button
                        key={duration}
                        onClick={() => setRentalDuration(duration)}
                        className={`flex-1 py-3 rounded-2xl border font-bold text-sm transition-all ${rentalDuration === duration ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-lg shadow-blue-500/20' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                      >
                        {duration} Months
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delivery Options */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-900">Delivery Options</h4>
                  <div className="flex gap-3">
                    {['Standard', 'Express'].map(speed => (
                      <button
                        key={speed}
                        onClick={() => setDeliverySpeed(speed as any)}
                        className={`flex-1 py-3 px-4 rounded-2xl border flex flex-col items-start transition-all ${deliverySpeed === speed ? 'bg-[#2563eb] border-[#2563eb] shadow-lg shadow-blue-500/20' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                      >
                        <span className={`font-bold text-sm ${deliverySpeed === speed ? 'text-white' : 'text-slate-900'}`}>{speed}</span>
                        <span className={`text-xs font-medium mt-1 text-left ${deliverySpeed === speed ? 'text-blue-100' : 'text-slate-500'}`}>
                          {speed === 'Standard' ? '3-5 Business Days (Free)' : 'Next Day Delivery (+$20)'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Promo Code */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-900">Promo Code</h4>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter code (e.g. SAVE10)"
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <button 
                      onClick={() => {
                        if (couponCode === 'SAVE10') {
                          setAppliedDiscount(10);
                          setCouponError('');
                          setCouponSuccess('$10 discount applied!');
                        } else if (couponCode === 'STUDENT20') {
                          setAppliedDiscount(20);
                          setCouponError('');
                          setCouponSuccess('$20 student discount applied!');
                        } else {
                          setAppliedDiscount(0);
                          setCouponSuccess('');
                          setCouponError('Invalid coupon code');
                        }
                      }}
                      className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-red-500 text-xs font-medium">{couponError}</p>}
                  {couponSuccess && <p className="text-emerald-600 text-xs font-medium">{couponSuccess}</p>}
                </div>

                {/* Price Breakdown */}
                <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                  {(() => {
                    const currentItemsTotal = isCartCheckout 
                      ? cart.reduce((total, item) => {
                          const p = products.find(prod => prod.id === item.id);
                          return total + (p ? p.price * item.quantity : 0);
                        }, 0)
                      : (selectedProduct?.price || 0);
                    
                    const currentDepositTotal = isCartCheckout
                      ? cart.reduce((total, item) => {
                          const p = products.find(prod => prod.id === item.id);
                          return total + (p ? (p.deposit || p.price * 0.5) * item.quantity : 0);
                        }, 0)
                      : (selectedProduct?.deposit || (selectedProduct?.price || 0) * 0.5);

                    const deliveryCharge = deliverySpeed === 'Express' ? 20 : 0;
                    const upfrontTotal = Math.max(0, currentItemsTotal + currentDepositTotal + deliveryCharge - appliedDiscount);

                    return (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">Monthly Rent ({rentalDuration} Months)</span>
                          <span className="font-bold font-mono">${currentItemsTotal}.00</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">Security Deposit (Refundable)</span>
                          <span className="font-bold font-mono">${currentDepositTotal}.00</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">Delivery & Setup</span>
                          <span className={deliverySpeed === 'Express' ? "font-bold font-mono" : "text-emerald-600 font-bold"}>
                            {deliverySpeed === 'Express' ? '+$20.00' : 'FREE'}
                          </span>
                        </div>
                        {appliedDiscount > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">Discount Applied</span>
                            <span className="font-bold font-mono text-emerald-600">-${appliedDiscount}.00</span>
                          </div>
                        )}
                        <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                          <span className="font-bold text-slate-900">Total Upfront</span>
                          <span className="text-2xl font-bold text-[#2563eb] font-mono">${upfrontTotal}.00</span>
                        </div>
                        <div className="flex justify-between items-center pb-2">
                          <span className="text-slate-500 text-xs font-medium">Total Contract Value</span>
                          <span className="font-bold text-slate-400 font-mono text-sm">${currentItemsTotal * rentalDuration}.00</span>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <CheckCircle2 size={20} className="text-emerald-500" />
                    <p className="text-sm text-emerald-800 font-medium">Quality Check Verified & Ready for Dispatch.</p>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium px-2">
                    By clicking "Complete Checkout", you agree to the RentEase Rental Agreement and authorize a security hold on your credit card.
                  </p>
                </div>
              </div>
              <div className="p-6 bg-white border-t border-slate-100">
                <button 
                  onClick={() => {
                    const today = new Date();
                    const deliveryDate = new Date(today);
                    deliveryDate.setDate(deliveryDate.getDate() + (deliverySpeed === 'Express' ? 1 : 3));

                    const orderId = `RT-${Math.floor(Math.random() * 900000) + 100000}`;
                    const itemsToProcess = isCartCheckout 
                      ? cart.map(item => ({ ...products.find(p => p.id === item.id), ...item }))
                      : [{ ...selectedProduct, selectedVariants: selectedCheckoutVariants, quantity: 1 }];

                    // Common upfront calc
                    const currentItemsTotal = itemsToProcess.reduce((total, item: any) => total + (item.price * (item.quantity || 1)), 0);
                    const currentDepositTotal = itemsToProcess.reduce((total, item: any) => total + ((item.deposit || item.price * 0.5) * (item.quantity || 1)), 0);
                    const deliveryCharge = deliverySpeed === 'Express' ? 20 : 0;
                    const upfrontTotal = Math.max(0, currentItemsTotal + currentDepositTotal + deliveryCharge - appliedDiscount);

                    // Add to Active Rentals
                    itemsToProcess.forEach(item => {
                      const newRentalId = Math.floor(Math.random() * 1000) + 300;
                      setMyRentals(prev => [{
                        id: newRentalId,
                        title: item.title as string,
                        price: item.price as number,
                        startDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                        status: 'Processing',
                        image: item.image as string,
                        selectedVariants: item.selectedVariants as Record<string, string>,
                        quantity: item.quantity
                      }, ...prev]);
                    });

                    // Add to Order History (Single entry for order)
                    setOrderHistory(prev => [{
                      id: Math.floor(Math.random() * 900000) + 100000,
                      title: isCartCheckout ? `${itemsToProcess.length} Items Order` : itemsToProcess[0].title,
                      price: currentItemsTotal,
                      duration: `${rentalDuration} Month${rentalDuration > 1 ? 's' : ''}`,
                      endDate: deliveryDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                      image: itemsToProcess[0].image,
                      selectedVariants: isCartCheckout ? { "Items": String(itemsToProcess.length) } : itemsToProcess[0].selectedVariants,
                      total: upfrontTotal
                    }, ...prev]);

                    setConfirmationDetails({
                      orderId,
                      product: isCartCheckout ? { title: `${itemsToProcess.length} Items`, vendor: 'Multi-Vendor' } : selectedProduct,
                      upfront: upfrontTotal,
                      deliveryDate: deliveryDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                    });
                    
                    if (isCartCheckout) setCart([]);
                    setShowCheckout(false);
                    setShowConfirmation(true);
                  }}
                  className="w-full bg-[#2563eb] text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Complete Checkout <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
        </AnimatePresence>

        {/* Confirmation Modal */}
        <AnimatePresence>
        {showConfirmation && confirmationDetails && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col text-center max-h-[90vh]"
            >
              <div className="p-8 overflow-y-auto no-scrollbar">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="text-emerald-500" />
                </div>
                <h2 className="font-bold text-2xl mb-2 text-slate-900">Rental Confirmed!</h2>
                <p className="text-slate-500 mb-6 font-medium">Your order has been placed successfully.</p>
                
                <div className="flex flex-col items-center justify-center mb-8">
                  <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm mb-3 mx-auto inline-flex">
                    <QRCodeSVG 
                      value={`https://ais-dev.run.app/order/${confirmationDetails.orderId}`} 
                      size={120}
                      level={"L"}
                      includeMargin={false}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium max-w-[200px] mx-auto text-center leading-relaxed">
                    Order ID: <span className="text-slate-900 font-bold">{confirmationDetails.orderId}</span><br/>
                    Scan to track your rental delivery status
                  </p>
                </div>
                
                <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-4 mb-8">
                  <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
                     <img 
                       src={getProductImage(confirmationDetails.product.title, confirmationDetails.product.image)}
                       alt={confirmationDetails.product.title}
                       className="w-12 h-12 rounded-xl object-cover bg-white border border-slate-200"
                       referrerPolicy="no-referrer"
                       onError={(e) => handleImageError(e, confirmationDetails.product.title)}
                     />
                     <div>
                       <p className="font-bold text-sm text-slate-900">{confirmationDetails.product.title}</p>
                       <p className="text-xs text-slate-500 font-medium">{confirmationDetails.duration} Months Term</p>
                     </div>
                  </div>
                  
                  {confirmationDetails.discount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500 font-medium">Discount Applied</span>
                      <span className="font-bold font-mono text-emerald-600">-${confirmationDetails.discount}.00</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 font-medium">Amount Paid</span>
                    <span className="font-bold font-mono text-slate-900">${confirmationDetails.upfront}.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 font-medium">Delivery</span>
                    <div className="text-right">
                      <p className="font-bold text-[#2563eb]">{confirmationDetails.deliverySpeed}</p>
                      <p className="text-xs font-bold text-slate-500">{confirmationDetails.deliveryDate}</p>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{confirmationDetails.deliveryTimeSlot}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button 
                    onClick={() => {
                      setMyRentals(prev => prev.map(r => 
                        r.id === confirmationDetails.rentalId ? { ...r, status: 'Delivered' as any } : r
                      ));
                      const newMessage = `Delivery confirmed for ${confirmationDetails.product.title}!`;
                      showToast(`${newMessage} Status updated to Delivered.`);
                      setNotifications(prev => [{
                        id: Date.now(),
                        message: newMessage,
                        time: 'Just now',
                        read: false
                      }, ...prev]);
                      setShowConfirmation(false);
                      navigateToTab('Rentals');
                    }}
                    className="bg-[#2563eb] text-white py-4 rounded-xl font-bold text-sm shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    Confirm Delivery
                  </button>
                  <button 
                    onClick={() => {
                      setShowConfirmation(false);
                      setDeliveryTrackingId(confirmationDetails.product.id);
                      setShowDeliveryTracking(true);
                      navigateToTab('Rentals');
                    }}
                    className="bg-emerald-500 text-white py-4 rounded-xl font-bold text-sm shadow-lg hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Navigation size={18} /> Track Delivery
                  </button>
                  <button 
                    onClick={() => {
                      setShowConfirmation(false);
                      navigateToTab('Rentals');
                    }}
                    className="bg-slate-50 text-slate-700 py-4 rounded-xl font-bold text-sm border border-slate-200 hover:bg-slate-100 active:scale-95 transition-all"
                  >
                    View Rentals
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        </AnimatePresence>

        {/* Listing / Vendor Onboarding Modal */}
        <AnimatePresence>
          {isListing && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
                onClick={() => {
                  setIsListing(false);
                  setOnboardingStep(0);
                }} 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#2563eb] rounded-lg flex items-center justify-center text-white">
                      <LayoutDashboard size={18} />
                    </div>
                    <h2 className="font-bold text-lg text-slate-900">Vendor Onboarding</h2>
                  </div>
                  <button 
                    onClick={() => {
                      setIsListing(false);
                      setOnboardingStep(0);
                    }} 
                    className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-8 overflow-y-auto no-scrollbar">
                  {/* Progress Bar */}
                  <div className="flex items-center gap-2 mb-8">
                    {[0, 1, 2, 3].map((step) => (
                      <div 
                        key={step}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                          onboardingStep >= step ? 'bg-[#2563eb]' : 'bg-slate-100'
                        }`}
                      />
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {onboardingStep === 0 && (
                      <motion.div
                        key="step0"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="text-center"
                      >
                        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-[#2563eb] mx-auto mb-6">
                          <ShoppingBag size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">Welcome, Partner!</h3>
                        <p className="text-slate-500 mb-8 font-medium leading-relaxed">
                          Join thousands of vendors earning monthly passive income. To get started, we'll need to verify your business and setup your payouts.
                        </p>
                        <div className="space-y-3 mb-8 text-left max-w-xs mx-auto">
                          <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                             <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                               <CheckCircle2 size={14} />
                             </div>
                             Verified listing badge
                          </div>
                          <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                             <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                               <CheckCircle2 size={14} />
                             </div>
                             Automated monthly payouts
                          </div>
                          <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                             <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                               <CheckCircle2 size={14} />
                             </div>
                             24/7 Logistics support
                          </div>
                        </div>
                        <button 
                          onClick={() => setOnboardingStep(1)}
                          className="w-full bg-[#2563eb] text-white py-4 rounded-2xl font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all text-lg"
                        >
                          Start Verification
                        </button>
                      </motion.div>
                    )}

                    {onboardingStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-1">Business Verification</h3>
                          <p className="text-sm text-slate-500 font-medium">Please provide your official business details.</p>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Portal Account Password</label>
                            <div className="relative">
                              <input 
                                type={showVendorPassword ? "text" : "password"} 
                                placeholder="Create a strong password" 
                                value={vendorPassword}
                                onChange={(e) => setVendorPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:bg-white transition-all font-medium" 
                              />
                              <button 
                                type="button"
                                onClick={() => setShowVendorPassword(!showVendorPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                              >
                                {showVendorPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                            {vendorPassword && (
                              <div className="mt-2 px-1">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                                    Strength: <span className={getPasswordStrengthLabel(getPasswordStrength(vendorPassword)).color}>
                                      {getPasswordStrengthLabel(getPasswordStrength(vendorPassword)).label}
                                    </span>
                                  </span>
                                </div>
                                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5 mb-2">
                                  {[1, 2, 3, 4].map((step) => (
                                    <div 
                                      key={step}
                                      className={`h-full flex-1 transition-all duration-500 ${
                                        getPasswordStrength(vendorPassword) >= step 
                                          ? getPasswordStrengthLabel(getPasswordStrength(vendorPassword)).barColor 
                                          : 'bg-slate-200'
                                      }`} 
                                    />
                                  ))}
                                </div>
                                <p className="text-[9px] text-slate-400 font-medium">
                                  Tip: Use 8+ characters with mixed case, numbers, and symbols.
                                </p>
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Legal Business Name</label>
                            <input type="text" placeholder="e.g. Urban Living Furniture Ltd." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:bg-white transition-all font-medium" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Business type</label>
                              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:bg-white transition-all font-medium appearance-none">
                                <option>Corporation</option>
                                <option>Sole Proprietor</option>
                                <option>Partnership</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Tax ID / EIN</label>
                              <input type="text" placeholder="XX-XXXXXXX" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:bg-white transition-all font-medium" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Business Address</label>
                            <textarea placeholder="Full office or warehouse address" rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:bg-white transition-all font-medium resize-none" />
                          </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                          <button onClick={() => setOnboardingStep(0)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all">Back</button>
                          <button onClick={() => setOnboardingStep(2)} className="flex-[2] bg-[#2563eb] text-white py-4 rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
                            Continue <ArrowRight size={18} />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {onboardingStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                         <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-1">Payout Settings</h3>
                          <p className="text-sm text-slate-500 font-medium">Monthly earnings will be deposited automatically.</p>
                        </div>

                        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                          <Info size={20} className="text-[#2563eb] shrink-0 mt-0.5" />
                          <p className="text-xs text-[#2563eb] font-semibold leading-relaxed">Payments are processed between the 1st and 5th of every month via Stripe Connect.</p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Account Holder Name</label>
                            <input type="text" placeholder="As it appears on your statement" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:bg-white transition-all font-medium" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Bank Name</label>
                            <input type="text" placeholder="e.g. Chase Bank, Wells Fargo" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:bg-white transition-all font-medium" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Account Number</label>
                              <div className="relative">
                                <input 
                                  type={showAccountNumber ? "text" : "password"} 
                                  placeholder="••••••••" 
                                  value={accountNumber}
                                  onChange={(e) => setAccountNumber(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:bg-white transition-all font-medium" 
                                />
                                <button 
                                  type="button"
                                  onClick={() => setShowAccountNumber(!showAccountNumber)}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                  {showAccountNumber ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                              </div>
                              {accountNumber && (
                                <div className="mt-2 px-1">
                                  <p className="text-[9px] text-slate-400 font-medium flex items-center gap-1">
                                    <Shield size={10} className="text-emerald-500" /> Masked for your security
                                  </p>
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Routing Number</label>
                              <input type="text" placeholder="9 digits" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:bg-white transition-all font-medium" />
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                          <button onClick={() => setOnboardingStep(1)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all">Back</button>
                          <button onClick={() => { setOnboardingStep(3); setIsVerifiedVendor(true); }} className="flex-[2] bg-[#2563eb] text-white py-4 rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
                            Finish Setup <CheckCircle2 size={18} />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {onboardingStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center"
                      >
                        <div className="relative inline-block mb-8">
                           <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto ring-8 ring-emerald-50/50">
                            <CheckCircle2 size={48} />
                          </div>
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-white border-4 border-emerald-50 rounded-full flex items-center justify-center text-emerald-500 shadow-sm"
                          >
                            <ShieldCheck size={16} />
                          </motion.div>
                        </div>

                        <h3 className="text-2xl font-bold text-slate-900 mb-3">You're Verified!</h3>
                        <p className="text-slate-500 mb-10 font-medium leading-relaxed px-4">
                          Your vendor profile is now active. You can start listing products and tracking orders in your new Vendor Dashboard.
                        </p>
                        
                        <div className="space-y-4 mb-4">
                          <button 
                            onClick={() => {
                              setIsListing(false);
                              setOnboardingStep(0);
                            }}
                            className="w-full bg-slate-900 text-white py-4 rounded-[1.25rem] font-bold shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                          >
                             <Plus size={20} /> List Your First Item
                          </button>
                          <button 
                            onClick={() => {
                              setIsListing(false);
                              setOnboardingStep(0);
                            }}
                            className="w-full bg-white border border-slate-200 text-slate-700 py-4 rounded-[1.25rem] font-bold hover:bg-slate-50 transition-all"
                          >
                            Go to Dashboard
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {rentalToCancel !== null && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-sm w-full relative"
              >
                <button 
                  onClick={() => setRentalToCancel(null)}
                  className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors active:scale-95"
                >
                  <X size={16} />
                </button>
                <div className="p-6 pt-8 text-center">
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-100">
                    <AlertCircle size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Cancel Rental?</h3>
                  <p className="text-sm font-medium text-slate-500 mb-8">
                    Are you sure you want to cancel this rental? You may be subject to early cancellation fees as per the agreement.
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setRentalToCancel(null)}
                      className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors active:scale-95"
                    >
                      Keep It
                    </button>
                    <button 
                      onClick={() => {
                        setMyRentals(prev => prev.map(r => r.id === rentalToCancel ? { ...r, status: 'Cancelled' as const } : r));
                        setRentalToCancel(null);
                      }}
                      className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 focus:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-colors active:scale-95 shadow-red-500/20"
                    >
                      Yes, Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delivery Tracking Modal */}
        <AnimatePresence>
          {showDeliveryTracking && deliveryTrackingId !== null && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full relative h-[600px] flex flex-col"
              >
                <div className="p-5 border-b border-slate-100 flex items-center justify-between z-10 bg-white">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Track Delivery</h3>
                    <p className="text-sm font-medium text-slate-500">Order #{deliveryTrackingId}</p>
                  </div>
                  <button 
                    onClick={() => setShowDeliveryTracking(false)}
                    className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full transition-colors active:scale-95"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                {/* Simulated Map Area */}
                <div className="flex-1 bg-slate-100 relative overflow-hidden">
                  {/* Decorative Map Vector representation */}
                  <svg className="absolute inset-0 w-full h-full text-slate-200" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\' fill=\'%23cbd5e1\' fill-opacity=\'0.4\' fill-rule=\'nonzero\'/%3E%3C/g%3E%3C/svg%3E")', backgroundSize: '30px 30px' }}></svg>
                  
                  {/* Map route curve line */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                    <path d="M 50 150 Q 150 50 250 200 T 450 350" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="8 8" className="opacity-60" />
                  </svg>
                  
                  <div className="absolute top-8 left-8 flex flex-col items-center">
                    <div className="w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center border-2 border-slate-200">
                      <Store size={20} className="text-slate-500"/>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 bg-white/80 px-2 py-0.5 rounded shadow mt-1">Warehouse</span>
                  </div>

                  <div className="absolute bottom-16 right-8 flex flex-col items-center">
                    <div className="w-10 h-10 bg-emerald-50 shadow-lg rounded-full flex items-center justify-center border-2 border-emerald-500 z-10 relative">
                       <MapPin size={20} className="text-emerald-500 fill-emerald-100"/>
                       <div className="absolute -inset-2 bg-emerald-500/20 rounded-full -z-10 animate-ping"></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 bg-white/80 px-2 py-0.5 rounded shadow mt-1">Destination</span>
                  </div>

                  {/* Agent location (animated) */}
                  <motion.div 
                    className="absolute"
                    initial={{ left: '30%', top: '30%' }}
                    animate={{ left: '55%', top: '55%' }}
                    transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 bg-[#2563eb] rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                        <Truck size={20} className="text-white" />
                      </div>
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap">
                        Agent Location
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="bg-white p-6 z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                   <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                     <div className="flex gap-4 items-center">
                       <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100">
                         <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80" alt="Agent" className="w-full h-full object-cover" />
                       </div>
                       <div>
                         <p className="font-bold text-slate-900 text-sm">Michael J.</p>
                         <div className="flex items-center gap-1 text-xs font-medium text-slate-500"><Star size={12} className="text-amber-400 fill-amber-400" /> 4.9 • Delivery Agent</div>
                       </div>
                     </div>
                     <div className="flex gap-2">
                       <button className="w-10 h-10 rounded-full bg-[#2563eb]/10 text-[#2563eb] border border-[#2563eb]/20 flex items-center justify-center hover:bg-[#2563eb]/20 transition-all"><MessageSquare size={18} /></button>
                       <button className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center hover:bg-slate-200 transition-all"><Smartphone size={18} /></button>
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100/50">
                       <p className="text-xs text-blue-600/60 font-bold mb-1 uppercase tracking-wide">Est. Arrival</p>
                       <p className="text-xl font-bold text-blue-700">14 Mins</p>
                     </div>
                     <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100/50">
                       <p className="text-xs text-emerald-600/60 font-bold mb-1 uppercase tracking-wide">Status</p>
                       <p className="text-[14px] font-bold text-emerald-700 mt-1.5 flex items-center gap-1.5"><Navigation size={14} className="animate-pulse" /> On the way</p>
                     </div>
                   </div>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed bottom-6 right-6 z-[200] bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[280px]"
            >
              <div className="w-8 h-8 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <p className="font-bold text-sm">{toastMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <FilterDrawer 
          isOpen={showFilters} 
          onClose={() => setShowFilters(false)}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          minRating={minRating}
          setMinRating={setMinRating}
          onReset={() => {
            setPriceRange(100);
            setMinRating(0);
          }}
        />

      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all text-left group ${
        active 
          ? 'bg-blue-50 text-[#2563eb] font-bold shadow-sm' 
          : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      <span className={`${active ? 'text-[#2563eb]' : 'text-slate-400 group-hover:text-slate-600'}`}>{icon}</span>
      <span className="text-sm">{label}</span>
      {active && <div className="ml-auto w-1 h-4 bg-[#2563eb] rounded-full" />}
    </button>
  );
}

function StatCard({ label, value, icon, onClick }: { label: string, value: string, icon: React.ReactNode, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm cursor-pointer group hover:border-[#2563eb]/30 hover:shadow-lg transition-all active:scale-95"
    >
      <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</p>
        <span className="text-slate-200 group-hover:text-[#2563eb] transition-colors">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-slate-900">{typeof value === 'string' && !value.includes('$') && value.length <= 2 ? value : (value.startsWith('$') ? value : `$${value}`)}</p>
    </div>
  );
}

function PreferenceToggle({ icon, label, description, active, onChange, disabled }: any) {
  return (
    <div className={`p-6 rounded-3xl border transition-all ${active ? 'bg-[#2563eb]/5 border-[#2563eb]/20' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-xl border ${active ? 'bg-white text-[#2563eb] border-[#2563eb]/10' : 'bg-white text-slate-400 border-slate-100'}`}>
          {icon}
        </div>
        {!disabled && (
          <button 
            onClick={() => onChange(!active)}
            className={`w-10 h-5 rounded-full relative transition-colors ${active ? 'bg-[#2563eb]' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${active ? 'right-1' : 'left-1'}`} />
          </button>
        )}
      </div>
      <p className="font-bold text-slate-900 text-sm">{label}</p>
      <p className="text-[10px] text-slate-500 font-medium leading-tight mt-1">{description}</p>
    </div>
  );
}

const getResponsiveImageAttributes = (title: string, image: string, mobileWidth = 400, desktopWidth = 800) => {
  const src = getProductImage(title, image, { width: desktopWidth });
  
  // Create a srcSet for different breakpoints
  const srcSet = [
    `${getProductImage(title, image, { width: mobileWidth })} ${mobileWidth}w`,
    `${getProductImage(title, image, { width: 600 })} 600w`,
    `${src} ${desktopWidth}w`,
    `${getProductImage(title, image, { width: 1200 })} 1200w`
  ].join(', ');

  const sizes = `(max-width: 640px) ${mobileWidth}px, (max-width: 1024px) 600px, ${desktopWidth}px`;

  return { src, srcSet, sizes };
};

function ProductCard({ id, category, image, title, vendor, price, status, statusColor = "text-emerald-500 bg-emerald-50", onRent, onQuickView, onWishlist, onRemove, isWishlisted, onAddToCart, isInCart, reviews = [], variants = [], selectedVariants: initialSelectedVariants = {}, quantity = 1, onUpdateQuantity }: any) {
  const avgRating = reviews.length > 0 ? (reviews.reduce((a: number, b: any) => a + b.rating, 0) / reviews.length).toFixed(1) : "New";
  const numReviews = reviews.length;

  const [localSelectedVariants, setLocalSelectedVariants] = useState<Record<string, string>>(() => {
    if (Object.keys(initialSelectedVariants).length > 0) return initialSelectedVariants;
    const initial: Record<string, string> = {};
    if (variants) {
      variants.forEach((v: any) => {
        initial[v.type] = v.options[0];
      });
    }
    return initial;
  });

  const responsiveAttrs = getResponsiveImageAttributes(title, image);

  return (
    <div 
      className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group relative hover:-translate-y-1 block h-full flex flex-col cursor-pointer"
      onClick={() => onQuickView()}
    >
      <div className="h-48 bg-slate-50 flex items-center justify-center text-slate-400 font-medium group-hover:bg-slate-100 transition-colors border-b border-slate-100 relative overflow-hidden flex-shrink-0">
        <img 
          {...responsiveAttrs}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={(e) => handleImageError(e, title)}
        />
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors duration-300" />
        
        {/* Wishlist Button */}
        {!onRemove && (
          <div className="absolute top-4 right-4 z-20 text-[#2563eb]">
             <button 
              onClick={(e) => { e.stopPropagation(); onWishlist(); }}
              className={`p-2.5 rounded-full backdrop-blur-md shadow-sm border transition-all active:scale-90 ${isWishlisted ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white/80 border-slate-100 text-slate-400 hover:text-red-500'}`}
             >
               <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
             </button>
          </div>
        )}

        {/* Variant Indicator */}
        {variants && variants.length > 0 && !onRemove && (
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-white/90 backdrop-blur-md border border-white/20 px-2 py-1 rounded-lg shadow-sm">
              <p className="text-[8px] font-black uppercase text-slate-500 tracking-tighter flex items-center gap-1">
                <Plus size={8} /> {variants.length} Options
              </p>
            </div>
          </div>
        )}

        {/* Selected Variants Badge (e.g. in Cart) */}
        {Object.entries(initialSelectedVariants as Record<string, string>).length > 0 && (
          <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-1">
            {Object.entries(initialSelectedVariants as Record<string, string>).map(([type, option]) => (
              <span key={type} className="text-[8px] font-black uppercase bg-[#2563eb] text-white px-2 py-1 rounded-md shadow-lg shadow-blue-500/20 tracking-wider">
                {String(option)}
              </span>
            ))}
          </div>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <button 
            onClick={(e) => { e.stopPropagation(); onQuickView(); }}
            className="pointer-events-auto bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-bold shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 hover:bg-slate-50 active:scale-95"
          >
            <Eye size={14} /> Quick View
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-slate-900 text-base leading-tight line-clamp-1 flex-1 pr-2 " title={title}>{title}</h3>
          <span className={`flex-shrink-0 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${statusColor}`}>
            {status}
          </span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-slate-500 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" /> by {vendor}
          </p>
          <RatingStars rating={avgRating === "New" ? 0 : parseFloat(avgRating)} count={numReviews} size={12} />
        </div>

        {/* Quantity Controls - Only show in Cart mode (onUpdateQuantity provided) */}
        {onUpdateQuantity && (
          <div className="flex items-center justify-between mb-6 pt-4 border-t border-slate-50">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity</span>
            <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-xl">
               <button 
                onClick={(e) => { e.stopPropagation(); onUpdateQuantity(-1); }}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center shadow-sm active:scale-90"
               >
                 <Minus size={14} />
               </button>
               <span className="text-sm font-black text-slate-900 w-4 text-center">{quantity}</span>
               <button 
                onClick={(e) => { e.stopPropagation(); onUpdateQuantity(1); }}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center shadow-sm active:scale-90"
               >
                 <Plus size={14} />
               </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center border-t border-slate-50 pt-4 mt-auto">
          <div>
            <p className="text-lg font-bold text-slate-900 leading-none">${price}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-1">per month</p>
          </div>
          <div className="flex gap-1.5">
            {onRemove && (
              <button 
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                className="bg-red-50 text-red-500 p-2.5 rounded-xl border border-red-100 hover:bg-red-100 transition-all active:scale-95 group/remove"
                title="Remove Item"
              >
                <Trash2 size={16} />
              </button>
            )}
            
            {!onRemove && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); onAddToCart && onAddToCart(localSelectedVariants); }}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all active:scale-95 flex-shrink-0 ${isInCart ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20 hover:bg-emerald-600' : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-[#2563eb] hover:bg-blue-50 hover:border-blue-100'}`}
                  title={isInCart ? 'Already in Cart' : 'Add to Cart'}
                >
                  <ShoppingCart size={18} fill={isInCart ? "currentColor" : "none"} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onRent && onRent(localSelectedVariants); }}
                  className="bg-[#2563eb] text-white px-4 py-2.5 rounded-xl border border-blue-600 shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center font-bold text-xs gap-2"
                >
                  Rent <ArrowRight size={14} />
                </button>
              </>
            )}
            
            {onRemove && !onUpdateQuantity && (
              <button 
                onClick={(e) => { e.stopPropagation(); onRent && onRent(); }}
                className="bg-[#2563eb] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-500/20 hover:bg-[#1d4ed8] transition-all active:scale-95 flex items-center gap-1.5"
              >
                Rent <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="p-5 flex items-center justify-between group cursor-pointer hover:bg-slate-50 transition-colors">
       <div>
         <p className="font-bold text-slate-900 text-sm mb-0.5">{title}</p>
         <p className="text-xs text-slate-500 font-medium">{desc}</p>
       </div>
       <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
    </div>
  )
}

function StepItem({ num, text, active = false }: { num: string, text: string, active?: boolean }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50">
       <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${active ? 'bg-[#2563eb] text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>
         {num}
       </div>
       <p className={`text-sm font-bold ${active ? 'text-slate-900' : 'text-slate-400'}`}>{text}</p>
       {active && <Info size={14} className="ml-auto text-slate-300" />}
    </div>
  )
}
