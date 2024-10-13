"use client";
import React from "react";

export default function WakeUpScrapper() {
  const [didFetch, setDidFetch] = React.useState(() => {
    // Initialize state from sessionStorage if available
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("didFetchLeetCode");
      return stored ? JSON.parse(stored) : false;
    }
    return false;
  });

  React.useEffect(() => {
    if (!didFetch) {
      fetch(`${process.env.NEXT_PUBLIC_LEETCODE_API}`)
        .then((response) => response.json())
        .then((data) => {
          setDidFetch(true);
          // Save to sessionStorage
          sessionStorage.setItem("didFetchLeetCode", JSON.stringify(true));
        })
        .catch((error) => {
          console.error("Error fetching from LeetCode API:", error);
        });
    }
  }, [didFetch]);

  return null;
}
