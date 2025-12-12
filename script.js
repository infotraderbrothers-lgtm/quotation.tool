let sectionCounter = 0;
let itemCounters = {};

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
};

// Update expiry date when quote date changes
document.getElementById('quoteDate').addEventListener('change', function() {
  const quoteDate = new Date(this.value);
  const validUntil = new Date(quoteDate);
  validUntil.setDate(validUntil.getDate() + 14);
  document.getElementById('expiryDate').value = validUntil.toISOString().split('T')[0];
});

// Templates
const templates = {
  bathroom: {
    sections: [
      {
        name: 'Demolition & Preparation',
        items: [
          { desc: 'Strip out existing bathroom fixtures', qty: 1, rate: 300 }
        ]
      },
      {
        name: 'Installation',
        items: [
          { desc: 'Install new bath', qty: 1, rate: 450 },
          { desc: 'Install new sink and toilet', qty: 1, rate: 350 }
        ]
      },
      {
        name: 'Tiling',
        items: [
          { desc: 'Wall tiling', qty: 15, rate: 45 }
        ]
      }
    ]
  },
  kitchen: {
    sections: [
      {
        name: 'Electrical Work',
        items: [
          { desc: 'Consumer unit upgrade', qty: 1, rate: 450 },
          { desc: 'Kitchen circuit rewire', qty: 1, rate: 1200 }
        ]
      },
      {
        name: 'Fittings',
        items: [
          { desc: 'Double socket outlets', qty: 8, rate: 35 },
          { desc: 'LED downlights', qty: 10, rate: 25 }
        ]
      }
    ]
  },
  extension: {
    sections: [
      {
        name: 'Groundwork',
        items: [
          { desc: 'Foundations', qty: 1, rate: 4500 }
        ]
      },
      {
        name: 'Structure',
        items: [
          { desc: 'Brickwork and blockwork', qty: 35, rate: 85 },
          { desc: 'Roof structure and covering', qty: 1, rate: 3200 }
        ]
      },
      {
        name: 'Windows & Doors',
        items: [
          { desc: 'Supply and fit windows and doors', qty: 1, rate: 2400 }
        ]
      }
    ]
  },
  plumbing: {
    sections: [
      {
        name: 'Plumbing Works',
        items: [
          { desc: 'Replace leaking radiator valve', qty: 2, rate: 65 },
          { desc: 'Install new tap', qty: 1, rate: 120 },
          { desc: 'Unblock drain', qty: 1, rate: 95 }
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
  let subtotal = 0;
  
  for (let sectionId in itemCounters) {
    for (let i = 0; i < itemCounters[sectionId]; i++) {
      const itemElement = document.getElementById(`item${sectionId}_${i}`);
      if (itemElement) {
        const qty = parseFloat(document.getElementById(`itemQty${sectionId}_${i}`).value) || 0;
        const rate = parseFloat(document.getElementById(`itemRate${sectionId}_${i}`).value) || 0;
        subtotal += qty * rate;
      }
    }
  }
  
  const vat = subtotal * 0.20;
  const total = subtotal + vat;
  
  document.getElementById('subtotalDisplay').textContent = `£${subtotal.toFixed(2)}`;
  document.getElementById('vatDisplay').textContent = `£${vat.toFixed(2)}`;
  document.getElementById('totalDisplay').textContent = `£${total.toFixed(2)}`;
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
          <td colspan="4">${sectionName}</td>
        </tr>
      `;
      
      // Add items in this section
      for (let i = 0; i < itemCounters[sectionId]; i++) {
        const itemElement = document.getElementById(`item${sectionId}_${i}`);
        if (itemElement) {
          const desc = document.getElementById(`itemDesc${sectionId}_${i}`).value;
          const qty = document.getElementById(`itemQty${sectionId}_${i}`).value;
          const rate = parseFloat(document.getElementById(`itemRate${sectionId}_${i}`).value);
          const total = (qty * rate).toFixed(2);
          
          itemsHTML += `
            <tr>
              <td>${desc}</td>
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
  
  const subtotal = document.getElementById('subtotalDisplay').textContent;
  const vat = document.getElementById('vatDisplay').textContent;
  const total = document.getElementById('totalDisplay').textContent;

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
            <td class="detail-label">Expiry Date:</td>
            <td class="expiry-date">${new Date(expiryDate).toLocaleDateString('en-GB')}</td>
          </tr>
        </table>
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>Description</th>
          <th>Qty</th>
          <th>Unit price</th>
          <th>Total price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
      </tbody>
    </table>

    <div class="notes-section">
      <h3>Notes:</h3>
      <ol>
        <li>Estimate valid for 14 days</li>
        <li>Payment of 50% is required to secure start date</li>
        <li>Pending to be supplied by customer</li>
        <li>Any extras to be charged accordingly</li>
      </ol>
    </div>

    <div class="totals-section-preview">
      <div class="totals-box">
        <div class="total-row-preview subtotal">
          <span>Subtotal</span>
          <span>${subtotal}</span>
        </div>
        <div class="total-row-preview vat">
          <span>VAT</span>
          <span>${vat}</span>
        </div>
        <div class="total-row-preview final">
          <span>Total</span>
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
