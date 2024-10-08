"use client";
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
import { useGlobalStore } from "@/context/GlobalContext";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { toast } from "sonner";
import { sendInvite } from "../_actions/friends-actions";

export default function AddFriendModal({ groupId }: { groupId: string }) {
  const { clientUser } = useGlobalStore();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  async function handleSubmit() {
    if (email.trim() == "") {
      toast.error("Email is required");
      return;
    }

    toast.loading("Sending request", { id: "add-friend" });
    const response = await sendInvite({
      groupId,
      senderId: clientUser!.id,
      receiverEmailId: email,
    });
    if (response.success) {
      toast.success("Friend request sent successfully", {
        id: "add-friend",
      });
      setOpen(false);
    } else {
      toast.error(response.error, { id: "add-friend" });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none transition-colors hover:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
          Add Friend
        </button>
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
          <DialogDescription>
            Add a friend to this room to track and compare your progress
          </DialogDescription>
        </DialogHeader>
        <form
          className="mt-2 space-y-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Label className="text-sm">Email of your friend</Label>
          <Input
            type="email"
            placeholder="friend@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button className="w-full" type="submit">
            Add Friend
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
