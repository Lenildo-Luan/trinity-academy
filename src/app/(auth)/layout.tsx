import { Logo } from "@/components/atoms";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center px-6 py-12 backdrop-opacity-50 bg-[url('https://ik.imagekit.io/qfmgarse7/login-background.webp?updatedAt=1766759129772')] bg-no-repeat bg-cover bg-center"
    >
      <div className="absolute inset-0 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm"></div>
      <div className="w-full max-w-xs z-10">
        <div className="flex justify-center">
          <Link href="/" aria-label="trinity-academy">
            <Logo className="h-8 fill-gray-950 dark:fill-white" />
          </Link>
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </div>
  );
}
