# The Compass

A simple tool for direction-finding in documentation.

---

## What is The Compass?

The Compass is a simple tool to help you find direction when you're working on documentation. When you're unsure what kind of documentation you're writing, or what kind you should be writing, The Compass helps you find your way.

## How to Use The Compass

When you're working on a piece of documentation, ask yourself these questions:

### 1. Is the user learning or looking something up?

**Learning**: The user is studying, following along, trying to understand something new.  
**Looking up**: The user knows what they need, they just need to find it.

### 2. Is the user doing something or understanding something?

**Doing**: The user wants to accomplish something, make something, get something done.  
**Understanding**: The user wants to understand why, how things work, the thinking behind it.

## The Four Directions

Based on your answers, you'll find yourself in one of four quadrants:

```
                Learning
                   ↑
                   |
    Tutorials  |  How-to Guides
    (learning  |  (learning
     +         |   +
     doing)    |    doing)
    -----------+----------
    Explanation|  Reference
    (learning  |  (looking up
     +         |   +
     understanding) |  understanding)
                   |
                   ↓
              Looking up
```

### Learning + Doing = Tutorial
- User is learning how to do something
- User is following along
- User is doing it for the first time
- **Write a Tutorial**

### Learning + Understanding = Explanation
- User is learning why something is the way it is
- User wants to understand concepts
- User wants context and background
- **Write an Explanation**

### Looking up + Understanding = Reference
- User knows what they need
- User wants to look up facts
- User wants to understand the system
- **Write Reference documentation**

### Looking up + Doing = How-to Guide
- User knows what they want to accomplish
- User needs to know how to do it
- User is looking up the steps
- **Write a How-to Guide**

## Examples

### Example 1: User wants to build their first web page

**Questions:**
- Learning or looking up? → **Learning** (first time)
- Doing or understanding? → **Doing** (building something)

**Answer: Tutorial**

### Example 2: User wants to know what the `authenticate()` function does

**Questions:**
- Learning or looking up? → **Looking up** (knows what they need)
- Doing or understanding? → **Understanding** (wants to know what it is)

**Answer: Reference**

### Example 3: User wants to deploy their app to production

**Questions:**
- Learning or looking up? → **Looking up** (knows what they want to do)
- Doing or understanding? → **Doing** (wants to accomplish a task)

**Answer: How-to Guide**

### Example 4: User wants to understand why we use dependency injection

**Questions:**
- Learning or looking up? → **Learning** (trying to understand)
- Doing or understanding? → **Understanding** (wants to know why)

**Answer: Explanation**

## When You're Unsure

If you're not sure which direction you're going:

1. **Ask the questions again** - Sometimes the answer becomes clearer when you think about it from the user's perspective

2. **Consider the user's state of mind**:
   - Are they new to this? → Probably Tutorial or Explanation
   - Do they know what they need? → Probably How-to Guide or Reference

3. **Consider what the user wants**:
   - To learn something new? → Tutorial or Explanation
   - To accomplish something? → How-to Guide
   - To look up information? → Reference

4. **Start writing** - Sometimes you only know what you're writing when you start writing it. The Compass can help you course-correct as you go.

## Common Confusions

### Tutorial vs How-to Guide

**Confusion**: Both involve doing something

**Clarification**:
- Tutorial: User is learning, doing it for the first time
- How-to Guide: User knows what they want, looking up how to do it

**Use The Compass**: Learning + Doing = Tutorial, Looking up + Doing = How-to Guide

### Reference vs Explanation

**Confusion**: Both involve understanding

**Clarification**:
- Reference: User is looking up facts about the system
- Explanation: User is learning why things are the way they are

**Use The Compass**: Looking up + Understanding = Reference, Learning + Understanding = Explanation

### How-to Guide vs Reference

**Confusion**: Both might be looked up

**Clarification**:
- How-to Guide: User wants to do something (prescriptive)
- Reference: User wants to know what something is (descriptive)

**Use The Compass**: Looking up + Doing = How-to Guide, Looking up + Understanding = Reference

## Remember

The Compass is a tool to help you find direction, not a strict rule. Sometimes documentation might have elements of more than one type. That's okay - use The Compass to identify the primary purpose, and make sure that's clear in your documentation.

---

**Related**: [Tutorials](./TUTORIALS.md) | [How-to Guides](./HOW-TO-GUIDES.md) | [Reference](./REFERENCE.md) | [Explanation](./EXPLANATION.md)

