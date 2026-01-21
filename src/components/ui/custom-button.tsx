import { LucideIcon, Loader2 } from "lucide-react";
import React, { MouseEvent } from "react";
import { Button } from "./button";

interface Props {
  text?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  Icon?: LucideIcon;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  variant?: "secondary" | "outline" | "ghost" | "default" | "link" | "destructive" | null | undefined;
  size?: "sm" | "lg" | "icon" | "default";
  isPending?: boolean;
}

const CustomButton: React.FC<Props> = ({
  text = "",
  onClick,
  Icon,
  className = "",
  disabled = false,
  type = "button",
  variant = "default",
  size = "default",
  isPending = false,
}) => {
  const baseStyles =
    "cursor-pointer p-6 rounded-4xl flex gap-1 hover:bg-amber-200 hover:text-black hover:border-gray-600";
  const isDisabled = disabled || isPending;

  return (
    <Button
      size={size}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      variant={variant}
      className={`${baseStyles} disabled:bg-gray-300 disabled:cursor-not-allowed ${className}`}
    >
      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon && <Icon />}
      {text}
    </Button>
  );
};

export default CustomButton;
