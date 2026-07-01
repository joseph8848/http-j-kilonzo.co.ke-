// Contact Form Validation and Submission (Client-side only)
// Note: This form requires a backend endpoint for actual email delivery.
// Currently configured for demo purposes - form data is validated and logged to console.

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    // Form validation patterns
    const validators = {
        name: (value) => {
            return value.trim().length >= 3 && /^[a-zA-Z\s'-]+$/.test(value);
        },
        email: (value) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        subject: (value) => {
            return value.trim().length >= 5;
        },
        message: (value) => {
            return value.trim().length >= 10;
        },
        service: (value) => {
            return value.length > 0;
        },
        agree: (checked) => {
            return checked;
        }
    };

    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });

    // Validate individual field
    function validateField(field) {
        const fieldName = field.name;
        const fieldValue = field.type === 'checkbox' ? field.checked : field.value;
        const errorElement = document.getElementById(`${fieldName}Error`);
        
        let isValid = true;
        let errorMessage = '';

        if (validators[fieldName]) {
            isValid = validators[fieldName](fieldValue);
            
            if (!isValid) {
                switch(fieldName) {
                    case 'name':
                        errorMessage = 'Please enter a valid name (at least 3 characters, letters only)';
                        break;
                    case 'email':
                        errorMessage = 'Please enter a valid email address';
                        break;
                    case 'subject':
                        errorMessage = 'Subject must be at least 5 characters';
                        break;
                    case 'message':
                        errorMessage = 'Message must be at least 10 characters';
                        break;
                    case 'service':
                        errorMessage = 'Please select a service';
                        break;
                    case 'agree':
                        errorMessage = 'You must agree to be contacted';
                        break;
                }
            }
        }

        if (!isValid) {
            field.classList.add('error');
            if (errorElement) {
                errorElement.textContent = errorMessage;
                errorElement.style.display = 'block';
            }
        } else {
            field.classList.remove('error');
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
        }

        return isValid;
    }

    // Form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all fields
        let isFormValid = true;
        const formData = new FormData(contactForm);

        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            showFormStatus('Please fix the errors above', 'error');
            return;
        }

        // Prepare form data
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn ? submitBtn.textContent : 'Submit';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        }

        try {
            // Client-side demo: Log form data and show success
            // In production, replace with actual backend endpoint
            console.log('Form submitted with data:', data);
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            showFormStatus('✓ Thank you! Your message has been received. We\'ll contact you at +254 706 923 653 or josephkilonzo8584@gmail.com shortly.', 'success');
            contactForm.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            showFormStatus('✗ There was an error. Please call us directly at +254 706 923 653.', 'error');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }
    });
}

// Show form status message
function showFormStatus(message, type) {
    const statusElement = document.getElementById('formStatus');
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = `form-status form-status-${type}`;
        statusElement.style.display = 'block';
        
        if (type === 'success') {
            setTimeout(() => {
                statusElement.style.display = 'none';
            }, 8000);
        }
    }
}

console.log('Contact form JavaScript loaded successfully');
