# Rule: Mandatory Angular Material UI Component Standard

1. **Mandatory Angular Material Primitives**:
   - All interactive UI controls, buttons, form inputs, dialogs, cards, navigation items, and data displays MUST consume official `@angular/material` standalone components and directives.
   - Raw, unstyled HTML interactive elements (`<button>`, `<input>`, `<select>`, `<textarea>`, bespoke `<table>`, or bespoke modal backdrop wrappers) are strictly prohibited when an Angular Material equivalent exists.

2. **Component Mapping Requirements**:
   - **Buttons**: Use `MatButtonModule`:
     - Primary actions: `<button mat-flat-button color="primary">`
     - Secondary actions: `<button mat-stroked-button>`
     - Tertiary / ghost actions: `<button mat-button>`
     - Icon-only actions: `<button mat-icon-button aria-label="...">`
     - **Trailing Icons / Carets**: Angular Material places `<mat-icon>` before button text by default. Whenever an icon acts as a trailing indicator (e.g., dropdown caret `expand_more`, forward arrow), you MUST add the `iconPositionEnd` attribute (`<mat-icon iconPositionEnd>expand_more</mat-icon>`).
   - **Form-Level Inputs vs. Inline Typographic Controls**:
     - **Form-Level Inputs** (toolbars, dialogs, filter bars, standalone forms): Use `MatFormFieldModule` and `MatInputModule` / `MatSelectModule` wrapped in `<mat-form-field appearance="outline" subscriptSizing="dynamic">` with `<mat-label>` and `<input matInput>` / `<mat-select>`.
     - **Inline Typographic Controls** (editable numbers, years, or tokens embedded inside `<h1>`–`<h3>` headings, card titles, or sentences): NEVER embed `<mat-form-field>` or `<input type="number">` inside headings, as Material's 56px form-field height and native browser spinners break typographic baselines and clip short values. Instead, use the **Ghost Trigger pattern**: `<button mat-button [matMenuTriggerFor]="menu">` styled to inherit the heading's font size and baseline, with a subtle trailing caret (`<mat-icon iconPositionEnd>expand_more</mat-icon>`) in `var(--neutral-500)`.
   - **Containers & Surfaces**: Use `MatCardModule`:
     - Implement `<mat-card appearance="outlined">`, `<mat-card-header>`, `<mat-card-content>`, `<mat-card-actions>`.
   - **Chips & Badges**: Use `MatChipsModule` (`mat-chip-set`, `mat-chip`) and `MatBadgeModule` (`matBadge`).
   - **Feedback & Notifications**: Use `MatProgressBarModule`, `MatProgressSpinnerModule`, and `MatSnackBarModule` (`MatSnackBar`).
   - **Menus & Navigation**: Use `MatMenuModule`, `MatToolbarModule`, `MatSidenavModule`, and `MatListModule`.

3. **Styling & Theme Integration**:
   - Custom styling must consume centralized CSS Design Tokens from `src/styles.css` using `var(--...)`.
   - Do NOT override Material density, radius, or typography with hardcoded pixel hacks.
   - Dual light and dark theme compatibility (`[data-theme="dark"]` / `src/material-theme.scss`) must be maintained across all Material components.
