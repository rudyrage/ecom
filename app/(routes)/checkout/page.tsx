"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CreditCard,
  MapPin,
  User,
  Loader2,
  ShoppingBag,
  Lock,
  Gift,
  Truck,
  Shield,
  Star,
} from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

interface CheckoutForm {
  // Shipping Information
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingAddress2: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  deliveryInstructions: string;

  // Billing Information
  billingName: string;
  billingAddress: string;
  billingAddress2: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  billingCountry: string;
  sameAsShipping: boolean;

  // Payment Information
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;

  // Additional Information
  giftMessage: string;
  isGift: boolean;
  marketingEmails: boolean;
  smsUpdates: boolean;
  deliveryDate: string;
  deliveryTime: string;
  alternatePhone: string;
  companyName: string;
  specialRequests: string;
  giftWrap: boolean;
  priorityShipping: boolean;
  insuranceOption: boolean;
  newsletterSubscription: boolean;
  birthdayOffers: boolean;
  birthdayDate: string;
}

function CheckoutContent() {
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const [form, setForm] = useState<CheckoutForm>({
    shippingName: "",
    shippingEmail: user?.email || "",
    shippingPhone: "",
    shippingAddress: "",
    shippingAddress2: "",
    shippingCity: "",
    shippingState: "",
    shippingZip: "",
    shippingCountry: "US",
    deliveryInstructions: "",
    billingName: "",
    billingAddress: "",
    billingAddress2: "",
    billingCity: "",
    billingState: "",
    billingZip: "",
    billingCountry: "US",
    sameAsShipping: true,
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    giftMessage: "",
    isGift: false,
    marketingEmails: false,
    smsUpdates: false,
    deliveryDate: "",
    deliveryTime: "anytime",
    alternatePhone: "",
    companyName: "",
    specialRequests: "",
    giftWrap: false,
    priorityShipping: false,
    insuranceOption: false,
    newsletterSubscription: false,
    birthdayOffers: false,
    birthdayDate: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const subtotal = getTotalPrice();
  const baseShipping = subtotal > 100 ? 0 : 9.99;
  const priorityShippingCost = form.priorityShipping ? 15.99 : 0;
  const giftWrapCost = form.giftWrap ? 4.99 : 0;
  const insuranceCost = form.insuranceOption ? subtotal * 0.02 : 0;
  const shipping =
    baseShipping + priorityShippingCost + giftWrapCost + insuranceCost;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (items.length === 0) {
      router.push("/");
    }
  }, [items.length, router]);

  const handleInputChange = (
    field: keyof CheckoutForm,
    value: string | boolean
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSameAsShippingChange = (checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      sameAsShipping: checked,
      ...(checked && {
        billingName: prev.shippingName,
        billingAddress: prev.shippingAddress,
        billingAddress2: prev.shippingAddress2,
        billingCity: prev.shippingCity,
        billingState: prev.shippingState,
        billingZip: prev.shippingZip,
        billingCountry: prev.shippingCountry,
      }),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
        total,
        shippingAddress: {
          name: form.shippingName,
          email: form.shippingEmail,
          phone: form.shippingPhone,
          alternatePhone: form.alternatePhone,
          companyName: form.companyName,
          address: form.shippingAddress,
          address2: form.shippingAddress2,
          city: form.shippingCity,
          state: form.shippingState,
          zip: form.shippingZip,
          country: form.shippingCountry,
          deliveryInstructions: form.deliveryInstructions,
        },
        billingAddress: {
          name: form.billingName,
          address: form.billingAddress,
          address2: form.billingAddress2,
          city: form.billingCity,
          state: form.billingState,
          zip: form.billingZip,
          country: form.billingCountry,
        },
        paymentMethod: "credit_card",
        giftMessage: form.giftMessage,
        isGift: form.isGift,
        giftWrap: form.giftWrap,
        priorityShipping: form.priorityShipping,
        insuranceOption: form.insuranceOption,
        marketingEmails: form.marketingEmails,
        smsUpdates: form.smsUpdates,
        newsletterSubscription: form.newsletterSubscription,
        birthdayOffers: form.birthdayOffers,
        birthdayDate: form.birthdayDate,
        deliveryDate: form.deliveryDate,
        deliveryTime: form.deliveryTime,
        specialRequests: form.specialRequests,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Order creation failed");
      }

      // Clear cart and redirect to success page
      clearCart();
      router.push(`/checkout/success?orderId=${data.orderId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-4">
          Add some items to your cart before checking out
        </p>
        <Button onClick={() => router.push("/")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Secure Checkout
          </h1>
          <p className="text-gray-600 text-lg">
            Complete your order safely and securely
          </p>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-green-600" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-green-600" />
              <span>Trusted by 50k+ customers</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Shipping Information */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <MapPin className="h-6 w-6 text-blue-600" />
                    Shipping Information
                  </CardTitle>
                  <CardDescription className="text-base">
                    Where should we deliver your order?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        value={form.shippingName}
                        onChange={(e) =>
                          handleInputChange("shippingName", e.target.value)
                        }
                        placeholder="John Doe"
                        className="h-12"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={form.shippingEmail}
                        onChange={(e) =>
                          handleInputChange("shippingEmail", e.target.value)
                        }
                        placeholder="john@example.com"
                        className="h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Primary Phone *
                      </label>
                      <Input
                        type="tel"
                        value={form.shippingPhone}
                        onChange={(e) =>
                          handleInputChange("shippingPhone", e.target.value)
                        }
                        placeholder="+1 (555) 123-4567"
                        className="h-12"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Alternate Phone
                      </label>
                      <Input
                        type="tel"
                        value={form.alternatePhone}
                        onChange={(e) =>
                          handleInputChange("alternatePhone", e.target.value)
                        }
                        placeholder="+1 (555) 987-6543"
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Name (Optional)
                    </label>
                    <Input
                      value={form.companyName}
                      onChange={(e) =>
                        handleInputChange("companyName", e.target.value)
                      }
                      placeholder="Your Company Inc."
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <Input
                      value={form.shippingAddress}
                      onChange={(e) =>
                        handleInputChange("shippingAddress", e.target.value)
                      }
                      placeholder="123 Main Street"
                      className="h-12"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address Line 2
                    </label>
                    <Input
                      value={form.shippingAddress2}
                      onChange={(e) =>
                        handleInputChange("shippingAddress2", e.target.value)
                      }
                      placeholder="Apartment, suite, unit, building, floor, etc."
                      className="h-12"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City *
                      </label>
                      <Input
                        value={form.shippingCity}
                        onChange={(e) =>
                          handleInputChange("shippingCity", e.target.value)
                        }
                        placeholder="New York"
                        className="h-12"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        State *
                      </label>
                      <Input
                        value={form.shippingState}
                        onChange={(e) =>
                          handleInputChange("shippingState", e.target.value)
                        }
                        placeholder="NY"
                        className="h-12"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ZIP Code *
                      </label>
                      <Input
                        value={form.shippingZip}
                        onChange={(e) =>
                          handleInputChange("shippingZip", e.target.value)
                        }
                        placeholder="10001"
                        className="h-12"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Delivery Instructions
                    </label>
                    <textarea
                      value={form.deliveryInstructions}
                      onChange={(e) =>
                        handleInputChange(
                          "deliveryInstructions",
                          e.target.value
                        )
                      }
                      placeholder="Leave at front door, ring doorbell, call upon arrival, etc."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Delivery & Shipping Options */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Truck className="h-6 w-6 text-green-600" />
                    Delivery & Shipping Options
                  </CardTitle>
                  <CardDescription className="text-base">
                    Choose your preferred delivery options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Preferred Delivery Date
                      </label>
                      <Input
                        type="date"
                        value={form.deliveryDate}
                        onChange={(e) =>
                          handleInputChange("deliveryDate", e.target.value)
                        }
                        min={new Date().toISOString().split("T")[0]}
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Delivery Time Window
                      </label>
                      <select
                        value={form.deliveryTime}
                        onChange={(e) =>
                          handleInputChange("deliveryTime", e.target.value)
                        }
                        className="w-full h-12 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="anytime">Anytime (9AM - 8PM)</option>
                        <option value="morning">Morning (9AM - 12PM)</option>
                        <option value="afternoon">
                          Afternoon (12PM - 5PM)
                        </option>
                        <option value="evening">Evening (5PM - 8PM)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="priorityShipping"
                          checked={form.priorityShipping}
                          onCheckedChange={(checked) =>
                            handleInputChange("priorityShipping", checked)
                          }
                        />
                        <div>
                          <label
                            htmlFor="priorityShipping"
                            className="font-semibold text-gray-900"
                          >
                            Priority Shipping
                          </label>
                          <p className="text-sm text-gray-600">
                            Get your order 1-2 days faster
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-blue-600">
                        +$15.99
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="insuranceOption"
                          checked={form.insuranceOption}
                          onCheckedChange={(checked) =>
                            handleInputChange("insuranceOption", checked)
                          }
                        />
                        <div>
                          <label
                            htmlFor="insuranceOption"
                            className="font-semibold text-gray-900"
                          >
                            Shipping Insurance
                          </label>
                          <p className="text-sm text-gray-600">
                            Protect your order against loss or damage
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-blue-600">
                        +${(subtotal * 0.02).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Billing Information
                  </CardTitle>
                  <CardDescription>Payment and billing details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sameAsShipping"
                      checked={form.sameAsShipping}
                      onCheckedChange={handleSameAsShippingChange}
                    />
                    <label
                      htmlFor="sameAsShipping"
                      className="text-sm text-gray-700"
                    >
                      Same as shipping address
                    </label>
                  </div>

                  {!form.sameAsShipping && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <Input
                          value={form.billingName}
                          onChange={(e) =>
                            handleInputChange("billingName", e.target.value)
                          }
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <Input
                          value={form.billingAddress}
                          onChange={(e) =>
                            handleInputChange("billingAddress", e.target.value)
                          }
                          placeholder="123 Main Street"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 2 (Optional)
                        </label>
                        <Input
                          value={form.billingAddress2}
                          onChange={(e) =>
                            handleInputChange("billingAddress2", e.target.value)
                          }
                          placeholder="Apartment, suite, unit, building, floor, etc."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City
                          </label>
                          <Input
                            value={form.billingCity}
                            onChange={(e) =>
                              handleInputChange("billingCity", e.target.value)
                            }
                            placeholder="New York"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State
                          </label>
                          <Input
                            value={form.billingState}
                            onChange={(e) =>
                              handleInputChange("billingState", e.target.value)
                            }
                            placeholder="NY"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            ZIP Code
                          </label>
                          <Input
                            value={form.billingZip}
                            onChange={(e) =>
                              handleInputChange("billingZip", e.target.value)
                            }
                            placeholder="10001"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                  <CardDescription>
                    Your payment details are secure and encrypted
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <Input
                      value={form.cardName}
                      onChange={(e) =>
                        handleInputChange("cardName", e.target.value)
                      }
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <Input
                      value={form.cardNumber}
                      onChange={(e) =>
                        handleInputChange("cardNumber", e.target.value)
                      }
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <Input
                        value={form.expiryDate}
                        onChange={(e) =>
                          handleInputChange("expiryDate", e.target.value)
                        }
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <Input
                        value={form.cvv}
                        onChange={(e) =>
                          handleInputChange("cvv", e.target.value)
                        }
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <Lock className="h-4 w-4" />
                    <span>
                      Your payment information is encrypted and secure
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Gift & Special Options */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Gift className="h-6 w-6 text-purple-600" />
                    Gift & Special Options
                  </CardTitle>
                  <CardDescription className="text-base">
                    Make your order extra special
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="isGift"
                        checked={form.isGift}
                        onCheckedChange={(checked) =>
                          handleInputChange("isGift", checked)
                        }
                      />
                      <div>
                        <label
                          htmlFor="isGift"
                          className="font-semibold text-gray-900"
                        >
                          This is a gift
                        </label>
                        <p className="text-sm text-gray-600">
                          Hide prices and add gift receipt
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="giftWrap"
                        checked={form.giftWrap}
                        onCheckedChange={(checked) =>
                          handleInputChange("giftWrap", checked)
                        }
                      />
                      <div>
                        <label
                          htmlFor="giftWrap"
                          className="font-semibold text-gray-900"
                        >
                          Premium Gift Wrapping
                        </label>
                        <p className="text-sm text-gray-600">
                          Beautiful wrapping with ribbon and card
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-purple-600">
                      +$4.99
                    </span>
                  </div>

                  {(form.isGift || form.giftWrap) && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Gift Message
                      </label>
                      <textarea
                        value={form.giftMessage}
                        onChange={(e) =>
                          handleInputChange("giftMessage", e.target.value)
                        }
                        placeholder="Write a personal message for the recipient..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        rows={3}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Special Requests
                    </label>
                    <textarea
                      value={form.specialRequests}
                      onChange={(e) =>
                        handleInputChange("specialRequests", e.target.value)
                      }
                      placeholder="Any special requests or notes for your order..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Communication Preferences */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
                  <CardTitle className="text-xl">
                    Communication Preferences
                  </CardTitle>
                  <CardDescription className="text-base">
                    Stay updated and save on future orders
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="smsUpdates"
                        checked={form.smsUpdates}
                        onCheckedChange={(checked) =>
                          handleInputChange("smsUpdates", checked)
                        }
                      />
                      <label
                        htmlFor="smsUpdates"
                        className="font-medium text-gray-900"
                      >
                        SMS order updates and delivery notifications
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="marketingEmails"
                        checked={form.marketingEmails}
                        onCheckedChange={(checked) =>
                          handleInputChange("marketingEmails", checked)
                        }
                      />
                      <label
                        htmlFor="marketingEmails"
                        className="font-medium text-gray-900"
                      >
                        Promotional emails about new products and exclusive
                        offers
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="newsletterSubscription"
                        checked={form.newsletterSubscription}
                        onCheckedChange={(checked) =>
                          handleInputChange("newsletterSubscription", checked)
                        }
                      />
                      <label
                        htmlFor="newsletterSubscription"
                        className="font-medium text-gray-900"
                      >
                        Weekly newsletter with tips, trends, and special deals
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="birthdayOffers"
                        checked={form.birthdayOffers}
                        onCheckedChange={(checked) =>
                          handleInputChange("birthdayOffers", checked)
                        }
                      />
                      <label
                        htmlFor="birthdayOffers"
                        className="font-medium text-gray-900"
                      >
                        Birthday offers and special discounts
                      </label>
                    </div>

                    {form.birthdayOffers && (
                      <div className="ml-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Birthday Date
                        </label>
                        <Input
                          type="date"
                          value={form.birthdayDate}
                          onChange={(e) =>
                            handleInputChange("birthdayDate", e.target.value)
                          }
                          className="h-12 max-w-xs"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                className="w-full h-14 text-lg font-semibold"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing Your Order...
                  </>
                ) : (
                  `Complete Secure Order - $${total.toFixed(2)}`
                )}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
                <CardTitle className="text-xl">Order Summary</CardTitle>
                <CardDescription className="text-base">
                  {getTotalItems()} items in your cart
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {/* Cart Items */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-lg">
                        $
                        {(
                          Number.parseFloat(item.product.price.toString()) *
                          item.quantity
                        ).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Order Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between text-base">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  {baseShipping > 0 && (
                    <div className="flex justify-between text-base">
                      <span>Standard Shipping</span>
                      <span className="font-semibold">
                        ${baseShipping.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {form.priorityShipping && (
                    <div className="flex justify-between text-base text-blue-600">
                      <span>Priority Shipping</span>
                      <span className="font-semibold">
                        +${priorityShippingCost.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {form.giftWrap && (
                    <div className="flex justify-between text-base text-purple-600">
                      <span>Gift Wrapping</span>
                      <span className="font-semibold">
                        +${giftWrapCost.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {form.insuranceOption && (
                    <div className="flex justify-between text-base text-green-600">
                      <span>Shipping Insurance</span>
                      <span className="font-semibold">
                        +${insuranceCost.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-base">
                    <span>Tax</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {subtotal > 100 && (
                  <div className="bg-green-50 text-green-800 p-4 rounded-lg text-sm border border-green-200">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      <span className="font-semibold">
                        Free Standard Shipping!
                      </span>
                    </div>
                    <p className="mt-1">You saved $9.99 on shipping</p>
                  </div>
                )}

                <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4" />
                    <span className="font-semibold">Secure Checkout</span>
                  </div>
                  <p>Your payment information is encrypted and protected</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <AuthGuard requireAuth>
      <CheckoutContent />
    </AuthGuard>
  );
}
