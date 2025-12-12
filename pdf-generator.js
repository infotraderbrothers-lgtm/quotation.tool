// PDF Generator - Connects to Railway Backend
const BACKEND_URL = 'https://quotation-toolbackend-production.up.railway.app';

async function generatePDF() {
  // Get the estimate container
  const element = document.getElementById('estimateContainer');
  
  if (!element || !element.innerHTML) {
    alert('Please generate an estimate preview first');
    return;
  }

  // Show loading state
  const downloadBtn = event.target;
  const originalText = downloadBtn.textContent;
  downloadBtn.textContent = 'Generating PDF...';
  downloadBtn.disabled = true;

  try {
    // Get the complete HTML including styles
    const htmlContent = generateCompleteHTML();

    // Generate filename
    const clientName = document.getElementById('clientName').value || 'Client';
    const estimateNumber = document.getElementById('estimateNumber').value || 'EST';
    const sanitizedClientName = clientName.replace(/[^a-z0-9]/gi, '_');
    const sanitizedEstNumber = estimateNumber.replace(/[^a-z0-9]/gi, '_');
    const filename = `${sanitizedClientName}_Estimate_${sanitizedEstNumber}.pdf`;

    console.log('Sending request to backend...');

    // Send request to Railway backend
    const response = await fetch(`${BACKEND_URL}/api/generate-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: htmlContent,
        filename: filename
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    console.log('Receiving PDF from backend...');

    // Get the PDF as a blob
    const blob = await response.blob();

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    console.log('PDF downloaded successfully!');
    
    // Show success message
    setTimeout(() => {
      alert('PDF downloaded successfully!');
    }, 100);

  } catch (error) {
    console.error('Error generating PDF:', error);
    
    let errorMessage = 'Error generating PDF. ';
    
    if (error.message.includes('Failed to fetch')) {
      errorMessage += 'Cannot connect to the PDF server. Please check:\n\n';
      errorMessage += '1. Is your Railway backend running?\n';
      errorMessage += '2. Is your internet connection working?\n';
      errorMessage += '3. Check browser console for more details (F12)';
    } else {
      errorMessage += error.message;
    }
    
    alert(errorMessage);
  } finally {
    // Restore button state
    downloadBtn.textContent = originalText;
    downloadBtn.disabled = false;
  }
}

// Generate complete HTML with embedded styles
function generateCompleteHTML() {
  const estimateContent = document.getElementById('estimateContainer').innerHTML;
  
  // Get all the CSS styles from the page
  const styles = `
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: Arial, sans-serif;
        background: white;
        padding: 20px;
      }
      
      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid #333;
      }
      
      .company-info {
        flex: 1;
      }
      
      .company-name {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 10px;
        color: #333;
      }
      
      .company-name .highlight {
        background: linear-gradient(135deg, #bc9c22, #d4af37);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .company-details {
        font-size: 11px;
        line-height: 1.6;
        color: #666;
      }
      
      .logo {
        width: 120px;
        height: auto;
      }
      
      .estimate-banner {
        background: linear-gradient(135deg, #bc9c22, #d4af37);
        padding: 15px 20px;
        margin-bottom: 25px;
        display: inline-block;
        font-weight: bold;
        font-size: 16px;
        color: white;
      }
      
      .info-section {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
      }
      
      .client-info {
        flex: 1;
      }
      
      .client-info h3 {
        font-size: 12px;
        color: #666;
        margin-bottom: 8px;
      }
      
      .client-info p {
        font-size: 13px;
        line-height: 1.5;
        color: #333;
      }
      
      .estimate-details {
        flex: 0 0 250px;
      }
      
      .details-table {
        width: 100%;
        border-collapse: collapse;
      }
      
      .details-table td {
        padding: 8px 10px;
        font-size: 13px;
      }
      
      .detail-label {
        color: #666;
        text-align: left;
        width: 120px;
      }
      
      .detail-value {
        font-weight: bold;
        color: #333;
        text-align: left;
      }
      
      .expiry-date {
        background: linear-gradient(135deg, #bc9c22, #d4af37);
        padding: 5px 10px;
        display: inline-block;
        color: white;
        font-weight: bold;
      }
      
      .items-table {
        width: 100%;
        border-collapse: collapse;
        margin: 30px 0;
      }
      
      .items-table thead {
        background: #f5f5f5;
      }
      
      .items-table th {
        padding: 12px;
        text-align: left;
        font-size: 12px;
        font-weight: bold;
        color: #333;
        border-bottom: 2px solid #ddd;
      }
      
      .items-table th:nth-child(2),
      .items-table th:nth-child(3),
      .items-table th:nth-child(4) {
        text-align: right;
        width: 100px;
      }
      
      .items-table td {
        padding: 12px;
        font-size: 13px;
        border-bottom: 1px solid #eee;
        color: #333;
      }
      
      .items-table td:nth-child(2),
      .items-table td:nth-child(3),
      .items-table td:nth-child(4) {
        text-align: right;
      }
      
      .section-header-row {
        background: #f0f0f0;
        font-weight: bold;
      }
      
      .section-header-row td {
        padding: 15px 12px;
        font-size: 14px;
        color: #333;
        border-top: 2px solid #bc9c22;
        border-bottom: 1px solid #bc9c22;
      }
      
      .notes-section {
        margin: 30px 0;
        padding: 20px;
        background: #f9f9f9;
        border-left: 3px solid #bc9c22;
      }
      
      .notes-section h3 {
        font-size: 13px;
        margin-bottom: 10px;
        color: #333;
      }
      
      .notes-section ol {
        margin-left: 20px;
        font-size: 12px;
        line-height: 1.8;
        color: #666;
      }
      
      .totals-section-preview {
        margin-top: 30px;
        display: flex;
        justify-content: flex-end;
      }
      
      .totals-box {
        width: 300px;
      }
      
      .total-row-preview {
        display: flex;
        justify-content: space-between;
        padding: 10px 15px;
        font-size: 13px;
      }
      
      .total-row-preview.subtotal {
        border-top: 1px solid #ddd;
      }
      
      .total-row-preview.vat {
        color: #666;
      }
      
      .total-row-preview.final {
        background: linear-gradient(135deg, #bc9c22, #d4af37);
        color: white;
        font-weight: bold;
        font-size: 16px;
        border-top: 2px solid #333;
        margin-top: 5px;
      }
      
      .footer-note {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #ddd;
        text-align: center;
        font-size: 11px;
        color: #666;
        font-style: italic;
      }
      
      .thank-you {
        margin-top: 15px;
        font-weight: bold;
        color: #333;
        font-size: 12px;
      }
    </style>
  `;
  
  // Combine everything into complete HTML document
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Estimate</title>
      ${styles}
    </head>
    <body>
      ${estimateContent}
    </body>
    </html>
  `;
}
