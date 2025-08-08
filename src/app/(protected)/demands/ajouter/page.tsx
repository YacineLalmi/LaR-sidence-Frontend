import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import React from "react";
import AddDemandeForm from "./form";

export default function page() {
  return (
    <Card>
      <CardHeader>Ajouter une demande</CardHeader>
      <CardContent>
        <AddDemandeForm formId="create-update-form" />
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
