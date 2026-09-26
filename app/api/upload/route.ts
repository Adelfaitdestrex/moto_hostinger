import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";
const accepted = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  if (!(await getServerSession(authOptions))?.user) return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  const formData = await request.formData();
  const files = formData.getAll("files").filter((value): value is File => value instanceof File);
  if (!files.length || files.some((file) => !accepted.has(file.type) || file.size > 8 * 1024 * 1024)) return NextResponse.json({ error: "Images JPG, PNG ou WEBP de 8 Mo maximum." }, { status: 400 });
  const directory = path.join(process.cwd(), "public", "uploads");
  await mkdir(directory, { recursive: true });
  const urls: string[] = [];
  for (const file of files) {
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, "-");
    const filename = `${Date.now()}-${crypto.randomUUID()}-${safeName}`;
    await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));
    urls.push(`/uploads/${filename}`);
  }
  return NextResponse.json({ urls });
}