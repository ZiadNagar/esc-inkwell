import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge conditional class names the shadcn way
export const cn = (...inputs) => twMerge(clsx(...inputs));
