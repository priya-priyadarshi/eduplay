// ==================== AUTHENTICATION ====================

// Check if user is logged in
async function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await fetch('/api/auth/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            
            if (data.success) {
                currentUser = data.user;
                updateUIForLoggedInUser();
            } else {
                logout();
            }
        } catch (error) {
            logout();
        }
    } else {
        updateUIForLoggedOutUser();
    }
}

// Update UI after login
function updateUIForLoggedInUser() {
    const authBtn = document.getElementById('authBtn');
    if (authBtn) {
        authBtn.innerHTML = `👤 ${currentUser.name.split(' ')[0]}`;
        authBtn.onclick = () => showPage('profile');
    }
    
    // Update language preference
    if (currentUser.preferred_language) {
        changeLanguage(currentUser.preferred_language);
    }
    
    // Load profile if on profile page
    if (document.getElementById('profilePage').classList.contains('active')) {
        loadProfile();
    }
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
    const authBtn = document.getElementById('authBtn');
    if (authBtn) {
        authBtn.innerHTML = '🔐 Login';
        authBtn.onclick = () => showAuthModal();
    }
    
    currentUser = null;
}

// Login function
async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showNotification('Please enter email and password', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            updateUIForLoggedInUser();
            closeAuthModal();
            showPage('home');
            showNotification('Login successful! Welcome back!', 'success');
            
            // Clear login form
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';
        } else {
            // Check if forgot password option should be shown
            if (data.forgotPassword) {
                showNotification(data.error || 'Login failed', 'error');
                // Show forgot password link in notification
                setTimeout(() => {
                    if (confirm('Forgot Password? Click OK to reset')) {
                        showForgotPasswordModal();
                    }
                }, 500);
            } else {
                showNotification(data.error || 'Login failed', 'error');
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Login failed. Please try again.', 'error');
    }
}

// ==================== LOGOUT (FIXED) ====================
function logout() {
    // Clear all localStorage items
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('preferred_language');
    
    // Clear sessionStorage if any
    if (sessionStorage) sessionStorage.clear();
    
    // Reset currentUser variable
    currentUser = null;
    
    // Update UI
    updateUIForLoggedOutUser();
    
    // Show home page
    showPage('home');
    
    // Show success message
    showNotification('Logged out successfully', 'info');
    
    // Optional: Reload page to clear all states
    setTimeout(() => {
        window.location.reload();
    }, 500);
}

// ==================== FORGOT PASSWORD FUNCTIONS ====================
let resetToken = null;

function showForgotPasswordModal() {
    closeAuthModal();
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) modal.style.display = 'block';
}

function closeForgotPasswordModal() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) modal.style.display = 'none';
}

function closeResetPasswordModal() {
    const modal = document.getElementById('resetPasswordModal');
    if (modal) modal.style.display = 'none';
}

async function sendResetLink() {
    const email = document.getElementById('resetEmail').value;
    
    if (!email) {
        showNotification('Please enter your email', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification(data.message, 'success');
            closeForgotPasswordModal();
            
            // In development, show the reset link
            if (data.resetLink) {
                console.log('Reset link:', data.resetLink);
                const urlParams = new URLSearchParams(data.resetLink.split('?')[1]);
                resetToken = urlParams.get('token');
                if (resetToken) {
                    const modal = document.getElementById('resetPasswordModal');
                    if (modal) modal.style.display = 'block';
                }
            }
        } else {
            showNotification(data.error, 'error');
        }
    } catch (err) {
        console.error('Send reset link error:', err);
        showNotification('Something went wrong', 'error');
    }
}

async function resetPassword() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!newPassword || !confirmPassword) {
        showNotification('Please fill both fields', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: resetToken, newPassword })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification(data.message, 'success');
            closeResetPasswordModal();
            showLogin();
            // Clear password fields
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
            document.getElementById('resetEmail').value = '';
        } else {
            showNotification(data.error, 'error');
        }
    } catch (err) {
        console.error('Reset password error:', err);
        showNotification('Something went wrong', 'error');
    }
}

// Signup function
async function signup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const language = document.getElementById('signupLanguage').value;
    
    if (!name || !email || !password) {
        showNotification('Please fill all fields', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, preferred_language: language })
        });
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            updateUIForLoggedInUser();
            closeAuthModal();
            showPage('home');
            changeLanguage(language);
            showNotification('Account created successfully! Welcome!', 'success');
            
            // Clear signup form
            document.getElementById('signupName').value = '';
            document.getElementById('signupEmail').value = '';
            document.getElementById('signupPassword').value = '';
        } else {
            showNotification(data.error || 'Signup failed', 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showNotification('Signup failed. Please try again.', 'error');
    }
}

// Show auth modal
function showAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'block';
        showLogin();
    }
}

// Close auth modal
function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Show login form
function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
}

// Show signup form
function showSignup() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
}

// Google Login
function googleLogin() {
    // Direct to Google OAuth
    window.location.href = '/api/auth/google';
}

// Facebook Login
function facebookLogin() {
    // Direct to Facebook OAuth
    window.location.href = '/api/auth/facebook';
}

// Check for reset token on page load
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
        resetToken = token;
        showAuthModal();
        const resetModal = document.getElementById('resetPasswordModal');
        if (resetModal) resetModal.style.display = 'block';
    }
});