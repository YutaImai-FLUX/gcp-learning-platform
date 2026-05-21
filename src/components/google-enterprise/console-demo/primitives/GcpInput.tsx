"use client";

import { forwardRef, useId, useState } from "react";
import { cn } from "@/lib/utils";

interface GcpInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  errorText?: string;
  required?: boolean;
  trailing?: React.ReactNode;
}

export const GcpInput = forwardRef<HTMLInputElement, GcpInputProps>(
  function GcpInput(
    {
      label,
      helperText,
      errorText,
      required,
      trailing,
      className,
      value,
      defaultValue,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) {
    const id = useId();
    const [focused, setFocused] = useState(false);
    const hasValue =
      (value !== undefined && value !== "") ||
      (defaultValue !== undefined && defaultValue !== "");
    const elevated = focused || hasValue;

    return (
      <div className="w-full">
        <div
          className={cn(
            "relative rounded border bg-white dark:bg-[#1F1F1F] transition-colors",
            errorText
              ? "border-[#D93025]"
              : focused
                ? "border-[#1A73E8] ring-1 ring-[#1A73E8]"
                : "border-[#DADCE0] hover:border-[#80868B]",
          )}
        >
          <label
            htmlFor={id}
            className={cn(
              "absolute pointer-events-none transition-all duration-150 bg-white dark:bg-[#1F1F1F] px-1 text-[#5F6368]",
              elevated
                ? "top-0 left-2 -translate-y-1/2 text-[11px]"
                : "top-1/2 left-3 -translate-y-1/2 text-[14px]",
              focused && !errorText && "text-[#1A73E8]",
              errorText && "text-[#D93025]",
            )}
          >
            {label}
            {required && <span className="text-[#D93025] ml-0.5">*</span>}
          </label>
          <div className="flex items-center">
            <input
              ref={ref}
              id={id}
              value={value}
              defaultValue={defaultValue}
              onFocus={(e) => {
                setFocused(true);
                onFocus?.(e);
              }}
              onBlur={(e) => {
                setFocused(false);
                onBlur?.(e);
              }}
              className={cn(
                "flex-1 bg-transparent px-3 py-2 text-[14px] text-[#202124] dark:text-white outline-none placeholder:text-transparent",
                trailing && "pr-1",
                className,
              )}
              {...rest}
            />
            {trailing && <div className="px-2 text-[#5F6368]">{trailing}</div>}
          </div>
        </div>
        {(helperText || errorText) && (
          <div
            className={cn(
              "mt-1 px-3 text-[11px]",
              errorText ? "text-[#D93025]" : "text-[#5F6368]",
            )}
          >
            {errorText ?? helperText}
          </div>
        )}
      </div>
    );
  },
);
