import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Trinity Academy",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
