# Muhammed Fadhel Fuhad · Portfolio

Personal portfolio of a senior frontend developer based in Manama, Bahrain. It's a single page with an aurora look: teal and purple light over a dark grid, frosted cards, and sections that fade in as you scroll.

**Live:** https://fadhelfuhad.vercel.app

## Sections

- **Home:** photo, title, stack, an "Available for work" badge and a CV download
- **About:** a short story and quick facts (contact details, languages, work status)
- **Skills & Tools:** six groups, from React and Vue to IT infrastructure
- **Experience:** a timeline from Euro Motors to Parcel
- **Featured Projects:** [Job Hunt](https://fadhel-jobhunt.vercel.app/#today), [Timezone W.L.L Inventory](https://timezone-wll.vercel.app/dashboard) and two highlights from work at Parcel
- **Education, Achievements, Contact:** the contact form opens the visitor's email app with the message filled in

## Run it

Requires Node 22 (see `.nvmrc`).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check and build to dist/
```

## Editing content

All text lives in `src/data.ts`: profile, story, skills, experience, projects, education and achievements. Every claim there comes from the CV, so keep it that way when you edit it.

- The photo is `public/photo.jpg` and the downloadable CV is `public/Muhammed_Fadhel_Fuhad_CV.pdf`.
- Project previews are in `public/projects/`.

## Built with

React 19, TypeScript, Vite 6 and plain CSS. There is no UI library and no backend. It's deployed on Vercel.
