"use client";

import { useState } from "react";

export default function CheckoutPage() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    card: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("🎉 Fake checkout complete! Thank you for your order.");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow space-y-4"
      >
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border rounded-xl"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="text"
          placeholder="Shipping Address"
          className="w-full p-3 border rounded-xl"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <input
          type="text"
          placeholder="Credit Card (fake)"
          className="w-full p-3 border rounded-xl"
          value={form.card}
          onChange={(e) => setForm({ ...form, card: e.target.value })}
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}
