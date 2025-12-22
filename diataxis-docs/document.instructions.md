```markdown
# 🛠️ Copilot Prompt: Document a Codebase Using Diátaxis

You are tasked with documenting a codebase using the **Diátaxis documentation framework**. Follow the steps below to classify the documentation type, apply best practices, and produce effective, user-centered documentation.

---

## ✅ Step-by-Step Instructions

### 1. 🔍 Identify the Code Element
Choose what part of the codebase to document:
- A module, class, API, function, configuration, or CLI tool.
- Examples: `auth.js`, `UserService`, `config.yaml`, etc.

---

### 2. 🧭 Classify the Documentation Type (Use The Compass)
Ask yourself two questions to find the documentation type:
- Is the user **learning** or **looking something up**?
- Is the user **doing something** or **trying to understand something**?

| If...                        | Then...            |
|-----------------------------|--------------------|
| Learning + Doing            | Write a **Tutorial** |
| Looking Up + Doing          | Write a **How-to Guide** |
| Looking Up + Understanding  | Write a **Reference** |
| Learning + Understanding    | Write an **Explanation** |

📌 Use these guides:
- `THE-COMPASS.md`
- `THE-MAP.md`

---

### 3. 📄 Write the Documentation (Choose Format Below)

#### If Tutorial → Use `./TUTORIALS.md`
- Step-by-step guide for learning by doing.
- Assume no prior knowledge.
- Use a “happy path” walkthrough.

#### If How-to Guide → Use `./HOW-TO-GUIDES.md`
- Goal-oriented steps to achieve a specific outcome.
- Be prescriptive and concise.
- Include troubleshooting if needed.

#### If Reference → Use `./REFERENCE.md`
- Technical, complete, accurate information.
- Describe APIs, configs, commands, data models.
- Organized for quick lookup.

#### If Explanation → Use `./EXPLANATION.md`
- Explain design rationale, concepts, trade-offs.
- Help the user understand the “why” behind decisions.

---

### 4. 🔁 Apply Diátaxis Workflow Best Practices

Use `./APPLYING-AND-WORKFLOW.md`:

- Work iteratively — one piece at a time.
- Publish improvements immediately, even if small.
- Use The Map and The Compass to guide your decisions.
- Don’t attempt to perfect or restructure everything at once.

---

### 5. 🔗 Link Between Documentation Types
Create context across documents:
- From tutorials → how-to → reference.
- From how-to → explanation (why it’s done this way).
- Ensure each document only serves **one user need** clearly.

---

## 🧱 Output Template

```
## [Title of the Document]

**Type**: [Tutorial | How-to Guide | Reference | Explanation]  
**Audience**: [Who is this for? What is their goal?]

### Overview
[A short summary of what this documentation covers.]

### [If How-to: Prescriptive Steps]
1. Do this
2. Then this
3. Verify it worked

### [If Reference: Technical Facts]
- Function: `getToken()`
- Parameters: `username`, `password`
- Returns: Auth token
- Example: `getToken("admin", "pass")`

### [If Explanation: Design Rationale]
- Why this exists
- Alternatives considered
- Trade-offs and decisions

### [If Tutorial: Step-by-step Learning]
- Prerequisites
- Step 1, Step 2, etc.
- End result

### Next Steps
- Related links, follow-ups, advanced topics
```

---

## 📚 Reference Files

Use these source files during your work:
- `./THE-COMPASS.md`
- `./THE-MAP.md`
- `./TUTORIALS.md`
- `./HOW-TO-GUIDES.md`
- `./REFERENCE.md`
- `./EXPLANATION.md`
- `./APPLYING-AND-WORKFLOW.md`
- `./UNDERSTANDING-DIATAXIS.md`

---

🎯 **Remember**:
- Pick the right type before writing.
- Keep it single-purpose and user-centered.
- Iterate, publish, repeat.

```
