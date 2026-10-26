import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { MAPS_KEY } from "@/lib/storage";

export async function GET() {
  const jar = await cookies();
  if (jar.get(MAPS_KEY)?.value !== "1") {
    return NextResponse.json({ error: "consent required" }, { status: 403 });
  }
  const token = process.env.MAPKIT_TOKEN;
  if (!token) {
    return NextResponse.json({ token: null }, { status: 200 });
  }
  return NextResponse.json({ token });
}
