# DevTask - CLI Documentation

## Overview

**DevTask** is a command-line task management tool designed specifically for developers. It helps organize development work by structuring tasks into **projects** and **features**, with support for task prioritization, status tracking, and detailed note-keeping.

### Key Features

- **Multi-project support** - Create and manage multiple development projects
- **Feature management** - Add, track, and organize features within projects
- **Focus system** - Prioritize features that need immediate attention
- **Status tracking** - Track feature progress (todo, in-progress, done)
- **Notes** - Add detailed notes to features to keep track of where you left off.
- **Database persistence** - All data is stored locally using SQLite

---

### Database Initialization

The database is automatically initialized when you first run the CLI. It creates:

- `projects` table - stores all projects
- `features` table - stores features linked to projects
- Indexes for optimized querying

---

## Project Management

### Initialize a Project

Create a new project:

```bash
devtask init <projectName>
```

**Options:**

- `-s, --switch` - Automatically switch to the newly created project. this will set the new project active and the previous project ot be inactive

- There can only be one active project

**Example:**

```bash
devtask init "My Web App"
devtask init "Backend API" --switch
# or
devtask init "Backend API" -s

```

### List All Projects

View all projects:

```bash
devtask projects
```

**Output includes:**

- Project ID
- Project name
- Status (active/inactive/done)
- Creation date

### Switch Projects

Switch the active project:

```bash
devtask switch <projectId>
```

**Example:**

```bash
devtask switch 1
```

The active project determines which features are shown and where new features are added.

### Get Current Project

View the currently active project:

```bash
devtask current
```

**Output includes:**

- Project ID
- Name
- Status
- Creation date

### Remove a Project

Delete a project:

```bash
devtask remove <projectId>
```

**Constraints:**

- Cannot delete the currently active project
- Deleting a project also removes all its features (cascade delete)

**Example:**

```bash
devtask remove 2
```

---

## Feature Management

Features are tasks within a project. They have statuses: **todo**, **in_progress**, or **done**.

### Add a Feature

Add a single feature to the active project:

```bash
devtask feat add <description>
```

Add multiple features interactively:

```bash
devtask feat add -m
# or
devtask feat add --many
```

**Example:**

```bash
devtask feat add "Implement user authentication"
devtask feat add --many
# Prompts for multiple features
```

### List Features

List features by status:

```bash
# List in-progress features (default)
devtask feat list

# List all features
devtask feat list -a
# or
devtask feat list --all

# List todo features
devtask feat list -t
# or
devtask feat list --todo
```

**Output includes:**

- Feature ID
- Description
- Current status (color-coded)
- Creation date
- Focus status (Yes/No)
- Notes (if any)

### Focus a Feature

Mark a feature as focused (priority):

```bash
# Focus a specific feature
devtask feat focus <featId>

# Focus multiple features interactively
devtask feat focus -m
# or
devtask feat focus --many
```

**Example:**

```bash
devtask feat focus 1
devtask feat feat focus --many
# Prompts to select multiple features
```

### Unfocus Features

Remove focus from all currently focused features:

```bash
devtask feat unfocus
```

This command will interactively prompt you to select which features to delete.

### Mark Feature as Done

Mark a feature as completed:

```bash
devtask feat done <featId>
```

**Behavior:**

- Updates feature status to "done"
- Automatically updates the project status if all features are done

**Example:**

```bash
devtask feat done 5
```

### Remove a Feature

Delete a feature (or multiple):

```bash
devtask feat remove
```

This command will interactively prompt you to select which features to delete.

### Add Notes to a Feature

Add notes for a feature:

```bash
devtask feat notes <featId> <description>
```

**Example:**

```bash
devtask feat notes 3 "Need to handle edge case for null values"
```
