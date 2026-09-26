"use client";

import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice, products } from "@/lib/products";

type OrderPanelContextValue = {
  openOrderPanel: (productId?: string) => void;
};

const OrderPanelContext = createContext<OrderPanelContextValue | undefined>(undefined);

export function useOrderPanel() {
  const context = useContext(OrderPanelContext);
  if (!context) throw new Error("useOrderPanel must be used within OrderPanelProvider");
  return context;
}

export function OrderPanelProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState<string>(products[0].id);
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState("Classic mix");
  const selectedProduct = products.find((product) => product.id === productId) ?? products[0];
  const total = selectedProduct.price * quantity;
  const value = useMemo(
    () => ({
      openOrderPanel: (nextProductId?: string) => {
        if (nextProductId && products.some((product) => product.id === nextProductId)) {
          setProductId(nextProductId);
        }
        setQuantity(1);
        setOpen(true);
      },
    }),
    [],
  );

  const proceedToCheckout = () => {
    setOpen(false);
    router.push(
      `/orders?product=${encodeURIComponent(selectedProduct.id)}&quantity=${quantity}`,
    );
  };

  return (
    <OrderPanelContext.Provider value={value}>
      {children}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="order-panel" side="right">
          <SheetHeader className="order-panel-header">
            <p className="eyebrow">Your order</p>
            <SheetTitle>Build your cup.</SheetTitle>
            <SheetDescription>
              Choose an option, adjust the quantity, then continue to checkout.
            </SheetDescription>
          </SheetHeader>

          <div className="order-panel-picker" aria-label="Choose a cup">
            {products.map((product) => (
              <Button
                key={product.id}
                type="button"
                variant="ghost"
                className={product.id === selectedProduct.id ? "active" : ""}
                onClick={() => setProductId(product.id)}
                aria-label={`Select ${product.name}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image} alt="" />
              </Button>
            ))}
          </div>

          <Tabs defaultValue="cup" className="order-panel-tabs">
            <TabsList>
              <TabsTrigger value="cup">Your cup</TabsTrigger>
              <TabsTrigger value="customize">Customize Your Cup</TabsTrigger>
            </TabsList>
            <TabsContent value="cup" className="order-panel-item">
              <div className="order-panel-item-row">
                <figure className="panel-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedProduct.image} alt="Fresh fruit cup placeholder" />
                </figure>
                <div className="order-panel-item-copy">
                  <p className="eyebrow">Current selection</p>
                  <h2>{selectedProduct.name}</h2>
                  <strong>{formatPrice(selectedProduct.price)}</strong>
                </div>
              </div>
              <p className="panel-desc">{selectedProduct.description}</p>
              <div className="panel-quantity">
                <span>Quantity</span>
                <div className="stepper">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    aria-label="Decrease quantity"
                  >
                    <Minus />
                  </Button>
                  <output>{quantity}</output>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity((current) => current + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus />
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="customize" className="customize-options">
              <p>Choose how you would like this cup prepared.</p>
              {["Classic mix", "Extra fruit", "No garnish"].map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant="ghost"
                  className={customization === option ? "active" : ""}
                  onClick={() => setCustomization(option)}
                >
                  <span aria-hidden="true" />
                  {option}
                </Button>
              ))}
            </TabsContent>
          </Tabs>

          <div className="order-panel-footer">
            <div>
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <Button
              type="button"
              variant="order"
              size="lg"
              className="panel-checkout"
              onClick={proceedToCheckout}
            >
              <ShoppingBag /> Proceed to Checkout
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </OrderPanelContext.Provider>
  );
}
