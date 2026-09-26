import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { phpRequest, proxyResponse } from "@/lib/php-api";

export async function GET() {
	return proxyResponse(await phpRequest("motos"));
}

export async function POST(request: Request) {
	if (!(await getServerSession(authOptions))?.user) {
		return NextResponse.json({ error: "Non autorise" }, { status: 401 });
	}
	return proxyResponse(await phpRequest("motos", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: await request.text(),
	}));
}