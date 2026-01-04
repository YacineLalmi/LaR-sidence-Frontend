import React from "react";

export const StatusBadge = ({ text = "Inactif", bgColor = "bg-red-50", textColor = "text-red-500" }) => {
  console.log("status text", text);
  console.log("status bg color", bgColor);
  console.log("status text color", textColor);
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full`} style={{ backgroundColor: bgColor }}>
      <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: textColor }} />
      <span className={`text-sm font-medium`} style={{ color: textColor }}>
        {text}
      </span>
    </div>
  );
};
