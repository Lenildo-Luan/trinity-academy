import { SidebarLayout } from "@/components/sidebar-layout";
import { SubscriptionGuard } from "@/components/subscription-guard";
import { getModules } from "@/data/lessons";
import type React from "react";

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SubscriptionGuard>
      <SidebarLayout modules={getModules()}>{children}</SidebarLayout>
    </SubscriptionGuard>
  );
}
