import React from "react";
import { Button } from "./button";
import { ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

export function GetStartedButton({
  text = "Get Started",
  className = "",
  size = "lg",
  variant = "default",
  asChild = false,
  ...props
}) {
  return (
    <Button
      className={cn("group relative overflow-hidden", className)}
      size={size}
      variant={variant}
      asChild={asChild}
      {...props}
    >
      {asChild ? (
        React.cloneElement(props.children, {
          children: (
            <>
              <span className="mr-10 transition-opacity duration-500 group-hover:opacity-0 relative z-20">
                {text}
              </span>
              <i className="absolute right-1 top-1 bottom-1 rounded-sm z-10 grid w-10 place-items-center transition-all duration-500 bg-background/20 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95">
                <ChevronRight size={18} strokeWidth={2.5} aria-hidden="true" />
              </i>
            </>
          )
        })
      ) : (
        <>
          <span className="mr-10 transition-opacity duration-500 group-hover:opacity-0 relative z-20">
            {text}
          </span>
          <i className="absolute right-1 top-1 bottom-1 rounded-sm z-10 grid w-10 place-items-center transition-all duration-500 bg-background/20 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95">
            <ChevronRight size={18} strokeWidth={2.5} aria-hidden="true" />
          </i>
        </>
      )}
    </Button>
  );
}
