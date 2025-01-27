import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-screen justify-between w-full flex-col">
      <div>
        <Navbar />
        <div className="w-full">{children}</div>
      </div>
      <Footer />
    </div>
  );
}

export default layout;
