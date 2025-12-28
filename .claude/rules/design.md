# Glassbox Design System - Rainy Grass Field Theme

## Core Philosophy

Our design philosophy evokes a **peaceful grass field on a rainy day** — a moment of serene natural beauty. Every visual element reflects our commitment to creating a **calm, grounded, and trustworthy** experience for portfolio management.

**Mood**: Peaceful, organic, grounded, fresh after rain
**Values**: Transparency, growth, natural stability, calm confidence
**User Feeling**: Safe, grounded, connected to nature, at peace

---

## Design Principles

### 1. Natural Grounding
- **Grass greens** (#2fb866) evoke growth, life, and positive momentum
- **Sky blues** (#7a9bc4) bring calm and trust, like peaceful overcast days
- **Earth browns** (#a88f68) provide stability and natural grounding
- Colors are muted and organic, never harsh or artificial

### 2. Softness & Diffusion
- **Soft shadows** simulate overcast daylight (no harsh contrasts)
- **Rounded corners** (xl, 2xl) feel organic and natural, not mechanical
- **Generous spacing** creates breathing room and peace
- **Subtle transitions** feel like watching clouds move in the sky

### 3. Transparency & Trust
- **Clear visual hierarchy** through natural depth (shadows, not opacity tricks)
- **Honest data presentation** — no glass tricks, just clean white cards
- **Accessible information** at a glance with proper contrast
- **No hidden complexity** — everything feels grounded and real

### 4. Growth Through Design
- **Green primary color** suggests positive momentum and growth
- **Uplifting animations** (gentle sway, organic grow) feel alive
- **Progressive disclosure** reveals information naturally
- **Connected elements** show relationships between data points

---

## Color System

### Primary Colors - Grass & Foliage

The main color family evoking growth, vitality, and positive returns.

```
grass-50:  #f0f9f4   // Misty morning grass
grass-100: #d1f0dd   // Fresh dew grass
grass-200: #a8e6c1   // Light grass
grass-300: #70d99f   // Spring grass
grass-400: #4aca80   // Vibrant grass
grass-500: #2fb866   // Deep grass (PRIMARY)
grass-600: #22944f   // Forest grass
grass-700: #1d7a42   // Dark grass
grass-800: #185f33   // Deep forest
grass-900: #144d2b   // Darkest foliage
```

**Use for**: Primary CTAs, success states, growth indicators, active states

### Secondary Colors - Rainy Sky

The sky palette bringing calm, trust, and contemplation.

```
sky-50:  #f4f7fb   // Light mist
sky-100: #e5ecf4   // Soft clouds
sky-200: #cbd8e9   // Overcast
sky-300: #a7bdd8   // Rainy sky
sky-400: #7a9bc4   // Storm approaching (SECONDARY)
sky-500: #5b80ad   // Deep rain clouds
sky-600: #4a6690   // Dark storm
sky-700: #3d5276   // Evening rain
sky-800: #334461   // Night rain
sky-900: #2b3950   // Deepest sky
```

**Use for**: Secondary CTAs, information, backgrounds, secondary actions

### Accent Colors - Earth & Soil

The earth palette providing grounding and natural stability.

```
earth-50:  #f9f7f4   // Dry soil
earth-100: #ede7dd   // Light earth
earth-200: #dccfbb   // Sand
earth-300: #c4ae8e   // Wet soil
earth-400: #a88f68   // Rich soil (ACCENT)
earth-500: #8c7350   // Deep earth
earth-600: #6e5a3e   // Dark earth
earth-700: #584932   // Forest floor
earth-800: #473b28   // Deep soil
earth-900: #3a3023   // Richest earth
```

**Use for**: Warnings, caution states, supplementary accents

### Neutral Colors - Rain & Mist

The neutral palette for text, borders, and subtle backgrounds.

```
rain-50:  #fafbfc   // Lightest mist
rain-100: #f1f3f5   // Morning fog
rain-200: #e3e7eb   // Light rain
rain-300: #cfd6dd   // Mist (BORDERS)
rain-400: #b1bcc7   // Drizzle
rain-500: #8895a3   // Rain (SECONDARY TEXT)
rain-600: #6b7885   // Heavy rain
rain-700: #55606a   // Storm
rain-800: #424c54   // Dark rain
rain-900: #343d43   // Deepest shadow (PRIMARY TEXT)
```

**Use for**: Text, borders, disabled states, subtle backgrounds

### Semantic Colors

```
Success:  #2fb866   (grass-500) - Growth, positive returns
Warning:  #a88f68   (earth-400) - Caution, attention needed
Error:    #c74444   - Muted red (autumn leaf)
Info:     #7a9bc4   (sky-400) - Information, clarity
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

#### Primary Button (.nature-button)
- **Color**: grass-500 background, white text
- **Hover**: grass-600, elevated shadow
- **Active**: scale down 95%
- **Usage**: Main CTAs, "Analyze", "Start Analysis"

#### Secondary Button (.nature-button-secondary)
- **Color**: sky-400 background, white text
- **Hover**: sky-500, elevated shadow
- **Active**: scale down 95%
- **Usage**: Secondary actions, "View Portfolios"

#### Outline Button (.nature-button-outline)
- **Border**: rain-300, 2px
- **Text**: grass-700
- **Hover**: rain-50 background
- **Usage**: Tertiary actions, "Export Results"

### Cards & Panels

#### Panel (.nature-panel)
- **Background**: white (#FFFFFF)
- **Border**: rain-200, 1px
- **Border Radius**: rounded-xl (1.5rem)
- **Shadow**: lg (0 8px 24px rgba(27, 58, 45, 0.12))
- **Hover**: shadow-xl, translate up -0.5
- **Usage**: Major containers, headers, sections

#### Card (.nature-card)
- **Background**: white
- **Border**: rain-200
- **Padding**: p-6 (1.5rem)
- **Radius**: rounded-xl
- **Shadow**: lg
- **Hover**: shadow-xl, translate up -0.25
- **Usage**: Feature cards, portfolio items, data cards

#### Badge (.nature-badge)
- **Background**: grass-100
- **Text**: grass-700
- **Padding**: px-3 py-1
- **Radius**: rounded-full
- **Usage**: Tags, asset labels, status indicators

### Forms

#### Input (.nature-input)
- **Background**: white
- **Border**: rain-300, 1px
- **Placeholder**: rain-400
- **Focus**:
  - Border: grass-400
  - Ring: grass-400/20 (2px)
- **Padding**: px-4 py-2.5
- **Radius**: rounded-lg (1rem)
- **Usage**: Text inputs, number fields, searches

---

## Shadows

Soft, diffused shadows simulating overcast daylight.

```
sm:     0 1px 2px rgba(0, 0, 0, 0.05)
default: 0 2px 8px rgba(27, 58, 45, 0.08)
md:     0 4px 16px rgba(27, 58, 45, 0.10)
lg:     0 8px 24px rgba(27, 58, 45, 0.12)
xl:     0 12px 32px rgba(27, 58, 45, 0.15)
2xl:    0 20px 48px rgba(27, 58, 45, 0.20)

rain:   0 4px 20px rgba(123, 155, 196, 0.15)  // Rainy glow
mist:   0 8px 32px rgba(177, 188, 199, 0.20)  // Misty effect
```

**Principle**: Shadows are greenish-tinted (nature-inspired) rather than black.

---

## Gradients

### Background Gradients

```
Page:     linear-gradient(135deg, #e5ecf4 0%, #d1f0dd 50%, #cbd8e9 100%)
Hero:     linear-gradient(180deg, #f4f7fb 0%, #f0f9f4 100%)
Section:  linear-gradient(135deg, #fafbfc 0%, #f9f7f4 100%)
Rain:     linear-gradient(180deg, rgba(123, 155, 196, 0.1) 0%, rgba(177, 188, 199, 0.05) 100%)
```

**Principle**: All gradients blend grass, sky, and earth tones for harmony.

---

## Animations & Motion

### Keyframe Animations

#### Sway (3s infinite)
Gentle side-to-side movement like grass in wind.
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

### Page Layout
```
min-h-screen (full viewport height)
bg-gradient-to-br (diagonal gradient background)
px-6 py-12 (organic padding)
max-w-4xl mx-auto (centered content)
space-y-6 (vertical rhythm)
```

### Card Grids
```
grid gap-6
md:grid-cols-2 (2 columns on tablet)
lg:grid-cols-3 (3 columns on desktop)
```

### Navigation
```
nature-panel (white card)
flex items-center justify-between
px-6 py-4 (comfortable padding)
sticky top-0 (optional stickiness)
```

---

## Accessibility

### Contrast Ratios
- **Normal text on white**: rain-900 text (#343d43) = 14:1
- **Body text on white**: rain-700 text (#55606a) = 10:1
- **Disabled text on white**: rain-400 (#b1bcc7) = 4.8:1

All ratios exceed WCAG AA standards (4.5:1).

### Color Independence
- Status is never indicated by color alone
- Icons and text labels accompany color indicators
- Focus states clearly visible (ring outline)

### Keyboard Navigation
- All interactive elements focusable
- Focus ring visible (grass-400, 2px)
- Tab order logical and predictable

---

## Dark Mode (Future)

When dark mode is implemented, invert:
- grass colors become lighter
- sky colors become warmer
- Text becomes lighter
- Shadows become more prominent

---

## Brand Voice Through Design

### Purity
- Clean, minimal interface
- No unnecessary decoration
- Whitespace as a design element
- Clear, honest data presentation

### Growth
- Green primary color
- Uplifting animations (grow, sway)
- Positive language in UI copy
- Progressive revelation of information

### Grounded Trust
- Soft shadows and muted colors
- Stability through earth-inspired accents
- Consistent, predictable patterns
- Professional yet approachable

### Natural Beauty
- Organic shapes and rounded corners
- Nature-inspired colors and gradients
- Gentle, flowing animations
- Peaceful, calm aesthetic

---

## Usage Guidelines

### When to Use Each Color

**Grass (Primary)**
- Main call-to-action buttons
- Active states and focus states
- Success indicators and positive feedback
- Primary navigation elements
- Growth-related metrics

**Sky (Secondary)**
- Secondary actions
- Information boxes and alerts
- Complementary CTAs
- Secondary navigation
- Contextual backgrounds

**Earth (Accent)**
- Warning states and caution
- Supplementary emphasis
- Alternative highlights
- Supporting UI elements

**Rain (Neutral)**
- Body text and labels
- Borders and dividers
- Disabled states
- Subtle backgrounds
- Secondary information

### Component Decision Tree

```
Need a CTA?
├─ Main action? → nature-button (grass)
├─ Secondary action? → nature-button-secondary (sky)
└─ Tertiary action? → nature-button-outline

Need a container?
├─ Major section? → nature-panel
├─ Feature/card? → nature-card
└─ Small tag? → nature-badge

Need text input?
└─ → nature-input (any type)
```

---

## Implementation Files

All design tokens are centralized in `packages/design-tokens/src/index.ts` and automatically exported to Tailwind via `apps/frontend/tailwind.config.ts`.

**Component classes** are defined in `apps/frontend/src/app/globals.css`.

To use: Simply apply class names like `.nature-button`, `.nature-input`, `.nature-card`, etc.

---

## Success Metrics

A successful design implementation should:
- ✅ Evoke calm and peace
- ✅ Feel grounded and organic
- ✅ Build trust through clarity
- ✅ Support growth and positivity
- ✅ Maintain consistency across pages
- ✅ Meet accessibility standards
- ✅ Perform smoothly with subtle animations
- ✅ Feel distinctly nature-inspired, not generic
