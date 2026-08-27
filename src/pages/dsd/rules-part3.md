---
layout: ../../layouts/DSDLayout.astro
title: "The Core Rules - Part 3"
description: "Learn rules 7-8: No Unnamed Survivors and Silence the Living."
currentPath: "/dsd/rules-part3"
---

## Learning Objectives

By the end of this module, you will be able to:

- Name files with clear, purposeful intent
- Maintain clean codebases without console statements or warnings
- Apply naming conventions consistently

## Rule 7: No Unnamed Survivors

### The Rule

- **Bad**: `utils.ts`, `helpers.ts`, `common.ts`, `index.ts`
- **Good**: `useCustomerFilters.ts`, `applyRiskRules.ts`, `AccountCard.tsx`
- **Test**: Can you tell what's inside without opening it?

### Analogy: Library Organization

Imagine a library organized like this:
- **Bad**: "Misc Books", "Stuff", "Things"
- **Good**: "Fiction", "Non-Fiction", "Science", "History"

You can find what you need without opening every drawer. Similarly, file names should tell you what's inside.

### Why Specific Names?

Specific names help you:
- Find code quickly
- Understand purpose without reading
- Avoid duplicate functionality
- Navigate codebase efficiently

### Exercise: Rename Generic Files

**Before (Generic):**
```
utils.ts
helpers.ts
common.ts
index.ts
```

**After (Specific):**
```
useCustomerFilters.ts
applyRiskRules.ts
formatCurrency.ts
validateEmail.ts
```

**Process:**
1. Open the generic file
2. Identify what each function does
3. Group related functions
4. Create specific files for each group
5. Update imports

### Quiz: "Can You Tell What's Inside?"

Look at these file names. Can you tell what's inside without opening them?

1. `utils.ts` ❌ (Too generic)
2. `customerUtils.ts` ⚠️ (Better, but still vague)
3. `useCustomerFilters.ts` ✅ (Clear purpose)
4. `helpers.ts` ❌ (Too generic)
5. `formatCustomerName.ts` ✅ (Specific function)
6. `common.ts` ❌ (Too generic)
7. `calculateOrderTotal.ts` ✅ (Specific function)
8. `index.ts` ⚠️ (OK if it's just re-exports)

**Rule:** If you can't tell what's inside, rename it.

### Naming Patterns

**Hooks:**
- ✅ `useCustomerData.ts`
- ✅ `useProductFilters.ts`
- ❌ `hooks.ts`

**Components:**
- ✅ `CustomerCard.tsx`
- ✅ `ProductList.tsx`
- ❌ `components.tsx`

**Utils:**
- ✅ `formatCurrency.ts`
- ✅ `validateEmail.ts`
- ❌ `utils.ts`

**Stores/State:**
- ✅ `customerStore.ts`
- ✅ `cartState.ts`
- ❌ `store.ts`

### The Index File Exception

`index.ts` files are OK if they only re-export:

```tsx
// ✅ Good: index.ts as re-export
// features/products/index.ts
export { ProductList } from './ProductList';
export { ProductCard } from './ProductCard';
export { useProducts } from './useProducts';

// ❌ Bad: index.ts with actual code
// features/products/index.ts
export function formatPrice() { ... }
export function calculateTotal() { ... }
```

**Better:**
```
features/products/
  index.ts (re-exports only)
  ProductList.tsx
  ProductCard.tsx
  useProducts.ts
  formatPrice.ts
  calculateTotal.ts
```

---

## Rule 8: Silence the Living

### The Rule

- **No**: Console statements in production code
- **No**: Warnings in build/lint
- **Yes**: Document exceptions if you must break silence

### Analogy: Professional Kitchen

A professional kitchen runs quietly:
- **No unnecessary noise**: Focus on cooking
- **Clear communication**: Only when needed
- **Clean workspace**: No clutter

Similarly, your codebase should be quiet:
- **No console.log**: Use proper logging or remove
- **No warnings**: Fix or suppress intentionally
- **Clean output**: Easy to spot real issues

### Why Silence?

Silence helps you:
- Spot real issues quickly
- Maintain professional codebase
- Avoid information overload
- Improve debugging experience

### Exercise: Clean Up Console Statements

**Before (Noisy):**
```tsx
function processOrder(order) {
  console.log('Processing order:', order);
  console.log('Order ID:', order.id);
  
  const total = calculateTotal(order);
  console.log('Total:', total);
  
  if (total > 1000) {
    console.warn('Large order detected!');
  }
  
  return submitOrder(order);
}
```

**After (Silent):**
```tsx
function processOrder(order) {
  // Use proper logging in production
  logger.info('Processing order', { orderId: order.id });
  
  const total = calculateTotal(order);
  
  if (total > 1000) {
    logger.warn('Large order detected', { orderId: order.id, total });
  }
  
  return submitOrder(order);
}
```

**Or remove entirely if not needed:**
```tsx
function processOrder(order) {
  const total = calculateTotal(order);
  return submitOrder(order);
}
```

### Handling Warnings

**Before (Warnings):**
```tsx
// ESLint warning: 'user' is assigned but never used
const user = fetchUser();
const products = fetchProducts();
```

**After (Fixed):**
```tsx
// Remove unused variable
const products = fetchProducts();
```

**Or if intentionally unused:**
```tsx
// Intentionally unused - will be used in future feature
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const user = fetchUser();
const products = fetchProducts();
```

### Simulation: Code Review for "Silence" Violations

Review this code and identify violations:

```tsx
function UserProfile({ userId }) {
  console.log('Rendering user profile for:', userId);
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    console.log('Fetching user data...');
    fetch(`/api/users/${userId}`)
      .then(res => {
        console.log('Response received:', res);
        return res.json();
      })
      .then(data => {
        console.log('User data:', data);
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching user:', err);
        setLoading(false);
      });
  }, [userId]);
  
  if (loading) {
    console.log('Loading...');
    return <div>Loading...</div>;
  }
  
  console.log('Rendering user:', user);
  return <div>{user.name}</div>;
}
```

**Violations Found:**
- 8 console.log statements
- 1 console.error (should use proper logging)
- All should be removed or replaced with proper logging

**Fixed Version:**
```tsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        logger.error('Error fetching user', { userId, error: err });
        setLoading(false);
      });
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  
  return <div>{user.name}</div>;
}
```

### When Exceptions Are OK

Sometimes you need to break silence, but document it:

```tsx
// Exception: Console.log needed for debugging production issue
// TODO: Remove after issue #123 is resolved
console.log('Debug info:', { userId, timestamp: Date.now() });
```

Or use proper logging:

```tsx
// Development-only logging
if (process.env.NODE_ENV === 'development') {
  logger.debug('User action', { userId, action: 'click' });
}
```

### Build Warnings

**Check for warnings:**
```bash
npm run build
npm run lint
```

**Fix all warnings before committing:**
- Fix the issue
- Or intentionally suppress with comment
- Never ignore warnings

## Creative Application Task

Audit this codebase structure and fix violations:

```
src/
  utils.ts              ❌ Generic name
  helpers.ts            ❌ Generic name
  common.ts             ❌ Generic name
  components/
    Button.tsx          ✅ Good
    Card.tsx            ✅ Good
  hooks/
    hooks.ts            ❌ Generic name
  features/
    products/
      index.ts         ⚠️ Check if it's just re-exports
      ProductList.tsx   ✅ Good
```

**Your task:**
1. Identify generic file names
2. Rename them to be specific
3. Check for console statements
4. Fix any warnings

## Key Takeaways

- **No Unnamed Survivors**: Use specific, descriptive file names
- **Silence the Living**: Remove console statements and fix warnings
- **Test**: Can you tell what's inside without opening the file?

## Next Steps

Continue to [Navigation Patterns](/dsd/navigation) to learn about navigating codebases and classifying components.
