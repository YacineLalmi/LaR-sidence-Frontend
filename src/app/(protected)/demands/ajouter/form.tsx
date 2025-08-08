import React from "react";

interface AddDemandeFormProps {
  formId: string;
}

export default function AddDemandeForm({ formId }: AddDemandeFormProps) {
  return (
    <form id={formId}>
      {/* Add your demande fields here */}
      <div>
        <label htmlFor="titre">Titre</label>
        <input id="titre" name="titre" type="text" required />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" required />
      </div>
      {/* Add more fields as needed */}
    </form>
  );
}
