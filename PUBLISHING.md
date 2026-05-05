# Publishing to the Chrome Web Store

A complete walkthrough, starting from zero. No prior publishing experience needed.

---

## Overview

Publishing has four phases:

1. **One-time account setup** — register as a Chrome developer ($5 fee, once ever)
2. **Prepare assets** — icons, screenshots, privacy policy, clean ZIP
3. **Create the store listing** — fill in all the fields, upload everything
4. **Submit and wait** — Google reviews the extension (usually a few days)

---

## Phase 1 — One-time developer account setup

### 1.1 — You need a Google account

Any Google/Gmail account works. If you want to keep things separate from your personal Google account, create a new one first. Either way is fine.

### 1.2 — Go to the Chrome Web Store Developer Dashboard

Open this URL in your browser:

```
https://chrome.google.com/webstore/devconsole
```

Sign in with your Google account.

### 1.3 — Pay the one-time developer registration fee

You will be prompted to pay **$5 USD** (one-time, never again). This is Google's fee to reduce spam extensions.

- Click **Pay registration fee**
- Enter a credit or debit card
- Complete the payment

After payment, your dashboard becomes active immediately.

### 1.4 — Accept the developer agreement

Read and accept the Chrome Web Store Developer Program Policies. You must agree before you can upload anything.

---

## Phase 2 — Prepare everything before uploading

Do all of this before touching the dashboard again. Uploading an incomplete extension wastes a review slot.

### 2.1 — Create real icons

The icons currently in `icons/` are plain blue squares generated as placeholders. Google does not reject extensions for this, but users see the icon in the toolbar and in the store — it matters for trust and clicks.

**Required sizes:** 16×16, 48×48, 128×128 px (PNG, transparent background works)

**Free tools to create icons:**
- **Figma** (figma.com) — free, browser-based, most capable
- **Canva** (canva.com) — free, easier, has icon templates
- **Photopea** (photopea.com) — free Photoshop-like, browser-based

**What makes a good extension icon:**
- Simple, readable at 16×16 px
- A magnifying glass with a `+` / `−`, or the letter `Z`, or a scroll wheel, all work well
- Export each size as PNG and overwrite `icons/icon16.png`, `icons/icon48.png`, `icons/icon128.png`

After replacing the icons, reload the extension in `brave://extensions` to verify they look right in the toolbar.

### 2.2 — Create a privacy policy

Google requires a privacy policy URL for all extensions, even ones that collect zero data. It can be a very short page.

**Easiest option — a GitHub Gist:**

1. Go to https://gist.github.com (sign in with GitHub, or create a free account)
2. Create a new Gist with filename `privacy-policy.md` and this content:

```
# Privacy Policy — Scroll Zoom

Scroll Zoom does not collect, transmit, or store any personal data or browsing information.

The only data the extension stores is your chosen modifier key preference,
saved locally in your browser using chrome.storage.sync.
This data never leaves your browser and is not accessible to anyone other than you.

Last updated: [today's date]
```

3. Click **Create public gist**
4. Copy the URL of the gist — you will paste it into the store listing form

**Alternative:** if you have a GitHub repo for this project (or create one), you can host the privacy policy as a Markdown file and use the `raw.githubusercontent.com` URL, or use GitHub Pages.

### 2.3 — Take screenshots

The store listing requires at least one screenshot. Screenshots must be exactly one of two sizes:
- **1280 × 800 px** (recommended)
- **640 × 400 px**

**What to screenshot:**
1. A normal webpage with the zoom indicator visible in the address bar (showing e.g. 125% or 150%) — demonstrates the zoom working
2. The settings popup open, showing the modifier key options

**How to take a precise-size screenshot on macOS:**
- Open the page you want to capture in Brave
- Resize the window so it fills the screen, then use **Cmd+Shift+4** and drag to capture, or use the built-in Screenshot app
- You may need to resize in Preview.app to hit exactly 1280×800

Take 2–3 screenshots. You can upload up to 5.

### 2.4 — Write your store listing text

Prepare these before the upload form:

**Short description** (up to 132 characters — shown in search results):
```
Zoom any webpage with scroll wheel + modifier key on macOS. Works in Brave and Chrome.
```

**Detailed description** (up to ~16,000 characters — shown on the extension's store page):
```
Scroll Zoom lets you zoom any webpage using your scroll wheel combined with a modifier key.

HOW TO USE
Hold Control (default), Option, or Command, then scroll up or down. The page zooms in or out just like the native browser zoom — text reflows, the zoom level appears in the address bar, and everything works exactly as you'd expect.

SETTINGS
Click the extension icon in your toolbar to choose which modifier key you prefer: Control ⌃, Option ⌥, or Command ⌘. Changes take effect immediately across all open tabs — no reload needed.

DETAILS
• Zoom range: 25% to 500%
• Trackpad pinch-to-zoom is completely unaffected
• Works on all http and https pages
• Does not work on browser internal pages (brave://, chrome://) — this is a Chrome security restriction that applies to all extensions
• No data collected, no network requests made
```

### 2.5 — Package the extension (create the ZIP)

The ZIP must contain the extension files directly at the root — not wrapped in a subfolder.

Run this in the project directory:

```bash
cd /path/to/MacOS-Brave-ScrollZoom

zip -r scroll-zoom-1.0.0.zip \
  manifest.json \
  src/ \
  icons/
```

**Do not include:** `.git/`, `.gitignore`, `README.md`, `ROADMAP.md`, `PUBLISHING.md`, `.claude/`

Verify the ZIP looks right:

```bash
unzip -l scroll-zoom-1.0.0.zip
```

You should see `manifest.json`, `src/content.js`, `src/background.js`, `src/popup/popup.html`, `src/popup/popup.js`, `src/popup/popup.css`, and the three icon files — nothing else.

---

## Phase 3 — Create the store listing

### 3.1 — Create a new item

In the developer dashboard (`https://chrome.google.com/webstore/devconsole`):

1. Click **New item** (top right)
2. Upload your ZIP file
3. The dashboard reads your `manifest.json` and pre-fills the name and version

### 3.2 — Fill in the Store listing tab

Work through each field:

| Field | What to enter |
|---|---|
| **Description** | Paste your detailed description from 2.4 |
| **Category** | Productivity |
| **Language** | English |
| **Screenshots** | Upload your 1280×800 screenshots from 2.3 |
| **Small promo tile** (optional) | 440×280 px image — can skip for initial submission |
| **Store icon** | Upload `icons/icon128.png` |

### 3.3 — Fill in the Privacy tab

| Field | What to enter |
|---|---|
| **Single purpose** | "Zoom webpages using scroll wheel + modifier key" |
| **Permission justification — tabs** | "Required to read and set the current tab's zoom level via chrome.tabs.getZoom and chrome.tabs.setZoom." |
| **Permission justification — storage** | "Required to persist the user's chosen modifier key preference across browser sessions." |
| **Privacy policy URL** | Paste the GitHub Gist URL from step 2.2 |
| **Does your extension use remote code?** | No |

### 3.4 — Fill in the Distribution tab

| Field | What to enter |
|---|---|
| **Visibility** | Public (so anyone can find and install it) |
| **Distribution** | All regions (or limit if you prefer) |
| **Payments** | Free |

### 3.5 — Submit for review

Click **Submit for review** (top right). A dialog may ask you to confirm.

Your extension status changes to **Pending review**.

---

## Phase 4 — Review process

### What happens now

Google's review team (and automated systems) check:
- That the extension does what the description says
- That requested permissions match what the code actually uses
- That there is no malicious or policy-violating code

### How long it takes

- **First submission:** typically 1–7 business days, sometimes up to 3 weeks during busy periods
- Subsequent updates are usually faster (1–3 days)

You will receive an email when the extension is approved or rejected. You can also check the status in the dashboard at any time.

### If it gets rejected

Rejections come with a reason. Common ones:

| Rejection reason | Fix |
|---|---|
| Permission not justified | Improve the permission justification text in the Privacy tab |
| Description doesn't match functionality | Rewrite the description to be more specific and accurate |
| Missing privacy policy | Make sure the URL is publicly accessible |
| Policy violation | Read the specific policy cited and adjust |

After fixing the issue, you can resubmit from the dashboard. There is no additional fee for resubmissions.

### Once approved

Your extension gets a public store URL like:
```
https://chrome.google.com/webstore/detail/scroll-zoom/[your-extension-id]
```

It works in both Chrome and Brave (Brave supports the Chrome Web Store natively).

---

## GitHub releases (recommended)

Publishing a GitHub release alongside each store submission is good practice. It gives you a permanent, public, versioned archive of exactly what is on the store — useful for auditing, for users who want to sideload a specific version, and for your own future reference. The ZIP you already create for the store upload doubles as the release asset with no extra work.

### One-time setup — push the repo to GitHub

If you have not already done this:

1. Go to https://github.com and sign in (or create a free account)
2. Click **New repository** (the `+` button, top right)
3. Name it `scroll-zoom` (or whatever you prefer), set it to **Public**, leave everything else unchecked, click **Create repository**
4. GitHub shows you a set of commands. Run these in your project directory:

```bash
git remote add origin https://github.com/YOUR_USERNAME/scroll-zoom.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username. After this, your code is on GitHub.

### For every release — tag, GitHub release, then store upload

Do these steps in order each time you publish a new version.

**Step 1 — Make sure your version in `manifest.json` is correct**

The tag and the manifest version should always match. If you are publishing `1.0.0`, `manifest.json` should have `"version": "1.0.0"`.

**Step 2 — Commit any last changes and push**

```bash
git add manifest.json   # and any other changed files
git commit -m "Release 1.0.0"
git push origin main
```

**Step 3 — Create and push a git tag**

```bash
git tag v1.0.0
git push origin v1.0.0
```

The `v` prefix is convention (e.g. `v1.0.0`, `v1.0.1`, `v1.1.0`). It has no effect on the store — it is purely for GitHub.

**Step 4 — Create the ZIP (same as store packaging)**

```bash
zip -r scroll-zoom-1.0.0.zip manifest.json src/ icons/
```

**Step 5 — Create the GitHub release**

1. Go to your repository on GitHub (e.g. `https://github.com/YOUR_USERNAME/scroll-zoom`)
2. Click **Releases** (right sidebar) → **Create a new release** (or **Draft a new release**)
3. In the **Choose a tag** dropdown, select the tag you just pushed (`v1.0.0`)
4. Set the **Release title** to `v1.0.0`
5. In the description box, write brief release notes — what changed, what the extension does (for the first release, a short summary is enough):

```
Initial public release.

Zoom any webpage with scroll wheel + modifier key on macOS.
Configurable via the toolbar popup (Control, Option, or Command).
Zoom range: 25%–500%.
```

6. Drag and drop `scroll-zoom-1.0.0.zip` onto the **Attach binaries** area at the bottom
7. Click **Publish release**

**Step 6 — Upload the same ZIP to the Chrome Web Store**

Use the ZIP you just attached to the GitHub release. Follow Phase 3 in this guide.

This way both the store and GitHub always have the exact same file for each version.

---

## Updating the extension later

When you make changes to the code:

1. Bump the version in `manifest.json` — e.g. `"version": "1.0.0"` → `"1.0.1"`. The store rejects a ZIP with the same version number as a previously uploaded version.
2. Follow the GitHub release steps above (new commit, new tag `v1.0.1`, new ZIP, new release)
3. In the Chrome Web Store dashboard, open your extension, go to **Package**, click **Upload new package**, and upload the same ZIP
4. Click **Submit for review**
5. Your existing users get the update automatically within a day or two of approval

---

## Checklist before submitting

- [ ] Icons are real images (not placeholder blue squares)
- [ ] `manifest.json` has a meaningful `name`, `description`, and correct `version`
- [ ] Privacy policy is live at a public URL
- [ ] ZIP contains only `manifest.json`, `src/`, `icons/` — no git history, no markdown docs
- [ ] Screenshots taken and sized to exactly 1280×800 or 640×400
- [ ] Description and permission justifications written
- [ ] Tested the extension one more time on a clean reload after zipping
- [ ] Git tag created and pushed to GitHub (`git tag v1.0.0 && git push origin v1.0.0`)
- [ ] GitHub release created with the ZIP attached
