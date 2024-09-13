"use client";
import { updateLeetcodeId } from "@/app/_actions/user-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { toast } from "sonner";

export default function LinkLeetcodeAccount({ userId }: { userId: string }) {
  const [leetcodeId, setLeetcodeId] = React.useState("");
  async function handleSubmit() {
    if (!leetcodeId || leetcodeId.trim() === "") {
      toast.error("Leetcode ID is required");
    }

    toast.loading("Linking Leetcode ID...", { id: "link-leetcode-id" });

    const response = await updateLeetcodeId(userId, leetcodeId);
    if (response.success) {
      toast.success("Leetcode ID linked successfully", {
        id: "link-leetcode-id",
      });
    } else {
      toast.error(response.error, {
        id: "link-leetcode-id",
      });
    }
  }

  return (
    <div className="fixed z-[51] flex min-h-screen w-full items-center justify-center bg-background">
      <div className="flex w-full max-w-md flex-col gap-2 rounded-xl border bg-background p-8 shadow-lg">
        <div>
          <h1 className="text-xl font-semibold">Link your Leetcode account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your LeetCode ID to complete your profile
          </p>
        </div>
        <form
          className="my-5 space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Input
            placeholder="LeetCode ID"
            type="text"
            onChange={(e) => setLeetcodeId(e.target.value)}
          />
          <Button className="w-full" type="submit">
            Link
          </Button>
        </form>
      </div>
    </div>
  );
}
