// Authentication functionality
function openAuthModal(mode = 'login') {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    
    const authTitle = document.getElementById('authTitle');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabButtons = document.querySelectorAll('.auth-tabs .tab-btn');
    
    if (authTitle) {
        authTitle.textContent = mode === 'login' ? 'Đăng nhập' : 'Đăng ký';
    }
    
    if (loginForm) {
        loginForm.style.display = mode === 'login' ? 'block' : 'none';
        loginForm.classList.toggle('active', mode === 'login');
    }
    
    if (registerForm) {
        registerForm.style.display = mode === 'register' ? 'block' : 'none';
        registerForm.classList.toggle('active', mode === 'register');
    }
    
    if (tabButtons) {
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === mode) {
                btn.classList.add('active');
            }
        });
    }
    
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// Initialize auth functionality
document.addEventListener('DOMContentLoaded', function() {
    const authModal = document.getElementById('authModal');
    const closeModalBtn = authModal?.querySelector('.close-modal');
    const tabButtons = authModal?.querySelectorAll('.auth-tabs .tab-btn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // Close modal when clicking outside
    if (authModal) {
        authModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeAuthModal();
            }
        });
    }
    
    // Close modal button
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeAuthModal);
    }
    
    // Tab switching
    if (tabButtons) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tab = this.getAttribute('data-tab');
                openAuthModal(tab);
            });
        });
    }
    
    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            if (!email || !password) {
                showToast('Vui lòng điền đầy đủ thông tin!', 'warning');
                return;
            }
            
            // Simple validation
            if (!isValidEmail(email)) {
                showToast('Email không hợp lệ!', 'warning');
                return;
            }
            
            // In a real app, this would be an API call
            // For demo, we'll use localStorage
            const users = JSON.parse(localStorage.getItem('petoriaUsers')) || [];
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Don't store password in currentUser
                const { password, ...currentUser } = user;
                localStorage.setItem('petoriaCurrentUser', JSON.stringify(currentUser));
                
                closeAuthModal();
                showToast('Đăng nhập thành công!', 'success');
                
                // Reload to update UI
                setTimeout(() => location.reload(), 1000);
            } else {
                showToast('Email hoặc mật khẩu không đúng!', 'danger');
            }
        });
    }
    
    // Register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const phone = document.getElementById('registerPhone').value.trim();
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            
            // Validation
            if (!name || !email || !phone || !password || !confirmPassword) {
                showToast('Vui lòng điền đầy đủ thông tin!', 'warning');
                return;
            }
            
            if (!isValidEmail(email)) {
                showToast('Email không hợp lệ!', 'warning');
                return;
            }
            
            if (!isValidPhone(phone.replace(/\s/g, ''))) {
                showToast('Số điện thoại không hợp lệ!', 'warning');
                return;
            }
            
            if (password.length < 6) {
                showToast('Mật khẩu phải có ít nhất 6 ký tự!', 'warning');
                return;
            }
            
            if (password !== confirmPassword) {
                showToast('Mật khẩu xác nhận không khớp!', 'warning');
                return;
            }
            
            const agreeTerms = document.getElementById('agreeTerms').checked;
            if (!agreeTerms) {
                showToast('Vui lòng đồng ý với điều khoản sử dụng!', 'warning');
                return;
            }
            
            // Check if user already exists
            const users = JSON.parse(localStorage.getItem('petoriaUsers')) || [];
            if (users.some(u => u.email === email)) {
                showToast('Email đã được đăng ký!', 'warning');
                return;
            }
            
            // Create new user
            const newUser = {
                id: Date.now(),
                name: name,
                email: email,
                phone: phone,
                password: password, // In real app, this should be hashed
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('petoriaUsers', JSON.stringify(users));
            
            // Auto login after registration
            const { password: _, ...currentUser } = newUser;
            localStorage.setItem('petoriaCurrentUser', JSON.stringify(currentUser));
            
            closeAuthModal();
            showToast('Đăng ký thành công!', 'success');
            
            // Reload to update UI
            setTimeout(() => location.reload(), 1000);
        });
    }
    
    // Social login buttons
    document.querySelectorAll('.btn-google, .btn-facebook').forEach(button => {
        button.addEventListener('click', function() {
            showToast('Tính năng đăng nhập bằng mạng xã hội đang được phát triển!', 'info');
        });
    });
    
    // Forgot password
    const forgotPassword = document.querySelector('.forgot-password');
    if (forgotPassword) {
        forgotPassword.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('Tính năng quên mật khẩu đang được phát triển!', 'info');
        });
    }
});

// Validation helpers
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    return phoneRegex.test(phone);
}