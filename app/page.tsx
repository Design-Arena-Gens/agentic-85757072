"use client";

import { useState } from "react";

type Operator = "+" | "-" | "×" | "÷";

type CalculatorState = {
  current: string;
  previous: string | null;
  operator: Operator | null;
  overwrite: boolean;
};

const DEFAULT_STATE: CalculatorState = {
  current: "0",
  previous: null,
  operator: null,
  overwrite: false
};

const keypad: Array<{ label: string; variant?: "primary" | "accent" | "ghost" }> = [
  { label: "AC", variant: "ghost" },
  { label: "+/-", variant: "ghost" },
  { label: "%", variant: "ghost" },
  { label: "÷", variant: "accent" },
  { label: "7" },
  { label: "8" },
  { label: "9" },
  { label: "×", variant: "accent" },
  { label: "4" },
  { label: "5" },
  { label: "6" },
  { label: "-", variant: "accent" },
  { label: "1" },
  { label: "2" },
  { label: "3" },
  { label: "+", variant: "accent" },
  { label: "0", variant: "primary" },
  { label: ".", variant: "ghost" },
  { label: "=", variant: "accent" }
];

function formatNumber(value: string) {
  if (value === "" || value === undefined) return "0";
  if (value === "Not a number") return value;
  const [integer, decimal] = value.split(".");
  const parsedInteger = Number(integer);
  if (!Number.isFinite(parsedInteger)) {
    return value;
  }
  const formattedInteger = parsedInteger.toLocaleString("en-US");
  if (decimal != null) {
    return `${formattedInteger}.${decimal}`;
  }
  return formattedInteger;
}

function evaluate(previous: string | null, current: string, operator: Operator | null) {
  if (previous == null || operator == null) return current;
  const prev = parseFloat(previous);
  const curr = parseFloat(current);

  let result = 0;
  switch (operator) {
    case "+":
      result = prev + curr;
      break;
    case "-":
      result = prev - curr;
      break;
    case "×":
      result = prev * curr;
      break;
    case "÷":
      if (curr === 0) {
        return "Not a number";
      }
      result = prev / curr;
      break;
  }

  const output = result.toPrecision(12);
  const trimmed = parseFloat(output).toString();
  return trimmed;
}

export default function Home() {
  const [state, setState] = useState<CalculatorState>(DEFAULT_STATE);
  const screenValue = state.current === "Not a number" ? state.current : formatNumber(state.current);

  const handleButtonPress = (label: string) => {
    if (Number.isInteger(Number(label))) {
      setState((prev) => {
        if (prev.overwrite) {
          return { ...prev, current: label, overwrite: false };
        }
        if (prev.current === "0") {
          return { ...prev, current: label };
        }
        return { ...prev, current: prev.current + label };
      });
      return;
    }

    if (label === ".") {
      setState((prev) => {
        if (prev.current.includes(".")) return prev;
        if (prev.overwrite) {
          return { ...prev, current: "0.", overwrite: false };
        }
        return { ...prev, current: `${prev.current}.` };
      });
      return;
    }

    if (label === "AC") {
      setState(DEFAULT_STATE);
      return;
    }

    if (label === "+/-") {
      setState((prev) => {
        if (prev.current === "0" || prev.current === "Not a number") return prev;
        return { ...prev, current: prev.current.startsWith("-") ? prev.current.slice(1) : `-${prev.current}` };
      });
      return;
    }

    if (label === "%") {
      setState((prev) => {
        if (prev.current === "Not a number") return prev;
        const value = parseFloat(prev.current) / 100;
        return { ...prev, current: value.toString() };
      });
      return;
    }

    if (label === "=") {
      setState((prev) => {
        if (prev.current === "Not a number") return DEFAULT_STATE;
        const result = evaluate(prev.previous, prev.current, prev.operator);
        return {
          current: result,
          previous: null,
          operator: null,
          overwrite: true
        };
      });
      return;
    }

    if (["+", "-", "×", "÷"].includes(label)) {
      setState((prev) => {
        if (prev.current === "Not a number") {
          return { ...DEFAULT_STATE, current: "0" };
        }

        if (prev.previous == null) {
          return {
            current: "0",
            previous: prev.current,
            operator: label as Operator,
            overwrite: true
          };
        }

        const result = evaluate(prev.previous, prev.current, prev.operator);
        return {
          current: "0",
          previous: result,
          operator: label as Operator,
          overwrite: true
        };
      });
    }
  };

  return (
    <main className="w-full max-w-md">
      <section className="rounded-3xl bg-white/[0.05] p-6 backdrop-blur-xl shadow-glow border border-white/[0.08]">
        <div className="flex flex-col gap-6">
          <header className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="h-9 w-9 grid place-items-center rounded-full bg-white/[0.08] border border-white/[0.12]">
                <span className="text-sm font-semibold">LC</span>
              </span>
              <div>
                <h1 className="text-lg font-semibold tracking-tight text-slate-100">Luminous Calculator</h1>
                <p className="text-xs text-slate-400 uppercase tracking-[0.3em]">Dual precision</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.08] px-2 py-1 font-medium">
                <span className="h-2 w-2 rounded-full bg-mint animate-pulse" />
                Ready
              </span>
            </div>
          </header>
          <div className="relative rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.08] px-6 py-10 shadow-inner">
            <div className="absolute inset-x-6 top-4 h-1 rounded-full bg-gradient-to-r from-orchid via-mint to-sky-400 opacity-70 blur" />
            <div className="text-right text-sm text-slate-400 font-medium uppercase tracking-[0.4em]">result</div>
            <div className="mt-2 text-right text-5xl font-semibold tabular-nums tracking-tight text-slate-50">{screenValue}</div>
            <div className="mt-4 flex justify-between text-xs text-slate-500 uppercase tracking-[0.3em]">
              <div>prev: {state.previous ? formatNumber(state.previous) : "--"}</div>
              <div>op: {state.operator ?? "--"}</div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {keypad.map((key) => (
              <button
                key={key.label}
                type="button"
                onClick={() => handleButtonPress(key.label)}
                className={[
                  "rounded-full py-4 text-lg font-semibold transition-transform duration-150 ease-out active:scale-95",
                  "border border-white/[0.06] backdrop-blur-md",
                  key.variant === "accent"
                    ? "bg-gradient-to-br from-orchid to-fuchsia-500 text-white shadow-[0_10px_30px_rgba(168,85,247,0.35)]"
                    : "",
                  key.variant === "ghost" ? "bg-white/[0.04] text-slate-100 hover:bg-white/[0.08]" : "",
                  key.variant === "primary" ? "col-span-2 bg-white/[0.07] text-slate-50 hover:bg-white/[0.12]" : "bg-white/[0.05] text-slate-50 hover:bg-white/[0.1]"
                ].join(" ")}
              >
                {key.label}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
