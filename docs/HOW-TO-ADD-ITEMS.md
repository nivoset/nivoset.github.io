# How to Add or Update Items in the Portfolio

**Type**: How-to Guide  
**Audience**: Contributors who want to add or update projects, training materials, AI experiments, or play lab items

---

## Overview

This guide shows you how to add or update different types of content in the portfolio. Each section covers a specific content type with step-by-step instructions.

## How to Add or Update Projects

Projects are displayed on the `/systems` page and are defined in `src/lib/projects.ts`.

### Step 1: Open the Projects File

Navigate to `src/lib/projects.ts` in your editor.

### Step 2: Understand the Project Interface

Each project follows this structure:

```typescript
{
  id: string;              // Unique identifier (lowercase, no spaces)
  title: string;           // Display name
  description: string;     // Short description
  tags: string[];          // Array of tags (e.g., ['#DevTools', '#Testing'])
  stack: string[];         // Technologies used
  details?: string;        // Optional longer description
  architecture?: string;   // Optional architecture description
  links?: {                // Optional links
    github?: string;
    demo?: string;
    docs?: string;
  };
}
```

### Step 3: Add Your Project

Add a new project object to the `projects` array:

```typescript
{
  id: 'my-new-project',
  title: 'My New Project',
  description: 'A brief description of what this project does.',
  tags: ['#DevTools', '#Automation'],
  stack: ['TypeScript', 'Node.js'],
  details: 'A more detailed description of the project and its features.',
  architecture: 'Built with a modular architecture for extensibility.',
  links: {
    github: 'https://github.com/username/my-new-project',
    demo: 'https://my-new-project.example.com',
  },
},
```

### Step 4: Verify Your Changes

1. Save the file
2. Navigate to `http://localhost:4321/systems` in your browser
3. Your new project should appear in the grid
4. Click on it to see the modal with full details

### Updating an Existing Project

Find the project in the `projects` array by its `id` and modify any fields you want to change. The changes will appear immediately in the dev server.

---

## How to Add or Update Training Materials

Training materials are displayed on the `/training` page and are defined inline in `src/pages/training.astro`.

### Step 1: Open the Training Page

Navigate to `src/pages/training.astro` in your editor.

### Step 2: Find the Trainings Array

Look for the `trainings` constant near the top of the file (around line 6).

### Step 3: Understand the Training Structure

Each training item follows this structure:

```typescript
{
  id: string;                    // Unique identifier
  title: string;                 // Workshop/training title
  description: string;           // Description of the training
  type: 'Live' | 'Async' | 'Open' | 'Internal-Only';  // Training type
  links?: {                      // Optional links
    slides?: string;
    video?: string;
    repo?: string;
  };
}
```

### Step 4: Add Your Training

Add a new training object to the `trainings` array:

```typescript
{
  id: 'my-workshop',
  title: 'My Workshop Title',
  description: 'A description of what participants will learn.',
  type: 'Live',
  links: {
    slides: 'https://slides.example.com',
    video: 'https://video.example.com',
  },
},
```

### Step 5: Verify Your Changes

1. Save the file
2. Navigate to `http://localhost:4321/training` in your browser
3. Your new training should appear in the grid
4. Use the filter buttons to test filtering by type

---

## How to Add or Update AI Experiments

AI experiments are displayed on the `/ai` page and are defined inline in `src/pages/ai.astro`.

### Step 1: Open the AI Page

Navigate to `src/pages/ai.astro` in your editor.

### Step 2: Find the Experiments Array

Look for the `experiments` constant near the top of the file (around line 7).

### Step 3: Understand the Experiment Structure

Each experiment follows this structure:

```typescript
{
  title: string;           // Experiment name
  description: string;     // What the experiment does
  tech: string[];          // Technologies used
  links?: {                // Optional links
    github?: string;
    demo?: string;
  };
}
```

### Step 4: Add Your Experiment

Add a new experiment object to the `experiments` array:

```typescript
{
  title: 'My AI Experiment',
  description: 'An experiment with AI/ML technology.',
  tech: ['Python', 'TensorFlow'],
  links: {
    github: 'https://github.com/username/my-experiment',
  },
},
```

### Step 5: Verify Your Changes

1. Save the file
2. Navigate to `http://localhost:4321/ai` in your browser
3. Your new experiment should appear in the experiments grid

---

## How to Add or Update Play Lab Items

Play lab items (games, art, widgets) are displayed on the `/play` page and are defined inline in `src/pages/play.astro`.

### Step 1: Open the Play Page

Navigate to `src/pages/play.astro` in your editor.

### Step 2: Find the Projects Array

Look for the `projects` constant near the top of the file (around line 7).

### Step 3: Understand the Play Lab Item Structure

Each play lab item follows this structure:

```typescript
{
  title: string;                    // Project name
  description: string;              // Description
  type: 'game' | 'art' | 'widget'; // Item type
  preview?: string;                 // Optional HTML preview
}
```

### Step 4: Add Your Play Lab Item

Add a new item to the `projects` array:

```typescript
{
  title: 'My Game',
  description: 'A fun game I created.',
  type: 'game',
},
```

For widgets with HTML previews:

```typescript
{
  title: 'My Widget',
  description: 'An interactive widget.',
  type: 'widget',
  preview: '<div class="my-widget">Widget HTML here</div>',
},
```

### Step 5: Verify Your Changes

1. Save the file
2. Navigate to `http://localhost:4321/play` in your browser
3. Your new item should appear in the play lab grid

---

## Best Practices

### IDs and Identifiers

- Use lowercase, hyphenated IDs (e.g., `my-new-project`)
- Make IDs descriptive but concise
- Ensure IDs are unique within their category

### Descriptions

- Keep descriptions concise but informative
- Use clear, accessible language
- Include key technologies or concepts

### Tags

- Use consistent tag formats (e.g., `#DevTools`, `#Testing`)
- Limit to 2-4 relevant tags per item
- Use tags that help with filtering and discovery

### Links

- Always use full URLs (including `https://`)
- Test links to ensure they work
- Use `noopener noreferrer` for external links (handled automatically by components)

### Testing

- Always test your changes in the dev server
- Check that items appear correctly in their respective pages
- Verify that filters work (for training and projects)
- Test modals and interactions

---

## Troubleshooting

**Problem**: New item doesn't appear  
**Solution**: 
- Check that you saved the file
- Verify the dev server is running
- Check the browser console for errors
- Ensure your syntax is correct (matching commas, brackets, etc.)

**Problem**: TypeScript errors  
**Solution**:
- Make sure all required fields are present
- Check that types match the interface (e.g., `type` values match the union type)
- Verify string arrays use proper syntax

**Problem**: Item appears but looks wrong  
**Solution**:
- Check that all required fields are filled
- Verify the component can handle optional fields
- Look at similar items for reference

---

## Next Steps

- Learn about [Easter Eggs](../docs/HOW-TO-ADD-EASTER-EGGS.md) if you want to add interactive features
- Check the [Reference](../docs/REFERENCE.md) for detailed technical information
- Read the [Easter Eggs Explanation](../docs/EASTER-EGGS-EXPLANATION.md) to understand existing easter eggs

