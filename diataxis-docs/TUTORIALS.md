# Tutorials

**Orientation**: Learning-oriented  
**Purpose**: To help the user learn something

---

## What is a Tutorial?

A tutorial is **lesson-oriented**. Its purpose is to help the user learn something. It's a lesson that takes the reader by the hand through a series of steps to complete a project of some kind.

A tutorial is not the same as a how-to guide. A tutorial is what you follow when you're learning how to make something for the first time. A how-to guide is what you look at when you want to achieve a particular goal.

## Characteristics of Tutorials

### Learning-Oriented
- The user is learning
- The user is following along
- The user is doing something for the first time
- The user needs guidance and explanation

### Step-by-Step
- Takes the reader through a series of steps
- Each step builds on the previous one
- The reader does something at each step
- The reader sees results at each step

### Complete and Concrete
- Shows a complete, working example
- Uses concrete, specific examples (not abstractions)
- The reader ends up with something that works
- The reader can see the results of their work

### Assumes No Prior Knowledge
- Starts from the beginning
- Explains concepts as they're introduced
- Doesn't assume familiarity with the subject
- Provides context and background

## How to Write a Tutorial

### 1. Choose a Concrete Project

Pick a single, concrete project that the user will complete. It should be:
- **Simple enough** to complete in one session
- **Interesting enough** to be motivating
- **Representative** of the kind of work the user will do
- **Complete** - it should result in something that works

**Example**: "Build a simple blog" is better than "Learn about web frameworks"

### 2. Show, Don't Just Tell

At each step:
- Show the user what to do
- Show the user what they should see
- Show the user what the result should be
- Explain why they're doing it

### 3. Use the "Happy Path"

Show the simplest, most straightforward way to do something first. Don't:
- Show all the edge cases
- Show all the error handling
- Show all the alternatives
- Show all the configuration options

Save complexity for later (how-to guides, reference, explanation).

### 4. Make It Interactive

The user should be doing something at each step:
- Typing code
- Running commands
- Clicking buttons
- Seeing results

### 5. Provide Context

Explain:
- **What** you're doing
- **Why** you're doing it (in simple terms)
- **What** the result should be

Don't explain:
- All the alternatives
- All the edge cases
- All the theory behind it
- All the historical context

### 6. Check Understanding

Include:
- What the user should see at each step
- How to verify the step worked
- What to do if something goes wrong (briefly)

## Structure of a Tutorial

1. **Introduction**
   - What the user will learn
   - What they'll build
   - What they need to know beforehand
   - How long it will take

2. **Prerequisites**
   - What software they need
   - What accounts they need
   - What knowledge they need

3. **Step-by-Step Instructions**
   - Clear, numbered steps
   - Each step is concrete and actionable
   - Each step shows expected results
   - Each step explains briefly why

4. **Conclusion**
   - What the user accomplished
   - What they learned
   - What to do next

## Example Tutorial Structure

```markdown
# Tutorial: Build Your First Web Page

## What you'll learn
In this tutorial, you'll learn how to create a simple web page using HTML.

## What you'll build
You'll create a personal homepage that displays your name and a short bio.

## Prerequisites
- A text editor
- A web browser
- No prior HTML knowledge required

## Step 1: Create a new file
[Instructions...]

## Step 2: Add basic HTML structure
[Instructions...]

## Step 3: Add your content
[Instructions...]

## Step 4: View your page
[Instructions...]

## What you learned
[Summary...]

## Next steps
[What to do next...]
```

## Common Mistakes

### ❌ Too Abstract
**Bad**: "Learn about variables and functions"  
**Good**: "Build a calculator that adds two numbers"

### ❌ Too Complex
**Bad**: "Build a complete e-commerce site"  
**Good**: "Build a simple product listing page"

### ❌ Not Interactive
**Bad**: Just explaining concepts  
**Good**: User does something at each step

### ❌ Showing Too Much
**Bad**: Showing all error handling, edge cases, alternatives  
**Good**: Showing the simplest path that works

### ❌ Assuming Prior Knowledge
**Bad**: "As you know, HTTP is a stateless protocol..."  
**Good**: "HTTP is a protocol that allows web browsers to request pages from servers..."

## Tutorial vs How-To Guide

| Tutorial | How-To Guide |
|----------|--------------|
| Learning-oriented | Goal-oriented |
| First time doing something | Need to accomplish a specific task |
| Following along | Looking up how to do something |
| Complete project | Specific goal |
| Shows the happy path | May show alternatives |
| Assumes no prior knowledge | Assumes some familiarity |

## Checklist

- [ ] Is this for someone learning for the first time?
- [ ] Does it take the reader through a complete project?
- [ ] Is it concrete and specific (not abstract)?
- [ ] Does the reader do something at each step?
- [ ] Does it show the simplest path that works?
- [ ] Does it explain what and why (briefly)?
- [ ] Can the reader verify each step worked?
- [ ] Does it assume no prior knowledge?

---

**Related**: [How-to Guides](./HOW-TO-GUIDES.md) | [Reference](./REFERENCE.md) | [Explanation](./EXPLANATION.md)

