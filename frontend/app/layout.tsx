import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { OrderPanelProvider } from "@/components/order-panel";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Taza Cup — Fresh Fruit, Made for You",
  description: "Freshly cut, joyfully layered fruit cups from Taza Cup.",
  openGraph: {
    title: "Taza Cup — Fresh Fruit, Made for You",
    description: "Freshly cut, joyfully layered fruit cups from Taza Cup.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <OrderPanelProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
          </OrderPanelProvider>
        </Providers>
      </body>
    </html>
  );
}
