import React from "react";
import { ButtonProps } from "./types";
import { sizeStyles, variantStyles } from "./styles";

export const Button = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        rounded
        font-medium
        disabled:opacity-50
        disabled:cursor-not-allowed
        transition-colors
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};
