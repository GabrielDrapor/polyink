# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Start development server**: `npm start`
- **Build for production**: `npm run build`
- **Run tests**: `npm test`
- **Eject from create-react-app**: `npm run eject` (irreversible)

## Architecture

This is a React TypeScript application built with Create React App. The codebase is structured as:

- **Entry point**: `src/index.tsx` - React app initialization
- **Main component**: `src/App.tsx` - Contains sample data and renders the bilingual reader
- **Core feature**: `src/components/BilingualReader.tsx` - Interactive bilingual text reader
- **Styling**: CSS modules in `src/App.css` and `src/components/BilingualReader.css`

The bilingual reader displays side-by-side translations with click-to-toggle functionality between original and translated text. Content is passed as an array of `{id, original, translated}` objects.