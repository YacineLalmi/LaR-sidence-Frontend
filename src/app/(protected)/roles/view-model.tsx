import { CreateOrUpdateRole } from "@/schemas/role.schema";
import React from "react";

export default function useViewModel() {
  const createRoleInitialState: CreateOrUpdateRole = {
    name: "",
    display_name: "",
    description: "",
  };
  return {
    createRoleInitialState,
  };
}
