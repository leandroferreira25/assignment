# Defect Report

## BUG-001 — Header logo link has no label for screen readers

**Severity:** Medium  
**Priority:** Medium

### Steps to Reproduce

1. Open Chrome and go to `https://demoqa.com/` (or any sub-page like `/automation-practice-form`).
2. Turn on a screen reader (such as VoiceOver on macOS or NVDA on Windows).
3. Press `Tab` to focus on the logo link at the top left of the header.
4. Listen to what the screen reader announces.

### Expected Result

The link should announce something clear like "ToolsQA, link" or "Go to ToolsQA homepage, link" so users know where it takes them.

### Actual Result

The screen reader just announces "Link" or reads out the raw image filename (`Toolsqa-DZdwt2ul.jpg`). Because there is no text or label, anyone relying on assistive tech has no way of knowing this link leads back to the homepage.

On top of that, the page doesn't wrap the primary content in a `<main>` landmark tag, which means screen reader users can't use standard shortcuts to skip the header and jump straight into the page content.

### Environment

- Browser: Chrome 153
- OS: macOS
- Cypress: 13.17.0
- URL: https://demoqa.com/

### Evidence

Inspecting `header > a` in the DOM:
```html
<a href="https://demoqa.com">
  <img src="/assets/Toolsqa-DZdwt2ul.jpg">
</a>
```
The `<a>` tag has no `aria-label` or inner text, and the `<img>` tag has no `alt` attribute.

### Impact

Anyone navigating with a keyboard or screen reader hits this link as their very first tab stop. Without an accessible name, they have to guess where the link leads, making basic site navigation confusing.

### Notes

Reproducible 100% of the time on every page sharing the site header.
