import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500",
        "focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
        "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500",
        className
      )}
      {...props}
    />
  )
}

export { Input }
