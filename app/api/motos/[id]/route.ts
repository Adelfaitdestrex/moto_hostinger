import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { phpRequest, proxyResponse } from "@/lib/php-api";

async function authorized() { return Boolean((await getServerSession(authOptions))?.user); }

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorized())) return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  const { id } = await params;
  return proxyResponse(await phpRequest("motos", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
  }, id));
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorized())) return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  const { id } = await params;
  return proxyResponse(await phpRequest("motos", { method: "DELETE" }, id));
}