# Update Medications Distribution

To update the medication distribution in the database so both pharmacies have both Semaglutide and Tirzepatide:

## On Railway Dashboard:

1. Go to your Railway dashboard
2. Click on the `meditrack-app` service
3. Click on the "Variables" tab
4. Make sure `DATABASE_URL` is properly set
5. Click on the service settings (three dots menu)
6. Select "Run a command"
7. Run this command:

```bash
npm run db:seed
```

This will update the medications so both pharmacies can stock both types of medications.

## Note:
The seed script is designed to use `upsert` operations, so it will update existing records without duplicating data.
