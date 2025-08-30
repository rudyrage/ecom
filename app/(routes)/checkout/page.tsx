import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutClient />
    </Suspense>
  );
}
