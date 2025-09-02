# Update Primary Pharmacy Assignment

## Overview
We need to update the database to properly reflect that BOTH pharmacies (Mycelium and Angel) can stock ALL medications (both Semaglutide and Tirzepatide).

## Steps to Update on Railway

### 1. Clear Primary Pharmacy Assignments
Go to Railway dashboard and run this command to clear the misleading primaryPharmacy assignments:

```bash
npm run db:seed
```

This will:
- Update all medications to have `primaryPharmacy: null`
- Ensure inventory records exist for all medications in both pharmacies
- Both pharmacies can now stock and dispense both Semaglutide and Tirzepatide

### 2. Verify the Changes
After running the seed, the inventory table should:
- Show ALL medications without a specific pharmacy assignment
- Allow adding stock for any medication to either pharmacy
- Allow recording usage from either pharmacy for any medication

## Important Notes
- The `primaryPharmacy` field was causing confusion by suggesting certain medications "belonged" to specific pharmacies
- In reality, both pharmacies carry full inventory of all medications
- The UI now properly reflects this by showing Mycelium Stock and Angel Stock columns for all medications
