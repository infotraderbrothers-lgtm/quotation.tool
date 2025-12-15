// PDF Generator using Doppio.sh API
const DOPPIO_API_KEY = '2e650ea1d2829c0979a02189'; // Your Doppio API key

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
    
    // Convert HTML to base64 for Doppio API
    const base64Html = btoa(unescape(encodeURIComponent(htmlContent)));

    // Generate filename
    const clientName = document.getElementById('clientName').value || 'Client';
    const estimateNumber = document.getElementById('estimateNumber').value || 'EST';
    const sanitizedClientName = clientName.replace(/[^a-z0-9]/gi, '_');
    const sanitizedEstNumber = estimateNumber.replace(/[^a-z0-9]/gi, '_');
    const filename = `${sanitizedClientName}_Estimate_${sanitizedEstNumber}.pdf`;

    console.log('Sending request to Doppio...');

    // Send request to Doppio API using the CORRECT endpoint and structure
    const response = await fetch('https://api.doppio.sh/v1/render/pdf/direct', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DOPPIO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page: {
          setContent: {
            html: base64Html
          },
          emulateMediaType: 'print',
          pdf: {
            printBackground: true,
            format: 'A4',
            margin: {
              top: '20px',
              right: '20px',
              bottom: '20px',
              left: '20px'
            }
          }
        }
      })
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: await response.text() || 'Unknown error' };
      }
      
      console.error('Doppio API error:', errorData);
      
      // Specific error messages based on status code
      if (response.status === 401) {
        throw new Error('Authentication failed. Your API key appears to be invalid or expired.\n\nPlease:\n1. Check your API key at https://doppio.sh/dashboard\n2. Verify your account is active\n3. Check if you have remaining free tier credits (400 PDFs/month)');
      } else if (response.status === 403) {
        throw new Error('Access forbidden. Your API key may not have permission to generate PDFs.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. You may have used your free tier quota (400 PDFs/month).\n\nPlease wait or upgrade your plan at https://doppio.sh/dashboard');
      } else {
        throw new Error(errorData.message || `API Error (${response.status}): ${response.statusText}`);
      }
    }

    console.log('Receiving PDF from Doppio...');

    // Get the PDF as a blob (direct endpoint returns raw PDF)
    const blob = await response.blob();
    
    // Verify we got a PDF
    if (blob.size === 0) {
      throw new Error('Received empty PDF from server');
    }

    console.log('PDF blob size:', blob.size, 'bytes');

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);

    console.log('PDF downloaded successfully!');
    
    // Show success message
    setTimeout(() => {
      alert('PDF downloaded successfully!');
    }, 100);

  } catch (error) {
    console.error('Error generating PDF:', error);
    
    let errorMessage = 'Error generating PDF\n\n';
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      errorMessage += 'Network Error - Cannot connect to Doppio API.\n\n';
      errorMessage += 'Please check:\n';
      errorMessage += '• Your internet connection\n';
      errorMessage += '• Firewall or browser extensions blocking the request\n';
      errorMessage += '• Try using a different browser\n\n';
      errorMessage += 'If the problem persists, the Doppio service may be temporarily unavailable.';
    } else {
      errorMessage += error.message;
      errorMessage += '\n\nTechnical details logged to console (press F12 to view)';
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
  
  // Get all the CSS styles with UPDATED client info sizing
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
        font-size: 16px;
        color: #666;
        margin-bottom: 10px;
        font-weight: bold;
      }
      
      .client-info p {
        font-size: 15px;
        line-height: 1.6;
        color: #333;
        font-weight: 500;
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
        padding: 14px 12px;
        text-align: left;
        font-size: 14px;
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
        padding: 8px 12px;
        font-size: 12px;
        font-weight: normal;
        border-bottom: 1px solid #f0f0f0;
        color: #555;
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
        padding: 12px 12px;
        font-size: 13px;
        font-weight: 600;
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
