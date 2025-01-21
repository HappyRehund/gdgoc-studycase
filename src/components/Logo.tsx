import { DollarSign } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <Link
      href="/"
      className="text-foreground flex items-center text-xl md:text-2xl"
    >
      <DollarSign className="w-5 h-5" />
      <p className="font-bold leading-tight tracking-tighter">ExpenseTracker</p>
    </Link>
  );
}
