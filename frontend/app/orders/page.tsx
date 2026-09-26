"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Minus, Plus, ReceiptText } from "lucide-react";
import { products, formatPrice } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Step = "order" | "details" | "review" | "receipt";
type Quantities = Record<string, number>;

export default function OrdersPage() {
  // useSearchParams requires a Suspense boundary in the App Router,
  // so the actual page content lives in OrdersPageContent below.
  return (
    <Suspense fallback={null}>
      <OrdersPageContent />
    </Suspense>
  );
}

function OrdersPageContent() {
  const searchParams = useSearchParams();
  const productParam = searchParams.get("product") ?? undefined;
  const quantityParam = searchParams.get("quantity");
  const quantity = quantityParam
    ? Math.max(1, Math.floor(Number(quantityParam)))
    : undefined;
  const isPanelCheckout = Boolean(productParam && quantity);

  const [step, setStep] = useState<Step>(isPanelCheckout ? "details" : "order");
  const [qty, setQty] = useState<Quantities>(() =>
    Object.fromEntries(products.map((p) => [p.id, 0])),
  );
  const [details, setDetails] = useState({
    name: "",
    email: "",
    phone: "",
    pickup: "",
  });
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    if (productParam && products.some((p) => p.id === productParam)) {
      setQty((current) => ({
        ...current,
        [productParam]: quantity ?? Math.max(1, current[productParam] ?? 0),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productParam, quantity]);

  const selected = useMemo(
    () => products.filter((p) => (qty[p.id] ?? 0) > 0),
    [qty],
  );
  const subtotal = selected.reduce(
    (sum, p) => sum + p.price * (qty[p.id] ?? 0),
    0,
  );
  const tax = subtotal * 0.08;

  const update = (id: string, amount: number) =>
    setQty((current) => ({
      ...current,
      [id]: Math.max(0, (current[id] ?? 0) + amount),
    }));

  const nextDetails = (e: FormEvent) => {
    e.preventDefault();
    setStep("review");
  };

  const confirm = () => {
    setOrderNumber(`TZ-${Math.floor(100000 + Math.random() * 900000)}`);
    setStep("receipt");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setQty(Object.fromEntries(products.map((p) => [p.id, 0])));
    setDetails({ name: "", email: "", phone: "", pickup: "" });
    setStep("order");
  };

  return (
    <div className="page-shell orders-page">
      <header className="order-header">
        <div>
          <p className="eyebrow">Pickup order</p>
          <h1>{step === "receipt" ? "Made fresh." : "Build your cup run."}</h1>
        </div>
        {step !== "receipt" && (
          <ol>
            {(["order", "details", "review"] as const).map((s, i) => (
              <li key={s} className={step === s ? "active" : ""}>
                <span>0{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        )}
      </header>

      {step === "order" && (
        <section className="order-builder">
          <div className="order-products">
            {products.map((p) => (
              <article key={p.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt=""
                  width={1200}
                  height={1400}
                  loading="lazy"
                />
                <div>
                  <h2>{p.name}</h2>
                  <p>{formatPrice(p.price)}</p>
                </div>
                <div className="stepper">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => update(p.id, -1)}
                    aria-label={`Remove one ${p.name}`}
                  >
                    <Minus />
                  </Button>
                  <output>{qty[p.id] ?? 0}</output>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => update(p.id, 1)}
                    aria-label={`Add one ${p.name}`}
                  >
                    <Plus />
                  </Button>
                </div>
              </article>
            ))}
          </div>
          <OrderSummary qty={qty} subtotal={subtotal} />
          <Button
            variant="order"
            size="lg"
            disabled={!selected.length}
            onClick={() => setStep("details")}
          >
            Continue to details
          </Button>
        </section>
      )}

      {step === "details" && (
        <section className="order-details">
          <form onSubmit={nextDetails}>
            <p className="eyebrow">Who&rsquo;s picking up?</p>
            <h2>Your details</h2>
            <label>
              Full name
              <Input
                required
                value={details.name}
                onChange={(e) => setDetails({ ...details, name: e.target.value })}
              />
            </label>
            <label>
              Email
              <Input
                required
                type="email"
                value={details.email}
                onChange={(e) => setDetails({ ...details, email: e.target.value })}
              />
            </label>
            <label>
              Phone
              <Input
                required
                type="tel"
                value={details.phone}
                onChange={(e) => setDetails({ ...details, phone: e.target.value })}
              />
            </label>
            <label>
              Preferred pickup time
              <Input
                required
                type="datetime-local"
                value={details.pickup}
                onChange={(e) => setDetails({ ...details, pickup: e.target.value })}
              />
            </label>
            <div className="form-actions">
              <Button type="button" variant="line" onClick={() => setStep("order")}>
                Back
              </Button>
              <Button type="submit" variant="order">
                Review order
              </Button>
            </div>
          </form>
          <OrderSummary qty={qty} subtotal={subtotal} />
        </section>
      )}

      {step === "review" && (
        <section className="review-order">
          <div>
            <p className="eyebrow">One last look</p>
            <h2>Review your order</h2>
            <OrderSummary qty={qty} subtotal={subtotal} />
            <dl>
              <div>
                <dt>Pickup for</dt>
                <dd>{details.name}</dd>
              </div>
              <div>
                <dt>Contact</dt>
                <dd>
                  {details.email}
                  <br />
                  {details.phone}
                </dd>
              </div>
              <div>
                <dt>Pickup</dt>
                <dd>{new Date(details.pickup).toLocaleString()}</dd>
              </div>
            </dl>
            <p className="payment-note">
              Payment is collected at pickup for this demo order.
            </p>
            <div className="form-actions">
              <Button variant="line" onClick={() => setStep("details")}>
                Edit details
              </Button>
              <Button variant="order" onClick={confirm}>
                Confirm order
              </Button>
            </div>
          </div>
        </section>
      )}

      {step === "receipt" && (
        <section className="receipt">
          <div className="receipt-check">
            <Check />
          </div>
          <p className="eyebrow">Order confirmed</p>
          <h2>Thank you, {details.name.split(" ")[0]}.</h2>
          <p>Your fruit is in good hands. Keep this receipt for pickup.</p>
          <div className="receipt-paper">
            <header>
              <ReceiptText />
              <span>{orderNumber}</span>
            </header>
            {selected.map((p) => (
              <div key={p.id} className="receipt-line">
                <span>
                  {qty[p.id]} × {p.name}
                </span>
                <strong>{formatPrice(p.price * (qty[p.id] ?? 0))}</strong>
              </div>
            ))}
            <div className="receipt-line muted">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="receipt-line muted">
              <span>Estimated tax</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="receipt-total">
              <span>Total</span>
              <strong>{formatPrice(subtotal + tax)}</strong>
            </div>
            <footer>
              <span>Pickup</span>
              <strong>{new Date(details.pickup).toLocaleString()}</strong>
            </footer>
          </div>
          <Button variant="line" onClick={reset}>
            Start a new order
          </Button>
        </section>
      )}
    </div>
  );
}

function OrderSummary({
  qty,
  subtotal,
}: {
  qty: Quantities;
  subtotal: number;
}) {
  return (
    <aside className="order-summary">
      <h3>Your cups</h3>
      {products
        .filter((p) => (qty[p.id] ?? 0) > 0)
        .map((p) => (
          <div key={p.id}>
            <span>
              {qty[p.id]} × {p.name}
            </span>
            <strong>{formatPrice(p.price * (qty[p.id] ?? 0))}</strong>
          </div>
        ))}
      {subtotal === 0 && <p>No cups selected yet.</p>}
      <footer>
        <span>Subtotal</span>
        <strong>{formatPrice(subtotal)}</strong>
      </footer>
    </aside>
  );
}
