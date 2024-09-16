"use client";

import {
  searchHeaderImage,
  updateGroupHeaderImage,
} from "@/app/(dashboard)/_actions.ts/group-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Camera, LoaderCircle } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";

export default function ChooseImageDialog({ groupId }: { groupId: string }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 700);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.trim() == "") return;
    setLoading(true);
    searchHeaderImage({ searchQuery: debouncedQuery }).then((res) => {
      if (res.success) {
        console.log(res.data.photos);
        setSearchResults(res.data.photos);
      }
    });
    setLoading(false);
  }, [debouncedQuery]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="absolute flex size-full items-center justify-center bg-zinc-700/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <Camera className="stroke-white" />
        </button>
      </DialogTrigger>
      <DialogContent className="noscrollbar max-h-[600px] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Update Image</DialogTitle>
          <DialogDescription>
            Search for an image to update the header of your group.
          </DialogDescription>
        </DialogHeader>
        <form>
          <Input
            placeholder="Programming Aesthetics"
            type="text"
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
        {searchResults.length > 0 && (
          <SearchResultsPanel
            data={searchResults}
            groupId={groupId}
            setOpen={setOpen}
          />
        )}

        {loading && (
          <div className="mt-4 flex items-center justify-center">
            <LoaderCircle className="h-5 w-5 animate-spin" />
          </div>
        )}

        {debouncedQuery.trim() == "" &&
          searchResults.length == 0 &&
          !loading && (
            <div className="mt-4 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Search for an image to update the header of your group.
              </p>
            </div>
          )}
      </DialogContent>
    </Dialog>
  );
}

function SearchResultsPanel({
  data,
  groupId,
  setOpen,
}: {
  data: any[];
  groupId: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  async function handleImageSelection({ imageUrl }: { imageUrl: string }) {
    toast.loading("Updating image...", { id: "update-image" });
    try {
      const response = await updateGroupHeaderImage({ groupId, imageUrl });
      if (response.success) {
        toast.success("Image updated successfully!", { id: "update-image" });
        setOpen(false);
      } else {
        toast.error("Failed to update image", { id: "update-image" });
      }
    } catch (error) {
      toast.error("Failed to update image", { id: "update-image" });
    }
  }

  return (
    <div className="noscrollbar mt-5 grid grid-cols-2 gap-2 overflow-y-scroll">
      {data.map((result) => (
        <div
          key={result.id}
          onClick={() =>
            handleImageSelection({ imageUrl: result.src.original })
          }
        >
          <Image
            src={result.src.original}
            alt={result.alt}
            width={600}
            height={600}
            quality={75}
            className="aspect-square h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
