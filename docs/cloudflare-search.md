# Cloudflare semantic search deployment

The `Deploy semantic search to Cloudflare Pages` workflow publishes a separate Cloudflare Pages version. GitHub Pages continues to use the existing Fuse.js keyword search. The Cloudflare build embeds each published post with Workers AI, while the Pages Function embeds each query with the same model and returns cosine-ranked results in the browser.

## One-time setup

1. Create a Direct Upload Cloudflare Pages project named `nivoset`.
2. Deploy with the repository's `wrangler.toml`; it configures the production Workers AI binding `AI`.
3. Add `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` as GitHub repository secrets, granting Pages Write and Workers AI Read/Edit permissions for the workflow.
4. Run the `Deploy semantic search to Cloudflare Pages` workflow. Pushes to `main` deploy both versions independently; the workflow can also be started manually.

The workflow uses Workers AI model `@cf/baai/bge-small-en-v1.5` for build-time article vectors and query-time vectors. It batches article embeddings during the build, writes them to `dist/search-vectors.json`, then deploys the static site and `functions/api/embedding.ts` together.

Repeated query embeddings use Cloudflare's data-center-local Cache API for up to one hour. Cache entries are temporary and may be evicted; a cache miss simply invokes Workers AI again. Search queries are sent to Cloudflare to create their embeddings. The standard GitHub Pages deployment does not include the generated vectors or use the semantic-search mode.
