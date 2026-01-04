import React from "react";

interface Props {
  children: React.ReactNode;
  header: string;
}

export default function Section({ children, header }: Props) {
  return (
    <div>
      <h1 className="text-[28px] font-bold my-2">{header}</h1>
      <div className="grid grid-cols-1 gap-[12px]">{children}</div>
    </div>
  );
}
