# Makerburg V1

## Overview
Makerburg is a mobile editorial discovery app for makers, artists, artisans, and culture lovers. The app features content about craft traditions from around the world, including stories, opportunities (grants, residencies, open calls), videos, and deep cultural entries.

## Current State
The app is fully functional with:
- 5 main tabs: Today (Home), Stories, Opportunities, Watch, Culture, Library
- Backend database integration with PostgreSQL storing all content
- API endpoints for all content types
- Save/bookmark functionality with optional login
- Detail screens for all content types

## Project Architecture

### Frontend (Expo React Native)
- **Navigation**: 5-tab bottom navigator with stack navigators for detail screens
- **Screens**: HomeScreen, StoriesScreen, OpportunitiesScreen, WatchScreen, CultureScreen, LibraryScreen, plus detail screens for each content type
- **Components**: StoryCard, OpportunityCard, VideoCard, CultureCard, Pill, SaveButton, LoginModal, EmptyState, SectionHeader
- **State Management**: AppContext for auth and saved items (persisted via AsyncStorage), React Query for API data

### Backend (Express.js + PostgreSQL)
- **Database Tables**: stories, opportunities, videos, culture_entries, users, saved_items
- **API Endpoints**:
  - GET /api/stories, /api/stories/:id
  - GET /api/opportunities, /api/opportunities/:id
  - GET /api/videos, /api/videos/:id
  - GET /api/culture, /api/culture/:id
- **Database**: Uses Drizzle ORM with PostgreSQL (Neon-backed)

### Key Files
- `shared/schema.ts` - Database schema definitions
- `server/routes.ts` - API route handlers
- `server/storage.ts` - Database access layer
- `server/seed.ts` - Sample data seeding
- `client/context/AppContext.tsx` - Auth and saved items state
- `client/navigation/MainTabNavigator.tsx` - Tab navigation
- `client/navigation/RootStackNavigator.tsx` - Root stack with detail screens

## Design Guidelines
- **Background**: Ivory (#F6F2EC)
- **Cards**: White (#FFFFFF)
- **Accent**: Charcoal (#2E2A24)
- **Style**: Calm, museum-quality editorial aesthetic inspired by Google Arts & Culture
- **Typography**: System fonts with clear hierarchy

## Recent Changes
- 2026-02-03: Integrated PostgreSQL database with Drizzle ORM
- 2026-02-03: Created database schema for stories, opportunities, videos, culture entries
- 2026-02-03: Migrated sample data from static file to database
- 2026-02-03: Updated all screens to fetch data from API endpoints
- 2026-02-03: Added save/bookmark functionality with library screen

## Running the App
- Backend: `npm run server:dev` (port 5000)
- Frontend: `npm run expo:dev` (port 8081)
- Scan QR code with Expo Go to test on mobile device
