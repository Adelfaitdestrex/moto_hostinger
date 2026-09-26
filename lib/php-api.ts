const phpApiUrl = process.env.PHP_API_URL;

export async function phpRequest(
  resource: string,
  init?: RequestInit,
  id?: string,
): Promise<Response> {
  if (!phpApiUrl) {
    throw new Error("PHP_API_URL est requis pour contacter l API PHP.");
  }
  const url = new URL(phpApiUrl);
  url.searchParams.set("resource", resource);
  if (id) url.searchParams.set("id", id);
  return fetch(url, { ...init, cache: "no-store" });
}

export function proxyResponse(response: Response): Response {
  return new Response(response.body, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" },
  });
}
