import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-4 pt-10">
      <h1 className="font-display text-4xl">404</h1>
      <Link href="/de" className="underline">
        LV Beauty World
      </Link>
    </div>
  );
}
