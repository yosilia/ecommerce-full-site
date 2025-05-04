import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus:       200,
  duration:  '2m',
  thresholds: {
    http_req_duration: ['p(95)<500'], // target for Chapter 6
  },
};

// ← switch to HTTP for localhost, or point at your staging domain
const BASE       = __ENV.BASE_URL    || 'http://localhost:3000';
// ← set this before you run: export PRODUCT_ID=ocean-sovereign-agbada)
const PRODUCT_ID = __ENV.PRODUCT_ID  || 'ocean-sovereign-agbada';

export default function () {
  // 1. Home page
  let res = http.get(`${BASE}/`);
  check(res, { 'status 200': r => r.status === 200 });

  // 2. Browse a real product (slug or ID)
  res = http.get(`${BASE}/product/${PRODUCT_ID}`);
  check(res, { 'product OK': r => r.status === 200 });

  // 3. Add to cart
  res = http.post(
    `${BASE}/api/cart`,
    JSON.stringify({ id: PRODUCT_ID, qty: 1 }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(res, { 'added to cart': r => r.status === 200 });

  // 4. Checkout (Stripe test mode)
  res = http.post(
    `${BASE}/api/checkout`,
    JSON.stringify({ token: 'tok_visa' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(res, { 'checkout OK': r => r.status === 200 });

  sleep(1);
}
