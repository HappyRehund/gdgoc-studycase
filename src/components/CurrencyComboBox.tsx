"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Currencies, Currency } from "@/lib/currencies";
import { useMutation, useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "./SkeletonWrapper";
import { UserSettings } from "@prisma/client";
import { UpdateUserCurrency } from "@/app/wizard/_actions/userSettings";
import { toast } from "sonner";

export function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false);
  const [selectedCurrency, setSelectedCurrency] =
    React.useState<Currency | null>(null);

  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const userSettings = useQuery<UserSettings>({
    queryKey: ["userSettings"],
    queryFn: () => fetch("/api/user-settings").then((res) => res.json()),
  });

  React.useEffect(() => {
    if (!userSettings.data) return;
    const userCurrency = Currencies.find(
      (currency) => currency.value === userSettings.data.currency
    );
    if (userCurrency) setSelectedCurrency(userCurrency);
  }, [userSettings.data]);

  const mutation = useMutation({
    mutationFn: UpdateUserCurrency,
    onSuccess: (data: UserSettings) => {
      const updatedCurrency = Currencies.find((c) => c.value === data.currency);
      if (updatedCurrency) {
        setSelectedCurrency(updatedCurrency);
        toast.success("Currency updated successfully!", {
          id: "update-currency",
        });
      } else {
        toast.error("Server returned an unknown currency value.", {
          id: "update-currency",
        });
      }
    },
    onError: (error) => {
      console.error("Update failed:", error);
      toast.error("Failed to update currency. Please try again.", {
        id: "update-currency",
      });
    },
  });

  const selectOption = React.useCallback(
    (currency: Currency | null) => {
      if (!currency) {
        toast.error("Something went wrong");
        return;
      }

      toast.loading("Updating currency...", {
        id: "update-currency",
      });

      mutation.mutate(currency.value);
    },
    [mutation]
  );

  return (
    <SkeletonWrapper isLoading={userSettings.isFetching}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={buttonRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between font-semibold",
              userSettings.isFetching ? "bg-cardbg text-transparent" : "bg-[#f2f2f2] text-[#171717]"
            )}
            disabled={mutation.isPending}
          >
            {selectedCurrency ? selectedCurrency.label : "Select currency..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          style={{
            width: buttonRef.current
              ? `${buttonRef.current.offsetWidth}px`
              : "auto",
          }}
        >
          <Command>
            <CommandList>
              <CommandGroup>
                {Currencies.map((currency) => (
                  <CommandItem
                    key={currency.value}
                    value={currency.value}
                    onSelect={() => {
                      const newCurrency =
                        selectedCurrency?.value === currency.value
                          ? null
                          : Currencies.find(
                              (c) => c.value === currency.value
                            ) ?? null;
                      selectOption(newCurrency);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex items-center",
                      selectedCurrency?.value === currency.value
                        ? "text-cardcolor"
                        : "text-navselectedcolor"
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCurrency?.value === currency.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {currency.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </SkeletonWrapper>
  );
}
