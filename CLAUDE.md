# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Start development server**: `npm start`
- **Build for production**: `npm run build`
- **Run tests**: `npm test`
- **Deploy to Cloudflare Workers**: `npm run deploy`
- **Eject from create-react-app**: `npm run eject` (irreversible)

## Architecture

This is a React TypeScript application built with Create React App, deployed as a Cloudflare Worker with D1 database integration. The codebase is structured as:

- **Entry point**: `src/index.tsx` - React app initialization
- **Main component**: `src/App.tsx` - Loads chapters from API and manages reading state
- **Core feature**: `src/components/BilingualReader.tsx` - Interactive bilingual text reader with scroll navigation
- **Worker backend**: `src/worker/index.ts` - Cloudflare Worker with API endpoints and asset serving
- **Database**: D1 SQLite database with books, chapters, and content_items tables
- **Styling**: CSS modules in `src/App.css` and `src/components/BilingualReader.css`

## Reading Experience

The bilingual reader features:
- **Single-chapter mode**: Only one chapter loads at a time for performance
- **Scroll navigation**: 
  - Scroll to bottom → automatically loads next chapter
  - Scroll to top → automatically loads previous chapter
- **Manual navigation**: Chapter menu for direct chapter selection
- **Language toggle**: Click any paragraph to switch between original/translated text
- **Reading controls**: Adjustable line height, letter spacing, and paragraph spacing

## API Endpoints

- `GET /api/book/chapter/{number}` - Load specific chapter content
- `GET /api/book/chapters` - Get list of all chapters
- `GET /api/book/content` - Get full book content (legacy)

## Database Schema

- **books**: Book metadata (title, author, styles)
- **chapters**: Chapter information (chapter_number, titles)
- **content_items**: Individual paragraphs with bilingual text