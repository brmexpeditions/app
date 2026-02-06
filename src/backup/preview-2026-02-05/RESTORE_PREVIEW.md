# Preview Restore Point (2026-02-05)

This snapshot matches the current working UI preview.

## Restore commands

```bash
# App shell
cp src/backup/preview-2026-02-05/App.tsx.backup src/App.tsx

# Core UI
cp src/backup/preview-2026-02-05/components/Dashboard.tsx.backup src/components/Dashboard.tsx
cp src/backup/preview-2026-02-05/components/BikeForm.tsx.backup src/components/BikeForm.tsx
cp src/backup/preview-2026-02-05/components/Analytics.tsx.backup src/components/Analytics.tsx
cp src/backup/preview-2026-02-05/components/AuthScreen.tsx.backup src/components/AuthScreen.tsx

# Types + helpers
cp src/backup/preview-2026-02-05/types/index.ts.backup src/types/index.ts
cp src/backup/preview-2026-02-05/utils/helpers.ts.backup src/utils/helpers.ts

# Supabase integration
cp src/backup/preview-2026-02-05/hooks/useSupabaseFleet.ts.backup src/hooks/useSupabaseFleet.ts
cp src/backup/preview-2026-02-05/lib/supabase.ts.backup src/lib/supabase.ts

npm run build
```

If you’re on Windows (PowerShell), use `Copy-Item` instead of `cp`.
