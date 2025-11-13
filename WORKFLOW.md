# Development & Deployment Workflow

## Quick Reference: Iterating on the Calculator

### 1. Make Changes Locally
Edit files in your project:
- `index.html` - HTML structure and layout
- `styles.css` - Styling and responsive design
- `src/main.js` - Calculator logic and functionality

### 2. Test Locally
Open the calculator in your browser to test changes:

**Option A: Direct file open**
```bash
cd /home/jeremy/code/tiller-roi
# On Windows/WSL, you can open directly:
explorer.exe index.html
# Or use a local server:
python3 -m http.server 5173
# Then visit: http://localhost:5173/
```

**Option B: Use VS Code/Cursor Live Server**
- Right-click `index.html` → "Open with Live Server"
- Or use the Live Server extension

### 3. Commit Your Changes
```bash
cd /home/jeremy/code/tiller-roi

# Check what changed
git status

# Stage your changes
git add .

# Or stage specific files
git add index.html styles.css src/main.js

# Commit with a descriptive message
git commit -m "Add feature description or Fix issue description"
```

**Commit message examples:**
- `Add sensitivity table export`
- `Fix baseline form validation`
- `Update styling for mobile responsiveness`
- `Add new scenario calculation logic`

### 4. Push to GitHub
```bash
git push origin main
```

Your credentials are already stored, so you won't be prompted for username/password.

### 5. Deploy to GitHub Pages (Automatic)
Once you push to `main`, GitHub Pages will automatically:
- Detect the changes
- Rebuild the site
- Deploy the updates

**Your live site:** https://jsince.github.io/tiller-roi/

The deployment usually takes 1-2 minutes. You can check the status at:
https://github.com/jsince/tiller-roi/actions

### 6. Share with Colleagues
After deployment completes, share the URL:
**https://jsince.github.io/tiller-roi/**

---

## Complete Workflow Example

```bash
# 1. Navigate to project
cd /home/jeremy/code/tiller-roi

# 2. Make your changes (edit files in your editor)

# 3. Test locally
python3 -m http.server 5173
# Open http://localhost:5173/ in browser

# 4. When satisfied, commit and push
git add .
git commit -m "Your descriptive commit message"
git push origin main

# 5. Wait 1-2 minutes for GitHub Pages to deploy
# 6. Visit https://jsince.github.io/tiller-roi/ to see changes live
```

---

## Tips

- **Test before pushing:** Always test locally before pushing to avoid breaking the live site
- **Commit often:** Make small, focused commits with clear messages
- **Check deployment:** Visit the Actions tab on GitHub to see deployment status
- **Rollback if needed:** If something breaks, you can revert commits or change the Pages source branch

---

## Troubleshooting

**If push fails:**
- Check your internet connection
- Verify credentials are stored: `git config --global credential.helper`
- Try: `git push origin main` again

**If site doesn't update:**
- Check GitHub Actions for errors: https://github.com/jsince/tiller-roi/actions
- Verify Pages is enabled: https://github.com/jsince/tiller-roi/settings/pages
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)

