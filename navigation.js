// Navigation between screens
document.addEventListener('DOMContentLoaded', function() {
  const splashScreen = document.getElementById('splashScreen');
  const setupScreen = document.getElementById('setupScreen');
  const dashboardScreen = document.getElementById('dashboardScreen');
  const quotationScreen = document.getElementById('quotationScreen');
  
  // Load settings
  const settings = loadSettings();
  
  if (splashScreen && setupScreen && dashboardScreen) {
    splashScreen.classList.add('active');
    
    // Auto-advance from splash after 2 seconds
    setTimeout(() => {
      splashScreen.classList.add('fade-out');
      
      setTimeout(() => {
        splashScreen.style.display = 'none';
        splashScreen.classList.remove('active', 'fade-out');
        
        // Check if setup is complete
        if (settings && settings.setupComplete) {
          dashboardScreen.classList.add('active');
        } else {
          setupScreen.classList.add('active');
        }
      }, 500);
    }, 2000);
  }
});

function navigateToQuotation() {
  const dashboardScreen = document.getElementById('dashboardScreen');
  const quotationScreen = document.getElementById('quotationScreen');
  
  if (dashboardScreen && quotationScreen) {
    dashboardScreen.classList.remove('active');
    quotationScreen.classList.add('active');
    window.scrollTo(0, 0);
  }
}

function navigateToDashboard() {
  const dashboardScreen = document.getElementById('dashboardScreen');
  const quotationScreen = document.getElementById('quotationScreen');
  const setupScreen = document.getElementById('setupScreen');
  
  if (dashboardScreen) {
    quotationScreen?.classList.remove('active');
    setupScreen?.classList.remove('active');
    dashboardScreen.classList.add('active');
    window.scrollTo(0, 0);
  }
}

function navigateToCRM() {
  // Navigate to CRM page
  window.location.href = 'crm.html';
}
