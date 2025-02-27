import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

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
    if (isVisible && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();

      // Wait for tooltip to render with content
      setTimeout(() => {
        if (!tooltipRef.current) return;

        const tooltipRect = tooltipRef.current.getBoundingClientRect();
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

        // Calculate absolute position in the viewport
        let left, top;

        if (finalPosition === "top") {
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          top = triggerRect.top - tooltipRect.height - 8;

          // Check left and right edges
          if (left < 8) {
            left = 8;
          } else if (left + tooltipRect.width > viewportWidth - 8) {
            left = viewportWidth - tooltipRect.width - 8;
          }
        } else if (finalPosition === "bottom") {
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          top = triggerRect.bottom + 8;

          // Check left and right edges
          if (left < 8) {
            left = 8;
          } else if (left + tooltipRect.width > viewportWidth - 8) {
            left = viewportWidth - tooltipRect.width - 8;
          }
        } else if (finalPosition === "left") {
          left = triggerRect.left - tooltipRect.width - 8;
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;

          // Check top and bottom edges
          if (top < 8) {
            top = 8;
          } else if (top + tooltipRect.height > viewportHeight - 8) {
            top = viewportHeight - tooltipRect.height - 8;
          }
        } else if (finalPosition === "right") {
          left = triggerRect.right + 8;
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;

          // Check top and bottom edges
          if (top < 8) {
            top = 8;
          } else if (top + tooltipRect.height > viewportHeight - 8) {
            top = viewportHeight - tooltipRect.height - 8;
          }
        }

        styles = {
          position: "fixed", // Changed from absolute to fixed for viewport positioning
          left: `${left}px`,
          top: `${top}px`,
          zIndex: 9999,
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

      {isVisible &&
        createPortal(
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
          </div>,
          document.body,
        )}
    </div>
  );
};
