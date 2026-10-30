export interface SemanticDocument {
  id: string;
  embedding: number[];
}

export interface RankedSemanticDocument extends SemanticDocument {
  score: number;
}

export function cosineSimilarity(left: number[], right: number[]): number;
export function rankSemanticResults(
  queryEmbedding: number[],
  documents: SemanticDocument[],
  limit?: number
): RankedSemanticDocument[];
