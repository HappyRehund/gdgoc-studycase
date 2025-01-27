import { CurrencyComboBox } from "@/components/CurrencyComboBox";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

async function page() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  return (
    <div className="container px-10 py-12 flex max-w-2xl flex-col items-center justify-between gap-4 border border-foreground rounded-2xl">
      <div>
        <h1 className="text-center font-semibold text-3xl">
          Welcome, <span className="">{user.firstName}!</span>
        </h1>
        <h2 className="mt-4 text-center text-cardcolor">
          Let &apos;s get started by setting up your currency
        </h2>
        <h3 className="mt-2 text-center text-sm font-semibold text-foreground">
          You can change these settings at any time
        </h3>
      </div>
      <Separator />
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-navselectedcolor">Currency</CardTitle>
          <CardDescription>
            Set your default currency for transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CurrencyComboBox />
        </CardContent>
      </Card>
      <Separator />
      <Button className="w-full bg-[#f2f2f2] font-semibold text-navselectedcolor" asChild>
        <Link href="/">I&apos;m done! Take me to the dashboard</Link>
      </Button>
      <Logo />
    </div>
  );
}

export default page;
