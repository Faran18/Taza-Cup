"use client";

import { Button } from "@/components/ui/button";

export function ChatWithUsButton() {
  return (
    <Button
      variant="line"
      size="lg"
      onClick={() => window.alert("Chat is coming soon.")}
    >
      Chat with Us
    </Button>
  );
}
