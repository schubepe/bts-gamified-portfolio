# Gamified Portfolio Template

A playful React + TypeScript portfolio with a drag-and-drop intro quest, project folders, a cassette-style about section, a 3D skill gallery, light/dark themes, and responsive layouts.

Original template design and development by **@tipandtale**.

## Quick start

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed in the terminal.

## Make it yours

1. Edit `src/config/portfolio.ts` for your name, role, introduction, links, and optional résumé path.
2. Copy `.env.example` to `.env` if you prefer to store public profile and repository URLs there.
3. Edit the `PROJECTS` array near the top of `src/components/section/Projects.tsx`.
4. Replace `src/assets/profile-placeholder-1.svg` through `profile-placeholder-3.svg` with your images, or change their imports in `CassetteAbout.tsx`.
5. Replace the sample skill icons through `src/assets/techstack/index.ts` and the gallery data in `DomeGallery.tsx`.
6. Replace the certification entries in `src/components/section/Certifications.tsx`, or remove `<Certifications />` from `src/App.tsx` if you do not need the section.
7. Replace `public/favicon.png`, then update the title and description in `index.html`.

Project case-study and code buttons are hidden when their URLs are blank, so unfinished links will not create broken pages.

### Optional audio

The template does not redistribute a song. To add your own licensed audio:

1. Put the file in `public/audio/`.
2. Set `AUDIO_SOURCE` in `src/components/section/CassetteAbout.tsx`, for example `/audio/about.mp3`.
3. Adjust `AUDIO_START_SECONDS` and `AUDIO_END_SECONDS`.

## Commands

```bash
npm run dev       # local development
npm run build     # type-check and production build
npm run preview   # preview the production build
npm run lint      # code-quality checks
```

## Deploy

Push the project to GitHub, then import it into Netlify or another static host. Use:

- Build command: `npm run build`
- Publish directory: `dist`

Never commit `.env`; it is already ignored. Only variables beginning with `VITE_` are available in the browser, so do not put secrets in them.

## Before publishing

- Replace all placeholder text and images.
- Test every external link.
- Run `npm run build` and `npm run lint`.
- Test keyboard navigation, mobile layout, and both themes.
- Only include images, fonts, audio, and icons you have permission to share.

## License and attribution

MIT © 2026 @tipandtale. See `LICENSE`. The copyright and permission notice must be included in copies or substantial portions of the template.
# bts-gamified-portfolio
