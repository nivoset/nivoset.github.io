import { readFile, unlink, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken = process.env.CLOUDFLARE_API_TOKEN;
if (!accountId || !apiToken) {
  throw new Error("CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are required");
}

const documents = JSON.parse(
  await readFile(resolve("dist/search-documents.json"), "utf8")
);
const vectors = [];
const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/baai/bge-small-en-v1.5`;

for (let start = 0; start < documents.length; start += 16) {
  const batch = documents.slice(start, start + 16);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: batch.map(document => document.text) }),
  });
  const payload = await response.json();
  if (!response.ok || payload.success !== true || !Array.isArray(payload.result?.data)) {
    throw new Error(`Cloudflare embedding request failed: ${JSON.stringify(payload.errors ?? payload)}`);
  }
  if (payload.result.data.length !== batch.length) {
    throw new Error("Cloudflare returned a different number of embeddings than documents");
  }
  batch.forEach((document, index) => {
    const embedding = payload.result.data[index];
    if (
      embedding?.length !== 384 ||
      embedding.some(value => !Number.isFinite(value))
    ) {
      throw new Error(`Cloudflare returned an invalid embedding for ${document.id}`);
    }
    vectors.push({ id: document.id, embedding });
  });
}

await writeFile(
  resolve("dist/search-vectors.json"),
  JSON.stringify({ model: "@cf/baai/bge-small-en-v1.5", vectors })
);
await unlink(resolve("dist/search-documents.json"));
console.log(`Generated ${vectors.length} semantic search vectors.`);
