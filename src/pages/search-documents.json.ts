import { getCollection } from "astro:content";
import slugify from "@utils/slugify";

export async function GET() {
  if (import.meta.env.PUBLIC_SEARCH_MODE !== "semantic") {
    return new Response("Not found", { status: 404 });
  }
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const documents = posts.map(({ body = "", data }) => ({
    id: slugify(data),
    text: `${data.title}\n${data.description}\n${body}`.slice(0, 1500),
  }));

  return new Response(JSON.stringify(documents), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
