import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-4">
      <div className="max-w-lg text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="outline-num mt-4 font-display text-[8rem] font-extrabold leading-none">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-dark-foreground">This room is <span className="text-primary">unlit</span></h2>
        <p className="mt-3 text-dark-muted">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link href="/" className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 font-display font-semibold text-primary-foreground hover:shadow-glow">Back to home</Link>
      </div>
    </section>
  );
}
