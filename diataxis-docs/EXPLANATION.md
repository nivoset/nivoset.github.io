# Explanation

**Orientation**: Understanding-oriented  
**Purpose**: To explain and clarify

---

## What is Explanation Documentation?

Explanation documentation is **understanding-oriented**. Its purpose is to explain and clarify. It provides background, context, and reasoning. It helps the user understand why things are the way they are, and how they fit into the bigger picture.

Explanation documentation is not the same as reference, tutorial, or how-to guide. It doesn't describe the machinery, teach how to use it, or show how to accomplish tasks. It explains the thinking behind it.

## Characteristics of Explanation Documentation

### Understanding-Oriented
- The user wants to understand
- The user wants context
- The user wants to know why
- The user wants the big picture

### Discussion-Oriented
- Explains concepts
- Provides background
- Discusses reasoning
- Explores relationships

### Context-Rich
- Provides historical context
- Explains design decisions
- Shows how things fit together
- Discusses trade-offs

### Not Prescriptive
- Doesn't tell you what to do
- Doesn't give step-by-step instructions
- Doesn't describe the API
- Explains the thinking

## How to Write Explanation Documentation

### 1. Focus on Why, Not What or How

Explain:
- Why things are designed this way
- Why this approach was chosen
- Why this matters
- How it fits into the bigger picture

Don't explain:
- How to use it (that's tutorial/how-to)
- What it is (that's reference)
- Step-by-step instructions

### 2. Provide Context

Include:
- Historical background
- Design decisions
- Trade-offs considered
- Alternatives explored
- Constraints and requirements

### 3. Explain Relationships

Show:
- How concepts relate to each other
- How parts fit into the whole
- How decisions affect other parts
- Dependencies and interactions

### 4. Discuss Trade-offs

Explain:
- What was chosen and why
- What was rejected and why
- What trade-offs were made
- What the implications are

### 5. Use Examples to Illustrate

Use examples to:
- Illustrate concepts
- Show relationships
- Clarify abstractions
- Make ideas concrete

But remember: examples in explanation are illustrative, not instructional.

### 6. Be Honest About Limitations

Discuss:
- What the design doesn't do
- What limitations exist
- What compromises were made
- What might change in the future

## Structure of Explanation Documentation

### For Concepts

```markdown
# Why We Use Dependency Injection

## The Problem
[What problem this solves...]

## The Solution
[How dependency injection addresses it...]

## Trade-offs
[What we gain and what we give up...]

## Alternatives Considered
[Other approaches and why they weren't chosen...]

## In Practice
[How this works in our system...]
```

### For Architecture

```markdown
# System Architecture

## Overview
[High-level view...]

## Design Principles
[Principles that guided the design...]

## Component Relationships
[How components interact...]

## Data Flow
[How data moves through the system...]

## Design Decisions
[Key decisions and their rationale...]
```

### For Design Patterns

```markdown
# The Repository Pattern

## What It Is
[Brief definition...]

## Why We Use It
[Rationale...]

## How It Works
[Conceptual explanation...]

## When to Use It
[Guidelines...]

## Examples in Our Codebase
[Where it's used...]
```

## Common Explanation Topics

### Architecture and Design
- System architecture
- Design patterns
- Design principles
- Component relationships

### Concepts and Theory
- Core concepts
- Theoretical background
- Domain knowledge
- Best practices

### Decisions and Rationale
- Why things are the way they are
- Design decisions
- Trade-offs
- Historical context

### Background and Context
- Project history
- Constraints and requirements
- Industry context
- Related work

## Common Mistakes

### ❌ Too Prescriptive
**Bad**: "You should always use dependency injection."  
**Good**: "Dependency injection helps manage complexity by inverting control of dependencies."

### ❌ Too Much How-To
**Bad**: Step-by-step instructions for using a pattern  
**Good**: Explanation of why the pattern exists and when it's useful

### ❌ Too Much Reference
**Bad**: Listing all the classes and methods  
**Good**: Explaining the concepts and relationships

### ❌ Missing Context
**Bad**: Just stating facts without background  
**Good**: Explaining why these facts matter and how they came to be

### ❌ Too Abstract
**Bad**: Only high-level concepts without concrete examples  
**Good**: Concepts illustrated with concrete examples

## Explanation vs Tutorial

| Explanation | Tutorial |
|-------------|----------|
| Understanding-oriented | Learning-oriented |
| Why things are this way | How to do something |
| Explains concepts | Shows steps |
| Provides context | Provides instructions |
| Discussion | Hands-on |

## Explanation vs How-To Guide

| Explanation | How-To Guide |
|-------------|--------------|
| Understanding-oriented | Goal-oriented |
| Why and how things work | How to accomplish a task |
| Explains thinking | Provides steps |
| Provides context | Provides instructions |
| Discussion | Prescriptive |

## Explanation vs Reference

| Explanation | Reference |
|-------------|-----------|
| Understanding-oriented | Information-oriented |
| Why things are this way | What things are |
| Explains thinking | Describes machinery |
| Provides context | Provides facts |
| Discussion | Description |

## Checklist

- [ ] Does it help the user understand why?
- [ ] Does it provide context and background?
- [ ] Does it explain relationships and concepts?
- [ ] Does it discuss trade-offs and decisions?
- [ ] Is it discussion-oriented, not prescriptive?
- [ ] Does it avoid step-by-step instructions?
- [ ] Does it avoid describing APIs in detail?
- [ ] Does it help users see the big picture?

---

**Related**: [Tutorials](./TUTORIALS.md) | [How-to Guides](./HOW-TO-GUIDES.md) | [Reference](./REFERENCE.md)

