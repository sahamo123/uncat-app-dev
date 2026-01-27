# DaxHive Design System

## Color Palette

### 1. Primary Color (Brand Core & Navigation)
**Deep Midnight Navy**
- Hex: `#0F172A`
- Usage: Sidebar navigation, top headers, main text headings, footer
- CSS Variable: `--color-primary`

### 2. Background Colors (The Canvas)
**Clean White / Pale Mist**
- Main Content: `#FFFFFF`
- Side Panels/Sections: `#F8FAFC`
- Usage: Dashboard background, content areas
- CSS Variables: 
  - `--color-bg-main: #FFFFFF`
  - `--color-bg-secondary: #F8FAFC`

### 3. Accent / Call-to-Action (The "Click" Button)
**Electric Coral / Mars Red**
- Primary CTA: `#F43F5E`
- Hover State: `#E11D48`
- Usage: **Buttons only** (e.g., "Sign Up," "Run Automation," "Book Demo")
- CSS Variable: `--color-accent`

### 4. Functional Status Colors (For Data)
- **Success/Profit**: Mint Green `#10B981`
- **Pending/Warning**: Amber Gold `#F59E0B`
- **Error/Loss**: (Suggested) Red `#EF4444`
- **Info/Neutral**: (Suggested) Sky Blue `#0EA5E9`

## CSS Variables (Global Stylesheet)

```css
:root {
  /* Brand Colors */
  --color-primary: #0F172A;
  --color-accent: #F43F5E;
  --color-accent-hover: #E11D48;
  
  /* Backgrounds */
  --color-bg-main: #FFFFFF;
  --color-bg-secondary: #F8FAFC;
  
  /* Status Colors */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #0EA5E9;
  
  /* Text */
  --color-text-primary: #0F172A;
  --color-text-secondary: #64748B;
  --color-text-muted: #94A3B8;
}
```

## Typography
- **Primary Font**: Inter (Google Fonts)
- **Headings**: Bold, Letter-spacing: -0.02em
- **Body**: Regular (400), Line-height: 1.6

## Component Specifications

### Button Styles
```css
.btn-primary {
  background-color: var(--color-accent);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: var(--color-accent-hover);
}
```

### Navigation Sidebar
```css
.sidebar {
  background-color: var(--color-primary);
  color: white;
}
```

### Status Badges
```css
.badge-success {
  background-color: var(--color-success);
  color: white;
}

.badge-warning {
  background-color: var(--color-warning);
  color: white;
}
```
