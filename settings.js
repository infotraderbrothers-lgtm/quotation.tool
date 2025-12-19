// Settings Management

// Logo upload handler
document.getElementById('logoUpload')?.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      alert('File is too large. Please choose an image under 2MB.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
      document.getElementById('logoPreview').src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Color preset selection
function selectColorPreset(element) {
  const colors = JSON.parse(element.getAttribute('data-colors'));
  document.getElementById('primaryColor').value = colors.primary;
  document.getElementById('secondaryColor').value = colors.secondary;
  
  // Visual feedback
  document.querySelectorAll('.preset-option').forEach(el => el.classList.remove('selected'));
  element.classList.add('selected');
}

// Save setup configuration
function saveSetup() {
  const companyName = document.getElementById('setupCompanyName').value.trim();
  const phone = document.getElementById('setupPhone').value.trim();
  const email = document.getElementById('setupEmail').value.trim();
  const address = document.getElementById('setupAddress').value.trim();
  const city = document.getElementById('setupCity').value.trim();
  const postcode = document.getElementById('setupPostcode').value.trim();
  
  if (!companyName || !phone || !email || !address || !city || !postcode) {
    alert('Please fill in all required fields (marked with *)');
    return;
  }
  
  const logoSrc = document.getElementById('logoPreview').src;
  
  const settings = {
    companyName: companyName,
    phone: phone,
    email: email,
    website: document.getElementById('setupWebsite').value.trim(),
    address: address,
    city: city,
    postcode: postcode,
    vat: document.getElementById('setupVAT').value.trim(),
    regNo: document.getElementById('setupRegNo').value.trim(),
    logo: logoSrc,
    primaryColor: document.getElementById('primaryColor').value,
    secondaryColor: document.getElementById('secondaryColor').value,
    paymentTerms: document.getElementById('setupPaymentTerms').value,
    notes: document.getElementById('setupNotes').value.trim(),
    setupComplete: true
  };
  
  localStorage.setItem('companySettings', JSON.stringify(settings));
  applyBranding(settings);
  
  document.getElementById('setupScreen').classList.remove('active');
  document.getElementById('dashboardScreen').classList.add('active');
}

// Skip setup and use defaults
function skipSetup() {
  const defaultSettings = {
    companyName: 'Trader Brothers Ltd',
    phone: '07448835577',
    email: 'info@traderbrothers.co.uk',
    website: '',
    address: '123 Business Park, Hillington',
    city: 'Glasgow',
    postcode: 'G52 4XZ',
    vat: '',
    regNo: '',
    logo: 'https://raw.githubusercontent.com/infotraderbrothers-lgtm/traderbrothers-assets-logo/main/Trader%20Brothers.png',
    primaryColor: '#d4af37',
    secondaryColor: '#bc9c22',
    paymentTerms: '50-50',
    notes: '',
    setupComplete: true
  };
  
  localStorage.setItem('companySettings', JSON.stringify(defaultSettings));
  applyBranding(defaultSettings);
  
  document.getElementById('setupScreen').classList.remove('active');
  document.getElementById('dashboardScreen').classList.add('active');
}

// Apply branding throughout the app
function applyBranding(settings) {
  // Apply colors as CSS variables
  document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
  document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
  
  // Dashboard
  document.getElementById('dashboardLogo').src = settings.logo;
  document.getElementById('dashboardTitle').textContent = settings.companyName.toUpperCase();
  document.getElementById('dashboardWelcome').textContent = `Welcome to ${settings.companyName}`;
  document.getElementById('dashboardFooter').textContent = `© 2024 ${settings.companyName}. All rights reserved.`;
  
  // Quotation screen
  document.getElementById('quotationLogo').src = settings.logo;
  document.getElementById('quotationCompanyName').innerHTML = settings.companyName.toUpperCase();
  document.getElementById('quotationNavTitle').textContent = `${settings.companyName} - Quotation System`;
  
  // Splash screen
  document.getElementById('splashLogo').src = settings.logo;
}

// Load settings on startup
function loadSettings() {
  const settings = localStorage.getItem('companySettings');
  if (settings) {
    const parsed = JSON.parse(settings);
    applyBranding(parsed);
    
    // Check for dark mode
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true') {
      document.body.classList.add('dark-mode');
    }
    
    return parsed;
  }
  return null;
}

// Open settings to edit
function openSettings() {
  const settings = loadSettings();
  if (!settings) return;
  
  // Populate setup form with current settings
  document.getElementById('setupCompanyName').value = settings.companyName;
  document.getElementById('setupPhone').value = settings.phone;
  document.getElementById('setupEmail').value = settings.email;
  document.getElementById('setupWebsite').value = settings.website || '';
  document.getElementById('setupAddress').value = settings.address;
  document.getElementById('setupCity').value = settings.city;
  document.getElementById('setupPostcode').value = settings.postcode;
  document.getElementById('setupVAT').value = settings.vat || '';
  document.getElementById('setupRegNo').value = settings.regNo || '';
  document.getElementById('logoPreview').src = settings.logo;
  document.getElementById('primaryColor').value = settings.primaryColor;
  document.getElementById('secondaryColor').value = settings.secondaryColor;
  document.getElementById('setupPaymentTerms').value = settings.paymentTerms;
  document.getElementById('setupNotes').value = settings.notes || '';
  
  // Show setup screen
  document.getElementById('dashboardScreen').classList.remove('active');
  document.getElementById('setupScreen').classList.add('active');
}

// Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark);
}

// Get company settings for PDF generation
function getCompanySettings() {
  const settings = localStorage.getItem('companySettings');
  if (settings) {
    return JSON.parse(settings);
  }
  return null;
}
