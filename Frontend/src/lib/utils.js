import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * cn - merge tailwind classnames safely
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
