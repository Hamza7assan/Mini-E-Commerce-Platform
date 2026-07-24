# Medwear - Mini E-Commerce Platform

This is a simplified e-commerce platform built as a monorepo containing three distinct parts: a Django backend API, a Next.js Admin Panel, and a Next.js Storefront. 

## How to Run Locally

### 1. Backend (Django API)
1. Navigate to the backend directory: `cd backend`
2. Activate your virtual environment (e.g., `venv\Scripts\activate` or `source venv/bin/activate`)
3. Install dependencies (if you haven't already): `pip install -r requirements.txt`
4. Apply migrations: `python manage.py migrate`
5. Run the server: `python manage.py runserver`
*(The API will be available at http://127.0.0.1:8000)*

### 2. Frontend (Storefront & Admin Panel)
This project uses a workspace structure. From the root directory:
1. Install dependencies: `npm install` (or `pnpm install`)
2. Run the storefront: `cd apps/storefront && npm run dev`
3. Run the admin panel: `cd ../admin && npm run dev`

## Assumptions Made
* **Monorepo Structure**: I assumed that managing all three pieces in a single monorepo using shared packages (e.g., Zod schemas) would be the most efficient and production-realistic architecture for a tightly coupled system.
* **Database & Media Inclusion**: While it is normally poor practice to commit a local SQLite database (`db.sqlite3`) and `media/` uploads to source control, I explicitly committed them for this test project so that you can pull the repository and instantly view a populated, working storefront without having to manually seed dummy data.
* **Variant Architecture**: I assumed that variants (colors/sizes) should be distinct tables on the backend to allow for precise inventory tracking per SKU, even if it adds slight complexity to the UI.
* **Cart Persistence**: As requested in the constraints, the cart relies entirely on client-side state (`Zustand`) and is not persisted to the database until checkout.

## What I Would Do Differently With More Time
* **Cloud Storage for Images**: Currently, images are saved to the local `media/` folder. For a true production environment, I would configure `django-storages` with AWS S3 or Cloudinary.
* **Inline Admin Editing**: I would optimize the admin panel by implementing inline table editing for product variants, reducing the number of modal popups and separate API calls needed to update stock/prices.
* **Server-Side Rendering (SSR) & SEO**: I would convert more of the storefront product pages to leverage Next.js SSR or Static Site Generation (SSG) to ensure perfect SEO for the public catalog.
* **End-to-End Testing**: I would implement Playwright or Cypress to automate checkout flow tests.

## Time Taken
* **Roughly 10 hours over 5 days.**
