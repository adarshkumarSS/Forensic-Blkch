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
document.addEventListener('DOMContentLoaded', function() {
    // File upload handling
    const uploadForm = document.getElementById('file-upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fileInput = document.getElementById('file-input');
            const uploadButton = document.getElementById('upload-button');
            const progressBar = document.getElementById('progress-bar');
            const progressContainer = document.getElementById('upload-progress');
            
            if (!fileInput.files.length) {
                alert('Please select a file to upload');
                return;
            }
            
            const formData = new FormData(uploadForm);
            const xhr = new XMLHttpRequest();
            
            // Disable upload button during upload
            uploadButton.disabled = true;
            uploadButton.textContent = 'Uploading...';
            progressContainer.style.display = 'block';
            
            xhr.upload.addEventListener('progress', function(e) {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    progressBar.style.width = percentComplete + '%';
                    progressBar.setAttribute('aria-valuenow', percentComplete);
                }
            });
            
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    uploadButton.disabled = false;
                    uploadButton.textContent = 'Upload';
                    progressContainer.style.display = 'none';
                    
                    try {
                        const response = JSON.parse(xhr.responseText);
                        
                        if (response.success) {
                            // Add new file to the list
                            addFileToUI(response.file);
                            fileInput.value = ''; // Clear file input
                        } else {
                            alert('Upload failed: ' + (response.error || 'Unknown error'));
                        }
                    } catch (e) {
                        alert('Error processing upload response');
                    }
                }
            };
            
            xhr.open('POST', window.location.pathname + 'upload/', true);
            xhr.send(formData);
        });
    }
    
    // File deletion handling
    document.querySelectorAll('.delete-file').forEach(button => {
        button.addEventListener('click', function() {
            const fileItem = this.closest('.file-item');
            const fileId = fileItem.dataset.fileId;
            const cid = fileItem.dataset.cid;
            
            if (confirm('Are you sure you want to delete this file?')) {
                fetch(window.location.pathname + 'files/' + fileId + '/', {
                    method: 'DELETE',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ cid: cid })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        fileItem.remove();
                    } else {
                        alert('Deletion failed: ' + (data.error || 'Unknown error'));
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Deletion failed');
                });
            }
        });
    });
    
    // Helper function to add new file to UI
    function addFileToUI(file) {
        const filesContainer = document.getElementById('files-container');
        const emptyMessage = filesContainer.querySelector('p');
        
        if (emptyMessage) {
            emptyMessage.remove();
        }
        
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.dataset.fileId = file.id;
        fileItem.dataset.cid = file.cid;
        
        let previewContent = '';
        if (file.type.startsWith('image/')) {
            previewContent = `<img src="https://gateway.pinata.cloud/ipfs/${file.cid}" alt="${file.name}">`;
        } else {
            previewContent = '<div class="file-icon"><i class="fas fa-file"></i></div>';
        }
        
        fileItem.innerHTML = `
            <div class="file-preview">
                ${previewContent}
            </div>
            <div class="file-info">
                <h5>${file.name}</h5>
                <p>Type: ${file.type}</p>
                <p>Size: ${formatFileSize(file.size)}</p>
                <p>Uploaded: ${new Date(file.uploaded_at).toLocaleString()}</p>
                <p>CID: <code>${file.cid}</code></p>
                ${file.is_disclosure ? '<span class="badge badge-warning">Disclosure</span>' : ''}
            </div>
            <div class="file-actions">
                <a href="https://gateway.pinata.cloud/ipfs/${file.cid}" target="_blank" class="btn btn-sm btn-info">View</a>
                <button class="btn btn-sm btn-danger delete-file">Delete</button>
            </div>
        `;
        
        filesContainer.appendChild(fileItem);
        
        // Add event listener to new delete button
        fileItem.querySelector('.delete-file').addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this file?')) {
                fetch(window.location.pathname + 'files/' + file.id + '/', {
                    method: 'DELETE',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ cid: file.cid })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        fileItem.remove();
                    } else {
                        alert('Deletion failed: ' + (data.error || 'Unknown error'));
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Deletion failed');
                });
            }
        });
    }
    
    // Helper function to format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Helper function to get CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});