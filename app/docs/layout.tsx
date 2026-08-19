import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Guardrail Library | AI Spec Blueprint",
    template: "%s | AI Spec Blueprint",
  },
  description:
    "A public field manual for architectural guardrails in AI-assisted software projects.",
};

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return children;
}
