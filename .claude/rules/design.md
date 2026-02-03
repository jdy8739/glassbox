# Glassbox Design System - Modern Glassmorphism

## Core Philosophy

Our design philosophy combines **premium glassmorphism with modern slate and cyan aesthetics**. Semi-transparent glass panels with higher opacity float above clean slate backgrounds, creating a sophisticated yet tech-forward interface that feels both professional and fresh. Every visual element reflects our commitment to **transparency, clarity, modern sophistication, and visual elegance** in portfolio management.

**Mood**: Premium, modern, clean, sophisticated
**Values**: Transparency, clarity, tech-forward design, refined trust, minimalism
**User Feeling**: Professional, confident, modern, empowered

---

## Design Principles

### 1. Glassmorphism with Clean Aesthetics
- **Higher opacity glass** (0.6-0.8) for better readability with black/white primary colors
- **Frosted glass appearance** with backdrop blur effects
- **Layered depth** through multiple glass surfaces
- **Real blur effects** that reveal content underneath while maintaining focus

### 2. Clean, Minimal Backgrounds
- **Neutral slate gradients** (#f8fafc to #e2e8f0 light mode, #0f172a to #1e293b dark mode)
- **Subtle texture overlays** for depth without visual noise
- **Fixed backgrounds** that anchor the experience
- **No competing colors** — clean and professional

### 3. Cyan Accent Colors
- **Cyan (#06b6d4)** as primary action color — modern and tech-forward
- **Clear, high-contrast CTAs** stand out against glass backgrounds
- **Tech-forward feel** with contemporary aesthetic
- **Professional yet approachable** tone

### 4. Black & White Primary Colors
- **Black buttons** with cyan border accents (light mode)
- **White buttons** with cyan accents (dark mode)
- **Maximum contrast** for accessibility and clarity
- **Simple, elegant** visual hierarchy

### 5. Clean Typography & Hierarchy
- **White text on glass** for maximum readability
- **Slate headings** for clear visual structure
- **Transparent text layers** (white/60, white/70, white/80) for hierarchy
- **Clear visual structure** through consistent typography

---

## Color System

### Primary Colors - Slate Neutrals

Professional, clean gray tones that serve as the foundation for the design system.

```
slate-50:  #f8fafc   // Lightest - backgrounds, very subtle elements
slate-100: #f1f5f9   // Very light - secondary backgrounds
slate-200: #e2e8f0   // Light - borders, subtle backgrounds
slate-300: #cbd5e1   // Light-mid - secondary borders
slate-400: #94a3b8   // Mid - disabled states
slate-500: #64748b   // Mid - secondary text
slate-600: #475569   // Mid-dark - body text
slate-700: #334155   // Dark - headings
slate-800: #1e293b   // Very dark - dark mode glass
slate-900: #0f172a   // Darkest - dark mode backgrounds
slate-950: #020617   // Black - dark mode darkest
```

**Use for**: Text, borders, disabled states, subtle backgrounds, dark mode surfaces

### Primary Accent Color - Cyan

Modern, tech-forward blue-green color for primary interactions and highlights.

```
cyan-50:  #ecfeff   // Lightest - hover states
cyan-100: #cffafe   // Very light - inactive states
cyan-200: #a5f3fc   // Light - subtle accents
cyan-300: #67e8f9   // Light-mid - secondary highlights
cyan-400: #22d3ee   // Mid - focus states, secondary actions
cyan-500: #06b6d4   // Primary - CTAs, primary actions (PRIMARY)
cyan-600: #0891b2   // Dark - hover states
cyan-700: #0e7490   // Darker - active states
cyan-800: #155e75   // Very dark - dark mode
cyan-900: #164e63   // Darkest - dark mode
```

**Use for**: Primary CTAs, success states, active states, focus indicators, data visualization accents, border highlights

### Alert Color - Coral/Red

Vibrant red tones for warnings, risk indicators, and urgent actions.

```
coral-50:  #fef2f2   // Lightest
coral-100: #fee2e2   // Very light
coral-200: #fecaca   // Light
coral-300: #fca5a5   // Light-mid
coral-400: #f87171   // Mid
coral-500: #ef4444   // Primary - Warnings, alerts (PRIMARY)
coral-600: #dc2626   // Dark - hover states
coral-700: #b91c1c   // Darker - active states
coral-800: #991b1b   // Very dark
coral-900: #7f1d1d   // Darkest
```

**Use for**: Warning states, risk indicators, hedging features, error messages, destructive actions

### Semantic Colors

Meaning-based colors with consistent usage patterns.

```
success:  #06b6d4   // cyan-500 - Positive outcomes, growth
warning:  #f59e0b   // amber-500 - Caution, needs attention
error:    #ef4444   // coral-500 - Failed actions, critical alerts
info:     #3b82f6   // blue-500 - Information, helpful tips
```

**Use for**: Success/error/warning messages, status indicators, semantic meaning

### Special Colors

```
white:       #ffffff    // For text on dark, button text
black:       #000000    // For primary buttons, dark text
transparent: transparent // For overlay effects
```

---

## Typography

### Font Families

```
Display:  Newsreader, Georgia, serif
          (Elegant, natural, sophisticated headings)

Body:     Inter, system-ui, sans-serif
          (Clean, readable, modern body text)

Mono:     JetBrains Mono, monospace
          (Code, numerical data, precise information)
```

### Scale

```
xs:   0.75rem   (12px)  - Small labels, hints
sm:   0.875rem  (14px)  - Secondary text, captions
base: 1rem      (16px)  - Body text (default)
lg:   1.125rem  (18px)  - Large body, section intro
xl:   1.25rem   (20px)  - Slightly large
2xl:  1.5rem    (24px)  - Section heading
3xl:  1.875rem  (30px)  - Page section
4xl:  2.25rem   (36px)  - Page heading
5xl:  3rem      (48px)  - Hero heading
6xl:  3.75rem   (60px)  - Main title
```

### Line Heights

```
tight:    1.25   (Code, dense information)
snug:     1.375  (Headings)
normal:   1.5    (Body text - default)
relaxed:  1.625  (Long-form content)
loose:    2      (Very open, airy)
```

---

## Spacing System

Based on 4px base unit, creating organic rhythm.

```
px:  1px
0:   0
1:   0.25rem  (4px)
2:   0.5rem   (8px)
3:   0.75rem  (12px)
4:   1rem     (16px) - Base unit
5:   1.25rem  (20px)
6:   1.5rem   (24px)
8:   2rem     (32px)
10:  2.5rem   (40px)
12:  3rem     (48px)
16:  4rem     (64px)
20:  5rem     (80px)
24:  6rem     (96px)
```

---

## Component Library

### Buttons

#### Primary Button (.glass-button)
- **Background**: Black (#000000) with cyan border
- **Text**: White
- **Border**: Cyan with 30% opacity
- **Hover**: Slate-800 with increased border opacity
- **Dark Mode**: White background with cyan accent
- **Usage**: Main CTAs, "Analyze", "Save", "Start Analysis"
- **Note**: High contrast with glassmorphic design

#### Secondary Button (.glass-button-secondary)
- **Background**: Cyan-500 (#06b6d4)
- **Text**: White
- **Hover**: Cyan-600 with elevated shadow
- **Dark Mode**: Cyan-400
- **Usage**: Secondary actions, "View More", "Learn"

#### Outline Button (.glass-button-outline)
- **Background**: White/10 with backdrop blur
- **Border**: White/30, 1px
- **Text**: White
- **Hover**: White/20 with increased shadow
- **Usage**: Tertiary actions, "Export", "Cancel"

### Cards & Panels

#### Panel (.glass-panel)
- **Background**: White/70 with backdrop blur
- **Border**: White/40, 1px
- **Shadow**: Elevation shadow
- **Dark Mode**: Slate-900/70 with white/10 border
- **Hover**: Elevated shadow and slight translate
- **Usage**: Major containers, headers, sections

#### Card (.glass-card)
- **Background**: White/60 with backdrop blur
- **Border**: White/30, 1px
- **Padding**: p-6 (1.5rem)
- **Shadow**: Moderate elevation
- **Dark Mode**: Slate-800/60 with white/10 border
- **Hover**: Lifted with enhanced shadow
- **Usage**: Feature cards, portfolio items, metric displays

#### Badge (.glass-badge)
- **Background**: Cyan-500/20 with backdrop blur
- **Border**: Cyan-500/30, 1px
- **Text**: Cyan-900 (light), Cyan-100 (dark)
- **Padding**: px-3 py-1
- **Radius**: rounded-full
- **Usage**: Tags, asset labels, status indicators

##### Badge Variants
- `.glass-badge.coral` - Coral/red tinted badge for warnings and risk

#### Card with Gradient (.glass-card-gradient)
- Extends `.glass-card` with colorful gradient overlay
- Overlay opacity: subtle for refined effect
- **Variants**:
  - `.cyan-blue` - Cyan to blue gradient (modern tech, primary features)
  - `.cyan-purple` - Cyan to purple gradient (premium features)
  - `.coral-pink` - Coral to pink gradient (alerts, risk)
  - `.slate-glow` - Slate gradient (neutral, grounding)
- **Usage**: Feature showcases, differentiated content cards

### Forms

#### Input (.glass-input)
- **Background**: White/60 with backdrop blur
- **Border**: White/30, 1px
- **Text**: Slate-900
- **Placeholder**: Slate-400
- **Focus**: Cyan-500 border with cyan ring
- **Dark Mode**: Slate-800/60 background, white text
- **Padding**: px-4 py-3
- **Radius**: rounded-lg (1rem)
- **Usage**: Text inputs, number fields, searches

---

## Shadows

Soft shadows for glassmorphic depth — subtle and refined.

```
sm:     0 4px 6px rgba(0, 0, 0, 0.05)
default: 0 8px 32px rgba(0, 0, 0, 0.1)
md:     0 12px 48px rgba(0, 0, 0, 0.15)
lg:     0 8px 32px rgba(0, 0, 0, 0.1)
xl:     0 16px 64px rgba(0, 0, 0, 0.2)
```

**Principle**: Shadows create depth for floating glass cards without feeling heavy. Subtle elevation effects maintain the premium aesthetic.

---

## Page Background

```
Light Mode: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)
Dark Mode:  linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)
Fixed: background-attachment: fixed (doesn't scroll)
Texture: SVG noise overlay at 5% opacity for subtle depth
```

**Principle**: The fixed, clean background anchors the entire experience while frosted glass cards float above it. Subtle texture adds depth without visual distraction.

---

## Typography Hierarchy

### Heading Scale
```
h1: text-5xl sm:text-6xl font-bold
h2: text-4xl font-bold
h3: text-2xl font-bold
h4: text-xl font-semibold
```

### Text Colors
- **Primary Headings**: Slate-900 (light), White (dark)
- **Secondary Text**: Slate-700 (light), White/80 (dark)
- **Muted Text**: Slate-600 (light), White/60 (dark)
- **Accent Headings**: Cyan spans for emphasis

### Hero Heading Pattern
```
Large h1 with slate base text
+ cyan accent span
Creates modern, tech-forward feel
```

**Example**: "Optimize Your **Portfolio**" (Portfolio in cyan)

### Section Titles
```
.section-title: text-4xl font-bold text-slate-900 dark:text-white
.section-subtitle: text-lg text-slate-900/70 dark:text-white/70
Always paired together for clarity
```

---

## Animations & Motion

### Keyframe Animations

#### Sway (3s infinite)
Gentle side-to-side movement like wind.
```
0%, 100%: translateX(0) rotate(0deg)
50%:      translateX(2px) rotate(1deg)
```

#### Fall (1s infinite)
Simulates gentle rainfall.
```
0%:   translateY(-100%), opacity: 0
50%:  opacity: 0.5
100%: translateY(100vh), opacity: 0
```

#### Drift (8s infinite)
Slow horizontal movement like clouds.
```
0%, 100%: translateX(0)
50%:      translateX(20px)
```

#### Grow (0.6s ease-out)
Entrance animation for elements.
```
0%:   scale(0.95), opacity: 0.8
100%: scale(1), opacity: 1
```

### Transition Principles

- **Fast interactions**: 200ms (button hover, focus states)
- **Component changes**: 300ms (panel hover, tab switch)
- **Page transitions**: 400ms (fade in/out)
- **Easing**: ease-in-out for natural motion

---

## Layout Patterns

### Hero Section
```
py-24 sm:py-32 (generous vertical padding)
max-w-4xl mx-auto (centered, narrow for text)
text-center (centered alignment)
space-y-6-8 (large vertical spacing)

Heading Structure:
- Large h1 with gradient text span
- Supporting paragraph in slate-700
- CTA buttons below heading
```

### Feature Grid Section
```
py-20 sm:py-28 (large vertical padding)
max-w-6xl mx-auto (wide container)
grid gap-6 (consistent spacing)
md:grid-cols-2 lg:grid-cols-3 (responsive)

Each feature card uses .glass-card-gradient
Cards have emoji icon, heading, description, badges
```

### Page Layout
```
min-h-screen (full viewport height)
p-6 (horizontal padding)
mx-auto max-w-4xl or max-w-6xl (centered container)
space-y-6-8 (vertical section spacing)
```

### Navigation (Top Bar)
```
.glass-panel (glassmorphic header)
flex items-center justify-between
px-6 py-4 (comfortable padding)
mx-4 mt-4 (inset from edges)
White text, cyan primary button
```

---

## Accessibility

### Contrast Ratios
- **Black button on white**: 21:1 (AAA)
- **Cyan on white**: 5.2:1 (AA)
- **Body text on white**: 12:1+ (AA)
- **Disabled text**: 4.8:1 (AA)

All ratios meet or exceed WCAG AA standards.

### Color Independence
- Status is never indicated by color alone
- Icons and text labels accompany color indicators
- Focus states clearly visible (cyan ring)

### Keyboard Navigation
- All interactive elements focusable
- Focus ring visible (cyan, 2px)
- Tab order logical and predictable

---

## Dark Mode - Complete Implementation

Dark mode provides a premium, eye-friendly alternative to light mode while maintaining all design principles.

### Dark Mode Philosophy

**Dark Mode Characteristics:**
- **Dark backgrounds**: Slate-900 to slate-800 gradient
- **Light text**: White on semi-transparent slate for readability
- **Brighter cyan accents**: More vibrant for contrast
- **Subtle glassmorphism**: Darker glass overlays on dark backgrounds
- **Enhanced shadows**: More pronounced for depth perception

### Dark Mode Color System

**Dark Slate** - Inverted light-to-dark spectrum
```
Dark backgrounds use: #0f172a to #1e293b
Dark glass uses: rgba(15, 23, 42, 0.6-0.8)
Lighter shades for text and accents
```

**Dark Cyan** - Brighter for contrast
```
Bright cyan used for visibility: #22d3ee to #06b6d4
Same semantic meaning as light mode
```

**Dark Coral** - Brighter for alerts
```
Brighter coral for urgency: #f87171 to #ef4444
Enhanced visibility on dark backgrounds
```

### Dark Mode Glassmorphism

Adjusted glass effects for visibility:

```
Glass Layers (Dark Mode):
- sm:    background: rgba(15, 23, 42, 0.6), blur: 8px
- default: background: rgba(15, 23, 42, 0.7), blur: 12px
- lg:    background: rgba(15, 23, 42, 0.75), blur: 16px
- xl:    background: rgba(15, 23, 42, 0.8), blur: 20px

Borders: rgba(255, 255, 255, 0.1 - 0.25)
Text: White (#ffffff) on glass
```

### Dark Mode Shadows

Enhanced shadows for depth perception:

```
sm:     0 4px 6px rgba(0, 0, 0, 0.3)
default: 0 8px 32px rgba(0, 0, 0, 0.4)
md:     0 12px 48px rgba(0, 0, 0, 0.5)
lg:     0 16px 64px rgba(0, 0, 0, 0.6)
xl:     0 20px 96px rgba(0, 0, 0, 0.7)
```

### Dark Mode Button Styles

- **Primary Button (Dark)**: White background with cyan border, black text
- **Secondary Button (Dark)**: Cyan-400 background
- **Outline Button (Dark)**: Slate-800/50 with white border

### Dark Mode Toggle

**Implemented in Header:**
- Sun/moon icon toggle in top navigation
- Uses HTML `<html class="dark">` for Tailwind dark mode
- User preference stored in localStorage (optional)
- System preference detection via `prefers-color-scheme`

### Dark Mode Advantages

✅ **Eye Comfort**: Reduces eye strain in low-light environments
✅ **Battery Efficiency**: Useful for OLED/mobile devices
✅ **Modern Feel**: Expected feature in premium applications
✅ **Brand Consistency**: Maintains design principles while adapting
✅ **Accessibility**: Options for users with light sensitivity

---

## Brand Voice Through Design

### Premium & Sophisticated
- Glassmorphic design with real blur effects
- Layered depth and visual hierarchy
- Clean, professional aesthetic
- Modern, refined look

### Tech-Forward & Modern
- Cyan primary color for contemporary feel
- Minimal, clean design without clutter
- Sleek glassmorphism with higher opacity
- Professional yet approachable tone

### Trustworthy & Clear
- Black/white primary colors for maximum clarity
- Stable, consistent component patterns
- Clear visual structure
- Transparent, honest presentation

### Accessible & Inclusive
- High contrast colors (black on white, cyan accents)
- Clear focus states and indicators
- Semantic color usage
- Professional, welcoming design

---

## Usage Guidelines

### When to Use Each Color

**Black (Primary)**
- Main call-to-action buttons (light mode)
- Primary text and headings
- High-contrast elements

**White (Primary)**
- Primary buttons in dark mode
- Text on dark backgrounds
- High-contrast elements

**Cyan (Accent)**
- Secondary actions
- Focus states and indicators
- Success indicators
- Data visualization accents
- Border highlights

**Coral (Alert)**
- Warning states and caution
- Risk indicators
- Error messages
- Destructive actions

**Slate (Neutral)**
- Body text and labels
- Borders and dividers
- Disabled states
- Subtle backgrounds

### Component Decision Tree

```
Need a CTA?
├─ Main action? → glass-button (black + cyan)
├─ Secondary action? → glass-button-secondary (cyan)
└─ Tertiary action? → glass-button-outline

Need a container?
├─ Major section? → glass-panel
├─ Feature/card? → glass-card
└─ Small tag? → glass-badge

Need text input?
└─ → glass-input (any type)
```

---

## Design Tokens Package

All design tokens are centralized in `packages/design-tokens/` and exported to Tailwind via `apps/web/tailwind.config.ts`.

### Package Structure

```
packages/design-tokens/src/
├── index.ts              # Main re-exports (light mode)
├── colors.ts             # Slate, cyan, coral, semantic colors
├── typography.ts         # Font families, sizes, weights, line heights
├── spacing.ts            # 4px grid system (0-24)
├── borderRadius.ts       # Border radius scale (none-full)
├── shadows.ts            # Elevation shadows (sm-2xl)
├── gradients.ts          # Background gradients (page, hero, section)
├── animations.ts         # Keyframe animations (sway, fall, drift, grow)
├── components.ts         # Component tokens (button, panel, input)
├── glass.ts              # Glassmorphism effects (sm-xl)
├── cardGradients.ts      # Card overlay gradients
└── dark/                 # Dark mode theme variants
    ├── colors.ts         # Dark mode color scales
    ├── glass.ts          # Dark mode glass effects
    ├── shadows.ts        # Dark mode enhanced shadows
    ├── gradients.ts      # Dark mode background gradients
    ├── components.ts     # Dark mode component tokens
    ├── cardGradients.ts  # Brighter overlays for dark mode visibility
    └── index.ts          # Dark mode re-exports
```

### Usage

**Import tokens in JavaScript:**
```typescript
import { colors, typography, spacing, glass } from '@glassbox/design-tokens';
import { darkColors, darkGlass } from '@glassbox/design-tokens/dark';

const primaryColor = colors.cyan[500];       // #06b6d4
const fontSize = typography.fontSize.base;   // 1rem
const padding = spacing[4];                  // 1rem
```

**Use in Tailwind CSS:**
All tokens are automatically available as Tailwind utilities:
```html
<button class="bg-black text-white border-cyan-500">Click</button>
<div class="px-4 py-2 text-base font-display">Heading</div>
<div class="dark:bg-slate-900/70 dark:backdrop-blur-md">Glass panel</div>
```

**Apply component classes:**
Component classes are defined in `apps/web/src/app/globals.css`:
```html
<button class="glass-button">Primary Action</button>
<div class="glass-panel">Glass Panel</div>
<input class="glass-input" placeholder="Enter text">
<span class="glass-badge">Tag</span>
```

---

## Success Metrics

A successful design implementation should:
- ✅ Feel clean and professional
- ✅ Be modern and tech-forward
- ✅ Support clarity and accessibility
- ✅ Maintain consistency across pages
- ✅ Meet accessibility standards
- ✅ Perform smoothly with subtle animations
- ✅ Feel premium and refined
- ✅ Support both light and dark modes
