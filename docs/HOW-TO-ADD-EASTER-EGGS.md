# How to Add or Update Easter Eggs

**Type**: How-to Guide  
**Audience**: Contributors who want to add interactive easter eggs or modify existing ones

---

## Overview

This guide shows you how to add new easter eggs or modify existing ones in the portfolio. Easter eggs are hidden interactive features that enhance the user experience.

## Understanding Existing Easter Eggs

Before adding new easter eggs, familiarize yourself with the existing ones:

1. **Konami Code** - Keyboard sequence that shows a solidarity message
2. **Bear-Bear** - Random pixel bear that appears on some pages
3. **Quick Facts Tooltips** - Hover tooltips on fact cards
4. **Weird Mode** - Color scheme toggle on the AI page
5. **Terminal Icon** - Interactive terminal on the contact page
6. **CSS Specificity Tooltip** - Educational tooltip on the training page

## How to Add a New Easter Egg

### Step 1: Choose Your Easter Egg Type

Decide what kind of easter egg you want:
- **Keyboard shortcut** (like Konami code)
- **Visual element** (like Bear-Bear)
- **Interactive toggle** (like Weird Mode)
- **Hover/click tooltip** (like Quick Facts)
- **Hidden button/link** (like Terminal icon)

### Step 2: Create the Component or Logic

#### For Visual Components (like Bear-Bear)

Create a new component in `src/components/`:

```astro
---
// YourComponent.astro
const shouldShow = Math.random() > 0.7; // 30% chance
---

{shouldShow && (
  <div 
    id="my-easter-egg"
    class="fixed bottom-4 left-4 w-12 h-12 opacity-50 hover:opacity-100 transition-opacity cursor-pointer z-50"
    role="button"
    tabindex="0"
    aria-label="My Easter Egg"
  >
    <!-- Your content here -->
  </div>
)}

<script>
  const element = document.getElementById('my-easter-egg');
  if (element) {
    element.addEventListener('click', () => {
      // Your interaction logic here
      alert('Easter egg activated!');
    });
  }
</script>
```

#### For Keyboard Shortcuts (like Konami Code)

Create a new file in `src/lib/`:

```typescript
// src/lib/myEasterEgg.ts

const SHORTCUT_KEYS = ['KeyM', 'KeyY', 'KeyK', 'KeyE', 'KeyY'];

let sequence: string[] = [];

export function initMyEasterEgg(): void {
  document.addEventListener('keydown', (e) => {
    sequence.push(e.code);
    
    if (sequence.length > SHORTCUT_KEYS.length) {
      sequence.shift();
    }
    
    if (sequence.length === SHORTCUT_KEYS.length) {
      let matches = true;
      for (let i = 0; i < SHORTCUT_KEYS.length; i++) {
        if (sequence[i] !== SHORTCUT_KEYS[i]) {
          matches = false;
          break;
        }
      }
      
      if (matches) {
        // Trigger your easter egg
        window.dispatchEvent(new CustomEvent('my-easter-egg-activated'));
        sequence = [];
      }
    }
  });
}

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
  initMyEasterEgg();
}
```

#### For Toggle Features (like Weird Mode)

Create a new file in `src/lib/`:

```typescript
// src/lib/myToggle.ts

export function initMyToggle(): void {
  const toggle = document.getElementById('my-toggle');
  const target = document.body; // or a specific element
  
  if (toggle) {
    const isActive = localStorage.getItem('my-toggle') === 'true';
    
    if (isActive) {
      target.classList.add('my-toggle-active');
      toggle.setAttribute('aria-pressed', 'true');
    }
    
    toggle.addEventListener('click', () => {
      const isActive = target.classList.toggle('my-toggle-active');
      toggle.setAttribute('aria-pressed', String(isActive));
      localStorage.setItem('my-toggle', String(isActive));
      
      // Additional logic when toggled
    });
  }
}
```

### Step 3: Integrate Your Easter Egg

#### For Components

Import and use in the relevant page:

```astro
---
import MyEasterEgg from '../components/MyEasterEgg.astro';
---

<BaseLayout>
  <!-- page content -->
  <MyEasterEgg />
</BaseLayout>
```

#### For Keyboard Shortcuts

Import in `src/layouts/BaseLayout.astro` or the relevant page:

```astro
<script>
  import '../lib/myEasterEgg';
</script>
```

Then listen for the event where needed:

```astro
<script>
  window.addEventListener('my-easter-egg-activated', () => {
    // Show your easter egg UI
  });
</script>
```

#### For Toggles

Add the toggle button to your page:

```astro
<button
  id="my-toggle"
  class="btn btn-secondary"
  aria-pressed="false"
  aria-label="Toggle my feature"
>
  My Toggle
</button>

<script>
  import { initMyToggle } from '../lib/myToggle';
  initMyToggle();
</script>
```

### Step 4: Style Your Easter Egg

Add styles in the component or in `src/global.css`:

```css
.my-toggle-active {
  /* Your styles here */
  filter: hue-rotate(90deg);
}
```

## How to Update Existing Easter Eggs

### Updating Konami Code

1. Open `src/lib/konami.ts`
2. Modify the `KONAMI_CODE` array to change the sequence
3. Update `src/components/KonamiOverlay.astro` to change the message/content

### Updating Bear-Bear

1. Open `src/components/BearBear.astro`
2. Change the `Math.random() > 0.7` threshold to adjust appearance probability
3. Modify the SVG or content to change appearance
4. Update the modal content for the lore

### Updating Quick Facts Tooltips

1. Open `src/components/QuickFacts.astro`
2. Modify the `facts` array to add/remove/change facts
3. Add `easterEgg` property to any fact to enable tooltip

### Updating Weird Mode

1. Open `src/lib/weirdMode.ts` to change toggle behavior
2. Open `src/pages/ai.astro` to modify the styles in the `<style>` block

### Updating Terminal Commands

1. Open `src/lib/terminalCommands.ts`
2. Add new commands to the `commands` array:

```typescript
{
  name: 'my-command',
  description: 'Description of what it does',
  handler: (args: string[]) => {
    return 'Output text here';
  },
},
```

## Best Practices

### Accessibility

- Always include `aria-label` or `aria-labelledby` for interactive elements
- Use semantic HTML (`role="button"`, `role="dialog"`, etc.)
- Ensure keyboard navigation works (Tab, Enter, Escape)
- Don't rely solely on color to convey information

### User Experience

- Make easter eggs discoverable but not intrusive
- Provide clear ways to dismiss/close easter eggs
- Use appropriate z-index values to ensure visibility
- Consider mobile users (touch events, viewport size)

### Performance

- Use event delegation when possible
- Debounce rapid interactions
- Clean up event listeners when components unmount
- Consider lazy loading for heavy easter eggs

### Code Organization

- Keep easter egg logic in separate files when complex
- Use consistent naming conventions
- Document what triggers the easter egg
- Add comments explaining the purpose

## Testing Your Easter Egg

1. **Functionality**: Test that the easter egg triggers correctly
2. **Accessibility**: Test with keyboard navigation and screen readers
3. **Responsive**: Test on different screen sizes
4. **Performance**: Check that it doesn't slow down the page
5. **Browser compatibility**: Test in different browsers

## Troubleshooting

**Problem**: Easter egg doesn't trigger  
**Solution**: 
- Check browser console for errors
- Verify event listeners are attached
- Ensure the trigger condition is met
- Check that the component is rendered

**Problem**: Easter egg appears but doesn't work  
**Solution**:
- Verify JavaScript is executing
- Check that DOM elements exist when script runs
- Ensure event handlers are properly attached
- Look for JavaScript errors in console

**Problem**: Styles don't apply  
**Solution**:
- Check Tailwind classes are correct
- Verify custom CSS is loaded
- Check for CSS specificity issues
- Ensure classes are applied to the right elements

---

## Next Steps

- Read the [Easter Eggs Explanation](../docs/EASTER-EGGS-EXPLANATION.md) to understand the design rationale
- Check the [Reference](../docs/REFERENCE.md) for technical details
- Review existing easter eggs for inspiration

