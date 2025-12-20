// CRM Data Management - In-Memory Storage

let crmData = {
  clients: [],
  projects: [],
  customColumns: {
    clients: [],
    projects: []
  }
};

// Load CRM data from localStorage
function loadCRMData() {
  const saved = localStorage.getItem('crmData');
  if (saved) {
    crmData = JSON.parse(saved);
  } else {
    // Initialize with sample data
    crmData.clients = [
      {
        id: generateId(),
        name: 'Dean Finlayson',
        clientId: 'recZGP29hBJ...',
        email: 'dean@gmail.com',
        phone: '07400 004400',
        companyName: 'We Build Stuff',
        status: 'Active',
        contract: '',
        projectManagement: 'We Build Stuff',
        linkedProjectId: null,
        createdAt: new Date().toISOString()
      }
    ];
    
    crmData.projects = [
      {
        id: generateId(),
        companyName: 'We Build Stuff',
        projectId: 'rec5CAoyWQ5zxHFUo',
        client: 'Dean Finlayson',
        lastUpdated: '29/11/2025  4:24pm',
        status: '',
        callOffContract: '',
        linkedClientId: null,
        createdAt: new Date().toISOString()
      }
    ];
    
    saveCRMData();
  }
}

// Save CRM data to localStorage
function saveCRMData() {
  localStorage.setItem('crmData', JSON.stringify(crmData));
}

// Generate unique ID
function generateId() {
  return 'rec' + Math.random().toString(36).substr(2, 9);
}

// Client CRUD operations
function addClient(clientData) {
  const client = {
    id: generateId(),
    ...clientData,
    createdAt: new Date().toISOString()
  };
  crmData.clients.push(client);
  saveCRMData();
  return client;
}

function updateClient(id, clientData) {
  const index = crmData.clients.findIndex(c => c.id === id);
  if (index !== -1) {
    crmData.clients[index] = { ...crmData.clients[index], ...clientData };
    
    // Update linked project if client name changed
    if (clientData.name && crmData.clients[index].linkedProjectId) {
      updateProject(crmData.clients[index].linkedProjectId, { client: clientData.name });
    }
    
    saveCRMData();
    return crmData.clients[index];
  }
  return null;
}

function deleteClient(id) {
  const client = crmData.clients.find(c => c.id === id);
  if (client && client.linkedProjectId) {
    // Remove link from project
    updateProject(client.linkedProjectId, { linkedClientId: null, client: '' });
  }
  crmData.clients = crmData.clients.filter(c => c.id !== id);
  saveCRMData();
}

function getClient(id) {
  return crmData.clients.find(c => c.id === id);
}

function getAllClients() {
  return crmData.clients;
}

// Project CRUD operations
function addProject(projectData) {
  const project = {
    id: generateId(),
    ...projectData,
    lastUpdated: new Date().toLocaleString('en-GB'),
    createdAt: new Date().toISOString()
  };
  crmData.projects.push(project);
  saveCRMData();
  return project;
}

function updateProject(id, projectData) {
  const index = crmData.projects.findIndex(p => p.id === id);
  if (index !== -1) {
    crmData.projects[index] = { 
      ...crmData.projects[index], 
      ...projectData,
      lastUpdated: new Date().toLocaleString('en-GB')
    };
    
    // Update linked client if company name changed
    if (projectData.companyName && crmData.projects[index].linkedClientId) {
      updateClient(crmData.projects[index].linkedClientId, { projectManagement: projectData.companyName });
    }
    
    saveCRMData();
    return crmData.projects[index];
  }
  return null;
}

function deleteProject(id) {
  const project = crmData.projects.find(p => p.id === id);
  if (project && project.linkedClientId) {
    // Remove link from client
    updateClient(project.linkedClientId, { linkedProjectId: null, projectManagement: '' });
  }
  crmData.projects = crmData.projects.filter(p => p.id !== id);
  saveCRMData();
}

function getProject(id) {
  return crmData.projects.find(p => p.id === id);
}

function getAllProjects() {
  return crmData.projects;
}

// Link client to project
function linkClientToProject(clientId, projectId) {
  const client = getClient(clientId);
  const project = getProject(projectId);
  
  if (client && project) {
    updateClient(clientId, { 
      linkedProjectId: projectId,
      projectManagement: project.companyName 
    });
    updateProject(projectId, { 
      linkedClientId: clientId,
      client: client.name 
    });
  }
}

// Custom column management
function addCustomColumn(table, columnName, columnType) {
  const column = {
    id: generateId(),
    name: columnName,
    type: columnType,
    table: table
  };
  crmData.customColumns[table].push(column);
  saveCRMData();
  return column;
}

function deleteCustomColumn(table, columnId) {
  crmData.customColumns[table] = crmData.customColumns[table].filter(c => c.id !== columnId);
  
  // Remove custom column data from all records
  if (table === 'clients') {
    crmData.clients.forEach(client => {
      delete client[`custom_${columnId}`];
    });
  } else {
    crmData.projects.forEach(project => {
      delete project[`custom_${columnId}`];
    });
  }
  
  saveCRMData();
}

function getCustomColumns(table) {
  return crmData.customColumns[table] || [];
}

// Initialize on load
loadCRMData();
