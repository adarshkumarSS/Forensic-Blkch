document.addEventListener('DOMContentLoaded', function() {
    // Password visibility toggle
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle eye icon
            const eyeIcon = this.querySelector('.eye-icon');
            if (type === 'password') {
                eyeIcon.textContent = '👁️';
            } else {
                eyeIcon.textContent = '👁️‍🗨️';
            }
        });
    });

    // Form validation
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Basic client-side validation
            const emailInput = this.querySelector('input[type="email"]');
            const passwordInput = this.querySelector('input[type="password"]');
            
            if (emailInput && !isValidEmail(emailInput.value)) {
                e.preventDefault();
                showError(emailInput, 'Please enter a valid email address');
                return;
            }
            
            if (passwordInput && passwordInput.value.length < 8) {
                e.preventDefault();
                showError(passwordInput, 'Password must be at least 8 characters');
                return;
            }
        });
    });

    // Helper functions
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        let errorMessage = formGroup.querySelector('.error-message');
        
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            formGroup.appendChild(errorMessage);
        }
        
        errorMessage.textContent = message;
        input.style.borderColor = 'var(--danger-color)';
        
        setTimeout(() => {
            errorMessage.textContent = '';
            input.style.borderColor = '';
        }, 3000);
    }

    // Domain suggestion for email input
    const emailInputs = document.querySelectorAll('input[type="email"]');
    const allowedDomains = [
        'tnpolice.gov.in',
        'forensic.tn.gov.in',
        'aij.gov.in',
        'nic.in',
        'tn.gov.in',
        'gov.in'
    ];

    emailInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            const value = e.target.value;
            if (value.includes('@')) {
                const domainPart = value.split('@')[1];
                if (domainPart) {
                    const matchedDomains = allowedDomains.filter(domain => domain.startsWith(domainPart))
                    
                    if (matchedDomains.length > 0) {
                        // In a real app, you might show these in a dropdown
                        console.log('Suggested domains:', matchedDomains);
                    }
                }
            }
        });
    });
});