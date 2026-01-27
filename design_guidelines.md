# Makerburg V1 Design Guidelines

## Brand Identity

**Purpose**: Makerburg is a global editorial discovery app for makers, artists, artisans, and culture lovers—designed to inspire, inform, and surface opportunities without requiring participation or performance.

**Aesthetic Direction**: Editorial/Magazine - Calm, authoritative, spacious. Inspired by Google Arts & Culture with museum-quality curation and typography-first design.

**Memorable Element**: The app feels like a living cultural archive—unhurried, generous with space, and respectful of craft. Content breathes. Every detail is considered.

**Tone**: Refined, contemplative, trustworthy. Not trendy or playful—timeless and serious about craft.

---

## Navigation Architecture

**Root Navigation**: Bottom Tab Bar (5 tabs)

1. **Home** - Editorial front page, daily curation
2. **Stories** - Long-form editorial feed
3. **Opportunities** - Grants, residencies, open calls
4. **Watch** - Video storytelling
5. **Culture** - Evergreen cultural atlas

**Login Entry**: Header icon (bookmark icon), triggered when user attempts to save.

**No Auth Screens**: All content browsable anonymously. Login only required for saving.

---

## Screen-by-Screen Specifications

### 1. Home (Today)
**Purpose**: Immediate editorial value—featured content updated daily.

**Layout**:
- Header: Transparent, title "Today", right button: bookmark icon (opens Library if logged in, Login modal if not)
- Main content: ScrollView
- Root view insets: top = headerHeight + 24, bottom = tabBarHeight + 24

**Components**:
- Hero Story Card (full-bleed image, title overlay)
- "Editor's Pick" section (1-2 horizontal cards)
- "Opportunity Highlight" card
- Featured Video thumbnail
- "From the Culture Atlas" snippet

**Empty State**: N/A (always curated)

---

### 2. Stories List
**Purpose**: Browse long-form editorial content.

**Layout**:
- Header: Transparent, title "Stories", right button: filter icon
- Main content: Vertical FlatList
- Root view insets: top = headerHeight + 24, bottom = tabBarHeight + 24

**Components**:
- Story Card (full-width image, title, subtitle, read time, region/craft pills)
- Filter chips when active (region, discipline, format)

**Empty State**: Illustration of open book with text "New stories coming soon"

---

### 3. Story Detail
**Purpose**: Immersive reading experience.

**Layout**:
- Header: Default with back button, right button: bookmark icon
- Main content: ScrollView (full-bleed hero image, then padded text)
- Root view insets: bottom = 24

**Components**:
- Hero image (full-bleed)
- Title, subtitle, metadata (read time, region, craft)
- Body paragraphs (generous line-height)
- Optional inline image
- Culture links at bottom

---

### 4. Opportunities List
**Purpose**: Discover actionable opportunities.

**Layout**:
- Header: Transparent, title "Opportunities", right button: filter icon
- Main content: Vertical FlatList
- Root view insets: top = headerHeight + 24, bottom = tabBarHeight + 24

**Components**:
- Opportunity Card (category pill, title, "for" line, deadline, region)
- Auto-hide expired opportunities

**Empty State**: Illustration of telescope with text "New opportunities weekly"

---

### 5. Opportunity Detail
**Purpose**: Full opportunity information.

**Layout**:
- Header: Default with back button, right button: bookmark icon
- Main content: ScrollView
- Root view insets: bottom = 24

**Components**:
- Category badge
- Title, "for" line, deadline (highlighted if near), region
- About paragraph
- "Who it's for" list
- "What's offered" list
- External link button (primary CTA)

---

### 6. Watch
**Purpose**: Visual storytelling through video.

**Layout**:
- Header: Transparent, title "Watch"
- Main content: Vertical FlatList
- Root view insets: top = headerHeight + 24, bottom = tabBarHeight + 24

**Components**:
- Video Card (thumbnail, play icon overlay, title, duration, region/craft pills)
- Tap to open Video Player (modal or stack screen)

**Empty State**: Illustration of film reel with text "New videos bi-weekly"

---

### 7. Culture Atlas
**Purpose**: Explore evergreen craft traditions.

**Layout**:
- Header: Transparent, title "Culture", right button: search icon
- Main content: Vertical FlatList or grid
- Root view insets: top = headerHeight + 24, bottom = tabBarHeight + 24

**Components**:
- Culture Entry Card (image, title, region, craft)
- Optional: Map view toggle

**Empty State**: Illustration of atlas/map with text "Cultural archive growing"

---

### 8. Culture Detail
**Purpose**: Deep-dive into a cultural tradition.

**Layout**:
- Header: Default with back button, right button: bookmark icon
- Main content: ScrollView
- Root view insets: bottom = 24

**Components**:
- Hero image (full-bleed)
- Title, region, craft
- Intro paragraph
- Sections (heading + paragraph pairs)

---

### 9. Library (Logged-in only)
**Purpose**: Access saved content.

**Layout**:
- Header: Default, title "Library"
- Main content: ScrollView with sections
- Root view insets: top = 24, bottom = tabBarHeight + 24

**Components**:
- Section headers: "Stories", "Opportunities", "Videos", "Culture"
- Saved items displayed as cards under each section
- Tap to open detail screens

**Empty State**: Illustration of empty bookshelf with text "Tap 🔖 to save content"

---

### 10. Login Modal
**Purpose**: Optional login for saving.

**Layout**: Centered modal card over dimmed overlay

**Components**:
- Title: "Save to your Library"
- Subtitle: "Optional login — only needed to save bookmarks."
- Email input (demo only, placeholder)
- "Sign in & Continue" button (primary)
- "Not now" button (text link)

---

## Color Palette

**Background**:
- Primary BG: `#F6F2EC` (soft ivory)
- Card Surface: `#FFFFFF` (pure white)

**Text**:
- Primary Text: `#111111` (near-black)
- Secondary Text: `#4B4B4B` (medium gray)

**Accents**:
- Primary Accent: `#2E2A24` (muted charcoal, for CTAs and focus states)
- Pill Background: `#EFE8DF` (warm neutral for tags)

**Borders**:
- Hairline: `rgba(0,0,0,0.08)` (subtle dividers)

---

## Typography

**Font**: System default (SF Pro on iOS, Roboto on Android) for maximum legibility.

**Type Scale**:
- H1 (Screen Titles): 34pt, Bold
- H2 (Section Titles): 24pt, Semibold
- Story Title: 28pt, Bold
- Card Title: 18pt, Semibold
- Body: 16pt, Regular, line-height 1.6
- Caption (metadata): 13pt, Regular
- Pill Text: 12pt, Medium

---

## Visual Design

- **Icons**: Use Feather icons from @expo/vector-icons (bookmark, filter, search, play, etc.)
- **Cards**: White background, 12pt border radius, no shadow (rely on hairline borders or subtle background contrast)
- **Touchable Feedback**: 0.7 opacity on press for cards and buttons
- **Spacing**: Generous—minimum 16pt between sections, 24pt page margins
- **Images**: Full-bleed where possible, 2:3 aspect ratio for hero images, soft rounded corners (8pt) for thumbnails
- **Buttons**: Primary (filled with accent color), Secondary (text link, no border)

---

## Assets to Generate

1. **icon.png** - App icon: Minimalist symbol (e.g., simplified loom, hands shaping clay) in muted charcoal on ivory background. WHERE USED: Device home screen.

2. **splash-icon.png** - Splash screen icon: Same as app icon but optimized for centered display. WHERE USED: App launch screen.

3. **empty-stories.png** - Illustration of open book, minimal line art, muted tones. WHERE USED: Stories tab if no content.

4. **empty-opportunities.png** - Illustration of telescope or open door, minimal line art. WHERE USED: Opportunities tab if no content.

5. **empty-watch.png** - Illustration of film reel or camera, minimal line art. WHERE USED: Watch tab if no content.

6. **empty-culture.png** - Illustration of atlas/map or cultural artifact, minimal line art. WHERE USED: Culture tab if no content.

7. **empty-library.png** - Illustration of empty bookshelf, minimal line art. WHERE USED: Library screen when no saved items.

**Style for all assets**: Clean, editorial line art—museum-quality, not playful. Match the ivory/charcoal color palette.