import assert from "node:assert/strict";
import test from "node:test";
import { onRequestGet } from "../functions/api/embedding.ts";

test("embeds valid queries and reuses cached vectors without another AI call", async () => {
  const previousCaches = globalThis.caches;
  const cachedResponses = new Map();
  globalThis.caches = {
    default: {
      match: async request => cachedResponses.get(request.url)?.clone(),
      put: async (request, response) => cachedResponses.set(request.url, response.clone()),
    },
  };

  let calls = 0;
  const env = {
    AI: {
      run: async (model, input) => {
        calls += 1;
        assert.equal(model, "@cf/baai/bge-small-en-v1.5");
        assert.deepEqual(input.text, [
          "Represent this sentence for searching relevant passages: design systems",
        ]);
        return { data: [Array(384).fill(0.25)] };
      },
    },
  };

  try {
    const invalid = await onRequestGet({
      request: new Request("https://site.test/api/embedding?q=x"),
      env,
    });
    assert.equal(invalid.status, 400);
    assert.equal(calls, 0);

    const request = new Request("https://site.test/api/embedding?q=design%20systems");
    const first = await onRequestGet({ request, env });
    assert.equal(first.status, 200);
    assert.equal((await first.json()).embedding.length, 384);

    const second = await onRequestGet({ request, env });
    assert.equal(second.status, 200);
    assert.equal((await second.json()).embedding.length, 384);
    assert.equal(calls, 1);
  } finally {
    if (previousCaches === undefined) delete globalThis.caches;
    else globalThis.caches = previousCaches;
  }
});
