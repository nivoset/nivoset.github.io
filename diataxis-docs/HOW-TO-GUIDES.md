# How-To Guides

**Orientation**: Goal-oriented  
**Purpose**: To help the user accomplish a specific task

---

## What is a How-To Guide?

A how-to guide is **goal-oriented**. Its purpose is to help the user accomplish a specific task. It's a series of steps that the user follows to achieve a particular goal.

A how-to guide is not the same as a tutorial. A tutorial is what you follow when you're learning how to make something for the first time. A how-to guide is what you look at when you want to achieve a particular goal.

## Characteristics of How-To Guides

### Goal-Oriented
- The user has a specific goal
- The user wants to accomplish something
- The user is looking for a solution
- The user wants to get something done

### Task-Focused
- Focuses on a single, specific task
- Answers "How do I...?" questions
- Provides a clear path to the goal
- Shows the steps to achieve it

### Practical and Prescriptive
- Tells the user what to do
- Provides actionable steps
- Shows the way to do it
- May show alternatives if relevant

### Assumes Some Familiarity
- Assumes the user knows the basics
- Doesn't explain fundamental concepts
- Focuses on the task at hand
- May reference other documentation

## How to Write a How-To Guide

### 1. Start with a Clear Goal

The title should clearly state what the user will accomplish:
- "How to deploy your application"
- "How to configure authentication"
- "How to export data to CSV"

### 2. Be Prescriptive

Tell the user what to do:
- Use imperative mood ("Do this", "Run that")
- Be direct and clear
- Don't explain all the theory
- Focus on the steps

### 3. Show the Steps

Provide clear, numbered steps:
- Each step should be actionable
- Each step should be specific
- Show what the user should see
- Show how to verify it worked

### 4. Include Alternatives When Relevant

If there are multiple ways to do something:
- Show the most common way first
- Show alternatives if they're significantly different
- Explain when to use each alternative
- Don't show every possible variation

### 5. Address Common Problems

Include:
- What can go wrong
- How to troubleshoot
- Common mistakes to avoid
- What to check if it doesn't work

### 6. Be Complete but Concise

- Include everything needed to complete the task
- Don't include unnecessary information
- Don't explain concepts that aren't needed
- Link to reference or explanation if needed

## Structure of a How-To Guide

1. **Title** (clear goal statement)
   - "How to [accomplish specific goal]"

2. **Introduction** (brief)
   - What this guide will help you do
   - When you'd use this guide
   - What you need to know beforehand

3. **Prerequisites** (if needed)
   - What you need to have set up
   - What you need to know
   - What you need to have access to

4. **Steps**
   - Clear, numbered steps
   - Each step is specific and actionable
   - Shows expected results
   - Shows how to verify

5. **Troubleshooting** (if needed)
   - Common problems
   - How to fix them
   - What to check

6. **Next Steps** (optional)
   - What to do after completing this task
   - Related tasks
   - Where to learn more

## Example How-To Guide Structure

```markdown
# How to Deploy Your Application to Production

## Overview
This guide shows you how to deploy your application to the production environment.

## Prerequisites
- Your application is tested and ready
- You have production credentials
- You have access to the deployment system

## Steps

### Step 1: Prepare your application
[Instructions...]

### Step 2: Configure production settings
[Instructions...]

### Step 3: Run deployment script
[Instructions...]

### Step 4: Verify deployment
[Instructions...]

## Troubleshooting

### Deployment fails
[Solutions...]

### Application doesn't start
[Solutions...]

## Next Steps
- [Monitor your application](../monitoring.md)
- [Set up backups](../backups.md)
```

## Common Mistakes

### ❌ Too Vague
**Bad**: "How to use the API"  
**Good**: "How to authenticate with the API"

### ❌ Too Broad
**Bad**: "How to build a web application"  
**Good**: "How to add user authentication to your web application"

### ❌ Not Prescriptive Enough
**Bad**: "You might want to consider..."  
**Good**: "Run this command: `npm install`"

### ❌ Missing Context
**Bad**: Just showing steps without explaining when/why  
**Good**: "If you're deploying for the first time, follow these steps..."

### ❌ Too Much Theory
**Bad**: Explaining how HTTP works in a deployment guide  
**Good**: "Run the deployment command. It will upload your files via HTTPS."

## How-To Guide vs Tutorial

| How-To Guide | Tutorial |
|--------------|----------|
| Goal-oriented | Learning-oriented |
| Need to accomplish a task | Learning for the first time |
| Looking up how to do something | Following along |
| Specific goal | Complete project |
| May show alternatives | Shows the happy path |
| Assumes some familiarity | Assumes no prior knowledge |

## How-To Guide vs Reference

| How-To Guide | Reference |
|--------------|-----------|
| Goal-oriented | Information-oriented |
| How to do something | What something is/does |
| Prescriptive (do this) | Descriptive (this is) |
| Steps to accomplish a goal | Facts about the system |
| May include alternatives | Complete and accurate |

## Checklist

- [ ] Does it help accomplish a specific goal?
- [ ] Is the goal clear from the title?
- [ ] Are the steps prescriptive and actionable?
- [ ] Does it assume appropriate prior knowledge?
- [ ] Does it show how to verify each step?
- [ ] Does it address common problems?
- [ ] Is it complete but concise?
- [ ] Does it focus on the task, not the theory?

---

**Related**: [Tutorials](./TUTORIALS.md) | [Reference](./REFERENCE.md) | [Explanation](./EXPLANATION.md)

