import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const liquidbuttonVariants = cva(
  "inline-flex items-center transition-colors justify-center cursor-pointer gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-[color,box-shadow,transform] duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-[#121212] text-[#ECE7DE] border border-[#222222] shadow-[0_4px_14px_rgba(0,0,0,0.08)] hover:bg-[#2A2A2A] hover:-translate-y-0.5 dark:bg-transparent dark:text-primary dark:shadow-none dark:border-transparent dark:hover:bg-transparent dark:hover:-translate-y-0 dark:hover:scale-105",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline: "bg-[#D4CFC5] text-[#121212] border border-[#BEB8AE] shadow-sm hover:bg-[#BEB8AE] hover:-translate-y-0.5 dark:bg-transparent dark:border-line dark:hover:bg-surface dark:text-primary dark:hover:text-primary dark:hover:-translate-y-0 dark:hover:scale-105 dark:shadow-none",
        secondary: "bg-[#D4CFC5] text-[#121212] hover:bg-[#BEB8AE] dark:bg-surface dark:text-primary dark:hover:bg-surface/80",
        ghost: "hover:bg-[#D4CFC5] text-[#121212] dark:hover:bg-surface dark:text-primary",
        link: "text-[#111111] underline-offset-4 hover:underline dark:text-primary",
      },
      size: {
        default: "h-12 px-8 py-3",
        sm: "h-10 text-xs px-5",
        lg: "h-14 rounded-xl px-10 text-base",
        icon: "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "lg",
    },
  }
)

function GlassFilter() {
  return (
    <svg className="hidden pointer-events-none absolute w-0 h-0">
      <defs>
        <filter
          id="container-glass"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves="1"
            seed="1"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="70"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

export function LiquidButton({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}) {
  const innerContent = (
    <>
      <div className="hidden dark:block absolute top-0 left-0 z-0 h-full w-full rounded-xl 
        transition-all 
        dark:bg-white/5 dark:border-transparent
        dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]" />
      <div
        className="hidden dark:block absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-xl"
        style={{ backdropFilter: 'url("#container-glass")' }}
      />

      <div className="pointer-events-none z-10 flex items-center justify-center gap-2">
        {asChild ? children.props.children : children}
      </div>
      <GlassFilter />
    </>
  );

  if (asChild) {
    return React.cloneElement(React.Children.only(children), {
      className: cn(
        "relative rounded-xl",
        liquidbuttonVariants({ variant, size, className }),
        children.props.className
      ),
      children: innerContent,
      ...props
    });
  }

  return (
    <button
      className={cn(
        "relative rounded-xl",
        liquidbuttonVariants({ variant, size, className })
      )}
      {...props}
    >
      {innerContent}
    </button>
  )
}
