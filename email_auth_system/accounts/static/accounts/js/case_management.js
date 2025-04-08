document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const newCaseBtn = document.getElementById('newCaseBtn');
    const newCaseModal = document.getElementById('newCaseModal');
    const closeModal = document.querySelector('.close-modal');
    const caseForm = document.getElementById('caseForm');
    const treeItems = document.querySelectorAll('.tree-item .tree-label');
    const refreshBtn = document.getElementById('refreshBtn');
    const caseDetails = document.getElementById('caseDetails');
    const welcomeMessage = document.querySelector('.welcome-message');
    const tabButtons = document.querySelectorAll('.tab-button');
    
    // Event Listeners
    newCaseBtn.addEventListener('click', openModal);
    closeModal.addEventListener('click', closeModal);
    refreshBtn.addEventListener('click', refreshCases);
    
    // Modal Functions
    function openModal() {
        newCaseModal.style.display = 'block';
    }
    
    function closeModal() {
        newCaseModal.style.display = 'none';
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === newCaseModal) {
            closeModal();
        }
    });
    
    // Form Submission
    caseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Here you would typically send the form data to the server
        // For now, we'll simulate a successful submission
        const formData = new FormData(caseForm);
        const caseData = Object.fromEntries(formData.entries());
        
        // Simulate API call
        setTimeout(() => {
            alert(`Case ${caseData.case_number} created successfully!`);
            closeModal();
            caseForm.reset();
            refreshCases();
        }, 1000);
    });
    
    // Case Selection
    treeItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            treeItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get case ID from parent li
            const caseId = this.parentElement.getAttribute('data-case-id');
            
            if (caseId) {
                loadCaseDetails(caseId);
            }
        });
    });
    
    // Tab Switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabName}Tab`).classList.add('active');
        });
    });
    
    // Helper Functions
    function refreshCases() {
        // In a real app, this would fetch updated cases from the server
        console.log('Refreshing cases...');
        welcomeMessage.style.display = 'block';
        caseDetails.innerHTML = '';
    }
    
    function loadCaseDetails(caseId) {
        // Hide welcome message
        welcomeMessage.style.display = 'none';
        
        // In a real app, this would fetch case details from the server
        // For now, we'll use mock data
        const mockCase = {
            id: caseId,
            case_number: `FC-${Math.floor(1000 + Math.random() * 9000)}`,
            case_name: "Digital Forensic Investigation",
            crime_type: "cyber",
            status: "active",
            description: "Investigation into potential data breach of government systems",
            officer_in_charge: "{{ user.email }}",
            created_at: new Date().toLocaleDateString(),
            evidence_count: 5,
            notes_count: 3
        };
        
        // Create case detail view
        const detailTemplate = document.getElementById('caseDetailTemplate').cloneNode(true);
        detailTemplate.style.display = 'block';
        detailTemplate.id = '';
        
        // Populate with data
        detailTemplate.querySelector('#displayCaseNumber').textContent = mockCase.case_number;
        
        // Set status badge
        const statusBadge = detailTemplate.querySelector('#statusBadge');
        statusBadge.textContent = mockCase.status.charAt(0).toUpperCase() + mockCase.status.slice(1);
        statusBadge.classList.add(mockCase.status);
        
        // Populate overview tab
        const overviewTab = detailTemplate.querySelector('#overviewTab');
        overviewTab.innerHTML = `
            <div class="overview-grid">
                <div class="overview-item">
                    <h4>Case Name</h4>
                    <p>${mockCase.case_name}</p>
                </div>
                <div class="overview-item">
                    <h4>Crime Type</h4>
                    <p>${getCrimeTypeName(mockCase.crime_type)}</p>
                </div>
                <div class="overview-item">
                    <h4>Officer In Charge</h4>
                    <p>${mockCase.officer_in_charge}</p>
                </div>
                <div class="overview-item">
                    <h4>Date Created</h4>
                    <p>${mockCase.created_at}</p>
                </div>
                <div class="overview-item full-width">
                    <h4>Description</h4>
                    <p>${mockCase.description}</p>
                </div>
            </div>
        `;
        
        // Populate evidence tab
        const evidenceTab = detailTemplate.querySelector('#evidenceTab');
        evidenceTab.innerHTML = `
            <div class="evidence-list">
                <div class="evidence-header">
                    <h4>Evidence Items (${mockCase.evidence_count})</h4>
                    <button class="add-button">
                        <i class="fas fa-plus"></i> Add Evidence
                    </button>
                </div>
                <table class="evidence-table">
                    <thead>
                        <tr>
                            <th>Item ID</th>
                            <th>Type</th>
                            <th>Collected On</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>E-1001</td>
                            <td>Hard Drive</td>
                            <td>${new Date().toLocaleDateString()}</td>
                            <td><span class="status-badge collected">Collected</span></td>
                            <td>
                                <button class="action-icon"><i class="fas fa-eye"></i></button>
                                <button class="action-icon"><i class="fas fa-edit"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>E-1002</td>
                            <td>Mobile Device</td>
                            <td>${new Date().toLocaleDateString()}</td>
                            <td><span class="status-badge analyzed">Analyzed</span></td>
                            <td>
                                <button class="action-icon"><i class="fas fa-eye"></i></button>
                                <button class="action-icon"><i class="fas fa-edit"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
        
        // Populate notes tab
        const notesTab = detailTemplate.querySelector('#notesTab');
        notesTab.innerHTML = `
            <div class="notes-container">
                <div class="notes-header">
                    <h4>Case Notes (${mockCase.notes_count})</h4>
                    <button class="add-button">
                        <i class="fas fa-plus"></i> Add Note
                    </button>
                </div>
                <div class="notes-list">
                    <div class="note-item">
                        <div class="note-header">
                            <span class="note-author">${mockCase.officer_in_charge}</span>
                            <span class="note-date">${new Date().toLocaleDateString()}</span>
                        </div>
                        <div class="note-content">
                            <p>Initial case assessment completed. Evidence collection to begin tomorrow.</p>
                        </div>
                    </div>
                    <div class="note-item">
                        <div class="note-header">
                            <span class="note-author">${mockCase.officer_in_charge}</span>
                            <span class="note-date">${new Date().toLocaleDateString()}</span>
                        </div>
                        <div class="note-content">
                            <p>Received hard drive from IT department for analysis.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Populate timeline tab
        const timelineTab = detailTemplate.querySelector('#timelineTab');
        timelineTab.innerHTML = `
            <div class="timeline-container">
                <div class="timeline-item">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <div class="timeline-date">${new Date().toLocaleDateString()}</div>
                        <div class="timeline-event">Case created</div>
                        <div class="timeline-details">Case ${mockCase.case_number} opened for investigation</div>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <div class="timeline-date">${new Date().toLocaleDateString()}</div>
                        <div class="timeline-event">Evidence collected</div>
                        <div class="timeline-details">Hard drive and mobile device collected from suspect</div>
                    </div>
                </div>
            </div>
        `;
        
        // Replace case details content
        caseDetails.innerHTML = '';
        caseDetails.appendChild(detailTemplate);
    }
    
    function getCrimeTypeName(type) {
        const types = {
            'cyber': 'Cyber Crime',
            'homicide': 'Homicide',
            'fraud': 'Financial Fraud',
            'narcotics': 'Narcotics',
            'other': 'Other'
        };
        return types[type] || type;
    }
});