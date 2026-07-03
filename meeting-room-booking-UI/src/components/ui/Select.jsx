import { forwardRef } from "react";

const Select = forwardRef(
  (
    {
      className = "",
      error,
      label,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "w-full rounded-xl border px-4 py-3 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 bg-white cursor-pointer";

    const errorStyles = error
      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
      : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/20";

    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block font-semibold text-slate-700">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`${baseStyles} ${errorStyles} ${className}`}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
