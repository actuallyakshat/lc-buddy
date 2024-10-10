"use client";
import {
  deleteGroup,
  editGroup,
} from "@/app/(dashboard)/_actions.ts/group-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GroupWithMembershipsAndUsers } from "@/types/types";
import { useState } from "react";
import { toast } from "sonner";

export default function EditGroupButton({
  groupId,
  groupDetails,
}: {
  groupId: string;
  groupDetails: GroupWithMembershipsAndUsers;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(groupDetails?.name || "");
  const [description, setDescription] = useState(
    groupDetails?.description || "",
  );
  async function handleEditGroup() {
    toast.loading("Saving Changes", { id: "save-changes" });
    const response = await editGroup({
      groupId,
      name,
      description,
    });
    if (response.success) {
      toast.success("Changes saved successfully", { id: "save-changes" });
      setOpen(false);
    } else {
      toast.error(response.error, { id: "delete-group" });
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none transition-colors hover:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
          Edit Group
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
          <DialogDescription>
            Feel free to edit the group details here.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditGroup();
          }}
          className="space-y-2"
        >
          <Input
            placeholder="Group Name"
            defaultValue={groupDetails?.name || ""}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            placeholder="Group Description"
            defaultValue={groupDetails?.description || ""}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            className="max-h-40 overflow-y-auto"
          />
          <Button typeof="submit" className="w-full">
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
