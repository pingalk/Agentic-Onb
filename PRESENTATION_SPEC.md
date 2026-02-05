# Ray Agentic Dashboard - Presentation Specification

## Overview

This document provides complete specifications for the Ray presentation, including structure, content, styling, and technical implementation details.

---

## Table of Contents

1. [Architecture](#architecture)
2. [Scene Structure](#scene-structure)
3. [Content Specification](#content-specification)
4. [Visual Design System](#visual-design-system)
5. [Technical Implementation](#technical-implementation)
6. [Component Specifications](#component-specifications)
7. [Interaction Patterns](#interaction-patterns)

---

## Architecture

### High-Level Structure

The presentation consists of two main modes:

1. **Full-Page Mode** (Slides 0-2)
   - Title slide + 2 intro slides
   - 100% width, centered content
   - No prototype visible

2. **Split-Screen Mode** (Slides 3-8)
   - Left panel: 18% width, narrative content
   - Right panel: 82% width, interactive prototype in iframe
   - Synchronized scrolling based on prototype interactions

### Layout Transitions

- Title slide → Full-page intro slides → Split-screen content slides
- Transition triggered by "Enter Presentation" button
- `isFullPageMode = isTitleSlideActive || currentSection <= 2`

---

## Scene Structure

### Scene Types

#### 1. Title Slide (`isTitleSlide: true`)
```typescript
{
  id: 0,
  title: 'Ray',
  description: 'Agentic Dashboard',
  isTitleSlide: true,
  prototypeState: ""
}
```

#### 2. Full-Page Intro Slides (`isFullPageIntro: true`)

**Principles Slide:**
```typescript
{
  id: 1,
  title: 'Our Solution Principles',
  description: '',
  isFullPageIntro: true,
  principles: [
    {
      title: 'Human-in-the-Loop, Not Human-in-the-Way',
      description: 'The Agent drafts the strategy; the merchant provides the "Go/No-Go."'
    },
    {
      title: 'Trust Through Transparency',
      description: 'If the Agent takes 15 seconds to think, it shows its work. No "Black Box" logic.'
    },
    {
      title: 'Contextual Intelligence',
      description: 'The dashboard isn\'t static. It morphs based on the urgency of the financial event.'
    }
  ],
  prototypeState: ""
}
```

**Features Slide:**
```typescript
{
  id: 2,
  title: 'The Claude++ Standard',
  description: 'A commitment to LLM-Native Design',
  isFullPageIntro: true,
  features: [
    {
      title: 'Actionable UI',
      description: 'We don\'t just output text; we output Interactions. If the Agent suggests a payment link, it builds the link.'
    },
    {
      title: 'Zero-Stale Data',
      description: 'Every insight is anchored in time. In payments, an answer from 5 minutes ago is a liability.'
    }
  ],
  prototypeState: ""
}
```

#### 3. Content Slides (Split-Screen)
```typescript
{
  id: 3-8,
  title: string,
  description: string,
  designDecision: {
    title: string,
    content: string  // Multi-line with \n separators
  },
  prototypeState: "scene1" | "scene2" | ... | "scene6"
}
```

---

## Content Specification

### Slide 0: Title Slide
- **Title:** Ray
- **Subtitle:** Agentic Dashboard
- **CTA:** "Enter Presentation" button
- **Visual:** Ray logo (24×24 component), centered

### Slide 1: Our Solution Principles
- **Title:** Our Solution Principles
- **Layout:** 3-column grid
- **Principles:**
  1. Human-in-the-Loop, Not Human-in-the-Way
     - Icon: Users (group icon)
     - Description: The Agent drafts the strategy; the merchant provides the "Go/No-Go."

  2. Trust Through Transparency
     - Icon: Shield with checkmark
     - Description: If the Agent takes 15 seconds to think, it shows its work. No "Black Box" logic.

  3. Contextual Intelligence
     - Icon: Lightning bolt
     - Description: The dashboard isn't static. It morphs based on the urgency of the financial event.

### Slide 2: The Claude++ Standard
- **Title:** The Claude++ Standard
- **Subtitle:** A commitment to LLM-Native Design
- **Status Badge:** "System Status: Optimal" with animated pulse
- **Layout:** 2-column grid
- **Features:**
  1. Actionable UI
     - Icon: Cursor/click icon
     - Description: We don't just output text; we output Interactions. If the Agent suggests a payment link, it builds the link.

  2. Zero-Stale Data
     - Icon: Clock
     - Description: Every insight is anchored in time. In payments, an answer from 5 minutes ago is a liability.

### Slide 3: Talk, don't tap
- **Title:** Talk, don't tap
- **Design Decision Header:** Librarian, not Assistant
- **Content:**
  ```
  Agentic experience, front and center.
  Not a helper on the side.
  ```
- **Prototype State:** "" (initial state)

### Slide 4: The Hybrid Grid
- **Title:** The Hybrid Grid
- **Design Decision Header:** Familiarity meets Agency
- **Content:**
  ```
  Legacy Vitals stay at the bottom.
  Pulse on the numbers, drive through Agent.
  ```
- **Prototype State:** scene2
- **Trigger:** User scrolls down on Ray landing page (>200px)

### Slide 5: The base chat experience
- **Title:** The base chat experience
- **Design Decision Header:** Pinned and timestamped
- **Content:**
  ```
  Question stays at the top.
  Timestamp shows when data was pulled.
  No guessing about freshness.
  ```
- **Prototype State:** scene3
- **Badge:** "Razorpay Contextualised" (blue gradient)

### Slide 6: 15 seconds well spent
- **Title:** 15 seconds well spent
- **Design Decision Header:** Turn waiting into trust
- **Content:**
  ```
  Real-time progress.
  Not stalling—working.
  ```
- **Prototype State:** scene4

### Slide 7: A clean stage for actions
- **Title:** A clean stage for actions
- **Design Decision Header:** Focused Interruption
- **Content:**
  ```
  Modal blocks noise.
  Chat is one step away.
  Same experience everywhere.
  ```
- **Prototype State:** scene5
- **Badge:** "Claude++ Experience" (cyan gradient)

### Slide 8: This came from Ray
- **Title:** This came from Ray
- **Design Decision Header:** Attribution changes everything
- **Content:**
  ```
  Not just revenue.
  Agent-recovered revenue.
  Dashboard as growth engine.
  ```
- **Prototype State:** scene6

---

## Visual Design System

### Color Palette

**Primary Colors:**
- Pure Black: `#000000`
- White: `#ffffff`

**Accent Colors (Blue-Green Zone Only):**
- Blue: `#3b82f6` (blue-500)
- Cyan: `#06b6d4` (cyan-500)
- Teal: `#14b8a6` (teal-500)
- Green: `#10b981` (green-500)

**Gradients:**
- Blue-Cyan: `from-blue-500/20 to-cyan-500/20`
- Cyan-Blue: `from-cyan-400/20 to-blue-400/20`
- Green-Blue: `from-green-500/20 to-blue-500/20`

**No Purple:** All purple tones have been removed from the design.

### Typography

**Headings (Serif):**
- Font Family: `Georgia, "Times New Roman", Times, serif`
- Title Slide: 56px, light weight
- Full-Page Intro: 64px, light weight
- Content Slides: 32px, light weight
- Gradient: `linear-gradient(180deg, #ffffff 0%, #d0d0d0 100%)`
- `-webkit-background-clip: text`
- `-webkit-text-fill-color: transparent`

**Body Text (Sans-Serif):**
- Font Family: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- Subtitle: 16-18px, light weight, 50-60% opacity
- Card Titles: 18-22px, semibold
- Card Body: 14-15px, light weight, 60% opacity
- Design Decision Header: 10px, semibold, uppercase, tracking-widest

**Content Text:**
- Line breaks: Use `\n` in content strings
- White space: `pre-line` to preserve line breaks
- Each line is a distinct pointer (not paragraph-style)

### Spacing & Layout

**Full-Page Intro Slides:**
- Max width: 6xl (1280px)
- Padding: 16 (64px) horizontal
- Title margin bottom: 20 (80px)
- Grid gap: 8 (32px) for 3-column, 12 (48px) for 2-column

**Content Slides:**
- Max width: xs (320px)
- Left panel padding: 8 (32px)
- Vertical spacing: 4-8 units

**Cards:**
- Padding: 8-10 (32-40px)
- Border radius: 2xl (16px) or 3xl (24px)
- Border: 1px, white/10 opacity
- Backdrop blur: sm

### Visual Effects

**Glassmorphism:**
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(8px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

**Gradient Glow (Hover):**
```css
.absolute.inset-0 {
  background: linear-gradient(to bottom right, from-blue-500/10, to-cyan-500/10);
  border-radius: 16px;
  filter: blur(40px);
  opacity: 0;
  transition: opacity 500ms;
}
.group:hover .glow {
  opacity: 1;
}
```

**Icon Containers:**
- Size: 16×16 (64px)
- Border radius: xl (12px)
- Background: Gradient (blue-cyan or cyan-blue)
- Border: 1px, accent color at 30% opacity
- Icon size: 8 (32px)

**Animations:**
- Pulse (System Status): `animate-pulse`
- Ping (Status Indicator): `animate-ping`
- Shine sweep (Button): Custom keyframes

### Badges

**Razorpay Contextualised (Slide 5):**
```css
background: linear-gradient(to right, from-blue-500/20, to-indigo-500/20);
border: 1px solid blue-400/30;
```
- Icon: Briefcase
- Text: 11px, semibold, blue-300

**Claude++ Experience (Slide 7):**
```css
background: linear-gradient(to right, from-cyan-500/20, to-blue-500/20);
border: 1px solid cyan-400/30;
```
- Icon: Star
- Text: 11px, semibold, cyan-300

---

## Technical Implementation

### Component Structure

```
Presentation.tsx
├── State Management
│   ├── currentSection (IntersectionObserver)
│   ├── hasStarted (boolean)
│   ├── sectionsRef (array of HTMLElement refs)
│   └── iframeRef (HTMLIFrameElement ref)
├── Scene Data Array
│   └── scenes: Scene[]
├── Layout
│   ├── Left Panel (narrative)
│   │   ├── Title Slide
│   │   ├── Full-Page Intro Slides
│   │   └── Content Slides
│   └── Right Panel (prototype iframe)
│       └── Only visible in split-screen mode
└── CSS Animations
```

### TypeScript Interface

```typescript
interface Scene {
  id: number;
  title: string;
  description: string;
  designDecision?: {
    title: string;
    content: string;
  };
  prototypeState?: string;
  isTitleSlide?: boolean;
  isFullPageIntro?: boolean;
  principles?: Array<{ title: string; description: string }>;
  features?: Array<{ title: string; description: string }>;
}
```

### Scene Mapping (postMessage)

```typescript
const sceneMap: { [key: string]: number } = {
  'scene1': 3,  // Talk, don't tap
  'scene2': 4,  // The Hybrid Grid
  'scene3': 5,  // The base chat experience
  'scene4': 6,  // 15 seconds well spent
  'scene5': 7,  // A clean stage for actions
  'scene6': 8   // This came from Ray
};
```

### Scroll Behavior

**Left Panel (Narrative):**
```css
scroll-snap-type: y mandatory;
scroll-behavior: smooth;
-webkit-overflow-scrolling: touch;
scrollbar-width: none; /* Firefox */
-ms-overflow-style: none; /* IE/Edge */
```

**Section Snap:**
```css
scroll-snap-align: start;
scroll-snap-stop: always;
```

**Hide Scrollbar:**
```css
.w-\[18\%\]::-webkit-scrollbar {
  display: none;
}
```

### Iframe Communication

**From Prototype to Presentation:**
```typescript
window.parent.postMessage({
  type: 'SCENE_CHANGE',
  sceneId: 'scene2' // scene1-scene6
}, window.location.origin);
```

**Presentation Message Handler:**
```typescript
useEffect(() => {
  const handleMessage = (event: MessageEvent) => {
    // Security: verify origin
    if (event.origin !== window.location.origin) return;

    if (event.data?.type === 'SCENE_CHANGE') {
      const targetIndex = sceneMap[event.data.sceneId];
      if (targetIndex !== undefined) {
        sectionsRef.current[targetIndex]?.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
  };

  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
}, []);
```

### Prototype Scroll Trigger

**In RayDashboard.tsx:**
```typescript
// Trigger scene2 when user scrolls on landing page
useEffect(() => {
  if (view !== 'landing' || hasTriggeredScene2Ref.current) return;

  if (scrollY > 200) {
    hasTriggeredScene2Ref.current = true;

    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'SCENE_CHANGE',
        sceneId: 'scene2'
      }, window.location.origin);
    }
  }
}, [scrollY, view]);
```

### IntersectionObserver

```typescript
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sectionsRef.current.findIndex(
            ref => ref === entry.target
          );
          if (index !== -1) {
            setCurrentSection(index);
          }
        }
      });
    },
    { threshold: 0.5 }
  );

  sectionsRef.current.forEach((ref) => {
    if (ref) observer.observe(ref);
  });

  return () => observer.disconnect();
}, []);
```

---

## Component Specifications

### Title Slide Components

**Ray Logo Container:**
```jsx
<div className="w-24 h-24">
  <Ray static={true} />
</div>
```

**Enter Presentation Button:**
- Dimensions: Auto-sized with px-10 py-4
- Border radius: Full (rounded-full)
- Border: 1px, white/40
- Background: Multi-layer gradient with inset shadows
- Hover effects: Border brightens, -translate-y-0.5
- Shine animation: Continuous sweep on hover
- Text: 13px, uppercase, tracking-widest

### Full-Page Intro Components

**Principle/Feature Card:**
```jsx
<div className="relative group">
  {/* Glow effect */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

  {/* Card */}
  <div className="relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-blue-400/30 transition-all duration-300">

    {/* Icon container */}
    <div className="w-16 h-16 mb-6 rounded-xl bg-gradient-to-br from-blue-400/20 to-cyan-400/20 border border-blue-400/30 flex items-center justify-center">
      <svg className="w-8 h-8 text-blue-400">...</svg>
    </div>

    {/* Content */}
    <h3>Title</h3>
    <p>Description</p>
  </div>
</div>
```

**System Status Badge:**
```jsx
<div className="relative group">
  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-2xl blur-2xl" />
  <div className="relative px-8 py-6 rounded-2xl border border-green-400/40 bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-sm">
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
        <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-400 animate-ping" />
      </div>
      <span className="text-[16px] font-semibold text-white tracking-wide">
        System Status: Optimal
      </span>
    </div>
  </div>
</div>
```

### Content Slide Components

**Scene Number Indicator:**
```jsx
<div className="absolute -left-12 top-0 flex items-center gap-3">
  <div className="w-[1px] h-16 bg-gradient-to-b from-white/20 to-transparent" />
  <span className="text-[10px] font-medium text-white/30 tracking-[0.2em]">
    {String(scene.id).padStart(2, '0')}
  </span>
</div>
```

**Design Decision Section:**
```jsx
<div className="space-y-2.5 mt-8">
  <div className="space-y-2">
    <h3 className="text-[10px] font-semibold text-blue-400/90 tracking-[0.15em] uppercase">
      {scene.designDecision.title}
    </h3>
    <p className="text-[13px] text-white/60 leading-[1.6] font-light"
       style={{ whiteSpace: 'pre-line' }}>
      {scene.designDecision.content}
    </p>
  </div>
</div>
```

---

## Interaction Patterns

### User Journey

1. **Landing**
   - User sees title slide with Ray logo and "Enter Presentation" button
   - Full-screen, centered layout

2. **Enter Presentation**
   - User clicks button
   - `setHasStarted(true)`
   - Auto-scroll to slide 1
   - Layout remains full-width

3. **Intro Slides Navigation**
   - User scrolls through slides 1-2 (principles and features)
   - Snap-scroll behavior
   - Full-width layout maintained

4. **Transition to Split-Screen**
   - User scrolls to slide 3
   - Layout automatically switches to 18/82 split
   - Prototype iframe appears on right
   - Left panel shows narrative content

5. **Prototype Interaction**
   - User scrolls down on prototype homepage → triggers slide 4
   - User submits question → triggers slide 5
   - AI thinking animation → triggers slide 6
   - Response appears → triggers slide 7
   - Modal opens → triggers slide 8
   - Each interaction automatically scrolls left panel

### Navigation Methods

**Manual Scrolling:**
- Left panel has snap-scroll
- User can scroll freely through slides

**Prototype-Triggered:**
- Prototype sends postMessage
- Presentation auto-scrolls to corresponding slide
- Smooth scroll behavior

**No Back Navigation:**
- User can scroll back manually
- Prototype doesn't restart (state preserved)

---

## File Structure

```
src/
├── app/
│   └── components/
│       └── presentation/
│           └── Presentation.tsx (main component)
├── context/
│   └── DemoContext.tsx (persona management)
└── imports/
    └── Ray.tsx (logo component)
```

---

## Dependencies

- React 18.3.1
- TypeScript
- Tailwind CSS v4
- Motion/Framer Motion (for animations)

---

## Key CSS Classes

### Layout
- `w-full h-screen` - Full viewport
- `w-[18%]` - Left panel in split mode
- `w-[82%]` - Right panel in split mode
- `overflow-hidden` - Prevent scroll
- `overflow-y-scroll` - Enable vertical scroll

### Positioning
- `relative` - Positioning context
- `absolute inset-0` - Full overlay
- `fixed` - Fixed positioning
- `flex items-center justify-center` - Center content

### Effects
- `backdrop-blur-sm` - Glassmorphism
- `bg-white/5` - Semi-transparent white
- `border-white/10` - Low opacity border
- `rounded-2xl` - 16px border radius
- `rounded-3xl` - 24px border radius
- `shadow-2xl` - Large shadow

### Animations
- `transition-all duration-300` - Smooth transitions
- `group-hover:opacity-100` - Reveal on hover
- `animate-pulse` - Pulsing animation
- `animate-ping` - Ping animation

---

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support (custom scrollbar handling)
- Safari: Full support (webkit prefixes included)

---

## Performance Considerations

1. **Iframe Loading:** Single iframe instance, not recreated
2. **Scroll Performance:** CSS-based snap scroll, hardware accelerated
3. **Animations:** GPU-accelerated transforms
4. **Images:** Minimal use, prefer SVG icons
5. **Bundle Size:** Components lazy-loaded where possible

---

## Accessibility

- Semantic HTML structure
- Keyboard navigation supported
- ARIA labels on interactive elements
- Sufficient color contrast ratios
- Focus states visible

---

## Future Enhancements

Potential improvements not currently implemented:

1. Keyboard shortcuts for slide navigation
2. Progress indicator
3. Slide thumbnails/overview
4. Export to PDF functionality
5. Analytics tracking for slide engagement
6. Responsive mobile layout

---

## Version History

- **v1.0** - Initial presentation structure
- **v1.1** - Added full-page intro slides
- **v1.2** - Removed Hero's Journey slide, updated color palette
- **Current** - Blue-green color scheme, 9 total slides

---

## Contact & Support

For questions or modifications, refer to the source code in `/src/app/components/presentation/Presentation.tsx`.

Last Updated: 2025-02-05
