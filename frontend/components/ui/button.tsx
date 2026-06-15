import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'text'
  size?: 'sm' | 'md' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center transition-all duration-200 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none font-sans font-medium tracking-[-0.01em] h-fit cursor-pointer"

    const variants = {
      primary: "bg-accent !text-[#ffffff] hover:!text-[#ffffff] !opacity-100 rounded-full hover:bg-accent-dim hover:-translate-y-px transition-all",
      secondary: "bg-surface !text-[#ffffff] hover:!text-[#ffffff] !opacity-100 border border-border rounded-full hover:border-accent",
      ghost: "bg-transparent !text-[#ffffff] hover:!text-[#ffffff] !opacity-100 border border-border-glow rounded-full hover:border-accent",
      text: "bg-transparent text-accent hover:underline underline-offset-4 p-0",
    }

    const sizes = {
      sm: "px-4 py-2 text-p-sm min-h-[40px]",
      md: "px-6 py-4 text-p-md min-h-[56px]",
      lg: "px-10 py-5 text-p-lg min-h-[64px]",
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], variant !== 'text' && sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
