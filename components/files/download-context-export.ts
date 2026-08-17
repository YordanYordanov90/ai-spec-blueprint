import { createContextExport } from "@/src/lib/blueprint/export/create-context-export";
import type { ProjectBlueprint } from "@/src/lib/blueprint/schemas/project-blueprint";

export function downloadContextExport(blueprint: ProjectBlueprint): string {
  const exported = createContextExport(blueprint);
  const blob = new Blob([new Uint8Array(exported.zipBytes)], {
    type: "application/zip",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = exported.filename;
  link.rel = "noopener";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  return exported.filename;
}
