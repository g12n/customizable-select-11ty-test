# Bundle Plugin Breaks HTML Structure: `<select>` Elements Close Prematurely

## Problem Description

The Eleventy [Bundle Plugin](https://www.11ty.dev/docs/plugins/bundle/) breaks HTML structure by prematurely closing `<select>` elements, even when the plugin is enabled but not actively used in templates.

This bug breaks the HTML output structure and makes customizable `<select>` elements non-functional.

## Example Code 

Example code used in this repository is based on [The customizable select](https://utilitybend.com/blog/the-customizable-select-part-one-history-trickery-and-styling-the-select-with-css) by Brecht De Ruyte

## Bug Impact

When `eleventyConfig.addBundle("css")` is enabled in the Eleventy config:
- `<select>` tags are closed immediately after opening
- Child elements (`<button>`, `<option>`) are rendered **outside** the select element
- The resulting HTML is structurally invalid
- This occurs even when no bundle features are actually used in the templates

## Reproduction Steps

This repository contains a minimal reproduction case:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build both versions:
   ```bash
   npm run build:both
   ```

   This runs:
   - `npm run build:with-bundle` - outputs to `_site-with-bundle/`
   - `npm run build:without-bundle` - outputs to `_site-without-bundle/`

3. Compare the outputs in the two directories

## Expected vs Actual Output

### Source Template (`src/index.html`)
```html
<select>
  <button>
    <selectedcontent></selectedcontent>
  </button>
  <option value="pokeball">
    <img src="https://assets.codepen.io/159218/pokeball.svg" alt="" />
    Pokeball
  </option>
  <option value="greatball">
    <img src="https://assets.codepen.io/159218/great-ball.svg" alt="" />
    Great ball
  </option>
  <option value="ultraball">
    <img src="https://assets.codepen.io/159218/ultra-ball.svg" alt="" />
    Ultra ball
  </option>
</select>
```

### WITHOUT Bundle Plugin (CORRECT)
Output: `_site-without-bundle/index.html`

```html
<select>
  <button>
    <selectedcontent></selectedcontent>
  </button>
  <option value="pokeball">
    <img src="https://assets.codepen.io/159218/pokeball.svg" alt="" />
    Pokeball
  </option>
  <!-- ... more options ... -->
</select>
```

**Result:** HTML structure is preserved correctly.

### WITH Bundle Plugin (BROKEN)
Output: `_site-with-bundle/index.html`

```html
<select>
  </select><button>
    <selectedcontent></selectedcontent>
  </button>
  <option value="pokeball">
    <img src="https://assets.codepen.io/159218/pokeball.svg" alt="">
    Pokeball
  </option>
  <!-- ... more options ... -->

```

**Result:** `<select>` tag is closed prematurely, and all child elements are rendered outside of it.

## Key Differences

| Aspect | Without Bundle | With Bundle |
|--------|---------------|-------------|
| `<select>` structure | Properly nested | Prematurely closed |
| `<button>` location | Inside `<select>` | Outside `<select>` |
| `<option>` elements | Inside `<select>` | Outside `<select>` |
| HTML validity | Valid | Invalid |
| Self-closing `/` on `<img>` | Present | Removed |

## Environment

- **Eleventy Version:** 3.1.2
- **Plugin Version:** @11ty/eleventy-plugin-webc 0.11.2
- **Node Version:** (check with `node --version`)
- **OS:** macOS/Linux/Windows

## Configuration Files

### With Bundle Plugin (`.eleventy.with-bundle.js`)
```javascript
eleventyConfig.addBundle("css"); // ENABLED - causes bug
```

### Without Bundle Plugin (`.eleventy.without-bundle.js`)
```javascript
// eleventyConfig.addBundle("css"); // DISABLED - works correctly
```

## Related Resources

- [Customizable Select HTML Pattern](https://utilitybend.com/blog/the-customizable-select-part-one-history-trickery-and-styling-the-select-with-css)
- [Eleventy Bundle Plugin Documentation](https://www.11ty.dev/docs/plugins/bundle/)

## Notes

- The bug affects multiple template engines (HTML, WebC, etc.)
- The bundle plugin doesn't need to be actively used to trigger the bug
- Simply having `eleventyConfig.addBundle("css")` in the config is enough to break the output
