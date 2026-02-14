# Fleet Guard – Restore Point v3.0.0 (Stable)

This repo now keeps **only one** restore point folder:

- `src/backup/stable-v3.0.0/`

## ✅ What this restore point represents
A known-good, buildable version of Fleet Guard with:
- Homepage + app
- Admin backend UI
- Supabase wiring (auth + fleet_store + site_settings + profiles)
- Excel import w/ preview
- Razorpay serverless endpoints

---

## ⭐ Recommended: Create a Git tag (best full-project restore)
A restore folder helps, but **Git tags** are the safest way to restore *all files* exactly.

Run:

```bash
git add -A

git commit -m "restore-point: Fleet Guard v3.0.0 stable"

git tag fleet-guard-v3.0.0-stable

git push origin main --tags
```

---

## 🔄 How to restore to this point later

### Option A: Checkout tag (keeps history)
```bash
git fetch --all --tags

git checkout fleet-guard-v3.0.0-stable
```

### Option B: Hard reset main back to the tag (destructive)
```bash
git fetch --all --tags

git checkout main

git reset --hard fleet-guard-v3.0.0-stable

git push --force
```

---

## Notes
- Never store secrets in the repo.
- Use Vercel Environment Variables for:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server-only)
  - `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`
  - `ADMIN_EMAILS` / `VITE_ADMIN_EMAILS`
