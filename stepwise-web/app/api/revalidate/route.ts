import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  console.log("Expected:", process.env.REVALIDATE_SECRET, "Got:", secret);

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    // Hard-code your production domain to avoid needing NEXT_PUBLIC_SITE_URL
    const baseUrl = "https://stepwise-pearl.vercel.app";

    await Promise.all([
      fetch(`${baseUrl}/api/revalidate?path=/`, {
        headers: { Authorization: `Bearer ${process.env.REVALIDATE_SECRET}` },
      }),
      fetch(`${baseUrl}/api/revalidate?path=/posts`, {
        headers: { Authorization: `Bearer ${process.env.REVALIDATE_SECRET}` },
      }),
      fetch(`${baseUrl}/api/revalidate?path=/category`, {
        headers: { Authorization: `Bearer ${process.env.REVALIDATE_SECRET}` },
      }),
    ]);

    return NextResponse.json({
      revalidated: true,
      paths: ["/", "/posts", "/category"],
    });
  } catch (err) {
    console.error("Error revalidating:", err);
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
