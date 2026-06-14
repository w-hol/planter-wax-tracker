import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button m3-state-layer inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/55 active:translate-y-px disabled:pointer-events-none disabled:opacity-45 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/25 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "m3-elevation-1 bg-primary text-on-primary hover:shadow-lg [a]:hover:bg-primary",
        outline:
          "border-outline bg-transparent text-primary hover:bg-primary/8 aria-expanded:bg-primary/10 aria-expanded:text-primary",
        secondary:
          "bg-tertiary-container text-on-tertiary-container hover:bg-tertiary-container aria-expanded:bg-tertiary-container aria-expanded:text-on-tertiary-container",
        tonal:
          "bg-secondary-container text-on-secondary-container hover:bg-secondary-container aria-expanded:bg-secondary-container aria-expanded:text-on-secondary-container",
        ghost:
          "text-on-surface-variant hover:bg-on-surface/8 aria-expanded:bg-on-surface/8 aria-expanded:text-on-surface",
        destructive:
          "bg-error-container text-on-error-container hover:bg-error-container focus-visible:ring-destructive/30",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-10 gap-2 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "h-8 gap-1.5 px-3 text-xs in-data-[slot=button-group]:rounded-4xl has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 px-4 text-[0.82rem] in-data-[slot=button-group]:rounded-4xl has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 px-6 has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        icon: "size-10",
        "icon-xs":
          "size-8 in-data-[slot=button-group]:rounded-4xl [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-9 in-data-[slot=button-group]:rounded-4xl",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
