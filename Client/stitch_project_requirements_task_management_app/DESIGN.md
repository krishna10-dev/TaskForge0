# Design System Document: The Precision Orchestrator

This design system is built for a high-performance React-based task management ecosystem. It rejects the "generic SaaS" aesthetic in favor of **High-End Editorial Precision**. By utilizing deep tonal layering, intentional asymmetry, and sophisticated typography, we move away from "software that tracks work" toward "an environment that empowers focus."

---

### 1. Overview & Creative North Star: "The Digital Curator"
The Creative North Star for this system is **The Digital Curator**. Unlike traditional dashboards that clutter the user with boxes and lines, this system treats every task as a curated piece of information. 

**Core Philosophies:**
*   **Intentional Asymmetry:** Break the rigid 12-column grid. Use whitespace as a structural element to guide the eye toward the most critical "Focus Task."
*   **Breathing Room:** Over-index on the Spacing Scale (specifically `8` to `12`) to prevent cognitive overload.
*   **Subtle Sophistication:** We build trust not through heavy borders, but through impeccable alignment and atmospheric depth.

---

### 2. Colors: Tonal Architecture
The palette avoids pure blacks and high-contrast separators. Instead, it uses a spectrum of slate grays and deep indigos to create a "no-line" environment.

*   **Primary (#000000) & Secondary (#505f76):** Used sparingly for high-contrast moments.
*   **The "No-Line" Rule:** Prohibit 1px solid borders for sectioning. Boundaries are defined solely by background color shifts. A `surface-container-low` (#f2f4f6) section should sit on a `surface` (#f7f9fb) background to create a clean break without visual noise.
*   **Glass & Gradient Rule:** For main CTAs and floating Action Buttons, use a gradient transition from `primary` to `primary-container` (#00174b). This adds "soul" and a tactile, premium quality.
*   **Surface Nesting:** Treat the UI as stacked sheets of fine paper.
    *   **Level 0 (Base):** `surface`
    *   **Level 1 (Sidebars/Nav):** `surface-container`
    *   **Level 2 (Cards/Content):** `surface-container-lowest` (#ffffff)

---

### 3. Typography: Editorial Authority
We pair the functional clarity of **Inter** with the architectural strength of **Manrope**.

*   **Display & Headlines (Manrope):** Use `display-lg` (3.5rem) for empty states and `headline-md` (1.75rem) for dashboard overviews. Manrope’s geometric nature provides an "engineered" feel that communicates professionalism.
*   **Body & Labels (Inter):** Use `body-md` (0.875rem) for the majority of task data. Inter is the workhorse here—designed for screen readability, it ensures that even dense task lists remain legible.
*   **The Hierarchy Rule:** Never use two different font weights to solve a hierarchy problem if a size shift or a color shift (using `on-surface-variant` #45464d) can solve it first.

---

### 4. Elevation & Depth: Atmospheric Layering
Traditional drop shadows are forbidden. We use **Tonal Layering** and **Ambient Light**.

*   **The Layering Principle:** Depth is achieved by "stacking." A `surface-container-lowest` card placed on a `surface-container-low` section creates a soft, natural lift.
*   **Ambient Shadows:** For floating elements (like Modals or Popovers), use a diffused shadow: `0px 20px 40px rgba(25, 28, 30, 0.06)`. The shadow color must be a tint of `on-surface` (#191c1e), never pure black.
*   **The Ghost Border Fallback:** If a border is required for accessibility, use the `outline-variant` (#c6c6cd) at **15% opacity**. This "Ghost Border" provides a hint of structure without interrupting the flow.
*   **Glassmorphism:** Use `surface_container_lowest` with a `backdrop-blur` of 12px for floating headers to allow content to bleed through subtly as the user scrolls.

---

### 5. Components: The Building Blocks

#### Buttons
*   **Primary:** Solid `primary` background. No border. `rounded-md` (0.375rem). Use `on-primary` (#ffffff) text.
*   **Secondary:** `secondary-container` (#d0e1fb) background. Transitions to `surface-tint` on hover.
*   **Tertiary:** Transparent background. Use `primary` color for text.

#### Input Fields
*   **The "Underline" Philosophy:** Avoid the fully enclosed box. Use a `surface-container-high` background with a 2px bottom-accent in `outline` (#76777d).
*   **States:** On focus, the bottom accent transitions to `on-primary-container` (#497cff). Use `label-md` for floating labels.

#### Cards & Lists
*   **Forbid Dividers:** Do not use 1px lines between list items. Instead, use a spacing of `4` (0.9rem) and a subtle hover state using `surface-container-highest`.
*   **Task Cards:** Use `surface-container-lowest` with a `xl` (0.75rem) corner radius. The subtle radius communicates modern precision without the "playfulness" of overly rounded corners.

#### Custom Component: The Progress Blade
*   For task management, use a thin, 2px "Blade" (gradient from `tertiary` to `on-tertiary-container`) that sits at the very top of a task card to indicate status, rather than a bulky progress bar.

---

### 6. Do’s and Don’ts

**Do:**
*   **Do** use `surface-dim` (#d8dadc) for inactive or backgrounded content to push it into the distance.
*   **Do** use `tertiary` (#000000) and `tertiary-fixed` (#89f5e7) for success states; the teal-indigo vibrance signals "Completion" with a premium feel.
*   **Do** embrace negative space. If a layout feels "empty," increase the typography size of the headline rather than adding more components.

**Don’t:**
*   **Don't** use 100% black text on 100% white backgrounds. Use `on-surface` on `surface-container-lowest` to reduce eye strain.
*   **Don't** use "Alert Red" for everything. Use the `error` (#ba1a1a) token sparingly, and prefer `error-container` (#ffdad6) for soft warnings.
*   **Don't** use standard "Drop Shadows." If it looks like a default plugin setting, it’s wrong. It must feel like ambient light.