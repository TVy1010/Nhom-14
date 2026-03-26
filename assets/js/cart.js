// Chức năng trang giỏ hàng
// Hàm khởi tạo trang giỏ hàng
function initCartPage() {
    loadCartItems(); // Tải danh sách sản phẩm trong giỏ
    updateCartSummary(); // Cập nhật tổng tiền
    loadSuggestedProducts(); // Tải sản phẩm gợi ý
    setupEventListeners(); // Thiết lập các sự kiện
}

// Hàm tải và hiển thị các sản phẩm trong giỏ hàng
function loadCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cart = JSON.parse(localStorage.getItem('petoriaCart')) || [];
    
    // Nếu giỏ hàng trống, hiển thị thông báo
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <h3>Giỏ hàng của bạn đang trống</h3>
                <p>Hãy thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm</p>
                <a href="products.html" class="btn btn-primary">Tiếp tục mua sắm</a>
            </div>
        `;
        return;
    }
    
    // Tạo HTML cho từng sản phẩm trong giỏ
    let html = '';
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        html += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <h3><a href="product-detail.html?id=${item.id}">${item.name}</a></h3>
                    <div class="cart-item-category">Thú cưng</div>
                    <div class="cart-item-stock">
                        <i class="fas fa-check-circle"></i> Còn hàng
                    </div>
                </div>
                <div class="cart-item-price">${formatPrice(item.price)}₫</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" data-id="${item.id}">
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-total">${formatPrice(itemTotal)}₫</div>
                <button class="remove-item-btn" data-id="${item.id}" title="Xóa sản phẩm">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = html;
    setupCartItemListeners(); // Gắn sự kiện cho các nút trong giỏ
}

// Hàm thiết lập sự kiện cho các nút trong giỏ hàng (tăng/giảm số lượng, xóa)
function setupCartItemListeners() {
    // Xử lý nút giảm số lượng
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            updateCartQuantity(productId, -1); // Giảm 1 số lượng
        });
    });
    
    // Xử lý nút tăng số lượng
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            updateCartQuantity(productId, 1); // Tăng 1 số lượng
        });
    });
    
    // Xử lý thay đổi trực tiếp số lượng bằng input
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const productId = this.getAttribute('data-id');
            const quantity = parseInt(this.value) || 1;
            if (quantity >= 1 && quantity <= 99) {
                setCartQuantity(productId, quantity); // Đặt số lượng cụ thể
            }
        });
    });
    
    // Xử lý nút xóa sản phẩm
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            removeCartItem(productId); // Xóa sản phẩm khỏi giỏ
        });
    });
}

// Hàm cập nhật số lượng sản phẩm (tăng/giảm theo giá trị change)
function updateCartQuantity(productId, change) {
    const cart = JSON.parse(localStorage.getItem('petoriaCart')) || [];
    const itemIndex = cart.findIndex(item => item.id == productId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        // Giới hạn số lượng từ 1 đến 99
        if (cart[itemIndex].quantity < 1) cart[itemIndex].quantity = 1;
        if (cart[itemIndex].quantity > 99) cart[itemIndex].quantity = 99;
        
        localStorage.setItem('petoriaCart', JSON.stringify(cart));
        loadCartItems(); // Tải lại danh sách giỏ hàng
        updateCartSummary(); // Cập nhật tổng tiền
        updateCartCount(); // Cập nhật số lượng hiển thị trên icon giỏ
    }
}

// Hàm đặt số lượng sản phẩm cụ thể
function setCartQuantity(productId, quantity) {
    const cart = JSON.parse(localStorage.getItem('petoriaCart')) || [];
    const itemIndex = cart.findIndex(item => item.id == productId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = quantity;
        localStorage.setItem('petoriaCart', JSON.stringify(cart));
        loadCartItems(); // Tải lại danh sách giỏ hàng
        updateCartSummary(); // Cập nhật tổng tiền
        updateCartCount(); // Cập nhật số lượng hiển thị trên icon giỏ
    }
}

// Hàm xóa một sản phẩm khỏi giỏ hàng
function removeCartItem(productId) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
        let cart = JSON.parse(localStorage.getItem('petoriaCart')) || [];
        cart = cart.filter(item => item.id != productId); // Lọc bỏ sản phẩm cần xóa
        localStorage.setItem('petoriaCart', JSON.stringify(cart));
        
        loadCartItems(); // Tải lại danh sách giỏ hàng
        updateCartSummary(); // Cập nhật tổng tiền
        updateCartCount(); // Cập nhật số lượng hiển thị trên icon giỏ
        showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
    }
}

// Hàm cập nhật tổng tiền giỏ hàng (tiền hàng, phí ship, giảm giá, tổng cộng)
function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('petoriaCart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0); // Tổng tiền hàng
    const shippingFee = subtotal > 0 ? (subtotal >= 500000 ? 0 : 30000) : 0; // Phí ship (miễn phí nếu >=500k)
    
    let discount = 0;
    const appliedCoupon = localStorage.getItem('petoriaAppliedCoupon'); // Lấy mã giảm giá đã áp dụng
    
    // Tính giảm giá theo mã đã áp dụng
    if (appliedCoupon) {
        if (appliedCoupon === 'PETORIA10' && subtotal >= 200000) {
            discount = subtotal * 0.1; // Giảm 10%
        } else if (appliedCoupon === 'PETORIA20' && subtotal >= 500000) {
            discount = subtotal * 0.2; // Giảm 20%
        } else if (appliedCoupon === 'FREESHIP' && subtotal >= 300000) {
            discount = shippingFee; // Miễn phí ship
        }
    }
    
    const total = subtotal + shippingFee - discount; // Tổng thanh toán
    
    // Cập nhật các phần tử hiển thị tóm tắt
    const subtotalElement = document.getElementById('summarySubtotal');
    const shippingElement = document.getElementById('summaryShipping');
    const discountElement = document.getElementById('summaryDiscount');
    const totalElement = document.getElementById('summaryTotal');
    
    if (subtotalElement) subtotalElement.textContent = `${formatPrice(subtotal)}₫`;
    if (shippingElement) shippingElement.textContent = `${formatPrice(shippingFee)}₫`;
    if (discountElement) {
        discountElement.textContent = `-${formatPrice(discount)}₫`;
        discountElement.style.display = discount > 0 ? 'block' : 'none'; // Ẩn nếu không có giảm giá
    }
    if (totalElement) totalElement.textContent = `${formatPrice(total)}₫`;
    
    // Cập nhật ô nhập mã giảm giá nếu có mã đang áp dụng
    const couponInput = document.getElementById('couponCode');
    if (couponInput && appliedCoupon) {
        couponInput.value = appliedCoupon;
    }
}

// Hàm thiết lập các sự kiện trên trang giỏ hàng
function setupEventListeners() {
    // Xử lý nút xóa toàn bộ giỏ hàng
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
                localStorage.removeItem('petoriaCart');
                localStorage.removeItem('petoriaAppliedCoupon');
                loadCartItems(); // Tải lại danh sách giỏ hàng
                updateCartSummary(); // Cập nhật tổng tiền
                updateCartCount(); // Cập nhật số lượng hiển thị
                showToast('Đã xóa toàn bộ giỏ hàng', 'info');
            }
        });
    }
    
    // Xử lý nút tiếp tục mua sắm
    const continueShoppingBtn = document.getElementById('continueShoppingBtn');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            window.location.href = 'products.html'; // Chuyển về trang sản phẩm
        });
    }
    
    // Xử lý nút áp dụng mã giảm giá
    const applyCouponBtn = document.getElementById('applyCouponBtn');
    const couponInput = document.getElementById('couponCode');
    const couponMessage = document.getElementById('couponMessage');
    
    if (applyCouponBtn && couponInput) {
        applyCouponBtn.addEventListener('click', function() {
            const couponCode = couponInput.value.trim().toUpperCase();
            applyCoupon(couponCode); // Áp dụng mã
        });
        
        // Xử lý phím Enter trong ô nhập mã
        couponInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyCoupon(this.value.trim().toUpperCase());
            }
        });
    }
    
    // Xử lý nút thanh toán
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            checkout(); // Tiến hành thanh toán
        });
    }
}

// Hàm áp dụng mã giảm giá
function applyCoupon(couponCode) {
    const couponMessage = document.getElementById('couponMessage');
    const cart = JSON.parse(localStorage.getItem('petoriaCart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Kiểm tra giỏ hàng trống
    if (cart.length === 0) {
        couponMessage.innerHTML = '<span class="error">Giỏ hàng trống, không thể áp dụng mã giảm giá</span>';
        return;
    }
    
    // Danh sách mã giảm giá hợp lệ
    const validCoupons = {
        'PETORIA10': { min: 200000, discount: 0.1, message: 'Giảm 10% cho đơn hàng từ 200.000₫' },
        'PETORIA20': { min: 500000, discount: 0.2, message: 'Giảm 20% cho đơn hàng từ 500.000₫' },
        'FREESHIP': { min: 300000, discount: 'freeship', message: 'Miễn phí vận chuyển cho đơn hàng từ 300.000₫' }
    };
    
    // Xử lý mã trống
    if (!couponCode) {
        couponMessage.innerHTML = '<span class="error">Vui lòng nhập mã giảm giá</span>';
        localStorage.removeItem('petoriaAppliedCoupon');
        updateCartSummary();
        return;
    }
    
    // Kiểm tra mã hợp lệ
    if (validCoupons[couponCode]) {
        const coupon = validCoupons[couponCode];
        
        // Kiểm tra điều kiện đơn hàng tối thiểu
        if (subtotal < coupon.min) {
            couponMessage.innerHTML = `<span class="error">Mã giảm giá yêu cầu đơn hàng tối thiểu ${formatPrice(coupon.min)}₫</span>`;
            localStorage.removeItem('petoriaAppliedCoupon');
        } else {
            localStorage.setItem('petoriaAppliedCoupon', couponCode);
            couponMessage.innerHTML = `<span class="success"><i class="fas fa-check-circle"></i> Đã áp dụng mã giảm giá: ${coupon.message}</span>`;
            showToast('Đã áp dụng mã giảm giá thành công!', 'success');
        }
    } else {
        couponMessage.innerHTML = '<span class="error">Mã giảm giá không hợp lệ</span>';
        localStorage.removeItem('petoriaAppliedCoupon');
    }
    
    updateCartSummary(); // Cập nhật lại tổng tiền
}

// Hàm xử lý thanh toán (tạo đơn hàng, lưu vào localStorage)
function checkout() {
    const cart = JSON.parse(localStorage.getItem('petoriaCart')) || [];
    
    // Kiểm tra giỏ hàng trống
    if (cart.length === 0) {
        showToast('Giỏ hàng của bạn đang trống', 'warning');
        return;
    }
    
    // Kiểm tra người dùng đã đăng nhập chưa
    const currentUser = JSON.parse(localStorage.getItem('petoriaCurrentUser'));
    if (!currentUser) {
        showToast('Vui lòng đăng nhập để thanh toán', 'warning');
        openAuthModal('login'); // Mở modal đăng nhập
        return;
    }
    
    // Tính toán chi tiết đơn hàng
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = subtotal > 0 ? (subtotal >= 500000 ? 0 : 30000) : 0;
    const appliedCoupon = localStorage.getItem('petoriaAppliedCoupon');
    
    let discount = 0;
    if (appliedCoupon) {
        if (appliedCoupon === 'PETORIA10' && subtotal >= 200000) {
            discount = subtotal * 0.1;
        } else if (appliedCoupon === 'PETORIA20' && subtotal >= 500000) {
            discount = subtotal * 0.2;
        } else if (appliedCoupon === 'FREESHIP' && subtotal >= 300000) {
            discount = shippingFee;
        }
    }
    
    const total = subtotal + shippingFee - discount;
    
    // Tạo đối tượng đơn hàng
    const order = {
        id: 'ORD' + Date.now(), // Mã đơn hàng duy nhất
        userId: currentUser.id,
        userEmail: currentUser.email,
        userName: currentUser.name,
        items: cart,
        subtotal: subtotal,
        shipping: shippingFee,
        discount: discount,
        total: total,
        coupon: appliedCoupon,
        status: 'pending', // Trạng thái: đang xử lý
        createdAt: new Date().toISOString(),
        shippingAddress: {
            name: currentUser.name,
            phone: currentUser.phone || '',
            address: 'Chưa có địa chỉ'
        },
        paymentMethod: 'cod' // Thanh toán khi nhận hàng
    };
    
    // Lưu đơn hàng vào localStorage
    const orders = JSON.parse(localStorage.getItem('petoriaOrders')) || [];
    orders.push(order);
    localStorage.setItem('petoriaOrders', JSON.stringify(orders));
    
    // Xóa giỏ hàng và mã giảm giá sau khi đặt hàng
    localStorage.removeItem('petoriaCart');
    localStorage.removeItem('petoriaAppliedCoupon');
    
    // Tạo nội dung hiển thị thông báo thành công
    const orderDetails = `
        <div style="text-align: center; padding: 30px 0;">
            <i class="fas fa-check-circle" style="font-size: 60px; color: var(--success-color); margin-bottom: 20px;"></i>
            <h3>Đặt hàng thành công!</h3>
            <p><strong>Mã đơn hàng:</strong> ${order.id}</p>
            <p><strong>Tổng tiền:</strong> ${formatPrice(total)}₫</p>
            <p><strong>Phương thức thanh toán:</strong> Thanh toán khi nhận hàng</p>
            <p><strong>Trạng thái:</strong> Đang xử lý</p>
            <p>Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.</p>
        </div>
    `;
    
    // Tạo modal thông báo thành công
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h3>Đặt hàng thành công!</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                ${orderDetails}
                <div style="display: flex; gap: 15px; margin-top: 30px;">
                    <button class="btn btn-outline" id="continueShoppingBtnModal" style="flex: 1;">Tiếp tục mua sắm</button>
                    <button class="btn btn-primary" id="viewOrdersBtnModal" style="flex: 1;">Xem đơn hàng</button>
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
    
    // Xử lý nút tiếp tục mua sắm
    const continueShoppingBtn = modal.querySelector('#continueShoppingBtnModal');
    continueShoppingBtn.addEventListener('click', () => {
        window.location.href = 'products.html';
    });
    
    // Xử lý nút xem đơn hàng
    const viewOrdersBtn = modal.querySelector('#viewOrdersBtnModal');
    viewOrdersBtn.addEventListener('click', () => {
        showToast('Tính năng xem đơn hàng sẽ sớm được cập nhật!', 'info');
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    });
    
    // Cập nhật lại hiển thị giỏ hàng
    loadCartItems();
    updateCartSummary();
    updateCartCount();
}

// Hàm tải sản phẩm gợi ý (sản phẩm không có trong giỏ)
function loadSuggestedProducts() {
    const suggestedProductsContainer = document.getElementById('suggestedProducts');
    if (!suggestedProductsContainer) return;
    
    const cart = JSON.parse(localStorage.getItem('petoriaCart')) || [];
    // Nếu giỏ hàng trống, ẩn phần gợi ý
    if (cart.length === 0) {
        suggestedProductsContainer.style.display = 'none';
        return;
    }
    
    // Lấy các sản phẩm không có trong giỏ hàng (tối đa 4 sản phẩm)
    const suggested = productsData
        .filter(product => !cart.some(item => item.id == product.id))
        .slice(0, 4);
    
    if (suggested.length === 0) {
        suggestedProductsContainer.style.display = 'none';
        return;
    }
    
    // Tạo HTML hiển thị sản phẩm gợi ý
    let html = `
        <div class="suggested-header">
            <h2>Sản phẩm gợi ý</h2>
            <p>Các sản phẩm bạn có thể thích</p>
        </div>
        <div class="suggested-grid">
    `;
    
    suggested.forEach(product => {
        const isOnSale = product.isSale && product.salePrice;
        const currentPrice = isOnSale ? product.salePrice : product.price;
        
        html += `
            <div class="suggested-item">
                <img src="${product.image}" alt="${product.name}">
                <h4>${product.name}</h4>
                <div class="suggested-price">${formatPrice(currentPrice)}₫</div>
                <button class="btn btn-primary add-suggested-btn" 
                        onclick="addToCart(${product.id}, '${product.name}', ${currentPrice}, '${product.image}')">
                    <i class="fas fa-cart-plus"></i> Thêm vào giỏ
                </button>
            </div>
        `;
    });
    
    html += '</div>';
    suggestedProductsContainer.innerHTML = html;
}

// Khởi tạo trang giỏ hàng nếu đang ở trang cart.html
if (window.location.pathname.includes('cart.html')) {
    document.addEventListener('DOMContentLoaded', initCartPage);
}