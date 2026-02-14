# Fleet Guard – Restore Point v1.2.0 (🖖)

This file marks a **known-good restore point** for the project.

## Why GitHub is the correct “restore point”
To restore **all files** exactly (frontend, API routes, config, etc.), the reliable method is to create a **Git commit** and **tag** it. Then you can revert anytime in 1 command.

---

## ✅ Create the restore point NOW (recommended)
Run these commands in your project folder:

```bash
git status

git add -A

git commit -m "restore-point: Fleet Guard v1.2.0 stable"

git tag fleet-guard-v1.2.0-stable

git push origin main --tags
```

After this, you can restore the entire project to this exact state from anywhere.

---

## 🔄 Restore back to this point later

### Option A — restore working directory to this exact version
```bash
git fetch --all --tags

git checkout fleet-guard-v1.2.0-stable
```

### Option B — reset main branch back to this point (destructive)
```bash
git fetch --all --tags

git checkout main

git reset --hard fleet-guard-v1.2.0-stable

git push --force
```

---

## What’s included in this restore point
- Fleet Guard homepage + app
- Supabase wiring (Auth + fleet_store + site_settings helpers)
- Admin backend UI
- Excel import preview + validation
- Vercel API endpoint: `api/admin/users.ts`

---

## Notes
- Never store secrets in the repo. Put them in Vercel Environment Variables.
- This restore point metadata is stored at: `src/backup/stable-v1.2.0/VERSION.json`
