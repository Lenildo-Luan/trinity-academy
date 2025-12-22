import { clsx } from "clsx";
import type React from "react";

export function Button({
  className,
  type = "button",
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={clsx(
        className,
        "inline-flex items-center justify-center rounded-full bg-green-600 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-offset-gray-950"
      )}
      {...props}
    />
  );
}
