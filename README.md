# OLX Lebanon Clone

A Next.js-based clone of OLX Lebanon, a classifieds marketplace. This app fetches real data from OLX's public API and provides a user interface for browsing categories, viewing ads, and posting new listings.

## Features

- Browse categories and subcategories
- View featured ads for cars, properties, and mobile phones
- Post new ads with dynamic forms based on category attributes
- Responsive design with CSS Modules
- Server-side rendering for better performance

## Tech Stack

- **Framework**: Next.js 16 with TypeScript
- **Frontend**: React 19
- **Styling**: CSS Modules
- **UI Components**: Radix UI primitives
- **Data Fetching**: Server-side rendering with fallbacks
- **Deployment**: Vercel-ready

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/OLX-Lebanon-Clone.git
   cd OLX-Lebanon-Clone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

## API Integration

The app integrates with OLX Lebanon's public API:
- Categories: `https://www.olx.com.lb/api/categories/source/all.json`
- Ads: `https://www.olx.com.lb/api/relevance/v4/search?category={id}&limit=4`
- Attributes: `https://www.olx.com.lb/api/categories/{id}/source/attributes.json`

Includes fallback static data for resilience.

## Project Structure

- `pages/` - Next.js pages (index, post-ad, API routes)
- `components/` - Reusable React components
- `types/` - TypeScript type definitions
- `styles/` - Global styles and CSS modules
- `public/` - Static assets

## License

This project is for assessment purposes only. OLX Lebanon data and branding are property of OLX.