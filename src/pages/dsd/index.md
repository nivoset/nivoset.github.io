---
layout: ../../layouts/DSDLayout.astro
title: "Dead Simple Discipline"
description: "A comprehensive guide to organizing React code using the zombie architecture pattern."
currentPath: "/dsd"
---

# Welcome to Dead Simple Discipline

A comprehensive, beginner-to-intermediate friendly guide to organizing React code using a simple mental model: **zombies** (UI) and **brains** (logic).

## What is Dead Simple Discipline?

Dead Simple Discipline is a set of 8 rules that help you build maintainable React applications by separating concerns. The core idea is simple:

- **🟢 Zombies (UI)**: Pure presentation components that receive props and render markup
- **🧠 Brains (Logic)**: Components and hooks that handle state, business rules, and side effects

## Why Zombies?

The zombie metaphor provides a simple mental model:
- **Zombies don't think** — they just display what they're told
- **Brains do the thinking** — they make decisions and orchestrate actions
- **Clear separation** — makes code easier to understand, test, and maintain

## The 8 Rules

1. **Start Undead** - Begin with pure UI components, add logic only when needed
2. **Horde Ratio** - Maintain ≥7:1 zombies to brains
3. **3-Click Brain Rule** - Keep navigation paths short (≤3 clicks)
4. **Trial of Three Strains** - Design interfaces for happy/failure/async paths
5. **No Tunnels** - Avoid prop drilling; use explicit props
6. **Coffin Rule** - Keep related code together (co-location)
7. **No Unnamed Survivors** - Use specific, descriptive file names
8. **Silence the Living** - Remove console statements and fix warnings

## Learning Path

This documentation is organized into progressive modules:

1. **[Foundation](/dsd/foundation)** - Understanding the zombie metaphor and core principles
2. **[Rules Part 1](/dsd/rules-part1)** - Start Undead, Horde Ratio, 3-Click Brain Rule
3. **[Rules Part 2](/dsd/rules-part2)** - Trial of Three Strains, No Tunnels, Coffin Rule
4. **[Rules Part 3](/dsd/rules-part3)** - No Unnamed Survivors, Silence the Living
5. **[Navigation](/dsd/navigation)** - Navigation patterns and component classification
6. **[Practice](/dsd/practice)** - Real-world scenarios, common violations, and complete examples
7. **[Quick Reference](/dsd/quick-reference)** - Condensed cheat sheet of all rules

## Quick Start

If you're new to Dead Simple Discipline, start with the [Foundation](/dsd/foundation) module to understand the core concepts.

If you're already familiar with the concepts, jump to the [Quick Reference](/dsd/quick-reference) for a condensed guide.

## Core Principles

```
Green = UI (Skin)    → Pure render, props-in/markup-out
Pink = Logic (Brains) → State, rules, effects, orchestration
```

## Key Benefits

- **Easier to understand** - Clear separation of concerns
- **Easier to test** - Pure components are simple to test
- **Easier to maintain** - Logic is concentrated in fewer places
- **Easier to navigate** - Short paths to find what you need
- **Better organization** - Related code stays together

## Get Started

Ready to learn? Start with the [Foundation](/dsd/foundation) module and work through each section progressively.

Need a quick reminder? Check the [Quick Reference](/dsd/quick-reference) for all rules at a glance.
