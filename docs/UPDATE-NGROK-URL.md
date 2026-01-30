# Update NgRok URL Script

This script helps you update the NgRok URL when it changes.

## Windows PowerShell Script

```powershell
# update-ngrok-url.ps1
param(
    [Parameter(Mandatory=$true)]
    [string]$NgrokUrl
)

# Update local environment file
$envContent = Get-Content ".env.local" | ForEach-Object {
    if ($_ -match "^NEXT_PUBLIC_NODERED_URL=") {
        "NEXT_PUBLIC_NODERED_URL=$NgrokUrl/ui"
    } else {
        $_
    }
}

$envContent | Set-Content ".env.local"
Write-Host "Updated .env.local with new NgRok URL: $NgrokUrl/ui" -ForegroundColor Green

# Instructions for Vercel
Write-Host "`nNow update Vercel:" -ForegroundColor Yellow
Write-Host "1. Go to https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. Find your AgriMarket project" -ForegroundColor White
Write-Host "3. Settings → Environment Variables" -ForegroundColor White
Write-Host "4. Update NEXT_PUBLIC_NODERED_URL to: $NgrokUrl/ui" -ForegroundColor White
Write-Host "5. Redeploy your application" -ForegroundColor White
```

## Usage

When ngrok gives you a new URL (like `https://abc123.ngrok-free.app`), run:

```powershell
.\update-ngrok-url.ps1 -NgrokUrl "https://abc123.ngrok-free.app"
```

## Current NgRok URL
Your current ngrok URL is: **https://85346bce2df5.ngrok-free.app**

Remember: 
- NgRok URLs change every time you restart ngrok
- For production, consider deploying Node-RED to a permanent cloud service
- Update both local `.env.local` and Vercel environment variables when URL changes