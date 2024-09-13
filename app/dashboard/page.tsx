"use client";
import { useGlobalStore } from "@/context/GlobalContext";
import React from "react";

export default function Dashboard() {
  const { clientUser, loading, error } = useGlobalStore();
  return <div>{clientUser?.name}</div>;
}
