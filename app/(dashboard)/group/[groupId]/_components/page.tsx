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
    if (email.trim() == "") toast.error("Email is required");

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
    } else {
      toast.error(response.error, { id: "add-friend" });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Friend</Button>
      </DialogTrigger>
      <DialogContent>
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
            type="text"
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
