import React from "react";
import { Badge } from "./badge";

export default function Status({ value, color = "bg-green-700" }: { value: string; color?: string }) {
  return <Badge className={`${color}`}>{value}</Badge>;
}
