import { SubscriptionGuard } from "@/components/subscription-guard";
import type React from "react";

export default function CenteredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SubscriptionGuard>{children}</SubscriptionGuard>;
}
