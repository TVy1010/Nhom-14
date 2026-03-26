// Chức năng xác thực (đăng nhập/đăng ký)
// Hàm mở modal xác thực (đăng nhập hoặc đăng ký)
function openAuthModal(mode = 'login') {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    
    const authTitle = document.getElementById('authTitle'); // Tiêu đề modal
    const loginForm = document.getElementById('loginForm'); // Form đăng nhập
    const registerForm = document.getElementById('registerForm'); // Form đăng ký
    const tabButtons = document.querySelectorAll('.auth-tabs .tab-btn'); // Các nút tab
    
    // Cập nhật tiêu đề modal theo chế độ
    if (authTitle) {
        authTitle.textContent = mode === 'login' ? 'Đăng nhập' : 'Đăng ký';
    }
    
    // Hiển thị form đăng nhập hoặc đăng ký tương ứng
    if (loginForm) {
        loginForm.style.display = mode === 'login' ? 'block' : 'none';
        loginForm.classList.toggle('active', mode === 'login');
    }
    
    if (registerForm) {
        registerForm.style.display = mode === 'register' ? 'block' : 'none';
        registerForm.classList.toggle('active', mode === 'register');
    }
    
    // Cập nhật trạng thái active cho tab
    if (tabButtons) {
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === mode) {
                btn.classList.add('active');
            }
        });
    }
    
    // Hiển thị modal với hiệu ứng
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
}

// Hàm đóng modal xác thực
function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.remove('show'); // Xóa class show để ẩn với hiệu ứng
        setTimeout(() => {
            modal.style.display = 'none'; // Sau hiệu ứng, ẩn modal
        }, 300);
    }
}

// Tạo chức năng xác thực (khởi tạo các sự kiện khi trang tải xong)
document.addEventListener('DOMContentLoaded', function() {
    const authModal = document.getElementById('authModal');
    const closeModalBtn = authModal?.querySelector('.close-modal'); // Nút đóng modal
    const tabButtons = authModal?.querySelectorAll('.auth-tabs .tab-btn'); // Các tab
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // Đóng modal khi click ra ngoài vùng nội dung
    if (authModal) {
        authModal.addEventListener('click', function(e) {
            if (e.target === this) { // Click vào background (không phải nội dung)
                closeAuthModal();
            }
        });
    }
    
    // Xử lý nút đóng modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeAuthModal);
    }
    
    // Xử lý chuyển đổi giữa tab Đăng nhập và Đăng ký
    if (tabButtons) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tab = this.getAttribute('data-tab'); // Lấy tab được chọn (login hoặc register)
                openAuthModal(tab); // Mở modal với tab tương ứng
            });
        });
    }
    
    // Xử lý nút hiển thị/ẩn mật khẩu (toggle password visibility)
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling; // Ô input phía trước nút
            const icon = this.querySelector('i'); // Icon trên nút
            
            // Chuyển đổi giữa type password và text
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash'; // Đổi icon thành mắt gạch chéo
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye'; // Đổi icon thành mắt
            }
        });
    });
    
    // Xử lý submit form đăng nhập
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Ngăn chặn reload trang
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            // Kiểm tra các trường bắt buộc
            if (!email || !password) {
                showToast('Vui lòng điền đầy đủ thông tin!', 'warning');
                return;
            }
            
            // Kiểm tra định dạng email
            if (!isValidEmail(email)) {
                showToast('Email không hợp lệ!', 'warning');
                return;
            }
            
            // Trong ứng dụng thực tế, đây sẽ là gọi API xác thực
            // Hiện tại dùng localStorage để minh họa
            const users = JSON.parse(localStorage.getItem('petoriaUsers')) || []; // Lấy danh sách người dùng
            const user = users.find(u => u.email === email && u.password === password); // Tìm user khớp email và mật khẩu
            
            if (user) {
                // Không lưu mật khẩu vào currentUser (bảo mật)
                const { password, ...currentUser } = user;
                localStorage.setItem('petoriaCurrentUser', JSON.stringify(currentUser)); // Lưu thông tin người dùng hiện tại
                
                closeAuthModal(); // Đóng modal
                showToast('Đăng nhập thành công!', 'success');
                
                // Tải lại trang để cập nhật giao diện người dùng (hiển thị tên, avatar...)
                setTimeout(() => location.reload(), 1000);
            } else {
                showToast('Email hoặc mật khẩu không đúng!', 'danger');
            }
        });
    }
    
    // Xử lý submit form đăng ký
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Ngăn chặn reload trang
            
            const name = document.getElementById('registerName').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const phone = document.getElementById('registerPhone').value.trim();
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            
            // Kiểm tra các trường bắt buộc
            if (!name || !email || !phone || !password || !confirmPassword) {
                showToast('Vui lòng điền đầy đủ thông tin!', 'warning');
                return;
            }
            
            // Kiểm tra định dạng email
            if (!isValidEmail(email)) {
                showToast('Email không hợp lệ!', 'warning');
                return;
            }
            
            // Kiểm tra định dạng số điện thoại
            if (!isValidPhone(phone.replace(/\s/g, ''))) {
                showToast('Số điện thoại không hợp lệ!', 'warning');
                return;
            }
            
            // Kiểm tra độ dài mật khẩu
            if (password.length < 6) {
                showToast('Mật khẩu phải có ít nhất 6 ký tự!', 'warning');
                return;
            }
            
            // Kiểm tra xác nhận mật khẩu
            if (password !== confirmPassword) {
                showToast('Mật khẩu xác nhận không khớp!', 'warning');
                return;
            }
            
            // Kiểm tra đồng ý điều khoản
            const agreeTerms = document.getElementById('agreeTerms').checked;
            if (!agreeTerms) {
                showToast('Vui lòng đồng ý với điều khoản sử dụng!', 'warning');
                return;
            }
            
            // Kiểm tra email đã được đăng ký chưa
            const users = JSON.parse(localStorage.getItem('petoriaUsers')) || [];
            if (users.some(u => u.email === email)) {
                showToast('Email đã được đăng ký!', 'warning');
                return;
            }
            
            // Tạo người dùng mới
            const newUser = {
                id: Date.now(), // ID duy nhất dựa trên timestamp
                name: name,
                email: email,
                phone: phone,
                password: password, // Trong ứng dụng thực tế, mật khẩu cần được mã hóa (hash)
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser); // Thêm vào danh sách người dùng
            localStorage.setItem('petoriaUsers', JSON.stringify(users));
            
            // Tự động đăng nhập sau khi đăng ký thành công
            const { password: _, ...currentUser } = newUser; // Loại bỏ mật khẩu khỏi đối tượng
            localStorage.setItem('petoriaCurrentUser', JSON.stringify(currentUser));
            
            closeAuthModal(); // Đóng modal
            showToast('Đăng ký thành công!', 'success');
            
            // Tải lại trang để cập nhật giao diện người dùng
            setTimeout(() => location.reload(), 1000);
        });
    }
    
    // Xử lý nút đăng nhập bằng Google và Facebook
    document.querySelectorAll('.btn-google, .btn-facebook').forEach(button => {
        button.addEventListener('click', function() {
            showToast('Tính năng đăng nhập bằng mạng xã hội đang được phát triển!', 'info');
        });
    });
    
    // Xử lý nút "Quên mật khẩu"
    const forgotPassword = document.querySelector('.forgot-password');
    if (forgotPassword) {
        forgotPassword.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('Tính năng quên mật khẩu đang được phát triển!', 'info');
        });
    }
});

// Các hàm hỗ trợ xác thực

// Hàm kiểm tra định dạng email hợp lệ
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex kiểm tra email: có @ và domain
    return emailRegex.test(email);
}

// Hàm kiểm tra định dạng số điện thoại Việt Nam hợp lệ
function isValidPhone(phone) {
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/; // Regex: đầu 03,05,07,08,09 + 8 số
    return phoneRegex.test(phone);
}