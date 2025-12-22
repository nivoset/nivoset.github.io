# Understanding Diátaxis

Theory, principles, quality, and handling complex documentation structures.

---

## Foundations: The Core Idea

Diátaxis is based on a simple but powerful idea: **there are fundamentally four different kinds of documentation, that respond to four different needs**.

These four kinds are not arbitrary - they emerge from understanding the different ways people interact with documentation, and the different needs they have at different times.

## The Two Axes

Diátaxis organizes documentation along two fundamental axes:

### 1. Practical vs Theoretical

**Practical**: Documentation that involves doing something
- The user wants to accomplish something
- The user wants to make something
- The user wants to get something done

**Theoretical**: Documentation that involves understanding
- The user wants to understand why
- The user wants to understand how things work
- The user wants context and background

### 2. Learning vs Looking Up

**Learning**: Documentation for studying
- The user is learning something new
- The user is following along
- The user is trying to understand

**Looking Up**: Documentation for reference
- The user knows what they need
- The user is looking for specific information
- The user wants to find something quickly

## The Four Types

These two axes create four quadrants, each corresponding to a distinct type of documentation:

### Tutorials (Learning + Practical)
- User is learning how to do something
- User is following along
- User is doing it for the first time
- **Purpose**: To learn

### How-to Guides (Looking Up + Practical)
- User knows what they want to accomplish
- User needs to know how to do it
- User is looking up the steps
- **Purpose**: To accomplish

### Explanation (Learning + Theoretical)
- User is learning why something is the way it is
- User wants to understand concepts
- User wants context and background
- **Purpose**: To explain and clarify

### Reference (Looking Up + Theoretical)
- User knows what they need
- User wants to look up facts
- User wants to understand the system
- **Purpose**: To describe the machinery

## Why Four Types?

These four types emerge naturally from the different ways people interact with documentation:

1. **Different states of mind**: People approach documentation differently depending on whether they're learning or looking something up
2. **Different goals**: People have different goals - some want to do, some want to understand
3. **Different needs**: These different states and goals create different needs
4. **Different forms**: These different needs are best served by different forms of documentation

## Core Principles

### The Principle of Separation

Diátaxis is based on the principle that **different needs require different forms**. Trying to serve multiple needs with a single form leads to:
- Confusion about purpose
- Mixed messages
- Ineffective documentation
- User frustration

By separating concerns - by creating distinct types for distinct needs - we can serve each need effectively.

### The Principle of Completeness

Diátaxis describes a complete picture of documentation. However, this doesn't mean you need to have all four types:
- **Completeness is a guide, not a requirement**
- Work on what users need most
- Fill gaps over time
- Let the structure emerge

### The Principle of Iteration

Diátaxis is designed for iterative improvement:
- **Don't try to complete everything at once**
- **Work on one piece at a time**
- **Publish improvements immediately**
- **Let the big picture emerge from small steps**

### The Principle of User-Centeredness

Diátaxis is fundamentally user-centered:
- **Serves user needs**, not documentation completeness
- **Responds to user states**, not documentation structure
- **Addresses user goals**, not documentation coverage
- **Helps users**, not documentation metrics

### The Principle of Practicality

Diátaxis is designed to be practical:
- **Easy to understand** - Simple concepts, clear structure
- **Easy to apply** - Tools like The Compass help you find direction
- **Easy to use** - Works with existing documentation, doesn't require starting over
- **Proven in practice** - Based on real-world experience

## Understanding the Axes

### Tutorials and How-to Guides: The Practical Axis

Tutorials and How-to Guides both sit on the **practical axis** - they both involve doing something. The difference between them lies on the **learning/looking up axis**.

**What They Share:**
- Both involve doing something
- Both are goal-oriented
- Both provide steps
- Both are prescriptive

**How They Differ:**
- **Tutorial**: User is learning, doing it for the first time
- **How-to Guide**: User knows what they want, looking up how to do it

**The Key Difference**: The user's state of mind
- Tutorial: "I want to learn how to do this"
- How-to Guide: "I know what I want, how do I do it?"

**Common Confusions:**
- Writing a Tutorial as a How-to Guide: Too prescriptive, not enough learning
- Writing a How-to Guide as a Tutorial: Too much explanation, not enough directness

### Reference and Explanation: The Theoretical Axis

Reference and Explanation both sit on the **theoretical axis** - they both involve understanding. The difference between them lies on the **learning/looking up axis**.

**What They Share:**
- Both involve understanding
- Both are information-oriented
- Both explain concepts
- Both are descriptive

**How They Differ:**
- **Reference**: User is looking up facts about the system
- **Explanation**: User is learning why things are the way they are

**The Key Difference**: The user's state of mind
- Reference: "What does X do?"
- Explanation: "Why is X this way?"

**Common Confusions:**
- Writing Reference as Explanation: Too much context, not enough facts
- Writing Explanation as Reference: Too many facts, not enough context

## Quality Principles

### What Makes Documentation Quality?

Quality documentation serves its users effectively. In Diátaxis, quality means that each piece of documentation:
- Is the right type for its purpose
- Follows the principles of that type
- Serves the user's need effectively
- Is clear and accessible

### Quality Principles

1. **Right Type, Right Purpose** - Each piece should be clearly one of the four types, and should serve that type's purpose effectively

2. **Follow Type Principles** - Each type has specific principles. Quality documentation follows them

3. **Serve the User's Need** - Quality documentation addresses the user's actual need, not what we think they need

4. **Be Clear and Accessible** - Quality documentation is clear, accessible, complete (for its type), and accurate

### Common Quality Problems

- **Wrong Type**: Documentation is the wrong type for its purpose
- **Mixed Types**: Documentation tries to be multiple types at once
- **Missing Principles**: Documentation doesn't follow its type's principles
- **Not Serving User Needs**: Documentation doesn't address what users actually need
- **Unclear Purpose**: It's not clear what type the documentation is

### Quality vs Completeness

Quality is not the same as completeness. You can have:
- **High quality, incomplete**: A few excellent pieces that serve their purpose well
- **Low quality, complete**: Many pieces that don't serve their purpose well

**Aim for high quality, even if incomplete.** It's better to have a few excellent pieces than many mediocre ones.

## Complex Hierarchies

### The Challenge

Real-world documentation is often complex:
- Multiple products or components
- Different audiences
- Varying levels of detail
- Interconnected concepts

Diátaxis provides a framework for thinking about this complexity, not a rigid structure to impose on it.

### Principles for Complex Documentation

1. **Apply Diátaxis at the Right Level** - Diátaxis applies to **pieces of documentation**, not necessarily to the entire structure

2. **Each Piece Has One Type** - Each individual piece should be clearly one type

3. **Use Hierarchies Thoughtfully** - Organize by subject, not by type. Let types emerge from user needs

4. **Link Between Related Content** - When content is related, link between pieces and make relationships clear

### Organizing Complex Documentation

**By Subject, Not by Type**

Don't organize like this:
```
Documentation/
  Tutorials/
  How-to Guides/
  Reference/
  Explanation/
```

Do this instead:
```
Documentation/
  Getting Started/
    Tutorial: Build Your First App
    How-to: Deploy Your App
  Authentication/
    Explanation: Why We Use Tokens
    How-to: Implement Authentication
    Reference: Auth API
```

### Handling Multiple Products

If you have multiple, distinct products:
- Each can have its own documentation
- Each follows Diátaxis principles
- Link between them when relevant

If products share concepts:
- **Explanation** can be shared - concepts apply across products
- **Reference** might be product-specific - each product has its own API
- **Tutorials** are usually product-specific - learning is product-specific
- **How-to Guides** might be shared or product-specific - depends on the task

### Handling Different Audiences

Different audiences might need:
- Different **subjects** - Developers vs users
- Different **levels** - Beginners vs experts
- But the same **types** - Everyone needs tutorials, how-to guides, reference, explanation

## How Diátaxis Solves Problems

### Content Problems

**Problem**: What should I write?

**Solution**: Diátaxis identifies four distinct needs and four corresponding forms. Use The Compass to identify what type to write.

### Style Problems

**Problem**: How should I write it?

**Solution**: Each type has specific principles for how to write it. Follow the guidance for that type.

### Architecture Problems

**Problem**: How should I organize it?

**Solution**: The Map shows how the four types relate to each other. Use it to understand and organize your documentation.

## Why Diátaxis Works

Diátaxis works because it:
1. **Addresses real needs** - Based on how people actually use documentation
2. **Is simple to understand** - Four types, two axes, clear principles
3. **Is practical to apply** - Tools and guidance for everyday work
4. **Is proven in practice** - Used successfully in hundreds of projects
5. **Is flexible** - Works with existing documentation, doesn't require starting over

## Remember

The foundations of Diátaxis are:
- **Four distinct types** for four distinct needs
- **Two axes** that organize the types
- **Principles** that guide practice
- **Tools** that help you apply it
- **User-centered** approach

Understanding these foundations helps you understand why Diátaxis works, and how to apply it effectively.

---

**Related**: [The Compass](./THE-COMPASS.md) | [The Map](./THE-MAP.md) | [Applying and Workflow](./APPLYING-AND-WORKFLOW.md)



