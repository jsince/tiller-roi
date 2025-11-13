# Detailed Development Workflow Guide

## Part 1: Working Locally on the Calculator

### Step 1: Open Your Project
```bash
# Navigate to your project directory
cd /home/jeremy/code/tiller-roi

# Open in your editor (Cursor/VS Code)
# The project files are:
# - index.html (main page structure)
# - styles.css (all styling)
# - src/main.js (calculator logic)
```

### Step 2: Start a Local Development Server
**Why?** Browsers have security restrictions when opening files directly. A local server lets you test properly.

```bash
# Option A: Python HTTP server (simple, no setup needed)
python3 -m http.server 5173
# Then open: http://localhost:5173/ in your browser

# Option B: If you have Node.js installed
npx serve .

# Option C: Use Cursor/VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

**Keep the server running** while you work. Refresh the browser to see changes.

### Step 3: Make Your Changes
Edit files in your editor:
- **index.html** - Change structure, add elements, modify layout
- **styles.css** - Update colors, spacing, responsive breakpoints
- **src/main.js** - Modify calculations, add features, fix bugs

**Tip:** Save files frequently. The browser auto-refresh (if using Live Server) or manual refresh shows changes.

### Step 4: Test Your Changes
1. **Visual check:** Does it look right?
2. **Functional test:** Do calculations work correctly?
3. **Cross-browser:** Test in Chrome, Firefox, Safari if possible
4. **Responsive:** Resize browser window, test on mobile if possible
5. **Edge cases:** Try extreme values, empty inputs, etc.

### Step 5: Iterate
- Make a change
- Save file
- Refresh browser
- Test
- Repeat until satisfied

---

## Part 2: When to Commit Changes to Git

### Decision Framework: "Is This a Logical Unit of Work?"

**Commit when you have:**
- ✅ **Completed a feature** (e.g., "Added export to CSV functionality")
- ✅ **Fixed a bug** (e.g., "Fixed calculation error when conversion rate is 0")
- ✅ **Made a meaningful improvement** (e.g., "Improved mobile responsiveness for input fields")
- ✅ **Refactored code** (e.g., "Cleaned up calculation functions")
- ✅ **Reached a stable point** where the code works and you want to save progress

**Don't commit:**
- ❌ **Mid-feature** (half-working code that breaks things)
- ❌ **Every single save** (too granular, cluttered history)
- ❌ **Broken code** (unless explicitly documenting a WIP state)
- ❌ **Temporary experiments** (unless you want to keep them)

### Practical Examples:

**Example 1: Small Fix**
```
You notice: "The submit button color is wrong"
1. Edit styles.css, change button color
2. Save, refresh browser, verify it looks good
3. ✅ COMMIT: "Fix submit button color"
```

**Example 2: New Feature**
```
You want to add: "Export results as PDF"
1. Edit index.html - add PDF button
2. Edit styles.css - style the button
3. Edit src/main.js - add PDF generation logic
4. Test: Click button, verify PDF downloads correctly
5. ✅ COMMIT: "Add PDF export functionality"
```

**Example 3: Multiple Related Changes**
```
You're improving the form:
1. Change input styling (styles.css)
2. Add validation (src/main.js)
3. Update error messages (index.html)
4. Test entire form flow
5. ✅ COMMIT: "Improve form validation and styling"
```

**Example 4: Experimental Work**
```
You're trying something risky:
1. Make experimental changes
2. Test - it works but you're not sure
3. Options:
   - ✅ COMMIT: "WIP: Experimental feature X" (if you want to save it)
   - OR: git stash (temporarily save without committing)
   - OR: Keep working until it's ready, then commit
```

### The Commit Process:

```bash
# 1. Check what changed
cd /home/jeremy/code/tiller-roi
git status

# 2. Review the changes (optional but recommended)
git diff
# This shows exactly what lines changed

# 3. Stage the files you want to commit
git add .                    # Add all changes
# OR
git add index.html          # Add specific file
git add styles.css src/main.js  # Add multiple files

# 4. Commit with a descriptive message
git commit -m "Clear description of what you did"

# Good commit messages:
git commit -m "Add sensitivity analysis table"
git commit -m "Fix mobile layout for scenario cards"
git commit -m "Update calculation formulas for ROI"

# Bad commit messages:
git commit -m "changes"           # Too vague
git commit -m "fixed stuff"       # Not descriptive
git commit -m "asdf"              # Meaningless
```

### When to Push to GitHub:

**Push immediately after commit if:**
- ✅ You want to back up your work
- ✅ You want colleagues to see the changes
- ✅ You're done with a feature and want it deployed

**You can also:**
- Make multiple commits locally, then push all at once
- Push once per day, or once per feature - your choice

```bash
# Push your commits to GitHub
git push origin main

# This will:
# 1. Upload your commits to GitHub
# 2. Trigger GitHub Pages to rebuild your site
# 3. Make changes live in 1-2 minutes
```

---

## Part 3: Branching for Variations

### What is Branching?
Branches let you work on different versions/features simultaneously without affecting the main version.

### When to Create a Branch:

**Create a branch when:**
- 🎨 **Experimenting** with a major design change
- 🔧 **Adding a feature** that might break things
- 🧪 **Trying different approaches** to solve a problem
- 👥 **Collaborating** on a feature with someone else
- 📦 **Preparing a specific version** for a client/demo

### Branching Workflow:

#### Scenario 1: Experimenting with a New Design

```bash
# 1. Start from your current main branch (make sure it's clean)
cd /home/jeremy/code/tiller-roi
git status  # Should show "working tree clean"

# 2. Create and switch to a new branch
git checkout -b experiment/new-dark-theme
# This creates a branch called "experiment/new-dark-theme" and switches to it

# 3. Make your experimental changes
# Edit styles.css, change colors, etc.
# Test locally

# 4. Commit your experiment
git add .
git commit -m "Experiment: Dark theme design"

# 5. Push the branch to GitHub
git push origin experiment/new-dark-theme
# Now you have:
# - main branch: Original version (still live)
# - experiment/new-dark-theme: Your experiment (not live)

# 6. Decide what to do:
# Option A: Keep experimenting on this branch
git checkout experiment/new-dark-theme
# Make more changes, commit, push

# Option B: Switch back to main to work on something else
git checkout main
# Make different changes, commit, push
# Your experiment is safe on the other branch

# Option C: Merge experiment into main (if you like it)
git checkout main
git merge experiment/new-dark-theme
git push origin main
# Now main has your dark theme, and it deploys to live site

# Option D: Delete the branch (if you don't want it)
git branch -d experiment/new-dark-theme  # Delete locally
git push origin --delete experiment/new-dark-theme  # Delete on GitHub
```

#### Scenario 2: Adding a Major Feature

```bash
# 1. Create a feature branch
git checkout -b feature/pdf-export

# 2. Work on the feature
# Add PDF library, implement export, test thoroughly
git add .
git commit -m "Add PDF export functionality"
git commit -m "Fix PDF formatting issues"
git commit -m "Add error handling for PDF generation"

# 3. Push feature branch
git push origin feature/pdf-export

# 4. Test the feature branch thoroughly
# You can even deploy this branch to a test URL if needed

# 5. When ready, merge to main
git checkout main
git merge feature/pdf-export
git push origin main
# Feature is now live!

# 6. Clean up
git branch -d feature/pdf-export
git push origin --delete feature/pdf-export
```

#### Scenario 3: Creating Variations for Different Clients

```bash
# Main calculator (generic)
git checkout main

# Create client-specific variation
git checkout -b client/acme-corp
# Customize colors, branding, specific calculations
git commit -m "Customize for Acme Corp"
git push origin client/acme-corp

# Create another variation
git checkout main
git checkout -b client/techstart-inc
# Different customizations
git commit -m "Customize for TechStart Inc"
git push origin client/techstart-inc

# Now you have:
# - main: Generic calculator
# - client/acme-corp: Acme version
# - client/techstart-inc: TechStart version

# Work on any branch independently
git checkout client/acme-corp
# Make changes specific to Acme
git commit -m "Update Acme branding"
git push origin client/acme-corp
```

### Branch Management Commands:

```bash
# List all branches
git branch                    # Local branches
git branch -a                 # All branches (local + remote)

# Create a new branch
git checkout -b branch-name

# Switch to a branch
git checkout branch-name

# See which branch you're on
git branch
# The * shows current branch

# Delete a local branch
git branch -d branch-name

# Delete a remote branch
git push origin --delete branch-name

# Rename current branch
git branch -m new-name
```

### Branch Naming Conventions:

**Good branch names:**
- `feature/add-charts` - Adding a feature
- `fix/calculation-bug` - Fixing a bug
- `experiment/new-layout` - Experimenting
- `client/acme-corp` - Client-specific version
- `refactor/cleanup-code` - Refactoring

**Avoid:**
- `test` - Too vague
- `branch1` - Not descriptive
- `new-stuff` - Unclear purpose

---

## Complete Example: Full Workflow

Let's say you want to add a "Save Scenario" feature:

```bash
# 1. Start from clean main
cd /home/jeremy/code/tiller-roi
git checkout main
git pull origin main  # Get latest changes

# 2. Create feature branch
git checkout -b feature/save-scenarios

# 3. Work locally
# Edit index.html - add save button
# Edit src/main.js - add save/load logic
# Edit styles.css - style the button

# 4. Test locally
python3 -m http.server 5173
# Open browser, test save/load functionality

# 5. Commit when feature works
git add .
git commit -m "Add save scenario functionality"
git commit -m "Add load saved scenarios"
git commit -m "Style save/load buttons"

# 6. Push feature branch
git push origin feature/save-scenarios

# 7. Test on GitHub (optional)
# You can view the branch on GitHub, or even set up a test deployment

# 8. When satisfied, merge to main
git checkout main
git merge feature/save-scenarios
git push origin main
# Feature is now live on GitHub Pages!

# 9. Clean up
git branch -d feature/save-scenarios
git push origin --delete feature/save-scenarios
```

---

## Quick Reference Card

### Daily Workflow:
```bash
cd /home/jeremy/code/tiller-roi
# Edit files
python3 -m http.server 5173  # Test locally
git add .
git commit -m "Description"
git push origin main
```

### Starting a Feature:
```bash
git checkout -b feature/name
# Work, commit, push
git push origin feature/name
```

### Switching Between Work:
```bash
git checkout main           # Go to main
git checkout feature/name   # Go to feature
git status                  # See what branch you're on
```

### Merging Feature:
```bash
git checkout main
git merge feature/name
git push origin main
```

---

## Tips & Best Practices

1. **Commit often, push when ready** - Commits are local saves, pushes share with others
2. **Test before committing** - Don't commit broken code
3. **Write clear commit messages** - Future you will thank present you
4. **Use branches for experiments** - Keep main stable
5. **Pull before starting work** - `git pull origin main` to get latest changes
6. **One feature per branch** - Easier to review and merge
7. **Delete merged branches** - Keep things clean

---

## Troubleshooting

**"I'm on the wrong branch!"**
```bash
git checkout main  # Switch to main
```

**"I made changes but want to switch branches!"**
```bash
git stash          # Temporarily save changes
git checkout other-branch
git stash pop      # Restore changes when you come back
```

**"I committed to the wrong branch!"**
```bash
git log --oneline  # Find the commit hash
git checkout correct-branch
git cherry-pick <commit-hash>  # Copy commit to correct branch
git checkout wrong-branch
git reset HEAD~1    # Remove from wrong branch
```

**"I want to see what's different between branches"**
```bash
git diff main..feature/name  # Compare branches
```

