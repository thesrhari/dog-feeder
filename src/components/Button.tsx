import React from "react";

// Define allowed sizes
type ButtonSize = "sm" | "md" | "lg";
type ButtonVariant = "primary" | "secondary" | "danger";

// Define props extending standard button attributes
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  variant?: ButtonVariant;
  size?: ButtonSize; // <-- Add optional size prop
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  icon: Icon,
  variant = "primary",
  size = "md", // <-- Set a default size (e.g., 'md')
  className = "",
  type = "button",
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center justify-center border border-transparent rounded-md shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition duration-150 ease-in-out";

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-primary hover:bg-primary-dark text-white focus:ring-primary",
    secondary:
      "bg-neutral-100 hover:bg-neutral-200 text-neutral-dark border-neutral-300 focus:ring-secondary",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
  };

  // Define Tailwind classes for different sizes
  const sizes: Record<ButtonSize, string> = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-4 py-2 text-sm", // Previous default implicit size
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      // Apply base, size, variant, and custom classes
      className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && (
        <Icon
          className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"} -ml-1 mr-2`}
          aria-hidden="true"
        />
      )}{" "}
      {/* Optional: Adjust icon size based on button size */}
      {children}
    </button>
  );
};

export default Button;
