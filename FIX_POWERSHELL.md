# Fix PowerShell Execution Policy Error

## Quick Fix (Recommended)

### Option 1: Change Execution Policy (Permanent Fix)

1. **Open PowerShell as Administrator**
   - Press `Win + X`
   - Select "Windows PowerShell (Admin)" or "Terminal (Admin)"
   - Click "Yes" when prompted

2. **Run this command:**
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. **Type `Y` and press Enter** when asked to confirm

4. **Close and reopen your terminal**

5. **Now try again:**
   ```bash
   cd cypher-hero-app
   npm install
   ```

---

### Option 2: Use Command Prompt (CMD) Instead

If you don't want to change PowerShell settings:

1. **Open Command Prompt (CMD)**
   - Press `Win + R`
   - Type `cmd` and press Enter

2. **Navigate to project:**
   ```bash
   cd "C:\Users\aliha\OneDrive\Masaüstü\PROJELER\CYPHER HERO\cypher-hero-app"
   ```

3. **Run npm commands:**
   ```bash
   npm install
   npm run dev
   ```

---

### Option 3: Bypass for Current Session Only

If you want a temporary fix (only works for current terminal session):

1. **In PowerShell, run:**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
   ```

2. **Then run:**
   ```bash
   npm install
   ```

**Note:** This only works for the current PowerShell window. You'll need to run it again each time.

---

## Recommended Solution

**Use Option 1** - It's the permanent fix and recommended by Microsoft. The `RemoteSigned` policy allows:
- ✅ Running local scripts (like npm)
- ✅ Running downloaded scripts that are signed
- ✅ Safe for development work

---

## After Fixing

Once you've fixed the execution policy, you can run:

```bash
cd cypher-hero-app
npm install
npm run dev
```

The app will start on http://localhost:3000

---

## Still Having Issues?

If you continue to have problems:
1. Use **Command Prompt (CMD)** instead of PowerShell
2. Or use **Git Bash** if you have Git installed
3. Or use **Windows Terminal** with CMD profile




