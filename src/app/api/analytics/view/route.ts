import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing card ID" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const viewCookieKey = `viewed_${id}`;
    
    // Rate Limiting: Prevent duplicate views from the same session
    if (cookieStore.has(viewCookieKey)) {
      return NextResponse.json({ success: true, message: "Already viewed" });
    }

    // Fire and forget the update but wrap it in await to ensure it runs before edge kills the function
    await db.vCard.update({
      where: { id },
      data: { totalViews: { increment: 1 } },
    });

    // Set cookie to expire in 1 hour to prevent spamming
    cookieStore.set(viewCookieKey, 'true', { maxAge: 60 * 60, httpOnly: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Analytics API] Error recording view:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
