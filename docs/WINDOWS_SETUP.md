# Windows Setup Guide

## PowerShell Execution Policy Issue

If you see this error:
```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.
```

This is a Windows security feature that blocks PowerShell scripts. Here are solutions:

## Solution 1: Use Command Prompt (Easiest)

Instead of PowerShell, use **Command Prompt (cmd)**:

1. Press `Win + R`
2. Type `cmd` and press Enter
3. Navigate to your project:
   ```cmd
   cd D:\Training\working\cognivectra-site
   ```
4. Run npm commands:
   ```cmd
   npm run dev
   ```

## Solution 2: Change PowerShell Execution Policy (Recommended)

### Option A: For Current User Only (Safest)

Open PowerShell as Administrator:
1. Press `Win + X`
2. Select "Windows PowerShell (Admin)" or "Terminal (Admin)"
3. Run:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
4. Type `Y` when prompted
5. Close and reopen PowerShell

### Option B: For Current Session Only

In your current PowerShell window:
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

This only works for the current PowerShell session.

## Solution 3: Bypass for Single Command

Run npm with bypass flag:
```powershell
powershell -ExecutionPolicy Bypass -Command "npm run dev"
```

Or use npx:
```powershell
npx vite
```

## Verify It Works

After fixing, test:
```powershell
npm --version
```

If it shows the npm version, you're good to go!

## Recommended: Use Command Prompt

For development, **Command Prompt (cmd)** is often simpler on Windows:
- No execution policy issues
- Works out of the box
- Same commands work the same way

## Alternative: Use Windows Terminal

Windows Terminal (available in Microsoft Store) often handles this better:
1. Install Windows Terminal from Microsoft Store
2. It usually has better script execution handling
3. You can set cmd as default profile
