import { LoaderCircle } from "lucide-react";
import React from "react";

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 z-[202] flex items-center justify-center bg-background">
      <LoaderCircle className="size-8 animate-spin" />
    </div>
  );
}
