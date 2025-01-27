"use client";

import { GetCategoriesStatsResponseType } from "@/app/api/stats/categories/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";
import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface Props {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}
function CategoriesStats({ userSettings, from, to }: Props) {
  const statsQuery = useQuery<GetCategoriesStatsResponseType>({
    queryKey: ["overview", "stats", "categories", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(
          to
        )}`
      ).then((res) => res.json()),
  });

  const formatter = React.useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  return (
    <div className="flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="income"
          data={statsQuery.data || []}
          isLoading={statsQuery.isFetching}
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="expense"
          data={statsQuery.data || []}
          isLoading={statsQuery.isFetching}
        />
      </SkeletonWrapper>
    </div>
  );
}

export default CategoriesStats;

function CategoriesCard({
  formatter,
  type,
  data,
  isLoading,
}: {
  formatter: Intl.NumberFormat;
  type: TransactionType;
  data: GetCategoriesStatsResponseType;
  isLoading: boolean;
}) {
  const filteredData = data.filter((el) => el.type === type);
  const total = filteredData.reduce(
    (acc, el) => acc + (el._sum?.amount || 0),
    0
  );

  return (
    <Card className="h-80 w-full col-span-6">
      <CardHeader>
        <CardTitle
          className={cn(
            isLoading ? "text-cardbg" : "text-navselectedcolor",
            "text-lg grid grid-flow-row justify-between gap-2 md:grid-flow-col"
          )}
        >
          {type === "income" ? "Incomes" : "Expenses"} by category
        </CardTitle>
      </CardHeader>
      <div className="flex items-center justify-between gap-2">
        {filteredData.length === 0 && (
          <div
            className={cn(
              isLoading ? "text-cardbg" : "text-cardcolor",
              "flex h-60 w-full flex-col items-center justify-center"
            )}
          >
            No data for the selected period
            <p
              className={cn(
                isLoading ? "text-cardbg" : "text-navselectedcolor",
                "text-sm"
              )}
            >
              Try selecting a differend period or try adding new{" "}
              {type === "income" ? "incomes" : "expenses"}
            </p>
          </div>
        )}
        {filteredData.length > 0 && (
          <ScrollArea className="h-60 w-full px-4">
            <div className="flex w-full flex-col gap-4 p-4">
              {filteredData.map((item) => {
                const amount = item._sum.amount || 0;
                const percentage = (amount * 100) / (total || amount);

                return (
                  <div key={item.category} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          isLoading ? "text-cardbg" : "text-abu",
                          "flex items-center"
                        )}
                      >
                        {item.category}
                        <span
                          className={cn(
                            isLoading ? "text-cardbg" : "text-abu",
                            "ml-2 text-sm"
                          )}
                        >
                          ({percentage.toFixed(0)}%)
                        </span>
                      </span>
                      <span
                        className={cn(
                          isLoading ? "text-cardbg" : "text-abu",
                          "text-base"
                        )}
                      >
                        {formatter.format(amount)}
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      indicator={
                        type === "income" ? "bg-emerald-500" : "bg-red-500"
                      }
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
}
