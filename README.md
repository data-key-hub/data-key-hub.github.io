# Keyur K — website

Personal portfolio hosted on GitHub Pages at `https://data-key-hub.github.io/`.

Static site — no build step. Content lives in `content/*.json` and is edited through Decap CMS at `/admin`.

## What's in here
- `Home.dc.html`, `projects.dc.html`, `project.dc.html`, `blog.dc.html`, `post.dc.html`, `about.dc.html`, `contact.dc.html`: the pages
- `index.html`: sends visitors to the home page
- `site.css`, `site.js`: shared theme (light/dark), helpers
- `content/profile.json`, `content/projects.json`, `content/posts.json`: **all the words and images**
- `admin/`: the CMS (log in, edit, publish)
- `assets/uploads/`: images you upload through the CMS
- `_ds/`, `support.js`: design system and page runtime (don't edit)
- `oauth-proxy/`: Cloudflare Worker for CMS login (deploy separately)

Each project and post gets its own page automatically: `project.dc.html?p=<slug>` and `post.dc.html?p=<slug>`.

## CMS setup (one time)

### 1. Create a GitHub OAuth App
1. Go to [github.com/settings/developers](https://github.com/settings/developers) → **OAuth Apps → New OAuth App**.
2. **Application name:** `Keyur Site CMS`
3. **Homepage URL:** `https://data-key-hub.github.io/`
4. **Authorization callback URL:** `https://keyur-cms-auth.keyur14112000.workers.dev/callback`
5. Click **Register application**, then **Generate a new client secret**. Copy both the **Client ID** and the **Client Secret**.

### 2. Deploy the OAuth proxy (Cloudflare Worker — free)
1. Sign up at [dash.cloudflare.com](https://dash.cloudflare.com/) (free).
2. Install Wrangler: `npm install -g wrangler`
3. Log in: `npx wrangler login`
4. From the `oauth-proxy/` folder:
   ```
   npx wrangler secret put CLIENT_ID      # paste your GitHub Client ID
   npx wrangler secret put CLIENT_SECRET   # paste your GitHub Client Secret
   npx wrangler deploy
   ```
5. Your CMS login is now live at `https://data-key-hub.github.io/admin/`.

### 3. Contact form (Formspree — free)
1. Go to [formspree.io](https://formspree.io/) → sign up → create a form.
2. Copy your form endpoint (like `https://formspree.io/f/xABCDEFG`).
3. In `contact.dc.html`, replace the `action="https://formspree.io/f/xcontact"` with your endpoint.

## Adding content
Log in at `/admin`, then:
- **Projects → Add project**: pick a Module, write sections, upload images, then Publish.
- **Blog posts → Add post**: same idea. Posts sort by date.
- **Profile & About**: your name, headline, bio, experience, links, CV, portrait.

## Speed
- The pages are static, so no server work happens on each request.
- Upload images at roughly 1600px wide or smaller, as JPG/WebP. The CMS doesn't resize them for you.
- GitHub Pages serves through a CDN with HTTPS.
