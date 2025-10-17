import { useRef, useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/cart';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Shield, MapPin, User, Minus, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useUserStore } from '@/store/user';
import { startRazorpayPayment } from '@/lib/razorpay';
import { api } from '@/lib/api';

const Checkout = () => {
  const { items, getTotalPrice, getTotalItems, clearCart, updateQuantity, removeItem } = useCartStore();
  const createAccount = useUserStore((s) => s.createAccount);
  const navigate = useNavigate();
  const formTopRef = useRef<HTMLDivElement>(null);
  
  const [mode, setMode] = useState<'guest' | 'account'>('guest');
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Shipping Address
    address: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    
    // Payment
    paymentMethod: 'razorpay',
    saveInfo: false,
    
    // Billing same as shipping
    billingSame: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrorSummary, setShowErrorSummary] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.pincode) newErrors.pincode = 'PIN code is required';
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Phone validation (India only)
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    // PIN code validation
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'PIN code must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const computeCODFee = (amount: number) => Math.min(250, Math.max(100, Math.round(amount * 0.10)));

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      setShowErrorSummary(true);
      toast.error('Please fill in all required fields correctly');
      setTimeout(() => formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
      return;
    }

    // If user chose to create account, persist minimal profile
    if (mode === 'account') {
      createAccount({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        apartment: formData.apartment,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      });
      toast.success('Account created for faster checkout');
    }

    const subtotalNow = getTotalPrice();
    const deliveryNow = formData.paymentMethod === 'cod' ? computeCODFee(subtotalNow) : 0;

    // 1) Create order server-side
    let orderId: string | null = null;
    let totalCents: number = Math.round((subtotalNow + deliveryNow) * 100);
    try {
      const res = await api<{ orderId: string; totalCents: number }>(`/api/checkout`, { method: 'POST', body: JSON.stringify({}) });
      orderId = res.orderId;
      totalCents = res.totalCents;
    } catch (e: any) {
      toast.error(e?.message || 'Unable to create order');
      return;
    }

    // COD path: order is created, no online payment
    if (formData.paymentMethod === 'cod') {
      toast.success('Order placed with Cash on Delivery');
      clearCart();
      navigate('/account/orders');
      return;
    }

    // 2) Start Razorpay checkout for the order total
    const res = await startRazorpayPayment({
      amount: Math.round(totalCents),
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      contact: formData.phone,
      notes: { city: formData.city, state: formData.state, pincode: formData.pincode },
    });

    if (res.status === 'success' || res.status === 'demo') {
      // 3) Confirm payment with the API so admin capture/refund can work
      try {
        const providerPaymentId = (res as any).response?.razorpay_payment_id || (res as any).id || 'payment';
        await api(`/api/payments/confirm`, { method: 'POST', body: JSON.stringify({ orderId, provider: 'razorpay', providerPaymentId }) });
      } catch (err: any) {
        // Non-fatal; admin can reconcile later
      }
      toast.success('Payment successful');
      clearCart();
      navigate('/account/orders');
    } else if (res.status === 'cancelled') {
      toast.message('Payment cancelled');
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const subtotal = getTotalPrice();
  const deliveryCharge = formData.paymentMethod === 'cod' ? computeCODFee(subtotal) : 0;
  const taxAmount = Math.round(subtotal * 0.05);
  const finalTotal = subtotal + deliveryCharge;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-semibold mb-2">Checkout</h1>
            <p className="text-muted-foreground">
              Complete your order for {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" ref={formTopRef}>
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Mode toggle: Guest vs Create Account */}
              <Card className="p-2 flex gap-2 bg-muted/40">
                <button
                  className={`flex-1 py-2 rounded-md text-sm ${mode === 'guest' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground'}`}
                  onClick={() => setMode('guest')}
                >
                  Guest Checkout
                </button>
                <button
                  className={`flex-1 py-2 rounded-md text-sm ${mode === 'account' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground'}`}
                  onClick={() => setMode('account')}
                >
                  Create Account & Checkout
                </button>
              </Card>
              {showErrorSummary && Object.keys(errors).length > 0 && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-sm font-medium text-red-700 mb-1">There are {Object.keys(errors).length} errors to fix before placing your order.</p>
                  <ul className="text-sm text-red-700 list-disc ml-5">
                    {Object.entries(errors).map(([k, v]) => (
                      <li key={k}>{v}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Contact Information */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <User className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Contact Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={errors.firstName ? 'border-destructive' : ''}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-destructive mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={errors.lastName ? 'border-destructive' : ''}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-destructive mt-1">{errors.lastName}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number (India) *</Label>
                    <div className={`flex items-center rounded-md border ${errors.phone ? 'border-destructive' : 'border-input'} bg-background`}> 
                      <span className="px-3 text-sm text-muted-foreground">+91</span>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0,10))}
                        placeholder="10-digit mobile number"
                        className="border-0 focus-visible:ring-0"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Shipping Address */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Shipping Address</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="px-2 py-0.5 rounded bg-muted">India-only checkout</span>
                    <span>We currently ship within India.</span>
                  </div>
                  <div>
                    <Label>Country</Label>
                    <div className="flex h-10 items-center px-3 rounded-md border border-input bg-muted/40 text-sm">India</div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Street address"
                      className={errors.address ? 'border-destructive' : ''}
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive mt-1">{errors.address}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                    <Input
                      id="apartment"
                      value={formData.apartment}
                      onChange={(e) => handleInputChange('apartment', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className={errors.city ? 'border-destructive' : ''}
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive mt-1">{errors.city}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                        <SelectTrigger className={errors.state ? 'border-destructive' : ''}>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="karnataka">Karnataka</SelectItem>
                          <SelectItem value="maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                          <SelectItem value="delhi">Delhi</SelectItem>
                          <SelectItem value="gujarat">Gujarat</SelectItem>
                          <SelectItem value="rajasthan">Rajasthan</SelectItem>
                          {/* Add more states */}
                        </SelectContent>
                      </Select>
                      {errors.state && (
                        <p className="text-sm text-destructive mt-1">{errors.state}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="pincode">PIN Code *</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        placeholder="6-digit PIN"
                        className={errors.pincode ? 'border-destructive' : ''}
                      />
                      {errors.pincode && (
                        <p className="text-sm text-destructive mt-1">{errors.pincode}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Payment Method */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange('paymentMethod', 'razorpay')}
                    className={`border rounded-lg p-4 text-left hover:border-primary ${formData.paymentMethod === 'razorpay' ? 'border-primary ring-1 ring-primary/30' : ''}`}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="razorpay"
                        name="payment"
                        value="razorpay"
                        checked={formData.paymentMethod === 'razorpay'}
                        onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                        className="text-primary"
                      />
                      <Label htmlFor="razorpay" className="cursor-pointer">Razorpay (Online)</Label>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Cards (Visa/Mastercard/RuPay), UPI, NetBanking, Wallets</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInputChange('paymentMethod', 'cod')}
                    className={`border rounded-lg p-4 text-left hover:border-primary ${formData.paymentMethod === 'cod' ? 'border-primary ring-1 ring-primary/30' : ''}`}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="cod"
                        name="payment"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                        className="text-primary"
                      />
                      <Label htmlFor="cod" className="cursor-pointer">Cash on Delivery</Label>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Pay when you receive</p>
                  </button>
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.productId}-${JSON.stringify(item.selectedVariant)}`} className="flex gap-3">
                      <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-medium line-clamp-2 pr-6">{item.product.title}</h4>
                          <button
                            className="text-muted-foreground hover:text-destructive"
                            aria-label="Remove item"
                            onClick={() => removeItem(item.productId)}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        {item.selectedVariant && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {Object.entries(item.selectedVariant).map(([key, value]) => (
                              <span key={key} className="mr-2">
                                {key}: {value}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm font-medium">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="mb-6" />
                
                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({getTotalItems()} items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Delivery {formData.paymentMethod === 'cod' ? '(COD Fee)' : ''}</span>
                    <span className={formData.paymentMethod !== 'cod' ? 'text-green-600' : ''}>
                      {formData.paymentMethod === 'cod' ? `₹${deliveryCharge.toLocaleString()}` : 'Free'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>GST (included)</span>
                    <span>₹{taxAmount.toLocaleString()}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                <Button 
                  onClick={handlePlaceOrder} 
                  className="btn-primary w-full mt-6"
                  size="lg"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Place Order
                </Button>

                <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>SSL encrypted checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Fast & secure delivery</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
