# App Icon — Design Guide

---

## What is Claude Design?

Claude Design is Anthropic's dedicated AI image generation tool, accessible at:

```
https://claude.ai/design
```

It generates raster images (PNG) from text prompts — think Midjourney or DALL-E, but built into the Claude ecosystem. You write a natural-language prompt describing what you want visually, and it outputs one or more PNGs.

- **Input:** a text prompt (and optionally a style/reference image)
- **Output:** PNG images
- **Excels at:** icons, illustrations, UI assets, logos, brand visuals
- **Does not** write code — pixel-based images only

---

## Chrome Extension Icon — Technical Requirements

Chrome requires PNG icons in four exact sizes:

| Size | Used for |
|---|---|
| 16 × 16 | Browser favicon/toolbar (most important) |
| 32 × 32 | Windows taskbar |
| 48 × 48 | Extensions management page |
| 128 × 128 | Chrome Web Store listing |

**The workflow:** generate one high-resolution master (512×512 or 1024×1024) in Claude Design, then resize it down programmatically. See the resizing section below.

**Design constraints Chrome expects:**
- Square aspect ratio (1:1)
- Must work on both light and dark browser themes — needs strong contrast
- Readable and recognisable at 16px — no fine detail, no thin lines, no small text
- Solid or transparent background (avoid gradients that bleed at edges)
- Should feel at home next to Grammarly, uBlock Origin, 1Password, etc. in the toolbar

---

## The Workflow (End to End)

```
1. Paste a prompt from this file into claude.ai/design
          ↓
2. Claude Design generates a 512×512 PNG
          ↓
3. Download the PNG, rename it master.png, place it in the project root
          ↓
4. Run the resize script below
          ↓
5. The four icon files are written to icons/ and wired up in manifest.json
```

---

## Resizing the Master PNG

macOS ships with `sips`, a built-in image tool that needs zero installation. Once you have `master.png` in the project root, run:

```bash
sips -z 128 128 master.png --out icons/icon128.png
sips -z 48  48  master.png --out icons/icon48.png
sips -z 32  32  master.png --out icons/icon32.png
sips -z 16  16  master.png --out icons/icon16.png
```

After running this, reload the extension in `brave://extensions` and verify the icon looks sharp in the toolbar at its actual size.

---

## Claude Design Prompts for This Extension

This extension's job is **scroll wheel + modifier key = page zoom**. The icon needs to communicate "zoom" and hint at scrolling, without any text, at sizes down to 16px.

Three prompt variants are provided below — from most recommended to most experimental. Paste each separately into Claude Design, generate a few variations, and pick the one that reads most clearly when you mentally squint it down to 16×16.

---

### Prompt 1 — Recommended: Magnifying glass with scroll grip

The magnifying glass is the universal zoom symbol. This variant integrates a scroll-wheel texture into the handle grip so the scroll action is subtly present without cluttering the shape.

```
A flat design Chrome extension icon, 512x512.
A bold white magnifying glass centred on a vivid electric blue (#0071e3) rounded square background.
The handle of the magnifying glass ends in a circular grip with three thin horizontal ridges,
evoking a scroll wheel. Inside the lens, a clean white plus symbol.
Thick strokes, no thin lines, no text, no gradients, sharp geometric shapes.
Bold and instantly recognisable when scaled down to 16px.
Style: flat design, Apple SF Symbols aesthetic, high contrast.
```

---

### Prompt 2 — Alternative: Scroll wheel with zoom arrows

Leads with the scroll wheel as the primary shape, with expansion arrows to signal zoom. Works well if Prompt 1 feels too generic as a magnifying glass.

```
A flat design Chrome extension icon, 512x512.
A bold white mouse scroll wheel viewed front-on, centred on a dark charcoal (#1c1c1e) rounded square background.
Two diagonal expand arrows (↗ and ↙) flank the scroll wheel, one top-right and one bottom-left,
suggesting zoom in and zoom out.
Thick strokes, simple geometric shapes, high contrast, no text, no gradients, no thin lines.
Clean, minimal, reads clearly at 16px.
Style: flat design, material design icon aesthetic.
```

---

### Prompt 3 — Alternative: Minimal zoom symbol with scroll lines

The most stripped-back option. A standard zoom-in symbol (circle with a plus) with three short horizontal lines beside it to hint at scrolling. Maximum simplicity for maximum legibility at tiny sizes.

```
A flat design Chrome extension icon, 512x512.
A bold white circle containing a thick plus sign (zoom-in symbol) on the left,
with three short bold horizontal lines stacked on the right (like a scroll indicator).
All centred on a deep navy blue (#003566) rounded square background.
No text, no gradients, no thin strokes. Every element bold enough to survive scaling to 16px.
Style: flat design, filled icon, Google Material aesthetic.
```

---

## What Makes a Prompt Work at Small Sizes

| Do | Don't |
|---|---|
| Bold, thick strokes (≥ 3px at 512px scale) | Thin outlines (disappear at 16px) |
| One single focal shape | Multiple equal-weight elements |
| High contrast (white on dark, or dark on white) | Mid-tones that blend into toolbar backgrounds |
| Solid background colour | Photorealism or complex textures |
| Flat or minimal shading | Gradients that bleed at edges |
| Negative space as part of the design | Text or letters (unreadable at 16px) |

---

## Evaluating the Result

Before accepting a generated icon:

1. **Squint test** — look at the 512px PNG and squint until it blurs. The shape should still be legible.
2. **Resize and check at 16px** — run the sips resize commands and open `icons/icon16.png` in Preview. If you can tell it's a magnifying glass (or whatever metaphor you chose), it passes.
3. **Light and dark background test** — open the icon in Preview, then in Edit → Change Background, check it against both white and dark grey. It should look right on both.
4. **Toolbar test** — reload the extension in Brave after replacing the icons. The toolbar is the real-world environment.

If a variant doesn't pass all four, go back to Claude Design and either regenerate with the same prompt or adjust the prompt (e.g. "make the strokes bolder", "increase the contrast", "simplify to one shape").
