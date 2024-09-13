"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGlobalStore } from "@/context/GlobalContext";
import { useState } from "react";
import { toast } from "sonner";
import { createGroup } from "../_actions.ts/group-actions";

export default function AddGroup() {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const { clientUser } = useGlobalStore();

  async function handleAddGroup() {
    if (!groupName || !description) {
      setError("Both fields are required.");
      return;
    }

    try {
      toast.loading("Adding Group", { id: "add-group" });
      const response = await createGroup({
        name: groupName,
        description: description,
        userId: clientUser!.id as string,
      });

      if (!response.success) throw new Error(response.error);

      toast.success("Group created successfully.", { id: "add-group" });
      setOpen(false);
    } catch (error) {
      console.error((error as Error).message);
      setError((error as Error).message);
      toast.error("Error creating group.", { id: "add-group" });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex h-full min-h-[200px] items-center justify-center overflow-hidden rounded-xl border-2 border-dashed">
          <span className="flex items-center justify-center font-medium">
            Create Group <PlusIcon className="ml-2 size-6" />
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create new group</DialogTitle>
          <DialogDescription>
            Create a new group to compete with your friends and peers.
          </DialogDescription>
          <form
            className="space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddGroup();
            }}
          >
            <Input
              placeholder="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {error && (
              <p className="text-sm font-medium text-red-500">{error}</p>
            )}
            <div className="flex w-full gap-2">
              <Button
                className="w-full"
                type="button"
                variant={"outline"}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button className="w-full" type="submit">
                Continue
              </Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
