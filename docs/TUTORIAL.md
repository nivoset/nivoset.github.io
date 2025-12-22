# Getting Started with the Portfolio Codebase

**Type**: Tutorial  
**Audience**: New contributors or developers who want to understand and work with this Astro-based portfolio website

---

## Overview

This tutorial will guide you through understanding the structure of this personal portfolio website built with Astro. By the end, you'll have a working development environment, understand the codebase organization, and be able to make your first contribution.

## Prerequisites

Before starting, ensure you have:
- Node.js (v18 or higher recommended)
- pnpm installed (`npm install -g pnpm`)
- A code editor (VS Code recommended)
- Basic familiarity with TypeScript and web development

## Step 1: Clone and Install

First, clone the repository and install dependencies:

```bash
# Clone the repository
git clone <repository-url>
cd nivoset.github.io

# Install dependencies
pnpm install
```

You should see dependencies being installed. This includes:
- Astro (the static site generator)
- Tailwind CSS (for styling)
- TypeScript (for type safety)
- Various other dependencies

## Step 2: Start the Development Server

Run the development server:

```bash
pnpm dev
```

You should see output indicating the server is running, typically at `http://localhost:4321`. Open this URL in your browser to see the site.

**What you're seeing**: The homepage with a hero section, navigation, and links to different sections of the portfolio.

## Step 3: Explore the Project Structure

Let's understand how the codebase is organized. Open your editor and explore these key directories:

### `src/pages/`
This is where all the pages live. Each `.astro` file becomes a route:
- `index.astro` → `/` (homepage)
- `about.astro` → `/about`
- `systems.astro` → `/systems`
- `ai.astro` → `/ai`
- And so on...

**Try it**: Navigate to `http://localhost:4321/systems` and see how it corresponds to `src/pages/systems.astro`.

### `src/components/`
Reusable components live here. These are `.astro` files that can be imported and used in pages:
- `Header.astro` - Site navigation
- `Footer.astro` - Site footer
- `ProjectCard.astro` - Displays a project
- `BearBear.astro` - An easter egg component

**Try it**: Open `src/pages/index.astro` and see how it imports `Hero.astro` from components.

### `src/lib/`
Utility functions and data live here:
- `projects.ts` - Project data and helper functions
- `konami.ts` - Konami code easter egg handler
- `terminalCommands.ts` - Terminal command definitions
- Other utility modules

**Try it**: Open `src/lib/projects.ts` to see how projects are structured.

### `src/layouts/`
Base layout templates:
- `BaseLayout.astro` - The main layout wrapper used by all pages

## Step 4: Make Your First Change

Let's make a simple change to see how the development workflow works.

1. Open `src/pages/index.astro`
2. Find the `<Hero />` component
3. Add a comment above it: `<!-- Hero section -->`
4. Save the file

**What happens**: The dev server automatically reloads and you'll see your change reflected immediately (hot module replacement).

## Step 5: Understand Data Flow

Let's trace how data flows through the application:

1. **Data Source**: Open `src/lib/projects.ts`
   - This file exports a `projects` array with project data
   - It also exports helper functions like `getProjectById()`

2. **Data Usage**: Open `src/pages/systems.astro`
   - See how it imports `projects` from `../lib/projects`
   - The projects are mapped to `ProjectCard` components

3. **Component Rendering**: Open `src/components/ProjectCard.astro`
   - See how it receives a `project` prop
   - The component renders the project data

**Try it**: Add a new project to the `projects` array in `src/lib/projects.ts` and see it appear on the `/systems` page.

## Step 6: Explore the Styling System

The site uses Tailwind CSS for styling:

1. Open `tailwind.config.mjs` to see custom colors and configuration
2. Open `src/global.css` to see global styles
3. Look at any component to see Tailwind classes in action

**Try it**: Change a color in `tailwind.config.mjs` and see it reflected across the site.

## Step 7: Build for Production

When you're ready to see the production build:

```bash
pnpm build
```

This creates a `dist/` directory with static HTML, CSS, and JavaScript files ready to deploy.

Preview the production build:

```bash
pnpm preview
```

## Step 8: Discover Easter Eggs

The codebase includes several easter eggs. Let's find them:

1. **Konami Code**: Try typing the Konami code (↑↑↓↓←→←→BA) on any page
2. **Bear-Bear**: Look for a small bear icon that sometimes appears (30% chance)
3. **Quick Facts**: Hover over fact cards on the homepage
4. **Weird Mode**: Visit `/ai` and click the "Weird Mode" button
5. **Terminal**: Visit `/contact` and look for the `$ _` button

**Try it**: Activate the Konami code and see the solidarity message!

## What You've Learned

By completing this tutorial, you now understand:
- How to set up the development environment
- The project structure and organization
- How pages, components, and data work together
- How to make changes and see them reflected
- How to build for production
- Where to find easter eggs

## Next Steps

Now that you understand the basics:
- Read the [How-to Guides](../docs/HOW-TO-ADD-ITEMS.md) to learn how to add or update content
- Check the [Reference](../docs/REFERENCE.md) for detailed technical information
- Explore the [Easter Eggs Explanation](../docs/EASTER-EGGS-EXPLANATION.md) to understand how they work

## Troubleshooting

**Problem**: `pnpm install` fails  
**Solution**: Make sure you have Node.js v18+ and pnpm installed correctly.

**Problem**: Dev server won't start  
**Solution**: Check if port 4321 is already in use. You can change the port in `astro.config.mjs`.

**Problem**: Changes don't appear  
**Solution**: Make sure the dev server is running and check the browser console for errors.

---

*Ready to contribute? Check out the How-to Guides for specific tasks!*

