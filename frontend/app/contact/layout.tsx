import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Taza Cup",
  description:
    "Get in touch with Taza Cup about fruit cups, orders, and catering.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
