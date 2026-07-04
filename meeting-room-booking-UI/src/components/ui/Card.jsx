import { forwardRef } from "react";

const Card = forwardRef(
  (
    {
      children,
      className = "",
      variant = "default",
      hover = true,
      glass = false,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "rounded-2xl border transition-all duration-300 ease-in-out";

    const variants = {
      default:
        "border-slate-200 bg-white shadow-lg shadow-slate-200/50",
      primary:
        "border-blue-200 bg-gradient-to-br from-blue-50 to-violet-50 shadow-lg shadow-blue-200/50",
      success:
        "border-emerald-200 bg-gradient-to-br from-emerald-50 to-cyan-50 shadow-lg shadow-emerald-200/50",
      danger:
        "border-red-200 bg-gradient-to-br from-red-50 to-rose-50 shadow-lg shadow-red-200/50",
      glass:
        "border-white/20 bg-white/10 backdrop-blur-xl shadow-xl shadow-black/10",
    };

    const hoverStyles = hover ? "hover:shadow-xl hover:-translate-y-0.5" : "";

    const selectedVariant = glass ? variants.glass : variants[variant];

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${selectedVariant} ${hoverStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
