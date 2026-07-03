import { useState } from "react";

const EyeOpenIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeClosedIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path d="M3 3l18 18" />
    <path d="M10.6 10.7a2 2 0 002.7 2.7" />
    <path d="M9.9 4.2A10.8 10.8 0 0112 4c5 0 9 4.2 10 8a12.7 12.7 0 01-2.1 4.1" />
    <path d="M6.2 6.2A12.4 12.4 0 002 12c1 3.8 5 8 10 8a10.8 10.8 0 005-1.2" />
  </svg>
);

const PasswordInput = ({
  name,
  value,
  onChange,
  placeholder,
  required = false,
  minLength,
  className = "w-full rounded-xl border border-gray-300 p-3.5 pr-12 outline-none focus:ring-4 focus:ring-blue-100",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        className={className}
      />
      <button
        type="button"
        onClick={() => setShowPassword((current) => !current)}
        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-500 transition hover:bg-blue-50 hover:text-blue-700"
        aria-label={showPassword ? "Hide password" : "Show password"}
        title={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
      </button>
    </div>
  );
};

export default PasswordInput;
