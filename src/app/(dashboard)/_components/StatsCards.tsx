"use client";

import { GetBalanceStatsResponseType } from "@/app/api/stats/balance/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card } from "@/components/ui/card";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import React, { ReactNode } from "react";
import CountUp from "react-countup";

interface Props {
  from: Date;
  to: Date;
  userSettings: UserSettings;
}
function StatsCards({ from, to, userSettings }: Props) {
  const statsQuery = useQuery<GetBalanceStatsResponseType>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
      ).then((res) => res.json()),
  });

  const formatter = React.useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;

  const balance = income - expense;
  return (
    <div className="mx-auto flex w-full flex-wrap md:flex-nowrap gap-2">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={income}
          title="Income"
          isLoading={statsQuery.isFetching}
          icon={
            <TrendingUp className="h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={expense}
          title="Expense"
          isLoading={statsQuery.isFetching}
          icon={
            <TrendingDown className="h-12 w-12 items-center rounded-lg p-2 text-red-500 bg-red-400/10" />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={balance}
          title="Balance"
          isLoading={statsQuery.isFetching}
          icon={
            <Wallet className="h-12 w-12 items-center rounded-lg p-2 text-violet-500 bg-violet-400/10" />
          }
        />
      </SkeletonWrapper>
    </div>
  );
}

export default StatsCards;

function StatCard({
  formatter,
  value,
  title,
  icon,
  isLoading,
}: {
  formatter: Intl.NumberFormat;
  value: number;
  title: string;
  icon: ReactNode;
  isLoading: boolean;
}) {
  const formatFn = React.useCallback(
    (value: number) => formatter.format(value),
    [formatter]
  );

  return (
    <Card className="flex w-full h-24 items-center gap-4 p-4">
      {/* Icon */}
      {icon}
      {/* Title and Value */}
      <div className="flex flex-col gap-1">
        <p
          className={cn(
            isLoading ? "text-cardbg" : "text-navselectedcolor",
            "text-base lg:text-md font-semibold"
          )}
        >
          {title}
        </p>
        <CountUp
          preserveValue
          redraw={false}
          end={value}
          decimals={2}
          formattingFn={formatFn}
          className={cn(
            isLoading ? "text-cardbg" : "text-cardcolor",
            "text-lg lg:text-xl"
          )}
        />
      </div>
    </Card>
  );
}
