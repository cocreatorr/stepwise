import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  // Debug log: shows what your server expects vs. what the webhook sent
  console.log("Expected:", process.env.REVALIDATE_SECRET, "Got:", secret);

  // Verify secret
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    // Use your actual domain or NEXT_PUBLIC_SITE_URL for reliability
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stepwise-pearl.vercel.app";

    // Revalidate homepage, posts listing, and category pages together
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
