import { Check, Circle, CircleDotDashed, X } from "lucide-react";

import { cn } from "@/lib/utils";

type DecisionStatusValue =
  | "fact"
  | "proposed"
  | "approved"
  | "unresolved"
  | "rejected";

const styles: Record<DecisionStatusValue, string> = {
  fact: "border-border bg-secondary text-foreground",
  proposed: "border-warning/40 bg-warning/10 text-warning",
  approved: "border-success/40 bg-success/10 text-success",
  unresolved: "border-border bg-transparent text-muted-foreground",
  rejected: "border-danger/40 bg-danger/10 text-danger",
};

function StatusIcon({ status }: { status: DecisionStatusValue }) {
  if (status === "approved") {
    return <Check aria-hidden="true" />;
  }

  if (status === "proposed") {
    return <CircleDotDashed aria-hidden="true" />;
  }

  if (status === "rejected") {
    return <X aria-hidden="true" />;
  }

  return <Circle aria-hidden="true" />;
}

export function DecisionStatus({
  status,
  label,
  className,
}: {
  status: DecisionStatusValue;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1.5 border px-2 font-mono text-[9px] font-medium tracking-[0.12em] uppercase [&_svg]:size-3",
        styles[status],
        className,
      )}
    >
      <StatusIcon status={status} />
      {label ?? status}
    </span>
  );
}
