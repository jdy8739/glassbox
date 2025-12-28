# Glassbox Design System - Glassmorphic Nature Theme

## Core Philosophy

Our design philosophy combines **premium glassmorphism with nature-inspired grounding and vibrant accent colors**. Frosted glass cards with colorful gradient overlays float above dark nature-inspired backgrounds, creating a sophisticated yet dynamic interface that feels both professional and alive. Every visual element reflects our commitment to **transparency, clarity, natural beauty, and visual excitement** in portfolio management.

**Mood**: Premium, dynamic, grounded, sophisticated
**Values**: Transparency, growth, natural stability, refined trust, creative expression
**User Feeling**: Professional, inspired, confident, grounded in nature with creative flair

---

## Design Principles

### 1. Glassmorphism with Depth
- **Semi-transparent glass cards** with real `backdrop-filter: blur()` effects
- **Frosted glass appearance** with subtle borders (rgba(255, 255, 255, 0.15-0.25))
- **Layered depth** through multiple glass surfaces
- **Real blur effects** that reveal content underneath while maintaining focus

### 2. Nature-Grounded Backgrounds
- **Dark green-tinted gradients** (#1a3a2a to #2d5a45) simulating soil and grass
- **Fixed backgrounds** that don't scroll, anchoring the experience
- **Soft, muted tones** that feel natural and organic
- **No harsh contrasts** — everything feels peaceful and welcoming

### 3. Bright Green Accents
- **Grass green (#2fb866)** as primary action color — bright and energetic
- **Clear, high-contrast CTAs** stand out against glass backgrounds
- **Growth-oriented feel** with nature-inspired primary color
- **Professional yet approachable** tone

### 4. Clean Typography & Hierarchy
- **White text on glass** for maximum readability
- **Green headings** to guide focus and show importance
- **Transparent text layers** (white/60, white/70, white/80) for hierarchy
- **Clear visual structure** through typography rather than decoration

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

### Accent Colors - Point Colors

Vibrant colors for visual interest and feature differentiation.

```
purple:  #a78bfa   // Elegant purple for premium features
coral:   #ff6b6b   // Vibrant coral/red for risk/hedging
gold:    #fbbf24   // Warm gold for premium features
cyan:    #06b6d4   // Cool cyan for data/analysis
pink:    #ec4899   // Vibrant pink for special highlights
indigo:  #6366f1   // Deep indigo for advanced features
```

**Use for**: Feature cards, badges, gradient overlays, visual differentiation, accent elements

### Secondary Accent Colors - Earth & Soil

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
- **Background**: grass-500 (#2fb866) — bright green accent
- **Text**: white
- **Hover**: grass-600 with elevated shadow
- **Active**: scale down 95%
- **Usage**: Main CTAs, "Analyze", "Start Analysis", "Add", "Save"
- **Note**: Stands out clearly against glass backgrounds

#### Secondary Button (.nature-button-secondary)
- **Background**: sky-400 (#7a9bc4) — secondary accent
- **Text**: white
- **Hover**: sky-500 with elevated shadow
- **Active**: scale down 95%
- **Usage**: Secondary actions, "View Portfolios"

#### Outline Button (.nature-button-outline)
- **Background**: rgba(255, 255, 255, 0.1) with `backdrop-filter: blur(8px)`
- **Border**: white/30, 2px
- **Text**: white
- **Hover**: border white/50 with increased shadow
- **Usage**: Tertiary actions, "Export Results"

### Cards & Panels

#### Panel (.nature-panel)
- **Background**: rgba(255, 255, 255, 0.15) with `backdrop-filter: blur(10px)`
- **Border**: white/20, 1px
- **Border Radius**: rounded-2xl (2rem)
- **Shadow**: 0 8px 32px rgba(0, 0, 0, 0.1)
- **Hover**: border white/30, shadow-xl, translate up -0.5
- **Usage**: Major containers, headers, sections

#### Card (.nature-card)
- **Background**: rgba(255, 255, 255, 0.15) with `backdrop-filter: blur(10px)`
- **Border**: white/20, 1px
- **Padding**: p-6 (1.5rem)
- **Radius**: rounded-2xl
- **Shadow**: 0 8px 32px rgba(0, 0, 0, 0.1)
- **Hover**: border white/30, shadow-xl, translate up -1
- **Usage**: Feature cards, portfolio items, data cards

#### Badge (.nature-badge)
- **Background**: rgba(47, 184, 102, 0.3) with `backdrop-filter: blur(4px)`
- **Border**: white/20, 1px
- **Text**: white
- **Padding**: px-3 py-1
- **Radius**: rounded-full
- **Usage**: Tags, asset labels, status indicators

##### Badge Variants
- `.nature-badge.purple` - Purple tinted badge
- `.nature-badge.coral` - Coral/red tinted badge
- `.nature-badge.gold` - Gold tinted badge
- `.nature-badge.cyan` - Cyan tinted badge

#### Card with Gradient (.nature-card-gradient)
- Extends `.nature-card` with colorful gradient overlay
- Overlay opacity: 0.4 for subtle effect
- **Variants**:
  - `.purple-blue` - Purple to blue gradient
  - `.coral-pink` - Coral to pink gradient
  - `.gold-cyan` - Gold to cyan gradient
  - `.indigo-green` - Indigo to green gradient
- **Usage**: Feature cards, differentiated content cards, visual hierarchy

### Forms

#### Input (.nature-input)
- **Background**: rgba(255, 255, 255, 0.1) with `backdrop-filter: blur(8px)`
- **Border**: white/20, 1px
- **Text**: rain-900 (dark text for readability)
- **Placeholder**: white/50
- **Focus**:
  - Border: grass-400
  - Ring: grass-400/20 (2px)
- **Padding**: px-4 py-2.5
- **Radius**: rounded-lg (1rem)
- **Usage**: Text inputs, number fields, searches

---

## Shadows

Soft shadows for glassmorphic depth — subtle and dark-tinted.

```
sm:     0 4px 6px rgba(0, 0, 0, 0.07)
default: 0 8px 32px rgba(0, 0, 0, 0.1)
md:     0 12px 48px rgba(0, 0, 0, 0.15)
lg:     0 8px 32px rgba(0, 0, 0, 0.1)
xl:     0 16px 64px rgba(0, 0, 0, 0.2)
```

**Principle**: Shadows create depth for floating glass cards without feeling heavy. Dark shadows on dark backgrounds maintain the premium aesthetic.

---

## Page Background

```
Base Gradient: linear-gradient(135deg, #1a3a2a 0%, #2d5a45 50%, #1a3a2a 100%)
Fixed: background-attachment: fixed (doesn't scroll)
Color Intent: Dark green gradient evoking soil and grass roots
```

**Principle**: The fixed, dark background anchors the entire experience while frosted glass cards float above it. This creates visual depth and sophistication while maintaining nature grounding.

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
- **Primary Headings**: White (#FFFFFF)
- **Secondary Text**: white/70 or white/80
- **Muted Text**: white/60
- **Accent Headings**: Colored spans (cyan, purple, gold, coral)

### Hero Heading Pattern
```
Large h1 with white base text
+ colored span with accent color
Creates visual interest while maintaining readability
```

**Example**: "Build Your **Portfolio**" (Portfolio in cyan-300)

### Section Titles
```
.section-title: text-4xl font-bold text-white
.section-subtitle: text-lg text-white/70
Always paired together for clarity
```

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

### Hero Section
```
py-24 sm:py-32 (generous vertical padding)
max-w-4xl mx-auto (centered, narrow for text)
text-center (centered alignment)
space-y-6-8 (large vertical spacing)

Heading Structure:
- Large h1 with gradient text span
- Supporting paragraph in white/70
- CTA buttons below heading
```

### Feature Grid Section
```
py-20 sm:py-28 (large vertical padding)
max-w-6xl mx-auto (wide container)
grid gap-6 (consistent spacing)
md:grid-cols-2 lg:grid-cols-3 (responsive)

Each feature card uses .nature-card-gradient
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
nature-panel (glassmorphic header)
flex items-center justify-between
px-6 py-4 (comfortable padding)
mx-4 mt-4 (inset from edges)
White text, green primary button
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

### Premium & Sophisticated
- Glassmorphic design with real blur effects
- Layered depth and visual hierarchy
- Gradient overlays for visual interest
- Professional, refined aesthetic

### Growth & Positivity
- Green primary color for actions and success
- Uplifting, forward-moving design
- Energetic accent colors (purple, coral, gold)
- Progressive revelation of information
- Dynamic visual hierarchy

### Grounded & Trustworthy
- Dark nature-inspired background
- Stable, consistent component patterns
- Clear visual structure
- Professional yet approachable tone
- Transparent, honest presentation

### Creative & Expressive
- Point accent colors (purple, coral, gold, cyan)
- Gradient overlays on feature cards
- Colorful badges and labels
- Visual diversity without chaos
- Playful yet professional

### Natural Beauty
- Nature-inspired color palette
- Organic, rounded shapes (rounded-2xl)
- Gentle animations and transitions
- Peaceful base aesthetic
- Peaceful dark background grounded in nature

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
