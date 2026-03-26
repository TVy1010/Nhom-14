// Hàm khởi tạo trang liên hệ
function initContactPage() {
    setupFormValidation(); // Thiết lập xác thực biểu mẫu
    setupFAQAccordion(); // Thiết lập accordion cho FAQ
    setupEmergencyContact(); // Thiết lập chức năng liên hệ khẩn cấp
    setupMapInteraction(); // Thiết lập tương tác bản đồ
    setupBranchSelection(); // Thiết lập chọn chi nhánh
}

// Hàm thiết lập xác thực và xử lý gửi biểu mẫu liên hệ
function setupFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    // Xử lý sự kiện submit form
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Lấy giá trị từ các trường trong biểu mẫu
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const phone = document.getElementById('contactPhone').value.trim();
        const subject = document.getElementById('contactSubject').value;
        const message = document.getElementById('contactMessage').value.trim();
        
        // Kiểm tra các trường bắt buộc
        if (!name || !email || !phone || !subject || !message) {
            showToast('Vui lòng điền đầy đủ thông tin bắt buộc', 'warning');
            return;
        }
        
        // Kiểm tra định dạng email
        if (!isValidEmail(email)) {
            showToast('Email không hợp lệ', 'warning');
            return;
        }
        
        // Kiểm tra định dạng số điện thoại
        if (!isValidPhone(phone.replace(/\s/g, ''))) {
            showToast('Số điện thoại không hợp lệ', 'warning');
            return;
        }
        
        // Kiểm tra độ dài tin nhắn
        if (message.length < 10) {
            showToast('Nội dung tin nhắn quá ngắn', 'warning');
            return;
        }
        
        // Vô hiệu hóa nút gửi và hiển thị trạng thái đang tải
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        submitBtn.disabled = true;
        
        // Mô phỏng cuộc gọi API (giả lập gửi dữ liệu lên server)
        setTimeout(() => {
            // Lưu tin nhắn liên hệ vào localStorage (trong ứng dụng thực tế sẽ gửi đến máy chủ)
            const contactMessages = JSON.parse(localStorage.getItem('petoriaContactMessages')) || [];
            const newMessage = {
                id: Date.now(),
                name: name,
                email: email,
                phone: phone,
                subject: subject,
                message: message,
                date: new Date().toISOString(),
                read: false
            };
            
            contactMessages.push(newMessage);
            localStorage.setItem('petoriaContactMessages', JSON.stringify(contactMessages));
            
            // Hiển thị thông báo thành công
            showToast('Tin nhắn của bạn đã được gửi thành công! Chúng tôi sẽ liên hệ lại sớm nhất.', 'success');
            
            // Đặt lại biểu mẫu về trạng thái ban đầu
            contactForm.reset();
            
            // Khôi phục nút gửi
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
    
    // Định dạng số điện thoại (thêm dấu cách sau mỗi 4 số)
    const phoneInput = document.getElementById('contactPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Chỉ giữ lại số
            if (value.length > 0) {
                value = value.match(new RegExp('.{1,4}', 'g')).join(' '); // Nhóm 4 số cách nhau
            }
            e.target.value = value;
        });
    }
}

// Hàm thiết lập accordion cho phần câu hỏi thường gặp (FAQ)
function setupFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        // Xử lý click vào câu hỏi để mở/đóng câu trả lời
        question.addEventListener('click', function() {
            // Đóng tất cả các mục FAQ khác
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const answer = otherItem.querySelector('.faq-answer');
                    answer.style.maxHeight = null; // Ẩn câu trả lời
                    const icon = otherItem.querySelector('.faq-question i');
                    if (icon) icon.className = 'fas fa-chevron-down'; // Đổi icon thành mũi tên xuống
                }
            });
            
            // Bật/tắt mục hiện tại
            item.classList.toggle('active');
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.faq-question i');
            
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px'; // Hiển thị câu trả lời
                if (icon) icon.className = 'fas fa-chevron-up'; // Đổi icon thành mũi tên lên
            } else {
                answer.style.maxHeight = null; // Ẩn câu trả lời
                if (icon) icon.className = 'fas fa-chevron-down'; // Đổi icon thành mũi tên xuống
            }
        });
    });
    
    // Mặc định, mở câu hỏi FAQ đầu tiên
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
        const answer = faqItems[0].querySelector('.faq-answer');
        const icon = faqItems[0].querySelector('.faq-question i');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
        if (icon) icon.className = 'fas fa-chevron-up';
    }
}

// Hàm thiết lập chức năng liên hệ khẩn cấp
function setupEmergencyContact() {
    const emergencyNumber = document.querySelector('.emergency-number');
    if (!emergencyNumber) return;
    
    // Thêm chức năng gọi điện trực tiếp khi click vào số điện thoại
    emergencyNumber.style.cursor = 'pointer';
    emergencyNumber.title = 'Nhấn để gọi ngay';
    
    emergencyNumber.addEventListener('click', function() {
        if (confirm('Bạn có muốn gọi đường dây khẩn cấp của Petoria?')) {
            // Trong ứng dụng thực tế, thao tác này sẽ bắt đầu một cuộc gọi điện thoại
            showToast('Đang kết nối đến đường dây khẩn cấp...', 'info');
            window.open('tel:0901234567'); // Mở ứng dụng gọi điện
        }
    });
    
    // Hiệu ứng nhấp nháy cho số điện thoại khẩn cấp
    let pulse = false;
    setInterval(() => {
        emergencyNumber.style.color = pulse ? '#ff4757' : 'white';
        emergencyNumber.style.textShadow = pulse ? '0 0 10px rgba(255, 71, 87, 0.7)' : 'none';
        pulse = !pulse;
    }, 1000);
}

// Hàm thiết lập tương tác với bản đồ
function setupMapInteraction() {
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (!mapPlaceholder) return;
    
    // Xử lý click vào placeholder bản đồ
    mapPlaceholder.addEventListener('click', function() {
        showToast('Tính năng bản đồ tương tác sẽ sớm được cập nhật!', 'info');
        
        // Hiển thị/ẩn chi tiết bản đồ
        const mapDetails = this.querySelector('.map-details');
        if (mapDetails) {
            const isVisible = mapDetails.style.transform === 'translateY(0px)';
            mapDetails.style.transform = isVisible ? 'translateY(100%)' : 'translateY(0)';
        }
    });
    
    // Xử lý nút chỉ đường
    const directionsBtn = document.querySelector('.btn-link');
    if (directionsBtn) {
        directionsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('Đang mở chỉ đường...', 'info');
            
            // Thông tin địa chỉ và tọa độ
            const address = "123 Đường Petoria, Phường Bến Nghé, Quận 1, TP.HCM";
            const coordinates = "10.7769, 106.7009";
            
            // Tạo modal chọn ứng dụng bản đồ
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.style.display = 'block';
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 500px;">
                    <div class="modal-header">
                        <h3>Chỉ đường đến Petoria</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div style="margin-bottom: 20px;">
                            <p><strong>Địa chỉ:</strong> ${address}</p>
                            <p><strong>Tọa độ:</strong> ${coordinates}</p>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button class="btn btn-primary" id="openGoogleMaps" style="flex: 1;">
                                <i class="fab fa-google"></i> Google Maps
                            </button>
                            <button class="btn btn-primary" id="openAppleMaps" style="flex: 1;">
                                <i class="fab fa-apple"></i> Apple Maps
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Xử lý đóng modal
            const closeBtn = modal.querySelector('.close-modal');
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                setTimeout(() => modal.remove(), 300);
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    setTimeout(() => modal.remove(), 300);
                }
            });
            
            // Xử lý nút mở Google Maps
            const googleMapsBtn = modal.querySelector('#openGoogleMaps');
            const appleMapsBtn = modal.querySelector('#openAppleMaps');
            
            googleMapsBtn.addEventListener('click', () => {
                showToast('Đang mở Google Maps...', 'info');
            });
            
            appleMapsBtn.addEventListener('click', () => {
                showToast('Đang mở Apple Maps...', 'info');
            });
        });
    }
}

// Hàm thiết lập chọn chi nhánh cửa hàng
function setupBranchSelection() {
    const branchItems = document.querySelectorAll('.branch-item');
    
    // Xử lý click vào từng chi nhánh
    branchItems.forEach(item => {
        item.addEventListener('click', function() {
            // Xóa class active của tất cả chi nhánh
            branchItems.forEach(branch => branch.classList.remove('active'));
            
            // Thêm class active cho chi nhánh được chọn
            this.classList.add('active');
            
            // Lấy thông tin chi nhánh
            const branchName = this.querySelector('h4').textContent;
            const branchAddress = this.querySelector('p:nth-child(2)').textContent.replace('📍 ', '');
            const branchPhone = this.querySelector('p:nth-child(3)').textContent.replace('📞 ', '');
            
            // Cập nhật hiển thị trên bản đồ
            const mapPlaceholder = document.querySelector('.map-placeholder');
            if (mapPlaceholder) {
                const icon = mapPlaceholder.querySelector('i');
                const text = mapPlaceholder.querySelector('p');
                const details = mapPlaceholder.querySelector('.map-details');
                
                if (icon) icon.className = 'fas fa-store';
                if (text) text.textContent = `Chi nhánh ${branchName}`;
                
                // Cập nhật chi tiết bản đồ
                if (details) {
                    details.innerHTML = `
                        <h3>Petoria - ${branchName}</h3>
                        <p>${branchAddress}</p>
                        <div class="map-directions">
                            <h4>Liên hệ:</h4>
                            <p><i class="fas fa-phone"></i> ${branchPhone}</p>
                            <p><i class="fas fa-clock"></i> 8:00 - 20:00 hàng ngày</p>
                        </div>
                    `;
                }
            }
            
            showToast(`Đã chọn chi nhánh: ${branchName}`, 'info');
        });
    });
    
    // Mặc định chọn chi nhánh đầu tiên
    if (branchItems.length > 0) {
        branchItems[0].classList.add('active');
        
        const firstBranch = branchItems[0];
        const branchName = firstBranch.querySelector('h4').textContent;
        const branchAddress = firstBranch.querySelector('p:nth-child(2)').textContent.replace('📍 ', '');
        const branchPhone = firstBranch.querySelector('p:nth-child(3)').textContent.replace('📞 ', '');
        
        // Cập nhật chi tiết bản đồ cho chi nhánh mặc định
        const mapPlaceholder = document.querySelector('.map-placeholder');
        if (mapPlaceholder) {
            const details = mapPlaceholder.querySelector('.map-details');
            if (details) {
                details.innerHTML = `
                    <h3>Petoria - ${branchName}</h3>
                    <p>${branchAddress}</p>
                    <div class="map-directions">
                        <h4>Liên hệ:</h4>
                        <p><i class="fas fa-phone"></i> ${branchPhone}</p>
                        <p><i class="fas fa-clock"></i> 8:00 - 20:00 hàng ngày</p>
                    </div>
                `;
            }
        }
    }
}

// Hàm thiết lập liên kết mạng xã hội
function setupSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    // Xử lý click vào các liên kết mạng xã hội
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.querySelector('span').textContent;
            let message = '';
            
            // Hiển thị thông báo tương ứng với từng nền tảng
            switch(platform) {
                case 'Facebook':
                    message = 'Đang chuyển đến trang Facebook của Petoria';
                    break;
                case 'Instagram':
                    message = 'Đang chuyển đến trang Instagram của Petoria';
                    break;
                case 'YouTube':
                    message = 'Đang chuyển đến kênh YouTube của Petoria';
                    break;
                case 'TikTok':
                    message = 'Đang chuyển đến trang TikTok của Petoria';
                    break;
                case 'Zalo OA':
                    message = 'Đang mở Zalo Official Account của Petoria';
                    break;
            }
            
            showToast(message, 'info');
        });
    });
}

// Kiểm tra nếu đang ở trang contact.html thì khởi tạo trang liên hệ
if (window.location.pathname.includes('contact.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        initContactPage(); // Khởi tạo các chức năng chính
        setupSocialLinks(); // Thiết lập liên kết mạng xã hội
    });
}