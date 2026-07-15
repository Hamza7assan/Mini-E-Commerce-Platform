# Medwear - Mini E-Commerce Platform

A simplified e-commerce platform built as an intern test project. The system includes a Django + Django REST Framework backend and a unified Next.js (App Router) frontend serving both the public Storefront and the internal Admin Panel.

## Architecture

This project is structured as a monorepo containing two main parts:
1. **Backend API (`apps/api`)**: Django & DRF. Serves as the source of truth for categories, products, orders, and variants. Handles JWT authentication for admin routes.
2. **Frontend (`apps/storefront`)**: Next.js App Router (React). Unified application for both the public storefront and the admin dashboard. Uses `zustand` for client-side cart state, `framer-motion` for subtle animations, and generic CSS (with Tailwind classes) for styling.

## How to Run Locally

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Run the Backend (Django)

Open a terminal and navigate to the `apps/api` directory:

```bash
cd apps/api
python -m venv venv
# Activate the virtual environment:
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```
*Note: We have pre-populated a superuser (`admin` / `admin`) if you wish to use the default Django admin.*

### 2. Run the Frontend (Next.js)

Open a new terminal and navigate to the `apps/storefront` directory:

```bash
cd apps/storefront
npm install
npm run dev
```

The frontend will start at [http://localhost:3000](http://localhost:3000).

- **Storefront**: [http://localhost:3000](http://localhost:3000)
- **Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Admin Login Credentials**: Username: `admin` | Password: `admin` (or whichever superuser you create)

## Assumptions Made & Scope Interpretation

1. **Monorepo / Unified Frontend**: The prompt stated "A repo per part ... or one monorepo". We chose a monorepo to easily share types/schemas. We also combined the Admin Panel and Storefront into a single Next.js application under different route segments (`/` for storefront, `/admin` for dashboard) to simplify deployment and maximize component reuse.
2. **Product Variants**: Although not strictly requested, real e-commerce apparel sites require variants (size, color). We implemented a basic variant system (Color + Size) connected to product stock. If you just want standard products, the base product model still tracks a `price` and `description`.
3. **No Auth for Storefront**: Per the instructions, guest checkout is fully implemented without user accounts.
4. **Validation**: We rely on backend Django constraint checks and serializer validation. On the frontend, basic HTML5 constraints and manual checks prevent invalid submissions (e.g., negative quantities).

## What We'd Do Differently With More Time

1. **Zod Validation on Frontend**: We would implement strict `zod` schemas for every form combined with `react-hook-form` to provide cleaner field-level error mapping straight from the backend. Currently, we handle field-level errors manually via state.
2. **Image Hosting Setup**: Currently, images upload to the local Django `media/` directory. For a real project, we would wire up AWS S3 or Cloudinary.
3. **Server-Side Rendered (SSR) Admin**: The admin panel heavily relies on client-side fetching (`useEffect`). With more time, we would leverage Next.js server components for the admin panel to prefetch dashboard stats and lists.
4. **Toast Notifications**: We would swap basic browser `alert()` and simple UI alerts for a robust toast notification library (like `sonner` or `react-toastify`) for better UX during CRUD operations.

---
*Built with Django, Next.js, and Framer Motion.*
