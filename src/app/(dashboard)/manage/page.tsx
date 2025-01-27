"use client";

import { CurrencyComboBox } from "@/components/CurrencyComboBox";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TransactionType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { PlusSquare, TrashIcon, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import CreateCategoryDialog from "../_components/CreateCategoryDialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Category } from "@prisma/client";
import DeleteCategoryDialog from "../_components/DeleteCategoryDialog";

function ManagePage() {
  return (
    <>
      <div className="bg-background">
        <div className="mx-8 md:mx-12 flex flex-wrap items-center justify-between gap-6 py-8">
          <div>
            <p className="text-3xl lg:text-4xl font-bold text-foreground">
              Manage
            </p>
            <p className="text-foreground lg:text-xl">
              Manage your account settings and categories
            </p>
          </div>
        </div>
      </div>

      <div className="mx-8 md:mx-12 flex flex-col gap-4 p-4">
        <Card>
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
        <CategoryList type="income" />
        <CategoryList type="expense" />
      </div>
    </>
  );
}

export default ManagePage;

function CategoryList({ type }: { type: TransactionType }) {
  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const dataAvailable = categoriesQuery.data && categoriesQuery.data.length > 0;

  return (
    <SkeletonWrapper isLoading={categoriesQuery.isLoading}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {type === "expense" ? (
                <TrendingDown className="h-12 w-12 items-center rounded-lg bg-red-400/10 p-2 text-red-500" />
              ) : (
                <TrendingUp className="h-12 w-12 items-center rounded-lg bg-emerald-400/10 p-2 text-emerald-500" />
              )}
              <div
                className={cn(
                  categoriesQuery.isLoading
                    ? "text-transparent"
                    : "text-navselectedcolor"
                )}
              >
                {type === "income" ? "Incomes" : "Expenses"} categories
                <div
                  className={cn(
                    categoriesQuery.isLoading
                      ? "text-transparent"
                      : "text-sm text-cardcolor"
                  )}
                >
                  Sorted by name
                </div>
              </div>
            </div>

            <CreateCategoryDialog
              type={type}
              successCallback={() => categoriesQuery.refetch()}
              trigger={
                <Button className="bg-background hover:bg-[#f2f2f2] gap-2 text-sm font-semibold text-navselectedcolor">
                  <PlusSquare className="h-4 w-4" />
                  Create category
                </Button>
              }
            />
          </CardTitle>
        </CardHeader>
        <Separator />
        {!dataAvailable && (
          <div className="flex h-40 w-full flex-col items-center justify-center">
            <p>
              No
              <span
                className={cn(
                  categoriesQuery.isFetching
                    ? "text-transparent"
                    : type === "income"
                    ? "text-emerald-500"
                    : "text-red-500",
                  "m-1"
                )}
              >
                {type}
              </span>
              categories yet
            </p>
            <p
              className={cn(
                categoriesQuery.isFetching
                  ? "text-transparent"
                  : "text-sm text-cardcolor"
              )}
            >
              Create one to start tracking
            </p>
          </div>
        )}
        {dataAvailable && (
          <div className="grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categoriesQuery.data.map((category: Category) => (
              <CategoryCard category={category} key={category.name} />
            ))}
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <div className="bg-background flex border-separate flex-col justify-between rounded-md border shadow-md ">
      <div className="font-semibold text-navselectedcolor text-lg flex flex-col items-center gap-2 p-4">
        {category.name}
      </div>
      <DeleteCategoryDialog
        category={category}
        trigger={
          <Button
            className="flex w-full border-separate items-center gap-2 rounded-t-none text-navselectedcolor hover:bg-red-500/70"
            variant={"secondary"}
          >
            <TrashIcon className="h-4 w-4" />
            Remove
          </Button>
        }
      />
    </div>
  );
}
