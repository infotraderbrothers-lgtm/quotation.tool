// Navigation between screens
document.addEventListener('DOMContentLoaded', function() {
  // Show splash screen on load
  const splashScreen = document.getElementById('splashScreen');
  const dashboardScreen = document.getElementById('dashboardScreen');
  const quotationScreen = document.getElementById('quotationScreen');
  
  // Auto-advance from splash to dashboard after 2.5 seconds
  setTimeout(() => {
    splashScreen.classList.add('fade-out');
    
    setTimeout(() => {
      splashScreen.classList.remove('active');
      splashScreen.classList.remove('fade-out');
      dashboardScreen.classList.add('active');
    }, 500);
  }, 2500);
});

function navigateToQuotation() {
  const dashboardScreen = document.getElementById('dashboardScreen');
  const quotationScreen = document.getElementById('quotationScreen');
  
  dashboardScreen.classList.remove('active');
  quotationScreen.classList.add('active');
  
  // Scroll to top
  window.scrollTo(0, 0);
}

function navigateToDashboard() {
  const dashboardScreen = document.getElementById('dashboardScreen');
  const quotationScreen = document.getElementById('quotationScreen');
  
  quotationScreen.classList.remove('active');
  dashboardScreen.classList.add('active');
  
  // Scroll to top
  window.scrollTo(0, 0);
}
```

## **3. REPLACE: index.html** 

Copy the HTML from the artifact above ☝️

## **4. Keep these files unchanged:**
- `styles.css` - no changes
- `script.js` - no changes
- `pdf-generator.js` - no changes
- `manifest.json` - no changes
- `service-worker.js` - no changes

---

## Your folder structure should be:
```
repo/
├── index.html (REPLACE with artifact code)
├── styles.css (no change)
├── script.js (no change)
├── pdf-generator.js (no change)
├── splash.css (NEW FILE)
├── navigation.js (NEW FILE)
├── manifest.json (no change)
└── service-worker.js (no change)
