// CRM UI Management

let currentTab = 'clients';
let currentColumnManagerTable = null;

// Switch between tabs
function switchCRMTab(tab) {
  currentTab = tab;
  
  // Update tab buttons
  document.querySelectorAll('.crm-tab').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  // Update tab content
  document.querySelectorAll('.crm-tab-content').forEach(content => content.classList.remove('active'));
  if (tab === 'clients') {
    document.getElementById('clientsTab').classList.add('active');
    renderClientsTable();
  } else {
    document.getElementById('projectsTab').classList.add('active');
    renderProjectsTable();
  }
}

// Render clients table
function renderClientsTable(searchTerm = '') {
  const tbody = document.getElementById('clientsTableBody');
  const clients = getAllClients().filter(client => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return client.name?.toLowerCase().includes(search) ||
           client.email?.toLowerCase().includes(search) ||
           client.companyName?.toLowerCase().includes(search);
  });
  
  if (clients.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="crm-empty-state">
          <h3>No clients found</h3>
          <p>Add your first client to get started</p>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = clients.map(client => `
    <tr>
      <td>${client.name || ''}</td>
      <td>${client.clientId || ''}</td>
      <td>${client.email || ''}</td>
      <td>${client.phone || ''}</td>
      <td>${client.companyName || ''}</td>
      <td>
        ${client.status ? `<span class="status-badge ${client.status.toLowerCase()}">${client.status}</span>` : ''}
      </td>
      <td>${client.contract || ''}</td>
      <td>
        ${client.linkedProjectId ? 
          `<span class="linked-field" onclick="viewLinkedRecord('${client.id}', 'client')">${client.projectManagement || 'View Project'}</span>` : 
          ''}
      </td>
      <td class="actions-column">
        <div class="crm-row-actions">
          <button class="btn-icon edit" onclick="editClient('${client.id}')" title="Edit">✏️</button>
          <button class="btn-icon delete" onclick="deleteClientConfirm('${client.id}')" title="Delete">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Render projects table
function renderProjectsTable(searchTerm = '') {
  const tbody = document.getElementById('projectsTableBody');
  const projects = getAllProjects().filter(project => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return project.companyName?.toLowerCase().includes(search) ||
           project.projectId?.toLowerCase().includes(search) ||
           project.client?.toLowerCase().includes(search);
  });
  
  if (projects.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="crm-empty-state">
          <h3>No projects found</h3>
          <p>Add your first project to get started</p>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = projects.map(project => `
    <tr>
      <td>${project.companyName || ''}</td>
      <td>${project.projectId || ''}</td>
      <td>
        ${project.linkedClientId ? 
          `<span class="linked-field" onclick="viewLinkedRecord('${project.id}', 'project')">${project.client || 'View Client'}</span>` : 
          project.client || ''}
      </td>
      <td>${project.lastUpdated || ''}</td>
      <td>
        ${project.status ? `<span class="status-badge ${project.status.toLowerCase().replace(' ', '-')}">${project.status}</span>` : ''}
      </td>
      <td>${project.callOffContract || ''}</td>
      <td class="actions-column">
        <div class="crm-row-actions">
          <button class="btn-icon edit" onclick="editProject('${project.id}')" title="Edit">✏️</button>
          <button class="btn-icon delete" onclick="deleteProjectConfirm('${project.id}')" title="Delete">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Client modal functions
function openAddClientModal() {
  document.getElementById('clientModalTitle').textContent = 'Add Client';
  document.getElementById('editClientId').value = '';
  document.getElementById('clientName').value = '';
  document.getElementById('clientClientId').value = '';
  document.getElementById('clientEmail').value = '';
  document.getElementById('clientPhone').value = '';
  document.getElementById('clientCompanyName').value = '';
  document.getElementById('clientStatus').value = 'Active';
  document.getElementById('clientContract').value = '';
  
  // Populate project dropdown
  const projectSelect = document.getElementById('clientProjectLink');
  projectSelect.innerHTML = '<option value="">-- Select Project --</option>' +
    getAllProjects().map(p => `<option value="${p.id}">${p.companyName}</option>`).join('');
  projectSelect.value = '';
  
  document.getElementById('clientModal').style.display = 'block';
}

function editClient(id) {
  const client = getClient(id);
  if (!client) return;
  
  document.getElementById('clientModalTitle').textContent = 'Edit Client';
  document.getElementById('editClientId').value = client.id;
  document.getElementById('clientName').value = client.name || '';
  document.getElementById('clientClientId').value = client.clientId || '';
  document.getElementById('clientEmail').value = client.email || '';
  document.getElementById('clientPhone').value = client.phone || '';
  document.getElementById('clientCompanyName').value = client.companyName || '';
  document.getElementById('clientStatus').value = client.status || 'Active';
  document.getElementById('clientContract').value = client.contract || '';
  
  // Populate project dropdown
  const projectSelect = document.getElementById('clientProjectLink');
  projectSelect.innerHTML = '<option value="">-- Select Project --</option>' +
    getAllProjects().map(p => `<option value="${p.id}">${p.companyName}</option>`).join('');
  projectSelect.value = client.linkedProjectId || '';
  
  document.getElementById('clientModal').style.display = 'block';
}

function closeClientModal() {
  document.getElementById('clientModal').style.display = 'none';
}

function saveClient() {
  const id = document.getElementById('editClientId').value;
  const clientData = {
    name: document.getElementById('clientName').value.trim(),
    clientId: document.getElementById('clientClientId').value.trim(),
    email: document.getElementById('clientEmail').value.trim(),
    phone: document.getElementById('clientPhone').value.trim(),
    companyName: document.getElementById('clientCompanyName').value.trim(),
    status: document.getElementById('clientStatus').value,
    contract: document.getElementById('clientContract').value.trim()
  };
  
  if (!clientData.name || !clientData.clientId || !clientData.email) {
    alert('Please fill in all required fields (Name, Client ID, Email)');
    return;
  }
  
  const linkedProjectId = document.getElementById('clientProjectLink').value;
  
  if (id) {
    // Update existing
    updateClient(id, clientData);
    
    // Handle project link
    const client = getClient(id);
    if (linkedProjectId && linkedProjectId !== client.linkedProjectId) {
      linkClientToProject(id, linkedProjectId);
    }
  } else {
    // Add new
    const newClient = addClient(clientData);
    
    // Handle project link
    if (linkedProjectId) {
      linkClientToProject(newClient.id, linkedProjectId);
    }
  }
  
  closeClientModal();
  renderClientsTable();
  renderProjectsTable();
}

function deleteClientConfirm(id) {
  if (confirm('Are you sure you want to delete this client?')) {
    deleteClient(id);
    renderClientsTable();
    renderProjectsTable();
  }
}

// Project modal functions
function openAddProjectModal() {
  document.getElementById('projectModalTitle').textContent = 'Add Project';
  document.getElementById('editProjectId').value = '';
  document.getElementById('projectCompanyName').value = '';
  document.getElementById('projectProjectId').value = '';
  document.getElementById('projectStatus').value = 'Active';
  document.getElementById('projectCallOff').value = '';
  
  // Populate client dropdown
  const clientSelect = document.getElementById('projectClientLink');
  clientSelect.innerHTML = '<option value="">-- Select Client --</option>' +
    getAllClients().map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  clientSelect.value = '';
  
  document.getElementById('projectModal').style.display = 'block';
}

function editProject(id) {
  const project = getProject(id);
  if (!project) return;
  
  document.getElementById('projectModalTitle').textContent = 'Edit Project';
  document.getElementById('editProjectId').value = project.id;
  document.getElementById('projectCompanyName').value = project.companyName || '';
  document.getElementById('projectProjectId').value = project.projectId || '';
  document.getElementById('projectStatus').value = project.status || 'Active';
  document.getElementById('projectCallOff').value = project.callOffContract || '';
  
  // Populate client dropdown
  const clientSelect = document.getElementById('projectClientLink');
  clientSelect.innerHTML = '<option value="">-- Select Client --</option>' +
    getAllClients().map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  clientSelect.value = project.linkedClientId || '';
  
  document.getElementById('projectModal').style.display = 'block';
}

function closeProjectModal() {
  document.getElementById('projectModal').style.display = 'none';
}

function saveProject() {
  const id = document.getElementById('editProjectId').value;
  const projectData = {
    companyName: document.getElementById('projectCompanyName').value.trim(),
    projectId: document.getElementById('projectProjectId').value.trim(),
    status: document.getElementById('projectStatus').value,
    callOffContract: document.getElementById('projectCallOff').value.trim()
  };
  
  if (!projectData.companyName || !projectData.projectId) {
    alert('Please fill in all required fields (Company Name, Project ID)');
    return;
  }
  
  const linkedClientId = document.getElementById('projectClientLink').value;
  
  if (id) {
    // Update existing
    updateProject(id, projectData);
    
    // Handle client link
    const project = getProject(id);
    if (linkedClientId && linkedClientId !== project.linkedClientId) {
      linkClientToProject(linkedClientId, id);
    }
  } else {
    // Add new
    const newProject = addProject(projectData);
    
    // Handle client link
    if (linkedClientId) {
      linkClientToProject(linkedClientId, newProject.id);
    }
  }
  
  closeProjectModal();
  renderProjectsTable();
  renderClientsTable();
}

function deleteProjectConfirm(id) {
  if (confirm('Are you sure you want to delete this project?')) {
    deleteProject(id);
    renderProjectsTable();
    renderClientsTable();
  }
}

// View linked record details
function viewLinkedRecord(recordId, recordType) {
  let clientData, projectData;
  
  if (recordType === 'client') {
    const client = getClient(recordId);
    const project = client.linkedProjectId ? getProject(client.linkedProjectId) : null;
    clientData = client;
    projectData = project;
  } else {
    const project = getProject(recordId);
    const client = project.linkedClientId ? getClient(project.linkedClientId) : null;
    clientData = client;
    projectData = project;
  }
  
  // Populate client info
  const clientInfo = document.getElementById('linkedClientInfo');
  if (clientData) {
    clientInfo.innerHTML = `
      <div class="info-row">
        <div class="info-label">Name:</div>
        <div class="info-value">${clientData.name || 'N/A'}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Client ID:</div>
        <div class="info-value">${clientData.clientId || 'N/A'}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Email:</div>
        <div class="info-value">${clientData.email || 'N/A'}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Phone:</div>
        <div class="info-value">${clientData.phone || 'N/A'}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Company:</div>
        <div class="info-value">${clientData.companyName || 'N/A'}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Status:</div>
        <div class="info-value">
          ${clientData.status ? `<span class="status-badge ${clientData.status.toLowerCase()}">${clientData.status}</span>` : 'N/A'}
        </div>
      </div>
      <div class="info-row">
        <div class="info-label">Contract:</div>
        <div class="info-value">${clientData.contract || 'N/A'}</div>
      </div>
    `;
  } else {
    clientInfo.innerHTML = '<p style="color: #999;">No client linked</p>';
  }
  
  // Populate project info
  const projectInfo = document.getElementById('linkedProjectInfo');
  if (projectData) {
    projectInfo.innerHTML = `
      <div class="info-row">
        <div class="info-label">Company Name:</div>
        <div class="info-value">${projectData.companyName || 'N/A'}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Project ID:</div>
        <div class="info-value">${projectData.projectId || 'N/A'}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Client:</div>
        <div class="info-value">${projectData.client || 'N/A'}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Last Updated:</div>
        <div class="info-value">${projectData.lastUpdated || 'N/A'}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Status:</div>
        <div class="info-value">
          ${projectData.status ? `<span class="status-badge ${projectData.status.toLowerCase().replace(' ', '-')}">${projectData.status}</span>` : 'N/A'}
        </div>
      </div>
      <div class="info-row">
        <div class="info-label">Call-Off Contract:</div>
        <div class="info-value">${projectData.callOffContract || 'N/A'}</div>
      </div>
    `;
  } else {
    projectInfo.innerHTML = '<p style="color: #999;">No project linked</p>';
  }
  
  document.getElementById('linkedRecordModal').style.display = 'block';
}

function closeLinkedRecordModal() {
  document.getElementById('linkedRecordModal').style.display = 'none';
}

// Column manager functions
function openColumnManager(table) {
  currentColumnManagerTable = table;
  renderCustomColumnsList();
  document.getElementById('columnManagerModal').style.display = 'block';
}

function closeColumnManager() {
  document.getElementById('columnManagerModal').style.display = 'none';
  currentColumnManagerTable = null;
}

function renderCustomColumnsList() {
  const container = document.getElementById('customColumnsList');
  const columns = getCustomColumns(currentColumnManagerTable);
  
  if (columns.length === 0) {
    container.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">No custom columns added yet</p>';
    return;
  }
  
  container.innerHTML = columns.map(col => `
    <div class="custom-column-item">
      <div>
        <span>${col.name}</span>
        <small>(${col.type})</small>
      </div>
      <button onclick="deleteCustomColumnConfirm('${col.id}')">Delete</button>
    </div>
  `).join('');
}

function addCustomColumnUI() {
  const name = document.getElementById('newColumnName').value.trim();
  const type = document.getElementById('newColumnType').value;
  
  if (!name) {
    alert('Please enter a column name');
    return;
  }
  
  addCustomColumn(currentColumnManagerTable, name, type);
  
  document.getElementById('newColumnName').value = '';
  document.getElementById('newColumnType').value = 'text';
  
  renderCustomColumnsList();
  
  // Refresh table to show new column
  if (currentColumnManagerTable === 'clients') {
    renderClientsTable();
  } else {
    renderProjectsTable();
  }
}

function deleteCustomColumnConfirm(columnId) {
  if (confirm('Are you sure you want to delete this column? All data in this column will be lost.')) {
    deleteCustomColumn(currentColumnManagerTable, columnId);
    renderCustomColumnsList();
    
    if (currentColumnManagerTable === 'clients') {
      renderClientsTable();
    } else {
      renderProjectsTable();
    }
  }
}

// Search functionality
document.getElementById('clientSearch')?.addEventListener('input', (e) => {
  renderClientsTable(e.target.value);
});

document.getElementById('projectSearch')?.addEventListener('input', (e) => {
  renderProjectsTable(e.target.value);
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
  }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  renderClientsTable();
  renderProjectsTable();
});
