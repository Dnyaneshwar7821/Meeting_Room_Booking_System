import { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      className = "",
      type = "text",
      icon,
      error,
      label,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "w-full rounded-xl border px-4 py-3 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2";

    const errorStyles = error
      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20"
      : "border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500/20";

    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block font-semibold text-slate-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={`${baseStyles} ${errorStyles} ${icon ? "pl-10" : ""} ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
