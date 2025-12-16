let sectionCounter = 0;
let itemCounters = {};

// Item Library - stored in memory
let itemLibrary = [
  { id: 1, description: 'Bathroom Renovation', price: 2500, type: 'labor' },
  { id: 2, description: 'Kitchen Rewire', price: 1800, type: 'labor' },
  { id: 3, description: 'Consumer Unit Upgrade', price: 450, type: 'labor' },
  { id: 4, description: 'Tile Installation per m²', price: 45, type: 'labor' },
  { id: 5, description: 'Double Socket Outlet', price: 35, type: 'labor' },
  { id: 6, description: 'LED Downlights', price: 25, type: 'materials' },
  { id: 7, description: 'Radiator Valve Replacement', price: 65, type: 'labor' },
  { id: 8, description: 'Tap Installation', price: 120, type: 'labor' },
  { id: 9, description: 'Drain Unblocking', price: 95, type: 'labor' },
  { id: 10, description: 'Standard White Tiles (Box)', price: 85, type: 'materials' }
];
let libraryIdCounter = 11;

// Initialize dates on load
window.onload = function() {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  document.getElementById('quoteDate').value = todayStr;
  
  const validUntil = new Date(today);
  validUntil.setDate(validUntil.getDate() + 14);
  const validUntilStr = validUntil.toISOString().split('T')[0];
  document.getElementById('expiryDate').value = validUntilStr;
  
  // Add first section by default
  addSection();
  
  // Render library items
  renderLibraryItems();
  
  // Setup library search
  document.getElementById('librarySearch').addEventListener('input', renderLibraryItems);
  
  // Setup payment terms toggle
  document.getElementById('paymentTerms').addEventListener('change', function() {
    const customTermsArea = document.getElementById('customPaymentTerms');
    if (this.value === 'custom') {
      customTermsArea.style.display = 'block';
    } else {
      customTermsArea.style.display = 'none';
    }
  });
};

// Update expiry date when quote date changes
document.getElementById('quoteDate').addEventListener('change', function() {
  const quoteDate = new Date(this.value);
  const validUntil = new Date(quoteDate);
  validUntil.setDate(validUntil.getDate() + 14);
  document.getElementById('expiryDate').value = validUntil.toISOString().split('T')[0];
});

// Library Management Functions
function renderLibraryItems() {
  const searchTerm = document.getElementById('librarySearch').value.toLowerCase();
  const container = document.getElementById('libraryItems');
  const filteredItems = itemLibrary.filter(item => 
    item.description.toLowerCase().includes(searchTerm)
  );
  
  if (filteredItems.length === 0) {
    container.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No services found. Add some in the library manager!</p>';
    return;
  }
  
  container.innerHTML = filteredItems.map(item => `
    <div class="library-item" onclick="addLibraryItemToQuote(${item.id})">
      <div style="font-weight: bold; font-size: 13px; color: #333;">${item.description}</div>
      <div style="font-size: 12px; color: #666; margin-top: 4px;">
        £${item.price.toFixed(2)} • ${item.type === 'materials' ? 'Materials' : 'Labor'}
      </div>
    </div>
  `).join('');
}

function addLibraryItemToQuote(itemId) {
  const item = itemLibrary.find(i => i.id === itemId);
  if (!item) return;
  
  // Find the first section or create one if none exists
  let targetSectionId = 0;
  if (Object.keys(itemCounters).length === 0) {
    addSection();
    targetSectionId = 0;
  } else {
    targetSectionId = parseInt(Object.keys(itemCounters)[0]);
  }
  
  // Add item to section
  addItemToSection(targetSectionId);
  const itemCount = itemCounters[targetSectionId] - 1;
  
  // Populate the item with library data
  document.getElementById(`itemDesc${targetSectionId}_${itemCount}`).value = item.description;
  document.getElementById(`itemQty${targetSectionId}_${itemCount}`).value = 1;
  document.getElementById(`itemRate${targetSectionId}_${itemCount}`).value = item.price;
  document.getElementById(`itemType${targetSectionId}_${itemCount}`).value = item.type;
  
  calculateItemTotal(targetSectionId, itemCount);
}

function openLibraryManager() {
  renderLibraryManagerList();
  document.getElementById('libraryModal').style.display = 'block';
}

function closeLibraryManager() {
  document.getElementById('libraryModal').style.display = 'none';
  document.getElementById('newLibraryDesc').value = '';
  document.getElementById('newLibraryPrice').value = '';
  document.getElementById('newLibraryType').value = 'materials';
}

function renderLibraryManagerList() {
  const container = document.getElementById('libraryManagerList');
  
  if (itemLibrary.length === 0) {
    container.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No services in library yet.</p>';
    return;
  }
  
  container.innerHTML = itemLibrary.map(item => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 8px; background: white;">
      <div>
        <div style="font-weight: bold; font-size: 13px; color: #333;">${item.description}</div>
        <div style="font-size: 12px; color: #666; margin-top: 3px;">
          £${item.price.toFixed(2)} • ${item.type === 'materials' ? 'Materials' : 'Labor'}
        </div>
      </div>
      <button onclick="deleteLibraryItem(${item.id})" style="background: #e74c3c; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">Delete</button>
    </div>
  `).join('');
}

function addLibraryItem() {
  const description = document.getElementById('newLibraryDesc').value.trim();
  const price = parseFloat(document.getElementById('newLibraryPrice').value) || 0;
  const type = document.getElementById('newLibraryType').value;
  
  if (!description) {
    alert('Please enter a description');
    return;
  }
  
  itemLibrary.push({
    id: libraryIdCounter++,
    description: description,
    price: price,
    type: type
  });
  
  document.getElementById('newLibraryDesc').value = '';
  document.getElementById('newLibraryPrice').value = '';
  document.getElementById('newLibraryType').value = 'materials';
  
  renderLibraryManagerList();
  renderLibraryItems();
}

function deleteLibraryItem(itemId) {
  if (confirm('Delete this service from your library?')) {
    itemLibrary = itemLibrary.filter(item => item.id !== itemId);
    renderLibraryManagerList();
    renderLibraryItems();
  }
}

// Templates
const templates = {
  bathroom: {
    sections: [
      {
        name: 'Demolition & Preparation',
        items: [
          { desc: 'Strip out existing bathroom fixtures', qty: 1, rate: 300, type: 'labor' }
        ]
      },
      {
        name: 'Installation',
        items: [
          { desc: 'Install new bath', qty: 1, rate: 450, type: 'labor' },
          { desc: 'Install new sink and toilet', qty: 1, rate: 350, type: 'labor' }
        ]
      },
      {
        name: 'Tiling',
        items: [
          { desc: 'Wall tiling', qty: 15, rate: 45, type: 'labor' }
        ]
      }
    ]
  },
  kitchen: {
    sections: [
      {
        name: 'Electrical Work',
        items: [
          { desc: 'Consumer unit upgrade', qty: 1, rate: 450, type: 'labor' },
          { desc: 'Kitchen circuit rewire', qty: 1, rate: 1200, type: 'labor' }
        ]
      },
      {
        name: 'Fittings',
        items: [
          { desc: 'Double socket outlets', qty: 8, rate: 35, type: 'labor' },
          { desc: 'LED downlights', qty: 10, rate: 25, type: 'materials' }
        ]
      }
    ]
  },
  extension: {
    sections: [
      {
        name: 'Groundwork',
        items: [
          { desc: 'Foundations', qty: 1, rate: 4500, type: 'labor' }
        ]
      },
      {
        name: 'Structure',
        items: [
          { desc: 'Brickwork and blockwork', qty: 35, rate: 85, type: 'labor' },
          { desc: 'Roof structure and covering', qty: 1, rate: 3200, type: 'labor' }
        ]
      },
      {
        name: 'Windows & Doors',
        items: [
          { desc: 'Supply and fit windows and doors', qty: 1, rate: 2400, type: 'materials' }
        ]
      }
    ]
  },
  plumbing: {
    sections: [
      {
        name: 'Plumbing Works',
        items: [
          { desc: 'Replace leaking radiator valve', qty: 2, rate: 65, type: 'labor' },
          { desc: 'Install new tap', qty: 1, rate: 120, type: 'labor' },
          { desc: 'Unblock drain', qty: 1, rate: 95, type: 'labor' }
        ]
      }
    ]
  }
};

document.getElementById('templateSelect').addEventListener('change', (e) => {
  const template = templates[e.target.value];
  if (template) {
    // Clear existing sections
    document.getElementById('sectionsContainer').innerHTML = '';
    sectionCounter = 0;
    itemCounters = {};
    
    // Add sections from template
    template.sections.forEach(section => {
      addSection();
      const sectionId = sectionCounter - 1;
      document.getElementById(`sectionName${sectionId}`).value = section.name;
      
      section.items.forEach(item => {
        addItemToSection(sectionId);
        const itemCount = itemCounters[sectionId] - 1;
        document.getElementById(`itemDesc${sectionId}_${itemCount}`).value = item.desc;
        document.getElementById(`itemQty${sectionId}_${itemCount}`).value = item.qty;
        document.getElementById(`itemRate${sectionId}_${itemCount}`).value = item.rate;
        document.getElementById(`itemType${sectionId}_${itemCount}`).value = item.type || 'labor';
        calculateItemTotal(sectionId, itemCount);
      });
    });
    calculateTotals();
  }
});

function addSection() {
  const container = document.getElementById('sectionsContainer');
  const sectionId = sectionCounter++;
  itemCounters[sectionId] = 0;
  
  const sectionDiv = document.createElement('div');
  sectionDiv.className = 'section-row';
  sectionDiv.id = `section${sectionId}`;
  sectionDiv.innerHTML = `
    <div class="section-header">
      <input type="text" id="sectionName${sectionId}" placeholder="Section name (e.g., Groundwork, Electrical, Plumbing)" value="Section ${sectionId + 1}">
      <button class="remove-section-btn" onclick="removeSection(${sectionId})">Remove Section</button>
    </div>
    <div id="itemsContainer${sectionId}"></div>
    <button class="add-item-btn" onclick="addItemToSection(${sectionId})">+ Add Item</button>
  `;
  
  container.appendChild(sectionDiv);
}

function removeSection(sectionId) {
  document.getElementById(`section${sectionId}`).remove();
  delete itemCounters[sectionId];
  calculateTotals();
}

function addItemToSection(sectionId) {
  const container = document.getElementById(`itemsContainer${sectionId}`);
  const itemId = itemCounters[sectionId]++;
  
  const itemDiv = document.createElement('div');
  itemDiv.className = 'item-row';
  itemDiv.id = `item${sectionId}_${itemId}`;
  itemDiv.innerHTML = `
    <div class="item-grid">
      <div class="form-group">
        <label>Description</label>
        <input type="text" id="itemDesc${sectionId}_${itemId}" oninput="calculateTotals()">
      </div>
      <div class="form-group">
        <label>Quantity</label>
        <input type="number" id="itemQty${sectionId}_${itemId}" value="1" step="0.1" oninput="calculateItemTotal(${sectionId}, ${itemId})">
      </div>
      <div class="form-group">
        <label>Rate (£)</label>
        <input type="number" id="itemRate${sectionId}_${itemId}" value="0" step="0.01" oninput="calculateItemTotal(${sectionId}, ${itemId})">
      </div>
      <div class="form-group">
        <label>Type</label>
        <select id="itemType${sectionId}_${itemId}" onchange="calculateTotals()">
          <option value="materials">Materials</option>
          <option value="labor">Labor</option>
        </select>
      </div>
      <button class="remove-btn" onclick="removeItem(${sectionId}, ${itemId})">Remove</button>
    </div>
    <div style="margin-top: 10px; text-align: right; font-weight: bold; color: #333;">
      Total: <span id="itemTotal${sectionId}_${itemId}">£0.00</span>
    </div>
  `;
  
  container.appendChild(itemDiv);
  calculateTotals();
}

function removeItem(sectionId, itemId) {
  document.getElementById(`item${sectionId}_${itemId}`).remove();
  calculateTotals();
}

function calculateItemTotal(sectionId, itemId) {
  const qty = parseFloat(document.getElementById(`itemQty${sectionId}_${itemId}`).value) || 0;
  const rate = parseFloat(document.getElementById(`itemRate${sectionId}_${itemId}`).value) || 0;
  const total = qty * rate;
  document.getElementById(`itemTotal${sectionId}_${itemId}`).textContent = `£${total.toFixed(2)}`;
  calculateTotals();
}

function calculateTotals() {
  let materialsSubtotal = 0;
  let laborSubtotal = 0;
  
  for (let sectionId in itemCounters) {
    for (let i = 0; i < itemCounters[sectionId]; i++) {
      const itemElement = document.getElementById(`item${sectionId}_${i}`);
      if (itemElement) {
        const qty = parseFloat(document.getElementById(`itemQty${sectionId}_${i}`).value) || 0;
        const rate = parseFloat(document.getElementById(`itemRate${sectionId}_${i}`).value) || 0;
        const type = document.getElementById(`itemType${sectionId}_${i}`).value;
        const itemTotal = qty * rate;
        
        if (type === 'materials') {
          materialsSubtotal += itemTotal;
        } else {
          laborSubtotal += itemTotal;
        }
      }
    }
  }
  
  const subtotal = materialsSubtotal + laborSubtotal;
  const vat = subtotal * 0.20;
  const total = subtotal + vat;
  
  document.getElementById('materialsSubtotalDisplay').textContent = `£${materialsSubtotal.toFixed(2)}`;
  document.getElementById('laborSubtotalDisplay').textContent = `£${laborSubtotal.toFixed(2)}`;
  document.getElementById('subtotalDisplay').textContent = `£${subtotal.toFixed(2)}`;
  document.getElementById('vatDisplay').textContent = `£${vat.toFixed(2)}`;
  document.getElementById('totalDisplay').textContent = `£${total.toFixed(2)}`;
}

function getPaymentTermsText() {
  const paymentTerms = document.getElementById('paymentTerms').value;
  const customTerms = document.getElementById('customPaymentTerms').value;
  
  switch(paymentTerms) {
    case '50-50':
      return '50% deposit required to secure start date, 50% on completion';
    case '30-40-30':
      return '30% deposit required to secure start date, 40% mid-project, 30% on completion';
    case 'full':
      return 'Full payment required on completion';
    case 'custom':
      return customTerms || 'Payment terms to be agreed';
    default:
      return '50% deposit required to secure start date, 50% on completion';
  }
}

function generateEstimate() {
  const clientName = document.getElementById('clientName').value;
  const quoteDate = document.getElementById('quoteDate').value;
  
  if (!clientName || !quoteDate) {
    alert('Please fill in Client Name and Quote Date');
    return;
  }

  // Build items table with sections
  let itemsHTML = '';
  for (let sectionId in itemCounters) {
    const sectionElement = document.getElementById(`section${sectionId}`);
    if (sectionElement) {
      const sectionName = document.getElementById(`sectionName${sectionId}`).value;
      
      // Add section header
      itemsHTML += `
        <tr class="section-header-row">
          <td colspan="5">${sectionName}</td>
        </tr>
      `;
      
      // Add items in this section
      for (let i = 0; i < itemCounters[sectionId]; i++) {
        const itemElement = document.getElementById(`item${sectionId}_${i}`);
        if (itemElement) {
          const desc = document.getElementById(`itemDesc${sectionId}_${i}`).value;
          const qty = document.getElementById(`itemQty${sectionId}_${i}`).value;
          const rate = parseFloat(document.getElementById(`itemRate${sectionId}_${i}`).value);
          const type = document.getElementById(`itemType${sectionId}_${i}`).value;
          const total = (qty * rate).toFixed(2);
          
          itemsHTML += `
            <tr>
              <td>${desc}</td>
              <td style="text-align: center;">${type === 'materials' ? 'M' : 'L'}</td>
              <td>${qty}</td>
              <td>£${rate.toFixed(2)}</td>
              <td>£${total}</td>
            </tr>
          `;
        }
      }
    }
  }

  const clientAddress = document.getElementById('clientAddress').value;
  const clientCity = document.getElementById('clientCity').value;
  const clientPostcode = document.getElementById('clientPostcode').value;
  const expiryDate = document.getElementById('expiryDate').value;
  const estimateNumber = document.getElementById('estimateNumber').value || 'TBD';
  const customerRef = document.getElementById('customerRef').value || 'N/A';
  
  const materialsSubtotal = document.getElementById('materialsSubtotalDisplay').textContent;
  const laborSubtotal = document.getElementById('laborSubtotalDisplay').textContent;
  const subtotal = document.getElementById('subtotalDisplay').textContent;
  const vat = document.getElementById('vatDisplay').textContent;
  const total = document.getElementById('totalDisplay').textContent;
  
  const paymentTermsText = getPaymentTermsText();

  const estimateHTML = `
    <div class="header">
      <div class="company-info">
        <div class="company-name">TR<span class="highlight">A</span>DER BROTHERS LTD</div>
        <div class="company-details">
          123 Business Park, Hillington<br>
          Glasgow, G52 4XZ, Scotland<br>
          07448835577<br>
          info@traderbrothers.co.uk
        </div>
      </div>
      <div class="logo-container">
        <img src="https://raw.githubusercontent.com/infotraderbrothers-lgtm/traderbrothers-assets-logo/main/Trader%20Brothers.png" alt="Trader Brothers Logo" class="logo">
      </div>
    </div>

    <div class="estimate-banner">Estimate for</div>

    <div class="info-section">
      <div class="client-info">
        <h3>${clientName}</h3>
        <p>
          ${clientAddress}<br>
          ${clientCity}<br>
          ${clientPostcode}
        </p>
      </div>

      <div class="estimate-details">
        <table class="details-table">
          <tr>
            <td class="detail-label">Date:</td>
            <td class="detail-value">${new Date(quoteDate).toLocaleDateString('en-GB')}</td>
          </tr>
          <tr>
            <td class="detail-label">Estimate #:</td>
            <td class="detail-value">${estimateNumber}</td>
          </tr>
          <tr>
            <td class="detail-label">Customer Ref:</td>
            <td class="detail-value">${customerRef}</td>
          </tr>
          <tr>
            <td class="detail-label">Valid Until:</td>
            <td class="expiry-date">${new Date(expiryDate).toLocaleDateString('en-GB')}</td>
          </tr>
        </table>
      </div>
    </div>

    <div style="background: #fff3cd; border-left: 4px solid #d4af37; padding: 12px 15px; margin-bottom: 20px; border-radius: 4px;">
      <strong style="color: #856404;">⚠ Quote Valid Until: ${new Date(expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
      <div style="font-size: 12px; color: #856404; margin-top: 5px;">This quote is valid for 14 days. Prices may change after this date due to material costs.</div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align: center; width: 60px;">Type</th>
          <th>Qty</th>
          <th>Unit price</th>
          <th>Total price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
      </tbody>
    </table>

    <div class="payment-terms-section">
      <h3>Payment Terms</h3>
      <p>${paymentTermsText}</p>
    </div>

    <div class="notes-section">
      <h3>Additional Notes:</h3>
      <ol>
        <li>Materials to be supplied by customer are excluded from this quote</li>
        <li>Any extras or variations to be charged accordingly</li>
        <li>All work completed to current building regulations</li>
      </ol>
    </div>

    <div class="totals-section-preview">
      <div class="totals-box">
        <div class="total-row-preview">
          <span>Materials Subtotal</span>
          <span>${materialsSubtotal}</span>
        </div>
        <div class="total-row-preview">
          <span>Labor Subtotal</span>
          <span>${laborSubtotal}</span>
        </div>
        <div class="total-row-preview subtotal">
          <span>Subtotal</span>
          <span>${subtotal}</span>
        </div>
        <div class="total-row-preview vat">
          <span>VAT (20%)</span>
          <span>${vat}</span>
        </div>
        <div class="total-row-preview final">
          <span>Total Amount</span>
          <span>${total}</span>
        </div>
      </div>
    </div>

    <div class="footer-note">
      If you have any questions about this estimate, please contact<br>
      Trader Brothers on 07448835577
      <div class="thank-you">Thank you for your business</div>
    </div>
  `;

  document.getElementById('estimateContainer').innerHTML = estimateHTML;
  document.getElementById('previewModal').style.display = 'block';
}

function closePreviewModal() {
  document.getElementById('previewModal').style.display = 'none';
}
