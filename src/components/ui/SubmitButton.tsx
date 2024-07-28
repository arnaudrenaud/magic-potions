"use client";

import { Button as UIButton } from "@/components/ui/button";
import { ReactNode } from "react";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  const { pending } = useFormStatus();

  return (
    <UIButton type="submit" disabled={pending} className={className}>
      {children}
    </UIButton>
  );
}
