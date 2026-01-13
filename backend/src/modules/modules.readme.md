# Module Interaction
auth → users
auth → permissions
permissions → plans
scheduler → excel (read-only)
scheduler → messaging
billing → plans
billing → permissions

# Module Dependency Rules (Golden Rules)
✔ Each module exposes services, not DB
✔ Only auth touches JWT
✔ Only permissions decides access
✔ Only scheduler creates jobs
✔ Only messaging sends WhatsApp