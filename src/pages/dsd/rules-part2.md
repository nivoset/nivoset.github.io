---
layout: ../../layouts/DSDLayout.astro
title: "The Core Rules - Part 2"
description: "Learn rules 4-6: Trial of Three Strains, No Tunnels, and the Coffin Rule (co-location)."
currentPath: "/dsd/rules-part2"
---

## Learning Objectives

By the end of this module, you will be able to:

- Design robust interfaces using the Trial of Three Strains
- Avoid prop drilling with explicit prop patterns
- Apply co-location principles effectively

## Rule 4: Trial of the Three Strains

### The Rule

- **Process**: Design 3 distinct interface contracts
- **Test**: Against 3 different scenarios (happy, failure, async)
- **Document**: Record decision in ADR (Architecture Decision Record)

### Analogy: Testing a Bridge

Before building a bridge, engineers test it with different loads:
- **Normal load**: Expected daily traffic
- **Maximum load**: Rush hour traffic
- **Failure scenario**: What happens if a support fails?

Similarly, design your interfaces to handle:
- **Happy path**: Everything works as expected
- **Failure path**: What happens when things go wrong
- **Async path**: Loading states and delayed responses

### Why Three Strains?

Designing for three scenarios helps you:
- Discover edge cases early
- Create more robust interfaces
- Avoid breaking changes later
- Build confidence in your design

### Exercise: Design 3 Interface Contracts

**Scenario:** Design an interface for fetching user data

**Strain 1: Happy Path**
```tsx
interface UserData {
  id: string;
  name: string;
  email: string;
}

function useUserData(userId: string): UserData {
  // Returns user data immediately
}
```

**Strain 2: Failure Path**
```tsx
interface UserDataResult {
  data: UserData | null;
  error: Error | null;
  loading: boolean;
}

function useUserData(userId: string): UserDataResult {
  // Handles errors gracefully
}
```

**Strain 3: Async Path**
```tsx
interface UserDataState {
  data: UserData | null;
  loading: boolean;
  error: Error | null;
}

function useUserData(userId: string): UserDataState {
  // Handles loading states
}
```

**Final Design:** Combine all three:
```tsx
interface UserDataState {
  data: UserData | null;
  loading: boolean;
  error: Error | null;
}

function useUserData(userId: string): UserDataState {
  // Handles happy, failure, and async paths
}
```

### Role-Play: Act Out Scenarios

**Scenario 1: Happy Path**
- User clicks "Load Profile"
- Data loads successfully
- Profile displays immediately

**Scenario 2: Failure Path**
- User clicks "Load Profile"
- API returns 404
- Error message displays
- User can retry

**Scenario 3: Async Path**
- User clicks "Load Profile"
- Loading spinner shows
- Data loads after 2 seconds
- Profile displays

**Question:** Does your interface handle all three?

---

## Rule 5: No Tunnels

### The Rule

- **Avoid**: Prop drilling through 3+ layers
- **Prefer**: Explicit props from brain boundary
- **Context**: Use sparingly for deep trees with stable values

### Analogy: Underground Tunnels vs Direct Paths

Prop drilling is like digging tunnels underground — you can't see where data flows. Explicit props are like direct paths — clear and visible.

- **Tunnels (Bad)**: Data flows through many layers invisibly
- **Direct Paths (Good)**: Data flows directly from source to destination

### Why Avoid Prop Drilling?

Prop drilling causes:
- Hard to trace data flow
- Components receive props they don't use
- Difficult to refactor
- Tight coupling between layers

### Exercise: Refactor Prop Drilling Code

**Before (Prop Drilling):**
```tsx
// ❌ Prop drilling through 4 layers
function App() {
  const user = { id: '1', name: 'John' };
  return <Dashboard user={user} />;
}

function Dashboard({ user }) {
  return <UserSection user={user} />;
}

function UserSection({ user }) {
  return <UserProfile user={user} />;
}

function UserProfile({ user }) {
  return <UserCard user={user} />;
}

function UserCard({ user }) {
  return <div>{user.name}</div>;
}
```

**After (Explicit Props):**
```tsx
// ✅ Explicit props from brain boundary
function App() {
  const user = { id: '1', name: 'John' };
  return <DashboardView />;
}

function DashboardView() {
  const user = useUser(); // Brain boundary
  return (
    <Dashboard>
      <UserSection>
        <UserProfile>
          <UserCard user={user} /> {/* Direct from boundary */}
        </UserProfile>
      </UserSection>
    </Dashboard>
  );
}

function UserCard({ user }) {
  return <div>{user.name}</div>;
}
```

### Quiz: Identify When Context is Appropriate

When should you use Context instead of props?

1. ✅ **Theme values** (stable, used everywhere)
2. ✅ **Authentication state** (stable, deep tree)
3. ❌ **Form data** (changes frequently, shallow tree)
4. ❌ **API response data** (changes frequently)
5. ✅ **Feature flags** (stable configuration)

**Rule of thumb:** Use Context for stable values that need to be deeply nested. Use props for data that changes frequently.

### When Context Makes Sense

```tsx
// ✅ Good use of Context: Theme (stable, deep)
<ThemeProvider>
  <App>
    <Dashboard>
      <Component>
        <DeepComponent /> {/* Needs theme */}
      </Component>
    </Dashboard>
  </App>
</ThemeProvider>

// ❌ Bad use of Context: User data (changes frequently)
<UserProvider>
  <App>
    <Dashboard user={user} /> {/* Should use props */}
  </App>
</UserProvider>
```

---

## Rule 6: Coffin Rule (Co-location)

### The Rule

- **Principle**: Related code lives together
- **If**: Only used together → keep together
- **Split**: By responsibility, not ritual

### Analogy: Keeping Tools in the Same Toolbox

When working on a project, you keep related tools together:
- **Screws and screwdrivers**: Same toolbox
- **Paint and brushes**: Same area
- **Measuring tape and level**: Same drawer

Similarly, keep related code together:
- **Component and its styles**: Same file or folder
- **Hook and its tests**: Same directory
- **Utils used by one feature**: With that feature

### Why Co-location?

Co-location helps you:
- Find related code quickly
- Understand feature boundaries
- Reduce cognitive load
- Make refactoring easier

### Exercise: Reorganize Scattered Code

**Before (Scattered):**
```
src/
  components/
    Button.tsx
    Card.tsx
  hooks/
    useProducts.ts
  utils/
    formatPrice.ts
    calculateTotal.ts
  features/
    products/
      ProductList.tsx
```

**After (Co-located):**
```
src/
  components/
    Button.tsx
    Card.tsx
  features/
    products/
      ProductList.tsx
      useProducts.ts
      formatPrice.ts
      calculateTotal.ts
```

**Benefits:**
- All product-related code in one place
- Easier to find and modify
- Clear feature boundaries

### Thought Experiment: When Should Code Be Split?

**Scenario 1: Shared Utility**
```tsx
// Used by multiple features
function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
```
**Decision:** Keep in shared `utils/` folder

**Scenario 2: Feature-Specific Utility**
```tsx
// Only used by products feature
function calculateProductDiscount(product: Product): number {
  // Complex product-specific logic
}
```
**Decision:** Keep with products feature

**Scenario 3: Component Used Everywhere**
```tsx
// Used across entire app
function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}
```
**Decision:** Keep in shared `components/` folder

**Rule:** If it's only used together, keep it together. If it's shared, put it in a shared location.

### Co-location Patterns

**Pattern 1: Feature Folder**
```
features/
  products/
    ProductList.tsx
    ProductCard.tsx
    useProducts.ts
    productUtils.ts
```

**Pattern 2: Component Folder**
```
components/
  ProductCard/
    ProductCard.tsx
    ProductCard.test.tsx
    ProductCard.styles.css
```

**Pattern 3: Hook Folder**
```
hooks/
  products/
    useProducts.ts
    useProductFilters.ts
    productHooks.test.ts
```

## Creative Application Task

Refactor this code to follow all three rules:

```tsx
// Current structure (violates all three rules)
function App() {
  const [products, setProducts] = useState([]);
  return <ProductPage products={products} />;
}

function ProductPage({ products }) {
  return <ProductList products={products} />;
}

function ProductList({ products }) {
  return products.map(p => <ProductCard product={p} />);
}

function ProductCard({ product }) {
  // Uses formatPrice from distant utils folder
  return <div>{formatPrice(product.price)}</div>;
}
```

**Your task:**
1. Design interface for 3 scenarios (happy, failure, async)
2. Eliminate prop drilling
3. Co-locate related code

## Key Takeaways

- **Trial of Three Strains**: Design interfaces for happy, failure, and async paths
- **No Tunnels**: Avoid prop drilling; use explicit props or Context appropriately
- **Coffin Rule**: Keep related code together; split by responsibility, not ritual

## Next Steps

Continue to [Rules Part 3](/dsd/rules-part3) to learn about naming conventions and maintaining clean codebases.
