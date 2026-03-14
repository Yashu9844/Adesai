# Design System: Tool Rental Management Application

## Overview
This document defines the visual design system for the Tool Rental Management Application. The primary goal is to provide a clean, modern, and trustworthy interface for the shop owner. The design is explicitly **mobile-first**, optimized for use in a physical storefront environment (e.g., readable in sunlight, easy to tap), and takes inspiration from award-winning SaaS dashboards.

---

## 1. Color System

We use a warm and professional 2-color palette. The goal is to strike a balance between professional trustworthiness (Indigo) and warm, friendly accents (Amber).

### Brand Colors
* **Primary Color**: `#4F46E5` (Deep Indigo / Tailwind: `indigo-600`)  
  *Usage*: Main actions, primary buttons, active states, key navigation highlights.
* **Secondary Color**: `#F59E0B` (Warm Amber / Tailwind: `amber-500`)  
  *Usage*: Highlights, secondary actions, alerts, badges.

*Design Rule*: **Do not use both colors equally**. Primary is for the main action on a screen; Secondary is for subtle highlights or secondary affordances to maintain a premium look.

### UI Colors
* **Background Color**: `#F9FAFB` (Soft Gray / Tailwind: `gray-50`)  
  *Usage*: Main app background. Easier on the eyes than pure white, especially during long usage.
* **Card Background**: `#FFFFFF` (White / Tailwind: `white`)  
  *Usage*: Surface color for cards, modals, and distinct content sections.
* **Border Color**: `#E5E7EB` (Light Gray / Tailwind: `gray-200`)  
  *Usage*: Dividers, mild card outlines, and inputs.

### Text Colors
* **Primary Text**: `#111827` (Darkest Gray / Tailwind: `gray-900`)  
  *Usage*: Headings, standard body text. Excellent contrast for sunlight readability.
* **Secondary Text**: `#6B7280` (Medium Gray / Tailwind: `gray-500`)  
  *Usage*: Helper text, timestamps, less important metadata.

### Status Colors
* **Success**: `#10B981` (Emerald / Tailwind: `emerald-500`) - Used for completed returns, active status.
* **Warning**: `#F59E0B` (Amber / Tailwind: `amber-500`) - Used for low inventory, pending actions.
* **Danger**: `#EF4444` (Red / Tailwind: `red-500`) - Used for overdue rentals, destructive actions (delete).

---

## 2. Typography

A clean, legible sans-serif font ensures readability on small screens. The application will utilize `Inter` (or the system default stack if optimized for speed).

* **Font Family**: `Inter, system-ui, sans-serif`
* **Heading 1 (Screen Titles)**: 24px (1.5rem), Semi-bold (`font-semibold`)
* **Heading 2 (Card Titles)**: 18px (1.125rem), Medium (`font-medium`)
* **Body Text**: 14px (0.875rem), Regular (`font-normal`)
* **Label/Small Text**: 12px (0.75rem), Medium (`font-medium`) - *Used for badges, secondary meta info.*

---

## 3. Spacing System

A consistent spacing scale prevents clutter and makes the UI feel breathable and premium.

* **xs**: 4px (0.25rem) - Space between an icon and text.
* **sm**: 8px (0.5rem) - Space between tight list items or small inner padding.
* **md**: 16px (1rem) - Standard padding for cards, standard margin between components.
* **lg**: 24px (1.5rem) - Section spacing, screen edge margins.
* **xl**: 32px (2rem) - Large overarching layout gaps.

---

## 4. Border Radius

Consistent rounding on elements softens the UI, making it feel modern and approachable.

* **Cards/Modals**: 12px (`rounded-xl` or `rounded-2xl` depending on standard)
* **Buttons/Inputs**: 8px (`rounded-lg`)
* **Badges**: Fully rounded (`rounded-full` / 9999px)

---

## 5. Shadows

Shadows should be barely noticeable—just enough to lift white cards off the `#F9FAFB` background without feeling heavy.

* **Subtle Elevation (Cards)**: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)` (Tailwind: `shadow-sm` or custom subtle `shadow`)
* **Hover State / Modals**: Tailwind `shadow-md` or `shadow-lg` (Keep opacity low, e.g., 5-10% black).

---

## 6. UI Components

### Navigation (Mobile First)
* **Bottom Navigation Bar**: Fixed to the bottom of the screen.
  * *Background*: White (`#FFFFFF`) with a top border (`#E5E7EB`).
  * *Items*: 
    1. **Dashboard** (Home icon)
    2. **Inventory** (Box/List icon)
    3. **Rent (FAB-style or central prominence)** (Plus icon)
    4. **Active Rentals** (Clock/Tag icon)
    5. **History** (Archive/Document icon)
  * *Active State*: Icon and text turn Primary Indigo (`#4F46E5`). Inactive remains Secondary Text (`#6B7280`).

### Buttons
* **Primary Button**: `bg-indigo-600 text-white rounded-lg px-4 py-2 font-medium`. Smooth hover/active states.
* **Secondary Button**: `bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-2 font-medium`.
* **Accent/Highlight Button**: `bg-amber-500 text-white rounded-lg` (Use sparingly for specific calls to action).

### Inputs
* **Text / Select Inputs**: 
  * Background: White
  * Border: `border-gray-200`
  * Focus State: `ring-2 ring-indigo-600 border-transparent` (Provides clear feedback when typing).
  * Padding: minimum `44px` height (Apple's minimum hit target for mobile).

### Cards
* **Tool Card (Inventory)**: Shows image thumbnail (left), tool name (top right), quantity badge (bottom right), minimal layout.
* **Rental Card (Active)**: Highlights customer name, tools rented (summary), and days active. If overdue, subtly highlights with a Danger red warning border or badge.

---

## Design Style Guidelines Summary
1. **Mobile-first Layout**: Ensure all tap targets are at least 44x44px. Everything is designed for a thumb reach.
2. **Smooth & Fast**: No heavy, janky animations. Transitions should be < 200ms (opacity and transforms only).
3. **Minimal Visual Noise**: Let the data breathe. Use whitespace (padding `md` / `lg`) instead of hard lines wherever possible to separate content.
4. **Contrast & Hierarchy**: The eye should immediately know what the most important action is (Primary Indigo vs Grays).
