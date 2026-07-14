# Walkthrough - CSS Purging & Compression

We have successfully purged and compressed the CSS stylesheets for the Samsung SDS Insights detailed article page, including the dynamic GNB (Global Navigation Bar) and LNB (Local Navigation Bar) components.

## Changes Made

1. **HTML Template Analysis**:
   - Analyzed the target article page [ai-junior-talent-pipeline-mentorship.html](https://www.samsungsds.com/kr/insights/ai-junior-talent-pipeline-mentorship.html).
   - Downloaded and analyzed the GNB dynamic rendering templates (`feature.html`, `gnb_ai_kr.html`, `rnb_genai.html`, `gnb.html`, `rnb.html`) to ensure all classes used by the dynamically generated navigation elements were collected.
   - Analyzed the local workspace templates (`detail.html` and `insights.html`).
   - Collected **239 unique class names** and **33 unique ID names**.

2. **Strict CSS Purging**:
   - Programmed a custom CSS parser in Python that handles nested `@media` rules, `@font-face` blocks, and `@keyframes` blocks.
   - Checked each selector: kept a rule only if **all** of its class and ID names (ignoring dynamic state flags like `.on`, `.active`, `.isFixed`, etc.) exist in the set of used classes and IDs, or if it is a global tag-only style.
   - This strict approach filtered out thousands of CSS rules belonging to other widgets and templates not present on the detail page.

3. **Compression & Optimization**:
   - Minified rule bodies (removing extra whitespace, spaces around colons, semicolons, etc.).
   - Consolidated the styles from `reset.css`, `layout.css`, `common.css`, `table.css`, `common_module.css`, and `module.css` into a single file.
   - Saved the optimized result in [purged_insights.css](file:///c:/Users/guidi/Documents/cms_project/purged_insights.css).

## Size Optimization Results

| Stylesheet | Original Rules Count | Kept Rules Count | Original Size | Purged & Compressed Size |
| :--- | :--- | :--- | :--- | :--- |
| **reset.css** | 42 | 35 | ~7.8 KB | \- |
| **layout.css** | 12 | 8 | ~1.2 KB | \- |
| **common.css** | 652 | 19 | ~55.9 KB | \- |
| **table.css** | 215 | 2 | ~18.1 KB | \- |
| **common_module.css** | 1,212 | 263 | ~125.9 KB | \- |
| **module.css** | 19,898 | 337 | ~2,091.3 KB (2.1 MB) | \- |
| **Combined & Purged** | **22,031** | **664** | **~2.3 MB** | **65.9 KB (97.1% reduction)** |

All the styles required to render the top GNB navigation menu, breadcrumbs/LNB, and detailed article layout are preserved in the optimized [purged_insights.css](file:///c:/Users/guidi/Documents/cms_project/purged_insights.css) file.
