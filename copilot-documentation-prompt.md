# GitHub Copilot Documentation Generation Prompt
## Legacy Codebase Flow Documentation (Java/JSP/React/TypeScript)

You are tasked with generating comprehensive documentation for a legacy codebase following Diátaxis documentation principles. The codebase consists of Java backend services, JSP pages, React components, and TypeScript modules.

## Phase 1: Flow Detection and Prioritization (FIRST STEP)

Before generating documentation, you must first identify all flows in the codebase and determine which ones need documentation. Follow this process:

### Step 1: Detect All Flows

Analyze the codebase to identify all user-facing flows and system processes:

1. **Entry Point Detection**
   - Scan for JSP pages (`.jsp` files) - these are likely user-facing entry points
   - Identify Java servlets and controllers (look for `@WebServlet`, `@Controller`, `@RequestMapping` annotations)
   - Find React routes (check `react-router` configurations, route files)
   - Identify API endpoints (REST controllers, `@Path` annotations, API route files)
   - Look for scheduled jobs or background processes

2. **Flow Identification Criteria**
   A "flow" is a complete user journey or system process that:
   - Has a clear entry point (URL, API endpoint, user action)
   - Performs a business function
   - Involves multiple components/layers
   - Produces a meaningful output or state change

3. **Flow Categorization**
   For each detected flow, categorize by:
   - **Type**: User-facing (web page), API endpoint, background job, scheduled task
   - **Technology**: Java-only, JSP-based, React frontend, API service
   - **Complexity**: Simple (single file), Medium (2-5 files), Complex (6+ files, multiple layers)
   - **Business Criticality**: Critical, Important, Standard, Low

### Step 2: Check Documentation Status

For each detected flow, determine if documentation exists:

1. **Search for Existing Documentation**
   - Check for README files in relevant directories
   - Look for inline code comments explaining the flow
   - Search for documentation files (`.md`, `.txt`, wiki pages)
   - Check for API documentation (Swagger/OpenAPI specs)
   - Review code comments in entry point files

2. **Documentation Quality Assessment**
   For flows with existing documentation, assess:
   - **Complete**: Has all four Diátaxis types (Tutorial, How-To, Reference, Explanation)
   - **Partial**: Has some documentation but missing key sections
   - **Outdated**: Documentation exists but doesn't match current code
   - **None**: No documentation found

3. **Create Flow Inventory**
   Generate a table listing:
   - Flow name/identifier
   - Entry point (file path, URL, or endpoint)
   - Type and complexity
   - Business criticality
   - Documentation status (Complete/Partial/Outdated/None)
   - Last modified date (if available)
   - Estimated documentation effort

### Step 3: Prioritize Flows for Documentation

Create a prioritized list using these criteria:

**High Priority** (Document First):
- Business-critical flows with no documentation
- Flows that are frequently modified or cause issues
- Complex flows that new developers struggle with
- Flows with security implications
- Flows that are candidates for modernization

**Medium Priority**:
- Important flows with partial or outdated documentation
- Moderately complex flows
- Flows that are stable but need better documentation

**Low Priority**:
- Simple, well-understood flows
- Deprecated or rarely-used flows
- Flows with complete, up-to-date documentation

### Step 4: Present Findings and Get Confirmation

Generate a report with:

```markdown
# Flow Detection Report

## Summary
- Total flows detected: [number]
- Undocumented: [number]
- Partially documented: [number]
- Fully documented: [number]
- Outdated documentation: [number]

## Flow Inventory

### High Priority Flows (Recommended to Document First)
| Flow Name | Entry Point | Type | Complexity | Criticality | Doc Status | Effort |
|-----------|-------------|------|------------|-------------|------------|--------|
| [Name] | [Path/URL] | [Type] | [Level] | [Level] | [Status] | [Estimate] |

### Medium Priority Flows
[Same table format]

### Low Priority Flows
[Same table format]

## Recommendations
1. Start with: [Flow name] - [Reason]
2. Then document: [Flow name] - [Reason]
3. Consider: [Flow name] - [Reason]

## Questions for Confirmation
- Which flows should we prioritize? (Confirm or suggest changes)
- Are there any flows missing from this list?
- Should we skip any flows? (e.g., deprecated features)
- What's the target timeline? (affects prioritization)
```

**Wait for user confirmation before proceeding to documentation generation.**

Only after receiving confirmation should you proceed to Phase 2 (Documentation Generation).

---

## Phase 2: Documentation Generation

After receiving confirmation on which flows to document, proceed with generating comprehensive documentation following Diátaxis principles.

## Documentation Strategy: Diátaxis Framework

Generate documentation in four distinct categories based on user needs:

### 1. **Tutorials** (Learning-oriented)
- Step-by-step guides for new developers to understand and work with legacy flows
- Assume the reader is learning the system
- Provide complete, working examples
- Show the "happy path" first
- Use concrete examples, not abstractions

### 2. **How-To Guides** (Problem-oriented)
- Task-focused documentation for specific workflows
- Answer "How do I...?" questions
- Focus on achieving a specific goal
- Include troubleshooting and common pitfalls
- Be prescriptive and practical

### 3. **Reference** (Information-oriented)
- Complete, accurate descriptions of APIs, classes, methods, and data structures
- Organized for quick lookup
- Be precise and unambiguous
- Include all parameters, return types, exceptions
- Document both Java/JSP and React/TypeScript interfaces

### 4. **Explanation** (Understanding-oriented)
- Conceptual documentation explaining "why" and "how things work"
- Help developers understand the architecture and design decisions
- Explain legacy patterns and historical context
- Clarify complex interactions between Java, JSP, React, and TypeScript layers

## Documentation Requirements for Legacy Flows

### For Each Legacy Flow, Document:

#### Flow Overview (Explanation)
- **Purpose**: What business problem does this flow solve?
- **Historical Context**: Why was it built this way? What constraints existed?
- **Architecture**: How do Java, JSP, React, and TypeScript interact in this flow?
- **Key Components**: List all major files, classes, and functions involved
- **Data Flow**: Trace data from entry point to final output
- **Dependencies**: What other systems, databases, or services does it depend on?

#### Step-by-Step Flow (How-To Guide)
- **Entry Points**: Where does the flow begin? (URLs, API endpoints, user actions)
- **Request Handling**: How are requests processed in Java/JSP layer?
- **Frontend Interaction**: How does React/TypeScript interact with the backend?
- **Business Logic**: What processing happens in each layer?
- **Response Generation**: How is the response formatted and returned?
- **Error Handling**: What happens when things go wrong?

#### Technical Reference
- **Java Classes**: Document all relevant Java classes, methods, and their signatures
- **JSP Pages**: Document JSP files, their purpose, and embedded Java code
- **React Components**: Document component props, state, and lifecycle
- **TypeScript Interfaces**: Document type definitions and their usage
- **API Contracts**: Document request/response formats, status codes, error codes
- **Database Schema**: Document tables, relationships, and queries used

#### Code Examples (Tutorial)
- **Complete Working Examples**: Show a full flow from start to finish
- **Integration Examples**: Show how Java, JSP, React, and TypeScript work together
- **Common Patterns**: Document recurring patterns in the legacy code
- **Migration Examples**: If applicable, show how to modernize parts of the flow

## Specific Instructions for GitHub Copilot

When analyzing code and generating documentation:

1. **Start with the Flow Entry Point**
   - Identify the user action or API call that initiates the flow
   - Trace through all layers (frontend → backend → database → response)
   - Document each transition point between technologies

2. **Identify Legacy Patterns**
   - Document JSP scriptlets and their modern alternatives
   - Note deprecated Java patterns and suggest improvements
   - Identify React class components vs functional components
   - Document TypeScript any types and suggest proper typing

3. **Map Dependencies**
   - Create dependency graphs showing relationships
   - Document circular dependencies or technical debt
   - Note external dependencies and their versions

4. **Document Data Transformations**
   - Show how data changes as it moves through layers
   - Document serialization/deserialization points
   - Note any data format conversions (JSON, XML, form data, etc.)

5. **Capture Business Rules**
   - Extract business logic from code
   - Document validation rules and constraints
   - Note hardcoded values and configuration

6. **Identify Pain Points**
   - Document known issues or limitations
   - Note areas that are difficult to maintain
   - Highlight security concerns or vulnerabilities

## Output Format

For each legacy flow, generate documentation in this structure:

```markdown
# [Flow Name]

## Overview (Explanation)
[Conceptual understanding of the flow]

## Quick Start (Tutorial)
[Step-by-step guide for new developers]

## Flow Diagram
[Visual representation of the flow, if possible]

## Detailed Flow (How-To)
### Step 1: [Entry Point]
- **Location**: [File paths]
- **Trigger**: [What initiates this step]
- **Code**: [Relevant code snippets]
- **Output**: [What this step produces]

### Step 2: [Next Step]
[...]

## Technical Reference
### Java Classes
- `[ClassName]`: [Description]
  - `[methodName](params)`: [Description]

### JSP Pages
- `[pageName].jsp`: [Description, embedded Java code]

### React Components
- `<ComponentName>`: [Props, state, usage]

### TypeScript Interfaces
- `[InterfaceName]`: [Type definition and usage]

### API Endpoints
- `[HTTP Method] /[path]`: [Request/response format]

## Common Tasks (How-To)
- [How to modify this flow]
- [How to debug issues]
- [How to add new features]

## Troubleshooting
- [Common issues and solutions]

## Related Flows
- [Links to related documentation]
```

## Quality Checklist

Before finalizing documentation, ensure:

- [ ] All four Diátaxis categories are represented
- [ ] Code examples are complete and runnable
- [ ] All file paths and class names are accurate
- [ ] Cross-references between Java, JSP, React, and TypeScript are clear
- [ ] Business context is explained, not just technical details
- [ ] Legacy patterns are identified and explained
- [ ] Migration paths or modernization suggestions are included where relevant
- [ ] Security considerations are documented
- [ ] Error handling and edge cases are covered

## Context for Analysis

When analyzing code, consider:
- This is a legacy codebase with technical debt
- Multiple technologies are integrated (Java, JSP, React, TypeScript)
- Some patterns may be outdated but still functional
- Documentation should help both maintainers and those modernizing the codebase
- Focus on understanding existing flows before suggesting changes

---

## Getting Started

**Begin by running Phase 1 (Flow Detection and Prioritization):**

"Please analyze this codebase and detect all legacy flows. Generate a flow detection report showing which flows are documented, which need documentation, and prioritize them for documentation. Wait for my confirmation before proceeding to generate documentation."

**After confirmation, proceed with Phase 2:**

"Now generate comprehensive documentation for [flow name] following Diátaxis principles. Start with the entry point at [file path/URL] and trace through the entire flow."

