# API Structure Guide for Next.js E-commerce App

## 📁 Current API Files Location

### 1. **External API Client Functions** (Current)
**Location:** `lib/productsApi.ts`

This file contains functions that call **external APIs** (like Fake Store API):
- `fetchProducts()` - Fetches all products from external API
- `fetchProduct(id)` - Fetches a single product from external API

**Usage:** These are used in Server Components and Client Components to fetch data from external sources.

---

## 📂 Where to Place Different Types of APIs

### 2. **Next.js API Routes** (Backend Endpoints)
**Location:** `app/api/` directory

Next.js API routes are server-side endpoints that run on your server. Create them like this:

```
app/
  api/
    products/
      route.ts          # GET /api/products
    products/
      [id]/
        route.ts        # GET /api/products/[id]
    orders/
      route.ts          # POST /api/orders
    cart/
      route.ts          # GET/POST /api/cart
```

**Example:** `app/api/orders/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Process order
    // Save to database
    return NextResponse.json({ success: true, orderId: '123' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
```

---

### 3. **API Client Utilities** (Recommended Structure)
**Location:** `lib/api/` directory

For better organization, you can create separate API client files:

```
lib/
  api/
    products.ts        # Product-related API calls
    orders.ts          # Order-related API calls
    cart.ts            # Cart-related API calls
    auth.ts            # Authentication API calls
```

**Example:** `lib/api/orders.ts`
```typescript
import type { OrderPayload } from '@/app/checkout/page';

export async function createOrder(order: OrderPayload) {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create order');
  }
  
  return response.json();
}
```

---

## 🗂️ Recommended Project Structure

```
ecommerce-app/
├── app/
│   ├── api/                    # Next.js API Routes (Backend)
│   │   ├── products/
│   │   │   └── route.ts
│   │   ├── orders/
│   │   │   └── route.ts
│   │   └── cart/
│   │       └── route.ts
│   ├── components/             # React Components
│   ├── product/
│   ├── checkout/
│   └── page.tsx
│
├── lib/
│   ├── api/                    # API Client Functions (Frontend)
│   │   ├── products.ts         # External API calls
│   │   ├── orders.ts           # Order API calls
│   │   └── cart.ts             # Cart API calls
│   ├── productsApi.ts          # Current: External API client
│   ├── store.ts                # Redux store
│   └── utils/                  # Utility functions
│
└── types/                      # TypeScript types (optional)
    ├── product.ts
    └── order.ts
```

---

## 📝 Examples

### Example 1: Create Order API Route
**File:** `app/api/orders/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    // Validate order data
    // Save to database
    // Send confirmation email
    
    return NextResponse.json(
      { success: true, orderId: 'ORD-12345' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
```

### Example 2: API Client Function
**File:** `lib/api/orders.ts`
```typescript
import type { OrderPayload } from '@/app/checkout/page';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function createOrder(order: OrderPayload) {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create order');
  }

  return response.json();
}

export async function getOrder(orderId: string) {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch order');
  }
  
  return response.json();
}
```

### Example 3: Use in Component
**File:** `app/checkout/page.tsx`
```typescript
import { createOrder } from '@/lib/api/orders';

// In your handlePlaceOrder function:
const result = await createOrder(orderPayload);
console.log('Order created:', result.orderId);
```

---

## 🔑 Key Points

1. **External APIs** → `lib/productsApi.ts` or `lib/api/` folder
2. **Next.js API Routes** → `app/api/` folder (backend endpoints)
3. **API Client Functions** → `lib/api/` folder (frontend API calls)
4. **Types** → `lib/types/` or `types/` folder (TypeScript definitions)

---

## 🚀 Quick Start

To add a new API:

1. **For External API calls:**
   - Add functions to `lib/productsApi.ts` or create `lib/api/[feature].ts`

2. **For Backend API routes:**
   - Create `app/api/[route]/route.ts`
   - Export GET, POST, PUT, DELETE functions

3. **For API client functions:**
   - Create `lib/api/[feature].ts`
   - Export functions that call your API routes

