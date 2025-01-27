"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";
import { DeleteTransaction } from "../_actions/deleteTransaction";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  transactionId: string;
}

function DeleteTransactionDialog({ open, setOpen, transactionId }: Props) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
      mutationFn: DeleteTransaction,
      onSuccess: async () => {
        toast.success("Transaction deleted successfully", {
          id: transactionId,
        });
  
        await queryClient.invalidateQueries({
          queryKey: ["transactions"],
        });
      },
      onError: () => {
        toast.error("Failed to delete transaction", {
          id: transactionId,
        });
      },
    });
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure deleting this transaction?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-red-500/90 font-semibold">
              This action cannot be undone
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                toast.loading("Deleting transaction...", {
                  id: transactionId,
                });
                deleteMutation.mutate(transactionId);
              }}
              className="hover:bg-[#f2f2f2] hover:text-[#fc9f1b]"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
}

export default DeleteTransactionDialog;
