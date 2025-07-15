import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import React from "react";
import AddRoleForm from "./form";

export default function page() {
  return (
    <Card>
      <CardHeader>Ajouter un rôle</CardHeader>
      <CardContent>
        <AddRoleForm formId="create-update-form" />
      </CardContent>
      <CardFooter>
        <Button variant="outline">Cancel</Button>
        <Button type="submit" form="create-update-form">
          Save changes
        </Button>
      </CardFooter>
    </Card>
  );
}
