---
layout: ../../layouts/DSDLayout.astro
title: "Navigation Patterns & Component Classification"
description: "Learn how to navigate codebases efficiently and classify components correctly."
currentPath: "/dsd/navigation"
---

## Learning Objectives

By the end of this module, you will be able to:

- Navigate codebases efficiently using established patterns
- Classify components correctly (Zombie, Brain, Hybrid)
- Trace data flow through the architecture

## Finding Logic

### Pattern: View → Hook/Store → Logic File

When you need to find where logic lives:

1. **Start at the View** (brain boundary)
2. **Follow imports** to hooks or stores
3. **Find the logic file** that contains the actual implementation

**Example:**
```
ProductsView.tsx
  → imports useProducts
  → useProducts.ts
    → imports productService
    → productService.ts (LOGIC)
```

**Clicks:** 3 clicks ✅

### Exercise: Trace Logic Path

Given this structure, find where product filtering logic lives:

```
ProductsView.tsx
  → imports useProducts
  → imports ProductList
  → useProducts.ts
    → imports productService
    → productService.ts
      → filterProducts() (LOGIC FOUND)
```

**Path:** ProductsView → useProducts → productService → filterProducts (3 clicks) ✅

## Finding UI

### Pattern: View → Component Import → Component File

When you need to find UI components:

1. **Start at the View**
2. **Follow component imports**
3. **Find the component file**

**Example:**
```
ProductsView.tsx
  → imports ProductCard
  → ProductCard.tsx (UI FOUND)
```

**Clicks:** 2 clicks ✅

### Exercise: Find UI Component

Given this structure, find where the product card UI is defined:

```
ProductsView.tsx
  → imports ProductList
  → ProductList.tsx
    → imports ProductCard
    → ProductCard.tsx (UI FOUND)
```

**Path:** ProductsView → ProductList → ProductCard (2 clicks) ✅

## Tracing Data Flow

### Complete User Action Journey

Understanding how data flows helps you debug and understand the system:

```
User Action
  → Component Callback
    → Brain Handler
      → API/Logic
        → State Update
          → Props
            → UI Update
```

**Example: Adding to Cart**

```tsx
// 1. User Action
<ProductCard onClick={handleAddToCart} />

// 2. Component Callback
function ProductCard({ onClick }) {
  return <button onClick={onClick}>Add to Cart</button>;
}

// 3. Brain Handler
function ProductsView() {
  const { addToCart } = useCart();
  
  const handleAddToCart = (productId) => {
    addToCart(productId); // 4. API/Logic
  };
  
  return <ProductCard onClick={handleAddToCart} />;
}

// 4. API/Logic
function useCart() {
  const [cart, setCart] = useState([]);
  
  const addToCart = (productId) => {
    // API call
    api.addToCart(productId).then(() => {
      setCart([...cart, productId]); // 5. State Update
    });
  };
  
  return { cart, addToCart };
}

// 5. Props → UI Update
function CartView() {
  const { cart } = useCart();
  return <div>{cart.length} items</div>; // 6. UI Update
}
```

### Exercise: Trace Complete Flow

Trace the flow for "filtering products by category":

1. **User Action**: Selects category from dropdown
2. **Component Callback**: `onCategoryChange` fired
3. **Brain Handler**: `handleCategoryChange` in ProductsView
4. **API/Logic**: `filterProductsByCategory` called
5. **State Update**: Filtered products stored in state
6. **Props**: Filtered products passed to ProductList
7. **UI Update**: ProductList re-renders with filtered products

## Component Classification Guide

### 🟢 Zombies (UI Components)

**Characteristics:**
- Pure render functions
- Props in, markup out
- No state (unless purely presentational)
- No effects
- No API calls
- Easy to test

**Examples:**
- `CustomerDetailsPanel`
- `TransactionsTable`
- `Button`
- `Card`
- `Input`

**Code Pattern:**
```tsx
function CustomerCard({ customer }) {
  return (
    <div>
      <h3>{customer.name}</h3>
      <p>{customer.email}</p>
    </div>
  );
}
```

### 🧠 Brains (Logic Components)

**Characteristics:**
- State management
- Business rules
- API orchestration
- Side effects
- Data transformation

**Examples:**
- `PaymentsOpsDashboard` (brain boundary)
- `useKycEngine` (hook)
- `kycRules.v1` (pure logic)

**Code Pattern:**
```tsx
function useCustomerData(customerId) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchCustomer(customerId)
      .then(data => {
        setCustomer(data);
        setLoading(false);
      });
  }, [customerId]);
  
  return { customer, loading };
}
```

### 🟡 Hybrid (Justified Exceptions)

**Characteristics:**
- Minimal integration logic
- Event bridging
- Configuration UI
- Feature flags

**Examples:**
- `CustomerSearch` (needs local input state)
- `FeatureFlagsPanel` (configuration UI)

**Code Pattern:**
```tsx
function CustomerSearch({ onSearch }) {
  const [query, setQuery] = useState(''); // Local UI state only
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query); // Delegates to brain
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}
```

### Classification Exercise

Classify these components:

1. **`ProductCard`** - Displays product info
   - 🟢 **Zombie** (pure presentation)

2. **`useProducts`** - Fetches products from API
   - 🧠 **Brain** (logic/hook)

3. **`ProductSearch`** - Search input with local state
   - 🟡 **Hybrid** (minimal local state for UI)

4. **`Button`** - Renders a button
   - 🟢 **Zombie** (pure presentation)

5. **`ProductsView`** - Orchestrates product display
   - 🧠 **Brain** (brain boundary/orchestration)

6. **`formatPrice`** - Formats number as currency
   - 🧠 **Brain** (pure logic function)

7. **`CartItem`** - Displays cart item
   - 🟢 **Zombie** (pure presentation)

8. **`useCart`** - Manages cart state
   - 🧠 **Brain** (state management)

## Directory Structure Patterns

### Recommended Structure

```
src/
  components/          # Global reusable zombies
    Button.tsx
    Card.tsx
    Input.tsx
  
  logic/               # Pure brains (rules, hooks)
    useProducts.ts
    useCart.ts
    productRules.ts
  
  state/               # Brain state (stores)
    cartStore.ts
    userStore.ts
  
  views/               # Brain boundaries (orchestration)
    ProductsView.tsx
    CartView.tsx
    
    feature/           # Feature folder
      components/      # Feature zombies
        ProductCard.tsx
        CartItem.tsx
      FeatureView.tsx # Brain boundary
```

### Feature-Based Structure

```
src/
  features/
    products/
      ProductList.tsx      # Brain boundary
      ProductCard.tsx      # Zombie
      useProducts.ts       # Brain hook
      productService.ts    # Brain logic
      productUtils.ts      # Brain utilities
    
    cart/
      CartView.tsx         # Brain boundary
      CartItem.tsx         # Zombie
      useCart.ts           # Brain hook
      cartService.ts       # Brain logic
```

### Exercise: Design Directory Structure

Design a directory structure for a "User Management" feature:

**Requirements:**
- User list view
- User detail view
- User creation form
- User editing form
- User deletion

**Your structure:**
```
features/
  users/
    UsersView.tsx          # Brain boundary (list)
    UserDetailView.tsx     # Brain boundary (detail)
    UserForm.tsx           # Zombie (form UI)
    UserCard.tsx           # Zombie (card UI)
    UserList.tsx           # Zombie (list UI)
    useUsers.ts            # Brain hook
    useUser.ts             # Brain hook (single user)
    userService.ts         # Brain logic
    userValidation.ts      # Brain logic
```

## Interactive Exercise: Classify Components

Given this codebase, classify each component:

```tsx
// Component 1
function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}
// Classification: 🟢 Zombie

// Component 2
function useProducts() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(setProducts);
  }, []);
  return products;
}
// Classification: 🧠 Brain

// Component 3
function ProductCard({ product }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>{product.price}</p>
    </div>
  );
}
// Classification: 🟢 Zombie

// Component 4
function ProductSearch({ onSearch }) {
  const [query, setQuery] = useState('');
  return (
    <input
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
      }}
    />
  );
}
// Classification: 🟡 Hybrid (minimal local state)

// Component 5
function ProductsView() {
  const products = useProducts();
  const [filter, setFilter] = useState('all');
  const filtered = products.filter(p => filter === 'all' || p.category === filter);
  return (
    <div>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="electronics">Electronics</option>
      </select>
      {filtered.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
// Classification: 🧠 Brain (orchestration)
```

## Guided Thought Experiment: Design Directory Structure

**Scenario:** You're building a new e-commerce feature with:
- Product browsing
- Shopping cart
- Checkout process
- Order history

**Questions to consider:**
1. What are the brain boundaries? (Views that orchestrate)
2. What are the zombies? (Pure UI components)
3. What logic needs to be extracted? (Hooks, services, utilities)
4. How do features relate? (Shared components vs feature-specific)

**Design your structure, then compare:**

```
features/
  products/
    ProductsView.tsx
    ProductCard.tsx
    ProductList.tsx
    useProducts.ts
    productService.ts
  
  cart/
    CartView.tsx
    CartItem.tsx
    useCart.ts
    cartService.ts
  
  checkout/
    CheckoutView.tsx
    CheckoutForm.tsx
    useCheckout.ts
    checkoutService.ts
  
  orders/
    OrdersView.tsx
    OrderCard.tsx
    useOrders.ts
    orderService.ts

components/  # Shared zombies
  Button.tsx
  Card.tsx
  Input.tsx
```

## Creative Application Task

Map navigation paths in your own codebase (or a sample):

**Task:**
1. Pick a feature
2. Identify the brain boundary
3. Trace paths from UI to logic
4. Count clicks (should be ≤3)
5. Classify all components
6. Document the structure

**Template:**
```
Feature: [Name]

Brain Boundaries:
  - [Component] (orchestrates [what])

Zombies:
  - [Component] (displays [what])

Brains:
  - [Hook/Service] (handles [what])

Navigation Paths:
  [UI] → [Brain] ([X] clicks)

Classification:
  Zombies: [X]
  Brains: [Y]
  Hybrids: [Z]
  Ratio: [X:Y] ([meets/doesn't meet] 7:1 target)
```

## Key Takeaways

- **Finding Logic**: View → Hook/Store → Logic File (≤3 clicks)
- **Finding UI**: View → Component Import → Component File (≤2 clicks)
- **Tracing Data Flow**: User Action → Callback → Handler → Logic → State → Props → UI
- **Classification**: Zombies (UI), Brains (Logic), Hybrids (Exceptions)
- **Structure**: Organize by feature, co-locate related code

## Next Steps

Continue to [Putting It All Together](/dsd/practice) to apply all rules in real-world scenarios.
