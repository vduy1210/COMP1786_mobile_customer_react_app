# Universal Yoga App - Zip File Contents

## Required Files for Submission

### Essential Project Files
```
Universal-yoga-app/
├── README.md                    # Main documentation and overview
├── INSTALLATION_GUIDE.md        # Detailed setup instructions
├── CODE_ATTRIBUTION.md          # Code references and academic integrity
├── package.json                 # Dependencies and scripts
├── app.json                     # Expo configuration
├── App.js                       # Main application entry point
├── firebaseConfig.js            # Firebase database configuration
└── index.js                     # Expo entry point
```

### Application Source Code
```
components/
└── CourseItem.js               # Reusable course card component

screens/
├── CourseListScreen.js         # Main courses listing screen
├── CourseDetailScreen.js       # Individual course details
├── ClassInstancesScreen.js     # Course sessions/instances
├── SearchScreen.js             # Course search and filtering
├── YourClassesScreen.js        # User's booked classes
└── BookingScreen.js            # Course booking interface
```

### Assets and Resources
```
assets/
├── adaptive-icon.png           # Android adaptive icon
├── favicon.png                 # Web favicon
├── icon.png                    # App icon
└── splash-icon.png             # Splash screen icon
```

### Optional but Recommended
```
node_modules/                   # Dependencies (auto-generated)
.expo/                          # Expo cache (auto-generated)
.gitignore                      # Git ignore rules
yarn.lock or package-lock.json  # Dependency lock file
```

## Files NOT to Include

### Auto-generated Files (Exclude these)
- `node_modules/` - Too large, auto-generated via `npm install`
- `.expo/` - Cache directory, auto-generated
- `build/` - Build output directory
- `.git/` - Git repository data (if present)

### Platform-specific (Optional)
- `android/` - Only if you have custom native code
- `ios/` - Only if you have custom native code

## Creating the Zip File

### Step 1: Prepare Files
Ensure your Universal-yoga-app folder contains all required files listed above.

### Step 2: Clean Project (Optional but Recommended)
Before zipping, you can clean the project:
```bash
# Remove node_modules to reduce size
rm -rf node_modules

# Remove cache directories
rm -rf .expo
```

### Step 3: Create Zip Archive

#### Windows (File Explorer)
1. Right-click on `Universal-yoga-app` folder
2. Select "Send to" → "Compressed (zipped) folder"
3. Rename to: `COMP1786_UniversalYogaApp_[YourStudentID].zip`

#### Windows (Command Line)
```powershell
Compress-Archive -Path "Universal-yoga-app" -DestinationPath "COMP1786_UniversalYogaApp_[YourStudentID].zip"
```

#### macOS/Linux (Terminal)
```bash
zip -r COMP1786_UniversalYogaApp_[YourStudentID].zip Universal-yoga-app/
```

#### macOS (Finder)
1. Right-click on `Universal-yoga-app` folder
2. Select "Compress Universal-yoga-app"
3. Rename the resulting archive

### Step 4: Verify Zip Contents
Before submission, extract the zip to a new location and verify:
1. All required files are present
2. Package.json contains all dependencies
3. README.md has complete instructions
4. CODE_ATTRIBUTION.md documents all references

## Recommended Zip File Name Format
```
COMP1786_UniversalYogaApp_[YourStudentID]_[Date].zip

Example:
COMP1786_UniversalYogaApp_12345678_20250805.zip
```

## File Size Considerations

### With node_modules: ~200-500MB
- Includes all dependencies
- Ready to run immediately
- Larger upload size

### Without node_modules: ~5-10MB  
- Smaller, faster upload
- Requires `npm install` before running
- **Recommended for submission**

## Submission Checklist

### ✅ Required Documentation
- [ ] README.md with complete instructions
- [ ] INSTALLATION_GUIDE.md with step-by-step setup
- [ ] CODE_ATTRIBUTION.md with references
- [ ] Clear academic integrity statement

### ✅ Source Code
- [ ] All screen components included
- [ ] Main App.js file
- [ ] Firebase configuration
- [ ] Package.json with dependencies

### ✅ Testing Verification
- [ ] Extract zip to new location
- [ ] Run `npm install`
- [ ] Run `npm start`
- [ ] Verify app launches successfully
- [ ] Test core functionality

### ✅ Academic Requirements
- [ ] All borrowed code documented
- [ ] References properly cited
- [ ] Original work clearly identified
- [ ] No shared code with other students

## Final Submission Notes

### For the Marker/Reviewer
The zip file contains everything needed to:
1. Extract and set up the project
2. Install dependencies with one command
3. Run the application immediately
4. Understand code attribution and references
5. Test all features of the app

### Expected Review Process
1. Extract zip file
2. Read README.md for overview
3. Follow INSTALLATION_GUIDE.md for setup
4. Review CODE_ATTRIBUTION.md for academic integrity
5. Test application functionality
6. Review source code for quality and originality

### Estimated Setup Time for Reviewer
- **File extraction**: 1 minute
- **Reading documentation**: 5-10 minutes
- **Installation**: 5-10 minutes
- **Testing functionality**: 10-15 minutes
- **Total**: 20-30 minutes

---

**Important**: Ensure the zip file is tested on a clean system before submission to verify all components work correctly for the reviewer.
