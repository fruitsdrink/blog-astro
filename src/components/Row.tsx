import React from "react";

type Props = {
  children: React.ReactNode;
};
export const Row = ({ children }: Props) => {
  return <div className="flex flex-row gap-2">{children}</div>;
};
