import React, { useState, useRef, useEffect } from "react";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  width?: string;
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  width = "max-content",
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyles, setTooltipStyles] = useState<React.CSSProperties>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsVisible(false), delay);
  };

  // Position the tooltip to stay within viewport
  useEffect(() => {
    if (isVisible && tooltipRef.current && triggerRef.current) {
      const tooltipElement = tooltipRef.current;
      const triggerRect = triggerRef.current.getBoundingClientRect();

      // Wait for tooltip to render with content
      setTimeout(() => {
        if (!tooltipElement) return;

        const tooltipRect = tooltipElement.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let finalPosition = position;
        let styles: React.CSSProperties = {};

        // Initial position calculation
        if (position === "top") {
          if (triggerRect.top < tooltipRect.height + 8) {
            finalPosition = "bottom";
          }
        } else if (position === "bottom") {
          if (triggerRect.bottom + tooltipRect.height + 8 > viewportHeight) {
            finalPosition = "top";
          }
        } else if (position === "left") {
          if (triggerRect.left < tooltipRect.width + 8) {
            finalPosition = "right";
          }
        } else if (position === "right") {
          if (triggerRect.right + tooltipRect.width + 8 > viewportWidth) {
            finalPosition = "left";
          }
        }

        // Calculate final coordinates
        let left, top, transform;

        if (finalPosition === "top") {
          top = -tooltipRect.height - 8;
          left = (triggerRect.width - tooltipRect.width) / 2;
          transform = "";

          // Check left and right edges
          if (triggerRect.left + left < 0) {
            left = -triggerRect.left + 8;
          } else if (
            triggerRect.left + left + tooltipRect.width >
            viewportWidth
          ) {
            left = viewportWidth - tooltipRect.width - triggerRect.left - 8;
          }
        } else if (finalPosition === "bottom") {
          top = triggerRect.height + 8;
          left = (triggerRect.width - tooltipRect.width) / 2;
          transform = "";

          // Check left and right edges
          if (triggerRect.left + left < 0) {
            left = -triggerRect.left + 8;
          } else if (
            triggerRect.left + left + tooltipRect.width >
            viewportWidth
          ) {
            left = viewportWidth - tooltipRect.width - triggerRect.left - 8;
          }
        } else if (finalPosition === "left") {
          top = (triggerRect.height - tooltipRect.height) / 2;
          left = -tooltipRect.width - 8;
          transform = "";

          // Check top and bottom edges
          if (triggerRect.top + top < 0) {
            top = -triggerRect.top + 8;
          } else if (
            triggerRect.top + top + tooltipRect.height >
            viewportHeight
          ) {
            top = viewportHeight - tooltipRect.height - triggerRect.top - 8;
          }
        } else if (finalPosition === "right") {
          top = (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.width + 8;
          transform = "";

          // Check top and bottom edges
          if (triggerRect.top + top < 0) {
            top = -triggerRect.top + 8;
          } else if (
            triggerRect.top + top + tooltipRect.height >
            viewportHeight
          ) {
            top = viewportHeight - tooltipRect.height - triggerRect.top - 8;
          }
        }

        styles = {
          position: "absolute",
          left: `${left}px`,
          top: `${top}px`,
          transform,
        };

        setTooltipStyles(styles);
      }, 0);
    }
  }, [isVisible, position]);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={triggerRef}
    >
      {/* Child element with highlight effect when tooltip is visible */}
      <div
        className={`transition-all duration-200 ${isVisible ? "ring-1 ring-amber-500/50 shadow-[0_0_4px_rgba(217,119,6,0.3)]" : ""}`}
      >
        {children}
      </div>

      {isVisible && (
        <div ref={tooltipRef} style={tooltipStyles} className="z-50 w-max">
          <div
            className="
              p-2.5 
              bg-gradient-to-b from-amber-900 to-amber-950
              text-amber-100 text-xs font-medieval
              rounded border border-amber-600/70
              shadow-lg
              animate-fadeIn
              whitespace-normal
              min-w-[120px]
              max-w-[250px]
              text-center
            "
          >
            <div className="relative z-10">{content}</div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('/assets/parchment-texture.png')] mix-blend-overlay rounded"></div>
            <div className="absolute top-1 right-1 text-amber-500/30 text-[8px]">
              ❧
            </div>
            <div className="absolute bottom-1 left-1 text-amber-500/30 text-[8px]">
              ❧
            </div>

            {/* Inner glow effect */}
            <div className="absolute inset-0 rounded pointer-events-none bg-gradient-to-r from-amber-500/5 via-amber-400/10 to-amber-500/5"></div>
          </div>
        </div>
      )}
    </div>
  );
};
