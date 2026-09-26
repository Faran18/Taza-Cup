import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story — Taza Cup",
  description:
    "Meet Taza Cup: fresh fruit, thoughtful preparation, and a little everyday joy.",
};

export default function AboutPage() {
  return (
    <div className="page-shell about-page">
      <section className="about-opening">
        <div>
          <p className="eyebrow">Our story</p>
          <h1>
            Simple fruit.
            <br />
            <em>Special care.</em>
          </h1>
        </div>
        <p className="lead">
          Taza means fresh. That one word guides everything we do: what we
          choose, how we cut, and the moment each cup reaches you.
        </p>
      </section>
      <section className="about-mark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Taza Cup fruit cup and logo" />
        <blockquote>
          &ldquo;We wanted fruit to feel like a treat — colorful, generous,
          and made with intention.&rdquo;
        </blockquote>
      </section>
      <section className="principles">
        <article>
          <span>01</span>
          <h2>Cut fresh</h2>
          <p>
            Fruit is prepared in small batches so texture, color, and flavor
            stay vivid.
          </p>
        </article>
        <article>
          <span>02</span>
          <h2>Layer generously</h2>
          <p>Every cup is composed for variety, from the first spoonful to the last.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Serve joyfully</h2>
          <p>
            Good food can brighten an ordinary day. We take that small
            responsibility seriously.
          </p>
        </article>
      </section>
      <p className="placeholder-note">
        Founder story and sourcing details are placeholder copy until final
        brand information is supplied.
      </p>
    </div>
  );
}
