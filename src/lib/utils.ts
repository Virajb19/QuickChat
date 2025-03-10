import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const colors = [
  'red', 'blue', 'green', 'orange', 'purple', 'pink', 'yellow', 'cyan', 'teal', 
  'indigo', 'lime', 'amber', 'violet', 'fuchsia', 'rose', 'emerald', 'turquoise',
  'magenta', 'coral', 'navy', 'brown', 'gold', 'silver', 'maroon', 'olive'
];