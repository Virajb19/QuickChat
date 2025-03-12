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

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function stringAvatar(name: string) {
  const nameParts = name.split(' ');
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    // children: `${nameParts[0][0]}${nameParts[1]?.[0] || ''}`,
  };
}