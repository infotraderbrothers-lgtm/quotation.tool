// PDF Generator using jsPDF and html2canvas
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
    // Wait a moment for any images to load
    await new Promise(resolve => setTimeout(resolve, 500));

    // Use html2canvas to capture the content
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      imageTimeout: 0,
      removeContainer: true
    });

    // Calculate dimensions for A4
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create PDF using jsPDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // Calculate how many pages are needed
    let heightLeft = imgHeight;
    let position = 0;

    // Add the first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    // Add additional pages if content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    // Generate filename from client name and estimate number
    const clientName = document.getElementById('clientName').value || 'Client';
    const estimateNumber = document.getElementById('estimateNumber').value || 'EST';
    const sanitizedClientName = clientName.replace(/[^a-z0-9]/gi, '_');
    const sanitizedEstNumber = estimateNumber.replace(/[^a-z0-9]/gi, '_');
    const filename = `${sanitizedClientName}_Estimate_${sanitizedEstNumber}.pdf`;

    // Save the PDF
    pdf.save(filename);

    // Show success message
    setTimeout(() => {
      alert('PDF downloaded successfully!');
    }, 100);

  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again. Error: ' + error.message);
  } finally {
    // Restore button state
    downloadBtn.textContent = originalText;
    downloadBtn.disabled = false;
  }
}
