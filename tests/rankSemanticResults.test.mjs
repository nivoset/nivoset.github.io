import assert from "node:assert/strict";
import test from "node:test";
import { rankSemanticResults } from "../src/utils/rankSemanticResults.js";

test("ranks the closest matching post first and limits the result list", () => {
  const results = rankSemanticResults(
    [1, 0],
    [
      { id: "unrelated", embedding: [0, 1] },
      { id: "closest", embedding: [0.9, 0.1] },
      { id: "similar", embedding: [0.7, 0.3] },
    ],
    2
  );

  assert.deepEqual(results.map(result => result.id), ["closest", "similar"]);
});

test("skips vectors with incompatible dimensions", () => {
  const results = rankSemanticResults([1, 0], [
    { id: "wrong-size", embedding: [1] },
    { id: "valid", embedding: [0, 1] },
  ]);

  assert.deepEqual(results.map(result => result.id), ["valid"]);
});
