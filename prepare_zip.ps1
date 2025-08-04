# Universal Yoga App - Zip Preparation Script (PowerShell)

Write-Host "================================================" -ForegroundColor Blue
Write-Host "Universal Yoga App - Zip Preparation Script" -ForegroundColor Blue
Write-Host "================================================" -ForegroundColor Blue
Write-Host ""

Write-Host "Step 1: Cleaning project directory..." -ForegroundColor Yellow

# Remove node_modules if it exists
if (Test-Path "node_modules") {
    Write-Host "Removing node_modules directory..." -ForegroundColor Yellow
    Remove-Item "node_modules" -Recurse -Force
}

# Remove .expo cache if it exists
if (Test-Path ".expo") {
    Write-Host "Removing .expo cache..." -ForegroundColor Yellow
    Remove-Item ".expo" -Recurse -Force
}

Write-Host ""
Write-Host "Step 2: Creating zip file..." -ForegroundColor Yellow

# Get current directory name for zip file
$currentDir = Split-Path -Leaf $PWD
$zipName = "COMP1786_UniversalYogaApp_$(Get-Date -Format 'yyyyMMdd').zip"

# Create zip file
Write-Host "Creating zip file: $zipName" -ForegroundColor Green
Compress-Archive -Path "." -DestinationPath "../$zipName" -Force

Write-Host ""
Write-Host "✅ Zip file created successfully!" -ForegroundColor Green
Write-Host "Location: $(Resolve-Path "../$zipName")" -ForegroundColor Cyan
Write-Host ""

Write-Host "Files included in your zip:" -ForegroundColor Yellow
Write-Host "- README.md (main documentation)" -ForegroundColor White
Write-Host "- INSTALLATION_GUIDE.md (setup instructions)" -ForegroundColor White
Write-Host "- CODE_ATTRIBUTION.md (code references)" -ForegroundColor White
Write-Host "- ZIP_CONTENTS.md (content guide)" -ForegroundColor White
Write-Host "- All source code files (.js files)" -ForegroundColor White
Write-Host "- package.json (dependencies)" -ForegroundColor White
Write-Host "- app.json (configuration)" -ForegroundColor White
Write-Host "- assets/ folder (images and icons)" -ForegroundColor White
Write-Host ""

Write-Host "IMPORTANT: Test the zip file by:" -ForegroundColor Red
Write-Host "1. Extract to a new location" -ForegroundColor White
Write-Host "2. Run: npm install" -ForegroundColor White
Write-Host "3. Run: npm start" -ForegroundColor White
Write-Host "4. Verify the app works correctly" -ForegroundColor White
Write-Host ""

Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
