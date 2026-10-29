# Adding a project

The site has two curated lists:

- **Projects page** (`/projects`): add a `Project` entry to `projects` in `src/lib/projects.ts`.
- **Game trials** (`/play`): add a game entry to the `gameTrials` list in `src/pages/play.astro`. Use the public demo URL for the playable link; the game itself can remain hosted separately.

## Project catalogue entry

Every project must have a unique `id`, a `title`, and a short `description`. The page renders every entry in `projects`; it does not require a separate card or modal update. The remaining fields are optional:

```ts
{
  id: "example-project",
  title: "Example Project",
  description: "A short, accurate description of what it does.",
  tags: ["Testing", "Developer tools"],
  stack: ["TypeScript", "Node.js"],
  details: "Additional context for readers.",
  architecture: "A concise architecture note.",
  links: {
    github: "https://github.com/example/project",
    demo: "https://example.com/",
    docs: "https://example.com/docs/",
  },
}
```

Keep claims current and use working links. Omit optional fields that do not apply; cards render without tags, stack, details, architecture, or links. The link labels are supplied by the page.

## Game-trial entry

Add a title, a short description, and the public playable URL to the `gameTrials` list in `src/pages/play.astro`. Keep hosted game code out of this repository when it is deployed separately. The Play Lab card should render a play link only when a valid URL is present.

## Verify

Run `pnpm build`, then open `/projects` and `/play` in the preview. Confirm every configured project or game has a visible card, and each link opens the intended repository, documentation, or playable demo.
