import React from "react";

interface Props {
  children: React.ReactNode;
  header: string;
}

export default function Section({ children, header }: Props) {
  return (
    <div>
      <h1 className="text-xl font-bold my-2">{header}</h1>
      {children}
    </div>
  );
}
