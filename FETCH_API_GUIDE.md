# Where to Place Fetch API Calls in Next.js

## 📍 Current Structure in Your Project

### ✅ **Current Location: `lib/productsApi.ts`**
This is where your fetch API calls are currently placed for external APIs.

---

## 🗂️ Where to Place Fetch API Calls

### 1. **External API Calls (Third-party APIs)**
**Location:** `lib/productsApi.ts` or `lib/api/[feature].ts`

**Example:** Fetching from Fake Store API, Stripe, etc.

```typescript
// lib/productsApi.ts (Current)
const BASE_URL = "https://fakestoreapi.com";

export async function fetchProducts() {
  const res = await fetch(`${BASE_URL}/products`);
  return res.json();
}
```

**When to use:**
- ✅ Server Components (async/await)
- ✅ Client Components (useEffect)
- ✅ API Routes (server-side)

---

### 2. **Your Own Next.js API Routes**
**Location:** `lib/api/[feature].ts` (API Client Functions)

**Example:** Calling your own `/api/orders` endpoint

```typescript
// lib/api/orders.ts
export async function createOrder(orderData) {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  return res.json();
}
```

**When to use:**
- ✅ Client Components (useEffect, event handlers)
- ✅ Server Components (can call directly)

---

### 3. **Server Component Fetching**
**Location:** Directly in Server Component files

**Example:** `app/product/[id]/page.tsx`

```typescript
// app/product/[id]/page.tsx (Current - Server Component)
export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await fetchProduct(id); // ✅ Can use async/await directly
  
  return <div>{product.title}</div>;
}
```

**When to use:**
- ✅ Server Components only
- ✅ Can use async/await directly
- ✅ No useEffect needed

---

### 4. **Client Component Fetching**
**Location:** Inside `useEffect` or event handlers in Client Components

**Example:** `app/page.tsx` (Current)

```typescript
// app/page.tsx (Current - Client Component)
"use client";

export default function Home() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetchProducts() // ✅ Called from lib/productsApi.ts
      .then(setProducts)
      .catch(console.error);
  }, []);
  
  return <div>...</div>;
}
```

**When to use:**
- ✅ Client Components only
- ✅ Must use useEffect or event handlers
- ✅ Cannot use async/await directly in component

---

## 📂 Complete File Structure

```
ecommerce-app/
├── lib/
│   ├── productsApi.ts          ← ✅ External API fetch calls (Current)
│   │   └── fetchProducts()
│   │   └── fetchProduct()
│   │
│   └── api/                    ← ✅ Your API client functions
│       └── orders.ts
│           └── createOrder()   ← fetch('/api/orders')
│
├── app/
│   ├── api/                    ← ✅ Next.js API Routes (Backend)
│   │   └── orders/
│   │       └── route.ts        ← Server-side code
│   │
│   ├── page.tsx                ← ✅ Client Component (uses fetchProducts)
│   │   └── useEffect(() => fetchProducts())
│   │
│   └── product/
│       └── [id]/
│           └── page.tsx       ← ✅ Server Component (uses fetchProduct)
│               └── const product = await fetchProduct(id)
```

---

## 🎯 Best Practices

### ✅ **DO:**

1. **External APIs** → `lib/productsApi.ts` or `lib/api/[feature].ts`
   ```typescript
   // lib/productsApi.ts
   export async function fetchProducts() {
     const res = await fetch('https://api.example.com/products');
     return res.json();
   }
   ```

2. **Your API Routes** → `lib/api/[feature].ts`
   ```typescript
   // lib/api/orders.ts
   export async function createOrder(data) {
     const res = await fetch('/api/orders', {
       method: 'POST',
       body: JSON.stringify(data),
     });
     return res.json();
   }
   ```

3. **Server Components** → Call fetch functions directly
   ```typescript
   // app/product/[id]/page.tsx
   export default async function Page() {
     const product = await fetchProduct(id); // ✅ Direct call
     return <div>{product.title}</div>;
   }
   ```

4. **Client Components** → Use in useEffect or handlers
   ```typescript
   // app/page.tsx
   "use client";
   useEffect(() => {
     fetchProducts().then(setProducts); // ✅ In useEffect
   }, []);
   ```

### ❌ **DON'T:**

1. ❌ Don't put fetch directly in Client Component body
   ```typescript
   // ❌ WRONG
   "use client";
   export default function Page() {
     const data = await fetch('/api/data'); // ❌ Can't use await here
   }
   ```

2. ❌ Don't mix external API URLs in components
   ```typescript
   // ❌ WRONG - Put in lib/productsApi.ts instead
   useEffect(() => {
     fetch('https://fakestoreapi.com/products') // ❌ Should be in lib file
   }, []);
   ```

---

## 📝 Examples by Use Case

### Example 1: Fetch External API (Current)
**File:** `lib/productsApi.ts`
```typescript
export async function fetchProducts() {
  const res = await fetch('https://fakestoreapi.com/products');
  return res.json();
}
```

### Example 2: Fetch Your API Route
**File:** `lib/api/orders.ts`
```typescript
export async function createOrder(orderData) {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  return res.json();
}
```

### Example 3: Use in Server Component
**File:** `app/product/[id]/page.tsx`
```typescript
import { fetchProduct } from '@/lib/productsApi';

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await fetchProduct(id); // ✅ Direct await
  
  return <div>{product.title}</div>;
}
```

### Example 4: Use in Client Component
**File:** `app/page.tsx`
```typescript
"use client";
import { fetchProducts } from '@/lib/productsApi';

export default function Home() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetchProducts() // ✅ Called in useEffect
      .then(setProducts);
  }, []);
  
  return <div>...</div>;
}
```

### Example 5: Fetch in Event Handler
**File:** `app/checkout/page.tsx`
```typescript
"use client";
import { createOrder } from '@/lib/api/orders';

const handlePlaceOrder = async () => {
  const result = await createOrder(orderData); // ✅ In event handler
  console.log(result);
};
```

---

## 🔑 Summary

| Type | Location | Usage |
|------|----------|-------|
| **External API** | `lib/productsApi.ts` | Server/Client Components |
| **Your API Routes** | `lib/api/[feature].ts` | Server/Client Components |
| **Server Component** | Direct in component | `await fetchFunction()` |
| **Client Component** | In `useEffect` or handler | `fetchFunction().then()` |

---

## ✅ Your Current Setup (Correct!)

1. ✅ External API calls → `lib/productsApi.ts`
2. ✅ Server Component → `app/product/[id]/page.tsx` (uses fetchProduct)
3. ✅ Client Component → `app/page.tsx` (uses fetchProducts in useEffect)

**Everything is correctly placed!** 🎉

