
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "blue" | "outline" | "neon" | "danger" | "success";
  size?: "sm" | "md" | "lg";
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) => {
  const baseStyles = "font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center relative overflow-hidden";
  
  const variantStyles = {
    primary: "bg-cipher-purple hover:bg-cipher-purple-dark text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]",
    secondary: "bg-transparent text-cipher-purple border border-cipher-purple hover:bg-cipher-purple/10 shadow-[0_0_10px_rgba(139,92,246,0.2)] hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]",
    blue: "bg-cipher-blue hover:bg-cipher-blue-dark text-white shadow-[0_0_15px_rgba(30,174,219,0.3)] hover:shadow-[0_0_20px_rgba(30,174,219,0.5)]",
    outline: "bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-800/50 shadow-[0_0_10px_rgba(255,255,255,0.1)]",
    neon: "bg-transparent border border-cipher-purple text-cipher-purple hover:text-white hover:bg-cipher-purple/80 shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:shadow-[0_0_25px_rgba(139,92,246,0.6)]",
    danger: "bg-red-600/80 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]",
    success: "bg-green-600/80 hover:bg-green-600 text-white shadow-[0_0_15px_rgba(22,163,74,0.3)] hover:shadow-[0_0_20px_rgba(22,163,74,0.5)]"
  };
  
  const sizeStyles = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg"
  };
  
  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {(variant === "primary" || variant === "blue" || variant === "neon" || variant === "danger" || variant === "success") && (
        <span className="absolute inset-0 overflow-hidden">
          <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 ease-in-out group-hover:left-[100%]"></span>
        </span>
      )}
    </button>
  );
};
