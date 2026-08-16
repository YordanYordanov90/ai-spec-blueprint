import Link from "next/link";

export default function NewProjectPage() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-3xl flex-col gap-6 px-6 py-24">
      <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
        New project
      </p>
      <h1 className="font-heading text-3xl tracking-tight">
        Onboarding continues after this landing.
      </h1>
      <p className="max-w-xl text-sm leading-6 text-muted-foreground">
        The start action is wired. Grill Me onboarding is the next feature and
        is not implemented on this route yet.
      </p>
      <Link
        href="/"
        className="w-fit text-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        Back to landing
      </Link>
    </main>
  );
}
