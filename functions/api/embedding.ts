interface EmbeddingResponse {
  data: number[][];
}

interface Environment {
  AI: {
    run(
      model: "@cf/baai/bge-small-en-v1.5",
      input: { text: string[] }
    ): Promise<EmbeddingResponse>;
  };
}

interface PagesRequestContext {
  request: Request;
  env: Environment;
}

const hashQuery = async (query: string) => {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`@cf/baai/bge-small-en-v1.5:${query.toLowerCase()}`)
  );
  return [...new Uint8Array(digest)]
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
};

export async function onRequestGet({ request, env }: PagesRequestContext) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < 2 || query.length > 200) {
    return Response.json(
      { error: "Query must be between 2 and 200 characters." },
      { status: 400 }
    );
  }

  const cacheKey = new Request(
    `${new URL(request.url).origin}/__embedding-cache/${await hashQuery(query)}`
  );
  const cache = (
    globalThis as typeof globalThis & { caches?: { default: Cache } }
  ).caches?.default;
  let cachedResponse: Response | undefined;
  try {
    cachedResponse = await cache?.match(cacheKey);
  } catch {
    // Cache failures must not block search.
  }
  if (cachedResponse) return cachedResponse;

  const result = await env.AI.run("@cf/baai/bge-small-en-v1.5", {
    text: [`Represent this sentence for searching relevant passages: ${query}`],
  });
  const embedding = result.data?.[0];
  if (!embedding || embedding.length !== 384) {
    return Response.json({ error: "Embedding model returned an invalid vector." }, { status: 502 });
  }

  const response = Response.json({ embedding }, {
    headers: { "Cache-Control": "public, max-age=3600" },
  });
  await cache?.put(cacheKey, response.clone()).catch(() => {});
  return response;
}
