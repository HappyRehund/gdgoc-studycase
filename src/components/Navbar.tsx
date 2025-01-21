"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowUpLeft, Menu } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button, buttonVariants } from "./ui/button";
import { ThemeSwitcherBtn } from "./ThemeSwitcherBtn";
import Logo from "./Logo";

function Navbar() {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  );
}

const items = [
  {
    title: "dashboard",
    link: "/",
  },
  {
    title: "transactions",
    link: "/transactions",
  },
  {
    title: "manage",
    link: "/manage",
  },
];

function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="block border-separate bg-background md:hidden w-full">
      <nav className="px-4 flex items-center justify-between shadow-lg w-full">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <Menu className="w-8 h-8" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-96 sm:w-[540px]" side="left">
            {/* Logo here */}
            <Logo />
            <div className="flex flex-col gap-1 pt-4">
              {items.map((item) => (
                <NavbarItemMobile
                  key={item.title}
                  title={item.title}
                  link={item.link}
                  clickCallback={() => setIsOpen((prev) => !prev)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex h-16 min-h-16 items-center gap-x-4">
          <ThemeSwitcherBtn />
          <div className="flex items-center gap-4 text-md lg:text-lg font-semibold text-foreground">
            <Logo />
            <UserButton
              appearance={{
                elements: {
                  triggerButton: "w-10 h-10", // Atur ukuran tombol
                  avatarBox: "w-10 h-10", // Atur ukuran avatar
                  userAvatar: "w-10 h-10", // Jika avatar spesifik perlu diubah
                },
              }}
            />
          </div>
        </div>
      </nav>
    </div>
  );
}
function DesktopNavbar() {
  return (
    <div className="hidden bg-background md:block">
      <nav className="flex items-center justify-between py-2 px-6">
        <div className="flex min-h-16 items-center justify-between w-full">
          <div className="flex bg-foreground rounded-3xl shadow-lg gap-2 justify-between items-center">
            {items.map((item) => (
              <NavbarItem
                key={item.title}
                title={item.title}
                link={item.link}
              />
            ))}
          </div>
          <div className="px-4 py-2 text-md lg:text-xl font-semibold text-foreground ml-auto flex items-center gap-4">
            <ThemeSwitcherBtn />
            <Logo />
            <UserButton
              appearance={{
                elements: {
                  triggerButton: "w-8 h-8", // Atur ukuran tombol
                  avatarBox: "w-10 h-10", // Atur ukuran avatar
                  userAvatar: "w-10 h-10", // Jika avatar spesifik perlu diubah
                },
              }}
            />
          </div>
        </div>
      </nav>
    </div>
  );
}

function NavbarItemMobile({
  title,
  link,
  clickCallback,
}: {
  title: string;
  link: string;
  clickCallback?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <div className="relative flex items-center">
      <Link
        href={link}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-full justify-start text-lg text-foreground hover:text-background",
          isActive && "text-navselectedcolor"
        )}
        onClick={() => {
          if (clickCallback) clickCallback();
        }}
      >
        {title}
      </Link>
    </div>
  );
}

function NavbarItem({ title, link }: { title: string; link: string }) {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <div
      className={cn(
        isActive && "shadow-sm",
        "relative flex items-center rounded-3xl"
      )}
    >
      <Link
        href={link}
        className={cn(
          "w-full justify-center gap-2 items-center px-4 lg:px-6 py-2 text-sm lg:text-lg font-semibold text-navcolor flex",
          isActive && "text-navselectedcolor bg-background rounded-3xl border border-navselectedcolor",
          title === "transactions" && "pr-0"
        )}
      >
        <ArrowUpLeft className="w-3 h-3" />
        {title}
      </Link>
    </div>
  );
}

export default Navbar;
