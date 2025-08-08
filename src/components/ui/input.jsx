import { cn } from '../../lib/utils.js'

export const Input = ({ className, ...props }) => {
  return (
    <input
      className={cn(
        'flex h-10 w-full rounded-[calc(var(--radius)-2px)] border border-[--color-input] bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[--color-muted-foreground] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}


