export function cosineSimilarity(left, right) {
  if (left.length !== right.length || left.length === 0) return Number.NaN;

  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftMagnitude += left[index] * left[index];
    rightMagnitude += right[index] * right[index];
  }

  if (leftMagnitude === 0 || rightMagnitude === 0) return Number.NaN;
  return dot / Math.sqrt(leftMagnitude * rightMagnitude);
}

export function rankSemanticResults(queryEmbedding, documents, limit = 5) {
  return documents
    .map(document => ({
      ...document,
      score: cosineSimilarity(queryEmbedding, document.embedding),
    }))
    .filter(result => Number.isFinite(result.score))
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}
