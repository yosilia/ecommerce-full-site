# Full-Stack E-Commerce Website

[Live Demo](https://dmtouch.vercel.app/) | [GitHub Repository](https://github.com/yosilia/ecommerce-full-site)

## Project Overview

This is a fully functional, full-stack e-commerce web application built with React (frontend) and Node.js (backend), deployed on Vercel. The browser supports user authentication, product browsing, cart management, and a secure checkout process with payment integration.

---

## Features

- **User Authentication:** Signup, login, and logout with JWT-based token authentication
- **Product Catalog:** Browse products with categories, search, and detailed product pages
- **Shopping Cart:** Add/remove products, update quantities, and persistent cart data
- **Checkout & Payment:** Integration with Stripe API for secure payments
- **Admin Panel:** Product management (CRUD), order tracking 
- **Responsive Design:** Mobile-friendly UI built with React and CSS
- **State Management:** Uses React Context API / Redux
- **Error Handling & Validation:** Both frontend and backend validation to ensure data integrity

## 🔐 Authentication & Access Control

- Users can **register**, **log in**, and manage their accounts via a secure authentication flow.
- Authentication is handled using **JWT-based tokens** to ensure secure access and session management.
- The **admin dashboard** is fully implemented but access is restricted to verified admin accounts only.
- Unauthorized users attempting to access admin routes are automatically redirected or blocked.

---

## 🔎 Product Filtering & Search

- Products are searchable using a dynamic **search bar** on the Shop page.
- Users can filter products by category using a responsive **category-based filtering system**.
- Dynamic routing implemented for clean URLs, e.g.:
  - `/shop/tops`
  - `/shop/dress`

---

## ⚙️ Tech Highlights

- **Dynamic Routing:** Uses Next.js dynamic routes to render product and category pages based on slugs.
- **Secure Login Flow:** All sensitive routes and features are protected with proper authentication logic.
- **State Management:** Cart, user session, and UI state are managed efficiently using React state/hooks and local storage.



---

## Tech Stack

- **Frontend:** React, React Router, CSS Modules, styled-components
- **Backend:** Node.js, MongoDB, Mongoose ORM
- **Authentication:** JWT (JSON Web Tokens)
- **Payment Gateway:** Stripe API
- **Deployment:** Frontend and backend deployed on Vercel 
- **Other Tools:** Git, GitHub, Postman (for API testing), ESLint/Prettier (code quality)

---

## Installation & Setup (For Local Development)

1. Clone the repo  
   ```bash
   git clone https://github.com/yosilia/ecommerce-full-site.git
   cd ecommerce-full-site
   ```

2. Install dependencies  
   ```bash
   yarn install
   ```
   Or, if you prefer npm:  
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add the following variables with your own secrets and keys:

 ### Environment Variables

```env
NEXT_PUBLIC_BASE_URL=your_base_url
URL=your_site_url
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
PUSHER_CLUSTER=your_pusher_cluster
NEXT_PUBLIC_PUSHER_KEY=your_pusher_public_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
FASHN_API_KEY=your_fashn_api_key
STRIPE_SECRET_KEY=your_stripe_private_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email_username
EMAIL_PASS=your_email_password
S3_ACCESS_KEY=your_s3_access_key
S3_SECRET_ACCESS_KEY=your_s3_secret_access_key
GOOGLE_ID=your_google_oauth_client_id
GOOGLE_SECRET=your_google_oauth_client_secret
PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret

   ```
   
   > **Note:** You will need to set up a Stripe account and a MongoDB database to run the project locally.
   > Never commit your .env.local file or actual secret values to a public repository. Keep these credentials secure.

4. Start the development server  
   ```bash
   yarn dev
   ```
   Or with npm:  
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see the app running locally.

