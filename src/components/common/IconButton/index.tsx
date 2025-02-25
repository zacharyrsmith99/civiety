import React from "react";
import { IconButtonProps } from "./types";
import { variantStyles } from "../Button/styles";

export const IconButton = ({
  icon,
  label,
  variant = "primary",
  className = "",
  ...props
}: IconButtonProps) => {
  return (
    <button
      className={`
        ${variantStyles[variant]}
        p-2
        rounded
        disabled:opacity-50
        disabled:cursor-not-allowed
        transition-colors
        ${className}
      `}
      aria-label={label}
      {...props}
    >
      {icon}
    </button>
  );
};
