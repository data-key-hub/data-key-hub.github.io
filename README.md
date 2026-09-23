# Keyur K — website

A static site. No build step. Content lives in `content/*.json` and is edited through Decap CMS at `/admin`.

## What's in here
- `Home.dc.html`, `projects.dc.html`, `project.dc.html`, `blog.dc.html`, `post.dc.html`, `about.dc.html`, `contact.dc.html`: the pages
- `index.html`: sends visitors to the home page
- `site.css`, `site.js`: shared theme (light/dark), helpers
- `content/profile.json`, `content/projects.json`, `content/posts.json`: **all the words and images**
- `admin/`: the CMS (log in, edit, publish)
- `assets/uploads/`: images you upload through the CMS
- `_ds/`, `support.js`: design system and page runtime (don't edit)

Each project and post gets its own page automatically: `project.dc.html?p=<slug>` and `post.dc.html?p=<slug>`.

## Deploy on Netlify (recommended: CMS login + contact form work out of the box)
1. Push this folder to a GitHub repository (branch `main`).
2. Go to netlify.com → **Add new site → Import from Git** → pick the repo. Leave the build command empty and set the publish directory to `/`.
3. In the site dashboard: **Identity → Enable**. Under Registration, choose **Invite only**, then invite yourself.
4. **Identity → Services → Git Gateway → Enable.**
5. Open the invite email, set a password, and you land in `/admin`.
6. **Forms:** the contact form is detected automatically. Submissions show up under **Forms**, and you can turn on email notifications there.

## Deploy on GitHub Pages (free; the CMS needs one extra step)
1. Push to GitHub → **Settings → Pages → Deploy from branch `main` / root**.
2. The site works straight away.
3. **CMS:** GitHub Pages can't handle logins. In `admin/config.yml`, switch to the `github` backend (the commented block) and point `base_url` at an OAuth proxy, for example a free Cloudflare Worker such as "decap-proxy".
4. **Contact form:** Pages can't receive form posts. Create a free Formspree form and change the form's `action` in `contact.dc.html` to your Formspree URL. The fetch call posts to `/`, so change that too.

## Adding content
Log in at `/admin`, then:
- **Projects → Add project**: pick a Module, write sections, upload images, then Publish.
- **Blog posts → Add post**: same idea. Posts sort by date.
- **Profile & About**: your name, headline, bio, experience, links, CV, portrait.

Before launch, delete the sample projects and posts in the CMS. Each list item has a delete button.

## Speed
- The pages are static, so no server work happens on each request.
- Upload images at roughly 1600px wide or smaller, as JPG/WebP. The CMS doesn't resize them for you.
- Netlify and GitHub Pages both serve through a CDN with HTTPS.
