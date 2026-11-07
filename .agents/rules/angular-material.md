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
   - **Form Fields & Inputs**: Use `MatFormFieldModule` and `MatInputModule`:
     - Wrap all text, number, date inputs in `<mat-form-field appearance="outline" subscriptSizing="dynamic">` with `<mat-label>` and `<input matInput>` / `<textarea matInput>`.
   - **Selects & Dropdowns**: Use `MatSelectModule`:
     - Implement `<mat-select>` and `<mat-option>` inside `<mat-form-field appearance="outline">`.
   - **Containers & Surfaces**: Use `MatCardModule`:
     - Implement `<mat-card appearance="outlined">`, `<mat-card-header>`, `<mat-card-content>`, `<mat-card-actions>`.
   - **Chips & Badges**: Use `MatChipsModule` (`mat-chip-set`, `mat-chip`) and `MatBadgeModule` (`matBadge`).
   - **Feedback & Notifications**: Use `MatProgressBarModule`, `MatProgressSpinnerModule`, and `MatSnackBarModule` (`MatSnackBar`).
   - **Menus & Navigation**: Use `MatMenuModule`, `MatToolbarModule`, `MatSidenavModule`, and `MatListModule`.

3. **Styling & Theme Integration**:
   - Custom styling must consume centralized CSS Design Tokens from `src/styles.css` using `var(--...)`.
   - Do NOT override Material density, radius, or typography with hardcoded pixel hacks.
   - Dual light and dark theme compatibility (`[data-theme="dark"]` / `src/material-theme.scss`) must be maintained across all Material components.
