# Possible Next Improvements After Deliverable 2

The core Deliverable 2 requirements are implemented. The items below are realistic follow-up improvements.

## Data Cleanup

- Add a simple one-time migration path for any old browser `localStorage` data from earlier frontend-only versions.
- Add optional backup/export instructions for `db.json`.

## Validation and Error Handling

- Add stronger input validation for edge cases such as duplicate course codes or unrealistic assessment values.
- Add more consistent inline feedback messages across every page instead of occasional fallback alerts.
- Add a few clearer empty-state and loading messages on longer flows.

## Session and Security Polish

- Move the session secret into an environment variable for deployment.
- Add more explicit session-expired messaging on public pages if a saved local user no longer matches the server session.

## Data Layer Improvements

- Replace `db.json` with a production database in a future version if the project grows beyond course requirements.
- Add safer write handling for concurrent updates if multiple users are editing at the same time.
