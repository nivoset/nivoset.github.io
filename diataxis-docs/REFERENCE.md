# Reference

**Orientation**: Information-oriented  
**Purpose**: To describe the machinery

---

## What is Reference Documentation?

Reference documentation is **information-oriented**. Its purpose is to describe the machinery. It's a technical description of the thing and how to operate it.

Reference documentation is not the same as a tutorial or how-to guide. It doesn't teach or guide - it describes. It's the documentation you look up when you need to know something specific about the system.

## Characteristics of Reference Documentation

### Information-Oriented
- The user is looking up information
- The user needs to know something specific
- The user wants facts, not guidance
- The user wants to understand the system

### Complete and Accurate
- Describes everything
- Describes it accurately
- Describes it precisely
- No gaps or ambiguities

### Organized for Lookup
- Easy to find what you need
- Organized logically
- Indexed and searchable
- Quick to scan

### Descriptive, Not Prescriptive
- Describes what is, not what to do
- States facts, not instructions
- Shows what's available, not how to use it
- Objective and neutral

## How to Write Reference Documentation

### 1. Be Complete

Include everything:
- All functions, methods, classes
- All parameters and their types
- All return values
- All exceptions and errors
- All options and configurations

### 2. Be Accurate

- Every detail must be correct
- Match the actual implementation
- Keep it up to date
- Verify against the code

### 3. Be Precise

- Use exact terminology
- Specify types precisely
- Be unambiguous
- Don't leave room for interpretation

### 4. Be Organized

Organize for quick lookup:
- Alphabetical order (for APIs)
- Logical grouping (for concepts)
- Clear hierarchy
- Good indexing

### 5. Be Concise

- Get to the point quickly
- Don't explain concepts (that's explanation)
- Don't show how to use it (that's tutorial/how-to)
- Just describe what it is

### 6. Use Consistent Structure

For each item, include:
- Name and signature
- Description
- Parameters
- Return value
- Exceptions
- Examples (brief, if helpful)

## Structure of Reference Documentation

### For APIs/Libraries

```markdown
# API Reference

## Module: authentication

### function authenticate(username, password)

Authenticates a user with the given credentials.

**Parameters:**
- `username` (string): The user's username
- `password` (string): The user's password

**Returns:**
- `AuthToken`: An authentication token if successful

**Raises:**
- `AuthenticationError`: If credentials are invalid

**Example:**
```python
token = authenticate("user", "pass")
```
```

### For Configuration

```markdown
# Configuration Reference

## server.port

**Type:** integer  
**Default:** 8080  
**Description:** The port number the server listens on.

**Example:**
```yaml
server:
  port: 3000
```
```

### For Data Structures

```markdown
# Data Structure Reference

## User

Represents a user in the system.

**Fields:**
- `id` (string): Unique identifier
- `username` (string): Username
- `email` (string): Email address
- `created_at` (datetime): Account creation timestamp
```

## Common Reference Documentation Types

### API Reference
- Function/method signatures
- Parameters and types
- Return values
- Exceptions

### Configuration Reference
- Configuration options
- Default values
- Valid values
- Environment variables

### Command Reference
- Command syntax
- Options and flags
- Arguments
- Exit codes

### Data Structure Reference
- Types and schemas
- Fields and properties
- Relationships
- Constraints

### Error Reference
- Error codes
- Error messages
- Causes
- Solutions (brief)

## Common Mistakes

### ❌ Too Much Explanation
**Bad**: "This function is really important because it handles authentication, which is a critical security feature..."  
**Good**: "Authenticates a user with the given credentials."

### ❌ Too Prescriptive
**Bad**: "You should call this function before accessing protected resources."  
**Good**: "Returns an authentication token if credentials are valid."

### ❌ Incomplete
**Bad**: "This function takes some parameters and returns something."  
**Good**: "`authenticate(username: string, password: string): AuthToken`"

### ❌ Not Organized for Lookup
**Bad**: Functions in random order  
**Good**: Functions alphabetically or by logical grouping

### ❌ Missing Details
**Bad**: "This option controls the server."  
**Good**: "`server.port` (integer, default: 8080): The port number the server listens on."

## Reference vs Tutorial

| Reference | Tutorial |
|-----------|----------|
| Information-oriented | Learning-oriented |
| Looking up facts | Learning for the first time |
| Describes what is | Shows how to do |
| Complete and accurate | Complete and concrete |
| Organized for lookup | Step-by-step |

## Reference vs How-To Guide

| Reference | How-To Guide |
|-----------|--------------|
| Information-oriented | Goal-oriented |
| What something is/does | How to do something |
| Descriptive | Prescriptive |
| Facts about the system | Steps to accomplish a goal |
| Organized for lookup | Organized by task |

## Reference vs Explanation

| Reference | Explanation |
|-----------|-------------|
| Information-oriented | Understanding-oriented |
| What something is | Why something is |
| Describes the machinery | Explains the thinking |
| Facts and specifications | Concepts and reasoning |
| Quick lookup | Deep understanding |

## Checklist

- [ ] Is it complete (covers everything)?
- [ ] Is it accurate (matches implementation)?
- [ ] Is it precise (unambiguous)?
- [ ] Is it organized for quick lookup?
- [ ] Is it descriptive, not prescriptive?
- [ ] Is it concise (no unnecessary explanation)?
- [ ] Does it use consistent structure?
- [ ] Can users find what they need quickly?

---

**Related**: [Tutorials](./TUTORIALS.md) | [How-to Guides](./HOW-TO-GUIDES.md) | [Explanation](./EXPLANATION.md)

