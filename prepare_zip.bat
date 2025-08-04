@echo off
echo ================================================
echo Universal Yoga App - Zip Preparation Script
echo ================================================
echo.

echo Step 1: Cleaning project directory...
if exist node_modules (
    echo Removing node_modules directory...
    rmdir /s /q node_modules
)

if exist .expo (
    echo Removing .expo cache...
    rmdir /s /q .expo
)

echo.
echo Step 2: Project is now ready for zipping!
echo.
echo To create the zip file:
echo 1. Right-click on the Universal-yoga-app folder
echo 2. Select "Send to" - "Compressed (zipped) folder"
echo 3. Rename to: COMP1786_UniversalYogaApp_[YourStudentID].zip
echo.
echo Alternative: Use PowerShell command:
echo Compress-Archive -Path "Universal-yoga-app" -DestinationPath "COMP1786_UniversalYogaApp.zip"
echo.
echo Files included in your zip:
echo - README.md (main documentation)
echo - INSTALLATION_GUIDE.md (setup instructions)
echo - CODE_ATTRIBUTION.md (code references)
echo - ZIP_CONTENTS.md (this guide)
echo - All source code files (.js files)
echo - package.json (dependencies)
echo - app.json (configuration)
echo - assets/ folder (images and icons)
echo.
echo IMPORTANT: Test the zip file by:
echo 1. Extract to a new location
echo 2. Run: npm install
echo 3. Run: npm start
echo 4. Verify the app works correctly
echo.
pause
