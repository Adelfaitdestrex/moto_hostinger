import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { phpRequest, proxyResponse } from "@/lib/php-api";

export async function GET() { return proxyResponse(await phpRequest("settings")); }
export async function PATCH(request: Request) {
  if (!(await getServerSession(authOptions))?.user) return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  return proxyResponse(await phpRequest("settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
  }));
}