# Drop-in images

Copy an image into one of these folders and it shows up on the site. There is no list to edit
and no code to change. Restart `npm run dev` if it was running, then commit and push to deploy.

| Folder | File name | Where it appears |
|---|---|---|
| `projects/` | `<projectId>.png` | Cover image on the project card and detail page |
| `projects/` | `<projectId>-2.png`, `-3.png`, … | Extra screenshots on the project detail page (click to enlarge) |
| `experience/` | `<id>.png` | Logo/photo on the Experience page (ids: `exp-cloudadvisory`, `exp-boffo`, `vol-mehewara`, `edu-uor`, …) |
| `experience/` | `<id>-2.jpg`, `-3.jpg` | Extra photos on that role's card |
| `gallery/` | anything, e.g. `aws-summit-2026.jpg` | `/gallery`; the title comes from the file name |
| `business/` | `<workId>.png` | Cover of a Business Work entry (`src/data/business.js`) |

Project ids are the `_id` values in `src/data/projects.js`, for example `lankaresilience`,
`cloudfix-buddy`, `gridpulse`, `teta-guard`, `securestay-infra`, `aks-platform`.

Formats: png, jpg, jpeg, webp, avif, gif, svg. Keep each file under about 500 KB (resize large
photos first), because Amplify serves them straight from the build.

Images that must keep an exact URL (or are shared with other pages) can live in `frontend/public/`
instead. Reference them with an explicit field, e.g. `image: '/my-photo.jpg'` in the data file.

Gallery captions and categories: add an entry to `GALLERY_META` in `src/data/gallery.js`, keyed by
the file name without its extension.
