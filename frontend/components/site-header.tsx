"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useOrderPanel } from "@/components/order-panel";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { openOrderPanel } = useOrderPanel();
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="site-header">
      <Link href="/" className="brand-lockup" aria-label="Taza Cup home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="" className="brand-mark" />
        <span>
          TAZA <small>CUP</small>
        </span>
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={isActive(link.href) ? "active" : ""}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        <Button
          type="button"
          variant="order"
          size="sm"
          className="header-order"
          onClick={() => openOrderPanel()}
        >
          <ShoppingBag /> Order
        </Button>
        <Button
          className="menu-button"
          variant="ghost"
          size="icon"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Button
            type="button"
            variant="order"
            onClick={() => {
              setOpen(false);
              openOrderPanel();
            }}
          >
            Place an order
          </Button>
        </nav>
      )}
    </header>
  );
}
