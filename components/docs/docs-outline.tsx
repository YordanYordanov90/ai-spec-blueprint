export type DocsOutlineItem = {
  id: string;
  label: string;
};

export function DocsOutline({ items }: { items: readonly DocsOutlineItem[] }) {
  return (
    <nav aria-label="On this page" className="sticky top-24">
      <p className="blueprint-kicker text-muted-foreground">On this page</p>
      <ol className="mt-4 space-y-2 border-l border-border pl-3">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="block py-1 text-[11px] leading-4 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
