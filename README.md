# LeaveFlow

A lightweight leave management and leave request software built as a static web app.

## Features

- Add employees with department details
- Submit leave requests with leave type, date range, and reason
- Auto-calculate leave days
- Approve or reject requests
- Filter requests by status (all, pending, approved, rejected)
- Dashboard counters for quick summary
- Local persistence with `localStorage`

## Run locally

### Option 1 (recommended)

```bash
npm run preview
```

Then open `http://localhost:4173`.

### Option 2

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
