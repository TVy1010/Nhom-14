// Cart page functionality
function initCartPage() {
    loadCartItems();
    updateCartSummary();
    loadSuggestedProducts();
    setupEventListeners();
}

function loadCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cart = JSON.parse(localStorage.getItem('petoriaCart')) || [];
    
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
    setupCartItemListeners();
}

function setupCartItemListeners() {
    // Quantity minus buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            updateCartQuantity(productId, -1);
        });
    });
    
    // Quantity plus buttons
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            updateCartQuantity(productId, 1);
        });
    });
    
    // Quantity inputs
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const productId = this.getAttribute('data-id');
            const quantity = parseInt(this.value) || 1;
            if (quantity >= 1 && quantity <= 99) {
                setCartQuantity(productId, quantity);
            }
        });
    });
    
    // Remove item buttons
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            removeCartItem(productId);
        });
    });
}

function updateCartQuantity(productId, change) {
    const cart = JSON.parse(localStorage.getItem('petoriaCart')) || [];
    const itemIndex = cart.findIndex(item => item.id == productId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity < 1) cart[itemIndex].quantity = 1;
        if (cart[itemIndex].quantity > 99) cart[itemIndex].quantity = 99;
        
        localStorage.setItem('petoriaCart', JSON.stringify(cart));
        loadCartItems();
        updateCartSummary();
        updateCartCount();
    }
}

function setCartQuantity(productId, quantity) {
    const cart = JSON.parse(localStorage.getItem('petoriaCart')) || [];
    const itemIndex = cart.findIndex(item => item.id == productId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = quantity;
        localStorage.setItem('petoriaCart', JSON.stringify(cart));
        loadCartItems();
        updateCartSummary();
        updateCartCount();
    }
}

function removeCartItem(productId) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
        let cart = JSON.parse(localStorage.getItem('petoriaCart')) || [];
        cart = cart.filter(item => item.id != productId);
        localStorage.setItem('petoriaCart', JSON.stringify(cart));
        
        loadCartItems();
        updateCartSummary();
        updateCartCount();
        showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
    }
}

function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('petoriaCart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = subtotal > 0 ? (subtotal >= 500000 ? 0 : 30000) : 0;
    
    let discount = 0;
    const appliedCoupon = localStorage.getItem('petoriaAppliedCoupon');
    
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
    
    // Update summary elements
    const subtotalElement = document.getElementById('summarySubtotal');
    const shippingElement = document.getElementById('summaryShipping');
    const discountElement = document.getElementById('summaryDiscount');
    const totalElement = document.getElementById('summaryTotal');
    
    if (subtotalElement) subtotalElement.textContent = `${formatPrice(subtotal)}₫`;
    if (shippingElement) shippingElement.textContent = `${formatPrice(shippingFee)}₫`;
    if (discountElement) {
        discountElement.textContent = `-${formatPrice(discount)}₫`;
        discountElement.style.display = discount > 0 ? 'block' : 'none';
    }
    if (totalElement) totalElement.textContent = `${formatPrice(total)}₫`;
    
    // Update coupon input if exists
    const couponInput = document.getElementById('couponCode');
    if (couponInput && appliedCoupon) {
        couponInput.value = appliedCoupon;
    }
}

function setupEventListeners() {
    // Clear cart button
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
                localStorage.removeItem('petoriaCart');
                localStorage.removeItem('petoriaAppliedCoupon');
                loadCartItems();
                updateCartSummary();
                updateCartCount();
                showToast('Đã xóa toàn bộ giỏ hàng', 'info');
            }
        });
    }
    
    // Continue shopping button
    const continueShoppingBtn = document.getElementById('continueShoppingBtn');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            window.location.href = 'products.html';
        });
    }
    
    // Apply coupon button
    const applyCouponBtn = document.getElementById('applyCouponBtn');
    const couponInput = document.getElementById('couponCode');
    const couponMessage = document.getElementById('couponMessage');
    
    if (applyCouponBtn && couponInput) {
        applyCouponBtn.addEventListener('click', function() {
            const couponCode = couponInput.value.trim().toUpperCase();
            applyCoupon(couponCode);
        });
        
        couponInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyCoupon(this.value.trim().toUpperCase());
            }
        });
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            checkout();
        });
    }
}

function applyCoupon(couponCode) {
    const couponMessage = document.getElementById('couponMessage');
    const cart = JSON.parse(localStorage.getItem('petoriaCart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (cart.length === 0) {
        couponMessage.innerHTML = '<span class="error">Giỏ hàng trống, không thể áp dụng mã giảm giá</span>';
        return;
    }
    
    const validCoupons = {
        'PETORIA10': { min: 200000, discount: 0.1, message: 'Giảm 10% cho đơn hàng từ 200.000₫' },
        'PETORIA20': { min: 500000, discount: 0.2, message: 'Giảm 20% cho đơn hàng từ 500.000₫' },
        'FREESHIP': { min: 300000, discount: 'freeship', message: 'Miễn phí vận chuyển cho đơn hàng từ 300.000₫' }
    };
    
    if (!couponCode) {
        couponMessage.innerHTML = '<span class="error">Vui lòng nhập mã giảm giá</span>';
        localStorage.removeItem('petoriaAppliedCoupon');
        updateCartSummary();
        return;
    }
    
    if (validCoupons[couponCode]) {
        const coupon = validCoupons[couponCode];
        
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
    
    updateCartSummary();
}

function checkout() {
    const cart = JSON.parse(localStorage.getItem('petoriaCart')) || [];
    
    if (cart.length === 0) {
        showToast('Giỏ hàng của bạn đang trống', 'warning');
        return;
    }
    
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('petoriaCurrentUser'));
    if (!currentUser) {
        showToast('Vui lòng đăng nhập để thanh toán', 'warning');
        openAuthModal('login');
        return;
    }
    
    // Calculate order details
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
    
    // Create order object
    const order = {
        id: 'ORD' + Date.now(),
        userId: currentUser.id,
        userEmail: currentUser.email,
        userName: currentUser.name,
        items: cart,
        subtotal: subtotal,
        shipping: shippingFee,
        discount: discount,
        total: total,
        coupon: appliedCoupon,
        status: 'pending',
        createdAt: new Date().toISOString(),
        shippingAddress: {
            name: currentUser.name,
            phone: currentUser.phone || '',
            address: 'Chưa có địa chỉ'
        },
        paymentMethod: 'cod'
    };
    
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('petoriaOrders')) || [];
    orders.push(order);
    localStorage.setItem('petoriaOrders', JSON.stringify(orders));
    
    // Clear cart and coupon
    localStorage.removeItem('petoriaCart');
    localStorage.removeItem('petoriaAppliedCoupon');
    
    // Show success message
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
    
    // Setup modal event listeners
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
    
    const continueShoppingBtn = modal.querySelector('#continueShoppingBtnModal');
    continueShoppingBtn.addEventListener('click', () => {
        window.location.href = 'products.html';
    });
    
    const viewOrdersBtn = modal.querySelector('#viewOrdersBtnModal');
    viewOrdersBtn.addEventListener('click', () => {
        showToast('Tính năng xem đơn hàng sẽ sớm được cập nhật!', 'info');
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    });
    
    // Update cart display
    loadCartItems();
    updateCartSummary();
    updateCartCount();
}

function loadSuggestedProducts() {
    const suggestedProductsContainer = document.getElementById('suggestedProducts');
    if (!suggestedProductsContainer) return;
    
    const cart = JSON.parse(localStorage.getItem('petoriaCart')) || [];
    if (cart.length === 0) {
        suggestedProductsContainer.style.display = 'none';
        return;
    }
    
    // Get products not in cart
    const suggested = productsData
        .filter(product => !cart.some(item => item.id == product.id))
        .slice(0, 4);
    
    if (suggested.length === 0) {
        suggestedProductsContainer.style.display = 'none';
        return;
    }
    
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

// Initialize cart page
if (window.location.pathname.includes('cart.html')) {
    document.addEventListener('DOMContentLoaded', initCartPage);
}