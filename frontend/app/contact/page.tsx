"use client";

import { FormEvent, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <div className="page-shell contact-page">
      <section className="contact-copy">
        <p className="eyebrow">Say hello</p>
        <h1>
          Let&rsquo;s talk
          <br />
          <em>fruit.</em>
        </h1>
        <p>Questions, catering ideas, or a note for the team? Send it our way.</p>
        <dl>
          <div>
            <dt>Email</dt>
            <dd>hello@tazacup.example</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>+1 (000) 000-0000</dd>
          </div>
          <div>
            <dt>Hours</dt>
            <dd>Daily · 10am–8pm</dd>
          </div>
        </dl>
        <small>Contact details and opening hours are placeholders.</small>
      </section>
      <form className="contact-form" onSubmit={submit}>
        {sent ? (
          <div className="form-success">
            <Check />
            <h2>Message received.</h2>
            <p>Thanks for reaching out. This demo form has not sent an email.</p>
            <Button type="button" variant="line" onClick={() => setSent(false)}>
              Send another
            </Button>
          </div>
        ) : (
          <>
            <label>
              Name
              <Input required placeholder="Your name" />
            </label>
            <label>
              Email
              <Input required type="email" placeholder="you@example.com" />
            </label>
            <label>
              What&rsquo;s on your mind?
              <Textarea required rows={6} placeholder="Tell us a little more…" />
            </label>
            <Button type="submit" variant="order" size="lg">
              Send message
            </Button>
          </>
        )}
      </form>
    </div>
  );
}
