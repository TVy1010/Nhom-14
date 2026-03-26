// Hàm khởi tạo trang sản phẩm, xử lý tìm kiếm và lọc theo danh mục từ URL
function initProductsPage() {
    loadAllProducts(); // Tải tất cả sản phẩm
    loadFeaturedSidebar(); // Tải sản phẩm nổi bật ở sidebar
    
    const urlParams = new URLSearchParams(window.location.search); // Lấy tham số từ URL
    const searchQuery = urlParams.get('search'); // Lấy từ khóa tìm kiếm
    const category = urlParams.get('category'); // Lấy danh mục
    
    if (searchQuery) {
        searchProducts(searchQuery); // Tìm kiếm sản phẩm nếu có từ khóa
        document.getElementById('searchInput').value = searchQuery; // Điền từ khóa vào ô tìm kiếm
    }
    
    if (category) {
        const categoryCheckbox = document.querySelector(`.filter-chip[data-category="${category}"]`);
        if (categoryCheckbox) {
            categoryCheckbox.click(); // Click vào chip lọc danh mục
            applyFilters(); // Áp dụng bộ lọc
        }
    }
}

// Hàm tải và hiển thị tất cả sản phẩm lên trang
function loadAllProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    let html = '';
    productsData.forEach(product => {
        html += createProductCard(product); // Tạo HTML cho từng sản phẩm
    });
    
    productsGrid.innerHTML = html; // Gán HTML vào grid sản phẩm
    updateProductsCount(productsData.length); // Cập nhật số lượng sản phẩm
}

// Hàm tải sản phẩm nổi bật ở sidebar (3 sản phẩm có đánh giá cao nhất)
function loadFeaturedSidebar() {
    const sidebarFeatured = document.getElementById('sidebarFeatured');
    if (!sidebarFeatured) return;
    
    const featured = [...productsData]
        .sort((a, b) => b.rating - a.rating) // Sắp xếp theo rating giảm dần
        .slice(0, 3); // Lấy 3 sản phẩm đầu
    
    let html = '';
    featured.forEach(product => {
        const isOnSale = product.isSale && product.salePrice;
        const currentPrice = isOnSale ? product.salePrice : product.price;
        
        html += `
            <div class="featured-item">
                <img src="${product.image}" alt="${product.name}">
                <div class="featured-info">
                    <h4>${product.name}</h4>
                    <div class="featured-price">${formatPrice(currentPrice)}₫</div>
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id}, '${product.name}', ${currentPrice}, '${product.image}')">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    sidebarFeatured.innerHTML = html; // Gán HTML vào sidebar
}

// Hàm tạo HTML cho một thẻ sản phẩm
function createProductCard(product) {
    const isOnSale = product.isSale && product.salePrice; // Kiểm tra có giảm giá không
    const currentPrice = isOnSale ? product.salePrice : product.price; // Giá hiện tại
    const oldPrice = isOnSale ? product.price : null; // Giá cũ
    const discount = isOnSale ? Math.round((1 - product.salePrice / product.price) * 100) : 0; // Phần trăm giảm giá
    
    return `
        <div class="product-card" data-id="${product.id}" data-category="${product.category}" 
             data-type="${product.type}" data-brand="${product.brand}" data-price="${currentPrice}" 
             data-rating="${product.rating}" data-stock="${product.stock}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-badges">
                    ${product.isNew ? '<span class="badge new">Mới</span>' : ''}
                    ${isOnSale ? '<span class="badge sale">Giảm ' + discount + '%</span>' : ''}
                    ${product.stock < 10 ? '<span class="badge hot">Sắp hết</span>' : ''}
                </div>
            </div>
            <div class="product-info">
                <h3><a href="product-detail.html?id=${product.id}">${product.name}</a></h3>
                <div class="product-category">${getCategoryName(product.category)}</div>
                <div class="product-price">
                    <span class="current-price">${formatPrice(currentPrice)}₫</span>
                    ${oldPrice ? `<span class="old-price">${formatPrice(oldPrice)}₫</span>` : ''}
                </div>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span class="review-count">(${product.reviews})</span>
                </div>
                <div class="product-stock">
                    <i class="fas fa-check-circle" style="color: ${product.stock > 0 ? 'var(--success-color)' : 'var(--danger-color)'};"></i>
                    <span>${product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}</span>
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="addToCart(${product.id}, '${product.name}', ${currentPrice}, '${product.image}')">
                        <i class="fas fa-cart-plus"></i> Thêm vào giỏ
                    </button>
                    <button class="btn btn-outline" onclick="window.location.href='product-detail.html?id=${product.id}'">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-icon" onclick="toggleWishlist(${product.id})">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Hàm tìm kiếm sản phẩm theo từ khóa (tên, mô tả, danh mục)
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    const filteredProducts = productsData.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        getCategoryName(product.category).toLowerCase().includes(searchTerm)
    );
    
    renderFilteredProducts(filteredProducts); // Hiển thị kết quả tìm kiếm
}

// Hàm lọc sản phẩm theo nhiều tiêu chí (danh mục, loại, giá, thương hiệu, đánh giá)
function filterProducts(filters) {
    let filteredProducts = [...productsData];
    
    // Lọc theo danh mục (chó, mèo, thủy sinh, chim)
    if (filters.categories && !filters.categories.includes('all')) {
        filteredProducts = filteredProducts.filter(product =>
            filters.categories.includes(product.category)
        );
    }
    
    // Lọc theo loại sản phẩm (thú cưng, thức ăn, phụ kiện, đồ chơi)
    if (filters.types && !filters.types.includes('all')) {
        filteredProducts = filteredProducts.filter(product =>
            filters.types.includes(product.type)
        );
    }
    
    // Lọc theo khoảng giá
    if (filters.priceRange) {
        const [minPrice, maxPrice] = filters.priceRange;
        filteredProducts = filteredProducts.filter(product => {
            const currentPrice = product.isSale && product.salePrice ? product.salePrice : product.price;
            return currentPrice >= minPrice && currentPrice <= maxPrice;
        });
    }
    
    // Lọc theo thương hiệu
    if (filters.brands && filters.brands.length > 0) {
        filteredProducts = filteredProducts.filter(product =>
            filters.brands.includes(product.brand)
        );
    }
    
    // Lọc theo số sao đánh giá
    if (filters.rating) {
        const minRating = parseFloat(filters.rating);
        filteredProducts = filteredProducts.filter(product =>
            product.rating >= minRating
        );
    }
    
    renderFilteredProducts(filteredProducts); // Hiển thị sản phẩm đã lọc
}

// Hàm sắp xếp danh sách sản phẩm theo các tiêu chí khác nhau
function sortProductsList(sortBy) {
    let sortedProducts = [...productsData];
    
    switch(sortBy) {
        case 'price-asc': // Giá tăng dần
            sortedProducts.sort((a, b) => {
                const priceA = a.isSale && a.salePrice ? a.salePrice : a.price;
                const priceB = b.isSale && b.salePrice ? b.salePrice : b.price;
                return priceA - priceB;
            });
            break;
        case 'price-desc': // Giá giảm dần
            sortedProducts.sort((a, b) => {
                const priceA = a.isSale && a.salePrice ? a.salePrice : a.price;
                const priceB = b.isSale && b.salePrice ? b.salePrice : b.price;
                return priceB - priceA;
            });
            break;
        case 'name-asc': // Tên A-Z
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
            break;
        case 'name-desc': // Tên Z-A
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name, 'vi'));
            break;
        case 'newest': // Mới nhất (theo ID)
            sortedProducts.sort((a, b) => b.id - a.id);
            break;
        case 'popular': // Phổ biến (theo số lượng đánh giá)
            sortedProducts.sort((a, b) => b.reviews - a.reviews);
            break;
    }
    
    renderFilteredProducts(sortedProducts); // Hiển thị sản phẩm đã sắp xếp
}

// Hàm hiển thị danh sách sản phẩm đã được lọc/sắp xếp
function renderFilteredProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    if (products.length === 0) {
        // Hiển thị thông báo khi không có sản phẩm
        productsGrid.innerHTML = `
            <div class="no-products" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-search" style="font-size: 48px; color: var(--gray-color); margin-bottom: 20px;"></i>
                <h3>Không tìm thấy sản phẩm nào</h3>
                <p>Hãy thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc</p>
                <button class="btn btn-primary" onclick="resetFilters()">Xóa tất cả bộ lọc</button>
            </div>
        `;
    } else {
        let html = '';
        products.forEach(product => {
            html += createProductCard(product); // Tạo HTML cho từng sản phẩm
        });
        productsGrid.innerHTML = html;
    }
    
    updateProductsCount(products.length); // Cập nhật số lượng sản phẩm hiển thị
}

// Hàm cập nhật số lượng sản phẩm đang hiển thị
function updateProductsCount(count) {
    const productsCount = document.getElementById('productsCount');
    if (productsCount) {
        productsCount.innerHTML = `Hiển thị <span>${count}</span> sản phẩm`;
    }
}

// Hàm thêm/xóa sản phẩm khỏi danh sách yêu thích (wishlist)
function toggleWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('petoriaWishlist')) || [];
    const index = wishlist.indexOf(productId);
    
    if (index === -1) {
        wishlist.push(productId); // Thêm vào wishlist
        showToast('Đã thêm vào danh sách yêu thích!', 'success');
    } else {
        wishlist.splice(index, 1); // Xóa khỏi wishlist
        showToast('Đã xóa khỏi danh sách yêu thích!', 'info');
    }
    
    localStorage.setItem('petoriaWishlist', JSON.stringify(wishlist)); // Lưu lại
    
    // Cập nhật icon trái tim
    const heartIcon = event.target.closest('button').querySelector('i');
    if (heartIcon) {
        if (index === -1) {
            heartIcon.className = 'fas fa-heart';
            heartIcon.style.color = 'var(--danger-color)';
        } else {
            heartIcon.className = 'far fa-heart';
            heartIcon.style.color = '';
        }
    }
}

// Kiểm tra nếu đang ở trang products.html thì khởi tạo trang sản phẩm
if (window.location.pathname.includes('products.html')) {
    document.addEventListener('DOMContentLoaded', initProductsPage);
}