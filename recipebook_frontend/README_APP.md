# RecipeBook Angular Frontend

This is a client-only Angular application for browsing and managing personal recipes. Data is persisted locally in the browser using LocalStorage (with in-memory fallback). No backend is required.

Features:
- Browse recipes in a card grid
- Create, edit, delete recipes
- Favorite recipes, quick toggle
- Search by title/description/ingredient/tag
- Filter by tag and favorites
- Sort by newest/oldest/title
- Upload a cover image (stored as a data URL)

Development:
- Install dependencies: npm install
- Start dev server: npm start (default port configured to 3000 via angular.json)
- Build: npm run build

Notes:
- Uses Angular standalone components (v19) and Signals.
- UI theme: light, modern, minimal.
