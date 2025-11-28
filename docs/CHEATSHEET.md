# Command Cheatsheet

## Development

### Start the App

```bash
pnpm dev
```

Runs the Nuxt application at [http://localhost:3000](http://localhost:3000).

---

## Supabase (Local)

### Start Local Supabase

```bash
npx supabase start
```

Starts the local database, auth server, and studio.

- **Studio URL:** [http://127.0.0.1:54323](http://127.0.0.1:54323) (Manage DB, Auth, etc.)
- **API URL:** `http://127.0.0.1:54321`
- **DB URL:** `postgresql://postgres:postgres@127.0.0.1:54322/postgres`

### Stop Local Supabase

```bash
npx supabase stop
```

Stops the containers.

### Check Status

```bash
npx supabase status
```

Shows running services.

### Reset Database

```bash
npx supabase db reset
```

**Warning:** This wipes the local database and reapplies migrations/seeds.

---

## Database Management

### Apply migration

```bash
npx supabase migration up
```

Applies the database migrations.

---

## Testing

### Run Database Tests

```bash
npx supabase test db
```

This runs all `.sql` files in `supabase/tests/`.

---

## Making Database Changes

### 1. Edit Locally

**Local Studio** at [http://127.0.0.1:54323](http://127.0.0.1:54323).

### 2. Create a Migration

Save changes to a migration file:

```bash
npx supabase db diff -f name_of_change
```

### 3. Apply to Production

Push the new migrations to the remote Supabase project:

```bash
npx supabase db push
```
