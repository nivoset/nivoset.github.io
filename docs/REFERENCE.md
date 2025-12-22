# Portfolio Codebase Reference

**Type**: Reference  
**Audience**: Developers who need to look up technical details, APIs, data structures, and implementation specifics

---

## Overview

This reference provides complete, accurate technical information about the portfolio codebase structure, APIs, data models, and implementation details.

## Project Structure

```
/
├── public/              # Static assets (favicon, etc.)
├── src/
│   ├── components/      # Astro components
│   ├── layouts/         # Layout templates
│   ├── lib/             # Utility functions and data
│   ├── pages/           # Page routes (file-based routing)
│   └── global.css       # Global styles
├── dist/                # Build output (generated)
├── astro.config.mjs     # Astro configuration
├── tailwind.config.mjs  # Tailwind CSS configuration
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## Technology Stack

- **Framework**: Astro 5.15.8
- **Styling**: Tailwind CSS 4.1.17
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Testing**: Vitest 4.0.9
- **Additional**: TensorFlow.js, Tracery Grammar

## Data Models

### Project Interface

```typescript
interface Project {
  id: string;                    // Unique identifier (lowercase, hyphenated)
  title: string;                 // Display name
  description: string;           // Short description
  tags: string[];                // Array of tags (e.g., ['#DevTools'])
  stack: string[];               // Technologies used
  details?: string;              // Optional longer description
  architecture?: string;         // Optional architecture description
  links?: {                      // Optional links object
    github?: string;             // GitHub repository URL
    demo?: string;               // Live demo URL
    docs?: string;               // Documentation URL
  };
}
```

**Location**: `src/lib/projects.ts`

**Helper Functions**:
- `getProjectsByTag(tag: string): Project[]` - Filter projects by tag
- `getProjectById(id: string): Project | undefined` - Get single project by ID

### Training Interface

```typescript
interface Training {
  id: string;                    // Unique identifier
  title: string;                 // Workshop/training title
  description: string;           // Description
  type: 'Live' | 'Async' | 'Open' | 'Internal-Only';  // Training type
  links?: {                      // Optional links
    slides?: string;             // Slides URL
    video?: string;              // Video URL
    repo?: string;               // Repository URL
  };
}
```

**Location**: `src/pages/training.astro` (inline array)

### AI Experiment Interface

```typescript
interface Experiment {
  title: string;                 // Experiment name
  description: string;           // Description
  tech: string[];                // Technologies used
  links?: {                      // Optional links
    github?: string;             // GitHub repository URL
    demo?: string;               // Live demo URL
  };
}
```

**Location**: `src/pages/ai.astro` (inline array)

### Play Lab Item Interface

```typescript
interface PlayLabItem {
  title: string;                 // Project name
  description: string;           // Description
  type: 'game' | 'art' | 'widget';  // Item type
  preview?: string;              // Optional HTML preview string
}
```

**Location**: `src/pages/play.astro` (inline array)

### Command Interface

```typescript
interface Command {
  name: string;                  // Command name
  description: string;           // Command description
  handler: (args: string[]) => string;  // Command handler function
}
```

**Location**: `src/lib/terminalCommands.ts`

**Functions**:
- `executeCommand(input: string): string` - Execute a command by name

## Component Reference

### BaseLayout

**Location**: `src/layouts/BaseLayout.astro`

**Props**:
- `title: string` - Page title (used in `<title>` tag)
- `description: string` - Meta description

**Usage**:
```astro
<BaseLayout title="Page Title" description="Page description">
  <!-- page content -->
</BaseLayout>
```

### ProjectCard

**Location**: `src/components/ProjectCard.astro`

**Props**:
- `project: Project` - Project object to display

**Events**: Dispatches `open-project-modal` custom event with `projectId` in detail

### TrainingCard

**Location**: `src/components/TrainingCard.astro`

**Props**:
- `training: Training` - Training object to display

### ExperimentCard

**Location**: `src/components/ExperimentCard.astro`

**Props**:
- `experiment: Experiment` - Experiment object to display

### PlayLabCard

**Location**: `src/components/PlayLabCard.astro`

**Props**:
- `project: PlayLabItem` - Play lab item to display

## Utility Functions

### Konami Code

**Location**: `src/lib/konami.ts`

**Function**: `initKonamiCode(): void`

**Behavior**: Listens for keyboard sequence: ↑↑↓↓←→←→BA

**Event**: Dispatches `konami-code-activated` custom event on window

### Weird Mode

**Location**: `src/lib/weirdMode.ts`

**Function**: `initWeirdMode(): void`

**Behavior**: Toggles `weird-mode` class on body, persists state in localStorage

**Storage Key**: `weird-mode` (boolean string)

### Terminal Commands

**Location**: `src/lib/terminalCommands.ts`

**Available Commands**:
- `help` - Show available commands
- `list-projects` - List all projects
- `show-union` - Show union organizing information
- `show-games` - Show game experiments
- `stretch-break` - Office-friendly workout sequence
- `clear` - Clear the terminal

## Color System

Colors are defined in `tailwind.config.mjs`:

- `graphite-black` - Primary dark background
- `federal-gray` - Secondary dark background
- `warmlight-sand` - Primary text color
- `worker-gold` - Accent/highlight color
- `union-red` - Union/organizing accent
- `fog-blue` - Link color
- `technocrat-purple` - AI/tech accent
- `ominous-teal` - Play/game accent
- `bear-bear-brown` - Bear-Bear color
- `storm-slate` - Code block background

## Routing

Astro uses file-based routing. Files in `src/pages/` become routes:

- `index.astro` → `/`
- `about.astro` → `/about`
- `systems.astro` → `/systems`
- `ai.astro` → `/ai`
- `training.astro` → `/training`
- `play.astro` → `/play`
- `organizing.astro` → `/organizing`
- `contact.astro` → `/contact`
- `storm.astro` → `/storm`
- `api/storm.json.ts` → `/api/storm.json`

## Build Configuration

### Astro Config

**File**: `astro.config.mjs`

```javascript
export default defineConfig({
  output: 'static',  // Static site generation
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### Scripts

**File**: `package.json`

- `pnpm dev` - Start development server (port 4321)
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm simulate` - Run simulation script
- `pnpm continuous` - Run continuous simulation

## Easter Eggs Reference

### Konami Code

**Trigger**: Keyboard sequence ↑↑↓↓←→←→BA  
**Component**: `src/components/KonamiOverlay.astro`  
**Handler**: `src/lib/konami.ts`  
**Effect**: Shows solidarity message overlay

### Bear-Bear

**Trigger**: Random appearance (30% chance)  
**Component**: `src/components/BearBear.astro`  
**Effect**: Clickable bear icon that shows lore modal

### Quick Facts Tooltips

**Trigger**: Hover over fact cards  
**Component**: `src/components/QuickFacts.astro`  
**Data**: `easterEgg` property in facts array  
**Effect**: Shows tooltip with easter egg text

### Weird Mode

**Trigger**: Button click on `/ai` page  
**Component**: Toggle button in `src/pages/ai.astro`  
**Handler**: `src/lib/weirdMode.ts`  
**Effect**: Changes color scheme, reveals surreal prompts

### Terminal Icon

**Trigger**: Click on `$ _` button  
**Location**: `src/pages/contact.astro`  
**Effect**: Opens interactive terminal (implementation varies)

### CSS Specificity Tooltip

**Trigger**: Hover over code example  
**Location**: `src/pages/training.astro`  
**Effect**: Shows educational tooltip about CSS specificity

## API Endpoints

### `/api/storm.json`

**File**: `src/pages/api/storm.json.ts`

**Method**: GET

**Response**: JSON object with generated storm story

**Structure**:
```typescript
{
  story: string;        // Generated story text
  mood: string;         // Story mood
  moodColor: string;    // Color associated with mood
}
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `ProjectCard.astro`)
- **Pages**: lowercase with hyphens (e.g., `about.astro`)
- **Utilities**: camelCase (e.g., `konami.ts`)
- **Data files**: camelCase (e.g., `projects.ts`)

## TypeScript Configuration

**File**: `tsconfig.json`

- Strict mode enabled
- ES modules
- Target: ES2020
- Module resolution: Node

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ features
- CSS Grid and Flexbox
- Custom properties (CSS variables)

## Performance Considerations

- Static site generation (SSG) for fast loading
- Component-based architecture for code splitting
- Tailwind CSS for optimized CSS output
- Lazy loading for heavy components (where applicable)

---

*For step-by-step instructions, see [How-to Guides](../docs/HOW-TO-ADD-ITEMS.md). For learning the codebase, see [Tutorial](../docs/TUTORIAL.md).*

