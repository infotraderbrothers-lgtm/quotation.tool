// Navigation between screens
document.addEventListener('DOMContentLoaded', function() {
  // Show splash screen on load
  const splashScreen = document.getElementById('splashScreen');
  const dashboardScreen = document.getElementById('dashboardScreen');
  const quotationScreen = document.getElementById('quotationScreen');
  
  // Ensure splash is visible
  if (splashScreen && dashboardScreen) {
    splashScreen.classList.add('active');
    
    // Auto-advance from splash to dashboard after 2 seconds
    setTimeout(() => {
      splashScreen.classList.add('fade-out');
      
      setTimeout(() => {
        splashScreen.style.display = 'none';
        splashScreen.classList.remove('active', 'fade-out');
        dashboardScreen.classList.add('active');
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
    
    // Scroll to top
    window.scrollTo(0, 0);
  }
}

function navigateToDashboard() {
  const dashboardScreen = document.getElementById('dashboardScreen');
  const quotationScreen = document.getElementById('quotationScreen');
  
  if (dashboardScreen && quotationScreen) {
    quotationScreen.classList.remove('active');
    dashboardScreen.classList.add('active');
    
    // Scroll to top
    window.scrollTo(0, 0);
  }
}
