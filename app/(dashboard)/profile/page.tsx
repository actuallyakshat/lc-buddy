"use client";
import { updateUserDetails } from "@/app/_actions/user-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGlobalStore } from "@/context/GlobalContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Profile() {
  const { clientUser } = useGlobalStore();
  const [name, setName] = useState(clientUser?.name || "");
  const [leetcodeId, setLeetcodeId] = useState(clientUser?.leetcodeId || "");
  const [allowSave, setAllowSave] = useState(false);

  useEffect(() => {
    if (clientUser) {
      if (clientUser.name != name || clientUser.leetcodeId != leetcodeId) {
        setAllowSave(true);
      } else {
        setAllowSave(false);
      }
    }
  }, [clientUser, name, leetcodeId]);

  if (!clientUser) return null;

  async function handleUpdateUser() {
    if (!clientUser) return;
    toast.loading("Updating user details", { id: "update-user-details" });
    const response = await updateUserDetails({
      clerkId: clientUser.id,
      name,
      leetcodeId,
    });
    if (response.success) {
      toast.success("User details updated successfully", {
        id: "update-user-details",
      });
    } else {
      toast.error(response.error, { id: "update-user-details" });
    }
  }

  return (
    <div className="page">
      <h1 className="text-3xl font-bold">Profile</h1>
      <p className="text-sm font-medium text-muted-foreground">
        Edit your personal details here
      </p>
      <form
        className="mt-3 max-w-lg space-y-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdateUser();
        }}
      >
        <div className="space-y-1">
          <Label>Email</Label>
          <Input
            type="text"
            defaultValue={clientUser!.email}
            disabled
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label>Name</Label>
          <Input
            type="text"
            defaultValue={clientUser!.name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label>LeetCode ID</Label>
          <Input
            type="text"
            defaultValue={clientUser!.leetcodeId}
            onChange={(e) => setLeetcodeId(e.target.value)}
          />
        </div>
        <div className="flex w-full justify-start pt-2">
          <Button disabled={!allowSave} type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
