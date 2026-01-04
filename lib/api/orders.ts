

import type { OrderPayload } from '@/app/checkout/page';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface OrderResponse {
  success: boolean;
  orderId: string;
  message?: string;
}


export async function createOrder(order: OrderPayload): Promise<OrderResponse> {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to create order');
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

