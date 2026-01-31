// Contact page functionality
function initContactPage() {
    setupFormValidation();
    setupFAQAccordion();
    setupEmergencyContact();
    setupMapInteraction();
    setupBranchSelection();
}

function setupFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const phone = document.getElementById('contactPhone').value.trim();
        const subject = document.getElementById('contactSubject').value;
        const message = document.getElementById('contactMessage').value.trim();
        
        // Validation
        if (!name || !email || !phone || !subject || !message) {
            showToast('Vui lòng điền đầy đủ thông tin bắt buộc', 'warning');
            return;
        }
        
        if (!isValidEmail(email)) {
            showToast('Email không hợp lệ', 'warning');
            return;
        }
        
        if (!isValidPhone(phone.replace(/\s/g, ''))) {
            showToast('Số điện thoại không hợp lệ', 'warning');
            return;
        }
        
        if (message.length < 10) {
            showToast('Nội dung tin nhắn quá ngắn', 'warning');
            return;
        }
        
        // Disable submit button and show loading
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Save contact message (in real app, this would be sent to server)
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
            
            // Show success message
            showToast('Tin nhắn của bạn đã được gửi thành công! Chúng tôi sẽ liên hệ lại sớm nhất.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
    
    // Phone number formatting
    const phoneInput = document.getElementById('contactPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
            }
            e.target.value = value;
        });
    }
}

function setupFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const answer = otherItem.querySelector('.faq-answer');
                    answer.style.maxHeight = null;
                    const icon = otherItem.querySelector('.faq-question i');
                    if (icon) icon.className = 'fas fa-chevron-down';
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.faq-question i');
            
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                if (icon) icon.className = 'fas fa-chevron-up';
            } else {
                answer.style.maxHeight = null;
                if (icon) icon.className = 'fas fa-chevron-down';
            }
        });
    });
    
    // Open first FAQ by default
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
        const answer = faqItems[0].querySelector('.faq-answer');
        const icon = faqItems[0].querySelector('.faq-question i');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
        if (icon) icon.className = 'fas fa-chevron-up';
    }
}

function setupEmergencyContact() {
    const emergencyNumber = document.querySelector('.emergency-number');
    if (!emergencyNumber) return;
    
    // Add click to call functionality
    emergencyNumber.style.cursor = 'pointer';
    emergencyNumber.title = 'Nhấn để gọi ngay';
    
    emergencyNumber.addEventListener('click', function() {
        if (confirm('Bạn có muốn gọi đường dây khẩn cấp của Petoria?')) {
            // In a real app, this would initiate a phone call
            showToast('Đang kết nối đến đường dây khẩn cấp...', 'info');
            window.open('tel:0901234567');
        }
    });
    
    // Pulsing animation
    let pulse = false;
    setInterval(() => {
        emergencyNumber.style.color = pulse ? '#ff4757' : 'white';
        emergencyNumber.style.textShadow = pulse ? '0 0 10px rgba(255, 71, 87, 0.7)' : 'none';
        pulse = !pulse;
    }, 1000);
}

function setupMapInteraction() {
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (!mapPlaceholder) return;
    
    mapPlaceholder.addEventListener('click', function() {
        showToast('Tính năng bản đồ tương tác sẽ sớm được cập nhật!', 'info');
        
        // Show map details on click
        const mapDetails = this.querySelector('.map-details');
        if (mapDetails) {
            const isVisible = mapDetails.style.transform === 'translateY(0px)';
            mapDetails.style.transform = isVisible ? 'translateY(100%)' : 'translateY(0)';
        }
    });
    
    // Directions functionality
    const directionsBtn = document.querySelector('.btn-link');
    if (directionsBtn) {
        directionsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('Đang mở chỉ đường...', 'info');
            
            // In a real app, this would open Google Maps or Apple Maps
            // For demo, we'll show coordinates
            const address = "123 Đường Petoria, Phường Bến Nghé, Quận 1, TP.HCM";
            const coordinates = "10.7769, 106.7009";
            
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
            
            const googleMapsBtn = modal.querySelector('#openGoogleMaps');
            const appleMapsBtn = modal.querySelector('#openAppleMaps');
            
            googleMapsBtn.addEventListener('click', () => {
                showToast('Đang mở Google Maps...', 'info');
                // In real app: window.open(`https://maps.google.com/?q=${coordinates}`);
            });
            
            appleMapsBtn.addEventListener('click', () => {
                showToast('Đang mở Apple Maps...', 'info');
                // In real app: window.open(`http://maps.apple.com/?ll=${coordinates}`);
            });
        });
    }
}

function setupBranchSelection() {
    const branchItems = document.querySelectorAll('.branch-item');
    
    branchItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all branches
            branchItems.forEach(branch => branch.classList.remove('active'));
            
            // Add active class to clicked branch
            this.classList.add('active');
            
            // Get branch info
            const branchName = this.querySelector('h4').textContent;
            const branchAddress = this.querySelector('p:nth-child(2)').textContent.replace('📍 ', '');
            const branchPhone = this.querySelector('p:nth-child(3)').textContent.replace('📞 ', '');
            
            // Update map placeholder
            const mapPlaceholder = document.querySelector('.map-placeholder');
            if (mapPlaceholder) {
                const icon = mapPlaceholder.querySelector('i');
                const text = mapPlaceholder.querySelector('p');
                const details = mapPlaceholder.querySelector('.map-details');
                
                if (icon) icon.className = 'fas fa-store';
                if (text) text.textContent = `Chi nhánh ${branchName}`;
                
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
    
    // Select first branch by default
    if (branchItems.length > 0) {
        branchItems[0].classList.add('active');
        
        // Update map with first branch info
        const firstBranch = branchItems[0];
        const branchName = firstBranch.querySelector('h4').textContent;
        const branchAddress = firstBranch.querySelector('p:nth-child(2)').textContent.replace('📍 ', '');
        const branchPhone = firstBranch.querySelector('p:nth-child(3)').textContent.replace('📞 ', '');
        
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

// Social links interaction
function setupSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.querySelector('span').textContent;
            let message = '';
            
            switch(platform) {
                case 'Facebook':
                    message = 'Đang chuyển đến trang Facebook của Petoria';
                    // window.open('https://facebook.com/petoria', '_blank');
                    break;
                case 'Instagram':
                    message = 'Đang chuyển đến trang Instagram của Petoria';
                    // window.open('https://instagram.com/petoria', '_blank');
                    break;
                case 'YouTube':
                    message = 'Đang chuyển đến kênh YouTube của Petoria';
                    // window.open('https://youtube.com/petoria', '_blank');
                    break;
                case 'TikTok':
                    message = 'Đang chuyển đến trang TikTok của Petoria';
                    // window.open('https://tiktok.com/@petoria', '_blank');
                    break;
                case 'Zalo OA':
                    message = 'Đang mở Zalo Official Account của Petoria';
                    // window.open('https://zalo.me/petoria', '_blank');
                    break;
            }
            
            showToast(message, 'info');
        });
    });
}

// Initialize contact page
if (window.location.pathname.includes('contact.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        initContactPage();
        setupSocialLinks();
    });
}