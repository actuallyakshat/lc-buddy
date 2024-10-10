"use client";
import React from "react";
export default function Error() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-2 text-center">
      <h1 className="text-3xl font-bold">
        Hey There! Looks like something went wrong 😅.
      </h1>
      <p className="text-muted-foreground">
        We suspect the reason of the issue being our backend booting up. <br />
        Kindly retry after 2 minutes. Thanks {":)"}
      </p>
    </div>
  );
}
