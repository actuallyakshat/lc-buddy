"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteGroup } from "@/app/(dashboard)/_actions.ts/group-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DeleteGroupButton({ groupId }: { groupId: string }) {
  const router = useRouter();
  async function handleDeleteGroup() {
    toast.loading("Deleting group", { id: "delete-group" });
    const response = await deleteGroup({ groupId });
    if (response.success) {
      toast.success("Group deleted successfully", { id: "delete-group" });
      router.push("/dashboard");
    } else {
      toast.error(response.error, { id: "delete-group" });
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none transition-colors hover:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
          Delete Group
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove all
            members and delete this group. Are you sure you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteGroup}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
