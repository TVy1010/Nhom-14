function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = 'toast';
    toast.classList.add(type, 'show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('petoriaCart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = totalItems;
    });
}

function addToCart(productId, productName, productPrice, productImage, quantity = 1) {
    let cart = JSON.parse(localStorage.getItem('petoriaCart')) || [];
    
    const existingItem = cart.find(item => item.id == productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: quantity
        });
    }
    
    localStorage.setItem('petoriaCart', JSON.stringify(cart));
    updateCartCount();
    showToast('Đã thêm sản phẩm vào giỏ hàng!', 'success');
    
    document.dispatchEvent(new CustomEvent('cartUpdated'));
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('petoriaCart')) || [];
    cart = cart.filter(item => item.id != productId);
    localStorage.setItem('petoriaCart', JSON.stringify(cart));
    updateCartCount();
    
    document.dispatchEvent(new CustomEvent('cartUpdated'));
}

const productsData = [
    //SẢN PHẨM CHÓ
    {
        id: 1,
        name: "Chó Husky",
        price: 1000000,
        category: "dog",
        type: "dog",
        brand: "",
        rating: 4.5,
        reviews: 1286,
        image: "image/dogs/husky.jpg",
        stock: 10,
        isNew: false,
        isSale: true,
        salePrice: 900000,
        description: "Giống chó Husky thuần chủng.",
        detailedDescription: "<h3>Chó Husky</h3><p>Chó Husky (Siberian Husky) nổi bật với ngoại hình hoang dã giống sói, đôi mắt xanh (hoặc nâu/hai màu) hình quả hạnh nhân quyến rũ, và bộ lông dày 2 lớp chịu lạnh tốt. Chúng là giống chó kéo xe năng động, thông minh nhưng bướng bỉnh, rất hiếu động (thường được gọi vui là 'ngáo'), thích hú thay vì sủa và cần không gian rộng rãi để vận động. </p>",
        specs: {
            "Trọng lượng": "Từ 5kg",
            "Độ tuổi": "Trên 2 tháng tuổi"
        }
    },
    {
        id: 2,
        name: "Chó Alaska",
        price: 900000,
        category: "dog",
        type: "dog",
        brand: "",
        rating: 4.6,
        reviews: 1788,
        image: "image/dogs/Alaska.jpg",
        stock: 14,
        isNew: false,
        isSale: false,
        salePrice: 900000,
        description: "Giống chó Alaska thuần chủng",
        detailedDescription: "<h3>Chó Alaska</h3><p>Chó Alaska (Alaskan Malamute) nổi bật với vóc dáng to lớn, khung xương vững chắc, bộ lông kép dày và xù, cùng sức bền bỉ phi thường của một chú chó kéo xe tuyết. Chúng có đôi tai nhọn, mắt hình hạnh nhân màu nâu/nâu hạt dẻ, đuôi cong ngược trên lưng. Tính cách Alaska thân thiện, thông minh, hiền lành, trung thành tuyệt đối và rất hiếu động. </p>",
        specs: {
            "Trọng lượng": "Từ 4kg",
            "Độ tuổi": "Trên 1 tháng tuổi"
        }
    },
    {
        id: 3,
        name: "Chó Akita",
        price: 999000,
        category: "dog",
        type: "dog",
        brand: "",
        rating: 4.7,
        reviews: 789,
        image: "image/dogs/Akita.jpg",
        stock: 14,
        isNew: false,
        isSale: false,
        salePrice: 999000,
        description: "Giống chó Akita thuần chủng",
        detailedDescription: "<h3>Chó Akita</h3><p>Chó Akita là giống cảnh khuyển vạm vỡ, quý phái từ Nhật Bản, nổi tiếng với sự trung thành tuyệt đối, lòng dũng cảm và bản năng bảo vệ cao. Chúng có thân hình to lớn, bộ lông hai lớp dày dặn, tai dựng đứng và chiếc đuôi cuộn tròn đặc trưng. Akita điềm tĩnh, độc lập, thông minh nhưng khá thận trọng với người lạ. Được mệnh danh là 'Quốc khuyển Nhật Bản'.</p>",
        specs: {
            "Trọng lượng": "Từ 2kg",
            "Độ tuổi": "Trên 1 tháng tuổi"
        }
    },
    {
        id: 4,
        name: "Chó Samonyed",
        price: 989000,
        category: "dog",
        type: "dog",
        brand: "",
        rating: 4.4,
        reviews: 789,
        image: "image/dogs/samonyed.jpg",
        stock: 14,
        isNew: false,
        isSale: false,
        salePrice: 989000,
        description: "Giống chó Samonyed thuần chủng",
        detailedDescription: "<h3>Chó Samonyed</h3><p>Chó Samoyed nổi bật với bộ lông kép dày màu trắng tuyết (hoặc kem/vàng nhạt) có khả năng tự làm sạch, nụ cười 'thương hiệu' thân thiện và tính cách thông minh, trung thành, hiền lành. Chúng là giống chó kéo xe vùng Siberia, năng lượng cao, rất quấn chủ, thích trẻ em nhưng đôi khi khá bướng bỉnh và cần được vận động nhiều. </p>",
        specs: {
            "Trọng lượng": "Từ 1kg",
            "Độ tuổi": "Trên 2 tháng tuổi"
        }
    },
    {
        id: 5,
        name: "Chó Ngao Tây Tạng",
        price: 20000000,
        category: "dog",
        type: "dog",
        brand: "",
        rating: 4.7,
        reviews: 16689,
        image: "image/dogs/Ngao Tây Tạng.jpg",
        stock: 2,
        isNew: true,
        isSale: true,
        salePrice: 1000000,
        description: "Giống chó Ngao Tây Tạng thuần chủng",
        detailedDescription: "<h3>Chó Ngao Tây Tạng</h3><p>Chó Ngao Tây Tạng (Tibetan Mastiff) nổi bật với vóc dáng khổng lồ, cao 70-80cm, nặng 60-90kg, cùng bộ lông kép dày bờm sư tử thích nghi lạnh giá. Chúng nổi tiếng hung dữ, trung thành tuyệt đối với một chủ, bản năng bảo vệ lãnh thổ mạnh mẽ, và thông minh nhưng rất độc lập, bướng bỉnh. </p>",
        specs: {
            "Trọng lượng": "Từ 10kg",
            "Độ tuổi": "Trên 4 tháng tuổi"
        }
    },
    {
        id: 6,
        name: "Thức ăn cho chó Royal Canin",
        price: 250000,
        category: "dog",
        type: "food",
        brand: "royal-canin",
        rating: 4.5,
        reviews: 128234,
        image: "image/food/Thức ăn cho chó Royal Canin.jpg",
        stock: 50,
        isNew: true,
        isSale: true,
        salePrice: 200000,
        description: "Thức ăn cao cấp cho chó trưởng thành, giúp duy trì sức khỏe và năng lượng.",
        detailedDescription: "<h3>Thức ăn cao cấp cho chó trưởng thành</h3><p>Sản phẩm được nghiên cứu đặc biệt cho nhu cầu dinh dưỡng của chó trưởng thành. Với công thức cân bằng giữa protein, vitamin và khoáng chất, giúp chó luôn khỏe mạnh và tràn đầy năng lượng.</p><h4>Đặc điểm nổi bật:</h4><ul><li>Hỗ trợ tiêu hóa tối ưu</li><li>Giúp duy trì cân nặng lý tưởng</li><li>Làm sáng bộ lông</li><li>Tăng cường hệ miễn dịch</li></ul>",
        specs: {
            "Trọng lượng": "5kg",
            "Thành phần": "Protein, Vitamin, Khoáng chất",
            "Hạn sử dụng": "12 tháng"
        }
    },
    //SẢN PHẨM MÈO
    {
        id: 1,
        name: "Mèo Anh Lông Dài",
        price: 1000000,
        category: "cat",
        type: "cat",
        brand: "",
        rating: 4.5,
        reviews: 128,
        image: "image/Cats/Mèo Anh Lông Dài.jpg",
        stock: 15,
        isNew: true,
        isSale: true,
        salePrice: 990000,
        description: "Mèo Anh Lông Dài thuần chủng.",
        detailedDescription: "<h3>Mèo Anh Lông Dài</h3><p>Mèo Anh Lông Dài (British Longhair) nổi bật với ngoại hình quý phái, thân hình mũm mĩm, đầu tròn, mắt to và bộ lông dài, dày, bồng bềnh như những cục bông gòn. Chúng có tính cách hiền lành, điềm tĩnh, quấn chủ, thông minh và thích nghi tốt với cuộc sống căn hộ, là người bạn đồng hành lý tưởng. </p>",
        specs: {
            "Trọng lượng": "Từ 2kg",
            "Độ tuổi": "Trên 1 tuần tuổi."
        }
    },
    {
        id: 2,
        name: "Mèo Anh Lông Ngắn",
        price: 1000000,
        category: "cat",
        type: "cat",
        brand: "",
        rating: 4.7,
        reviews: 1238,
        image: "image/Cats/Mèo Anh Lông Ngắn.jpg",
        stock: 15,
        isNew: false,
        isSale: false,
        salePrice: 1000000,
        description: "Mèo Anh Lông Ngắn thuần chủng.",
        detailedDescription: "<h3>Mèo Anh Lông Ngắn</h3><p>Mèo Anh Lông Ngắn (British Shorthair) nổi bật với ngoại hình mũm mĩm, bộ lông dày mịn, mặt tròn phệ và đôi mắt to tròn (thường màu vàng đồng). Chúng có tính cách điềm tĩnh, tình cảm, quấn chủ nhưng lười vận động. Loài này rất dễ nuôi, thân thiện với trẻ em và thích hợp cho không gian căn hộ. </p>",
        specs: {
            "Trọng lượng": "Từ 2kg",
            "Độ tuổi": "Trên 1 tuần tuổi."
        }
    },
    {
        id: 3,
        name: "Mèo Himalaya",
        price: 1000000,
        category: "cat",
        type: "cat",
        brand: "",
        rating: 4.5,
        reviews: 1284,
        image: "image/Cats/Mèo Himalaya.jpg",
        stock: 25,
        isNew: false,
        isSale: true,
        salePrice: 900000,
        description: "Mèo Himalaya thuần chủng.",
        detailedDescription: "<h3>Mèo Himalaya</h3><p>Mèo Himalaya là giống mèo lai giữa mèo Ba Tư và mèo Xiêm, nổi bật với đôi mắt xanh dương sâu thẳm, bộ lông dài mượt mà (kiểu colorpoint - màu đậm ở mặt, tai, chân, đuôi) và khuôn mặt tịt (brachycephalic). Chúng có tính cách hiền lành, điềm tĩnh, tình cảm, ít vận động, thích nằm trong lòng chủ, rất thông minh nhưng cần được chải lông hàng ngày. </p>",
        specs: {
            "Trọng lượng": "Từ 2kg",
            "Độ tuổi": "Trên 1 tuần tuổi."
        }
    },
    {
        id: 4,
        name: "Mèo Sphynx",
        price: 1000000,
        category: "cat",
        type: "cat",
        brand: "",
        rating: 4.5,
        reviews: 1284,
        image: "image/Cats/Mèo Sphynx.jpg",
        stock: 5,
        isNew: false,
        isSale: false,
        salePrice: 700000,
        description: "Mèo Sphynx thuần chủng. ",
        detailedDescription: "<h3>Mèo Sphynx</h3><p>Mèo Sphynx (mèo nhân sư) nổi bật với ngoại hình không lông (thực tế có lớp tơ mỏng như da đào), làn da nhăn nheo, tai lớn và đôi mắt to biểu cảm. Chúng có cơ thể vạm vỡ, thông minh, cực kỳ tình cảm, thích quấn quýt con người và nổi tiếng với tính cách hiếu động, thân thiện giống như chó. </p>",
        specs: {
            "Trọng lượng": "Từ 2kg",
            "Độ tuổi": "Trên 1 tuần tuổi."
        }
    },
    {
        id: 5,
        name: "Mèo Mướp",
        price: 1000000,
        category: "cat",
        type: "cat",
        brand: "",
        rating: 4.5,
        reviews: 1284,
        image: "image/Cats/Mèo Mướp.jpg",
        stock: 5,
        isNew: false,
        isSale: false,
        salePrice: 700000,
        description: "Mèo Mướp thuần chủng.",
        detailedDescription: "<h3>Mèo Mướp</h3><p>Mèo mướp (tabby cat) là giống mèo phổ biến tại Việt Nam, nổi bật với đặc điểm bộ lông ngắn, dày, có sọc vằn (đen, xám, vàng) giống hổ và dấu chữ M đặc trưng trên trán. Chúng có thân hình nhỏ nhắn, năng động, rất thông minh, giỏi leo trèo và săn chuột. Mèo mướp dễ nuôi, thích tắm nắng, liếm lông và khá độc lập. </p>",
        specs: {
            "Trọng lượng": "Từ 1kg",
            "Độ tuổi": "Trên 3 tuần tuổi."
        }
    },
    {
        id: 6,
        name: "Thức ăn cho mèo Whiskas",
        price: 180000,
        category: "cat",
        type: "food",
        brand: "whiskas",
        rating: 4.3,
        reviews: 156,
        image: "image/food/Thức ăn cho mèo Whiskas.jpg",
        stock: 75,
        isNew: false,
        isSale: false,
        salePrice: 200000,
        description: "Thức ăn hạt cho mèo Whiskas",
        specs: {
            "Trọng lượng": "Từ 1kg",
            "Độ tuổi": "Trên 3 tuần tuổi.",
            "Hạn sử dụng": "12 tháng"
        }
    },
    //SẢN PHẨM THỦY SINH =))
    {
        id: 1,
        name: "Cá Diếc Anh Đào",
        price: 255000,
        category: "fish",
        type: "fish",
        brand: "",
        rating: 4.3,
        reviews: 154,
        image: "image/Fish/Cá diếc anh đào.jpg",
        stock: 1000,
        isNew: false,
        isSale: true,
        salePrice: 250000,
        description: "Cá Diếc Anh Đào",
        detailedDescription: "Cá Diếc Anh Đào (Puntius titteya) nổi bật với màu đỏ hồng rực rỡ (đặc biệt là cá đực trong mùa sinh sản), thân hình thon dài nhỏ nhắn (~5cm) và tính cách ôn hòa, rất thích hợp cho bể thủy sinh. Chúng là loại cá sống theo đàn, dễ nuôi, ăn tạp, phù hợp với người mới chơi và nổi bật với dải sọc ngang màu đen trên thân. ",
        specs: {
            "Số lượng": "10-15 con/Đơn"
        }
    },
    {
        id: 2,
        name: "Cá Neon",
        price: 220000,
        category: "fish",
        type: "fish",
        brand: "",
        rating: 4.7,
        reviews: 123,
        image: "image/Fish/Cá Neon.jpg",
        stock: 1000,
        isNew: false,
        isSale: false,
        salePrice: 220000,
        description: "Cá Neon",
        detailedDescription: "Cá Neon nổi bật với kích thước nhỏ (2-5cm), màu sắc rực rỡ (xanh điện, đỏ/cam) lấp lánh như dạ quang, tạo thành dải màu tuyệt đẹp khi bơi theo đàn. Chúng hiền lành, phù hợp bể thủy sinh, sống tốt ở nước mềm, pH 5-7, nhiệt độ 20-27°C, yêu cầu cao về chất lượng nước ổn định. ",
        specs: {
            "Số lượng": "20-25 con/Đơn"
        }
    },
    {
        id: 3,
        name: "Cá Cầu Vòng",
        price: 220000,
        category: "fish",
        type: "fish",
        brand: "",
        rating: 4.7,
        reviews: 234,
        image: "image/Fish/Cá Cầu Vòng.jpg",
        stock: 1000,
        isNew: false,
        isSale: false,
        salePrice: 220000,
        description: "Cá Neon",
        detailedDescription: "Cá Cầu Vồng (Melanotaeniidae) nổi bật với thân hình thon dài, dẹp bên, ánh kim rực rỡ (xanh, đỏ, vàng) và đôi mắt lớn. Chúng là loài cá bơi đàn hiền lành, dễ chăm sóc, lý tưởng cho hồ thủy sinh. Đặc biệt, cá đực trưởng thành có màu sắc đậm, vây lưng/hậu môn kéo dài thướt tha, rất nổi bật. ",
        specs: {
            "Số lượng": "10-15 con/Đơn"
        }
    },
    {
        id: 4,
        name: "Cá Phượng Hoàng",
        price: 40000,
        category: "fish",
        type: "fish",
        brand: "",
        rating: 4.7,
        reviews: 234,
        image: "image/Fish/Cá Phượng Hoàng.jpg",
        stock: 1000,
        isNew: false,
        isSale: false,
        salePrice: 40000,
        description: "Cá Phượng Hoàng",
        detailedDescription: "Cá Phượng Hoàng (Mikrogeophagus ramirezi) nổi bật với thân hình nhỏ nhắn (4-10 cm), màu sắc rực rỡ óng ánh và bộ vây xòe rộng như cánh phượng. Chúng được ưa chuộng trong thủy sinh nhờ vẻ ngoài kiêu sa, tập tính bơi thành cặp uyển chuyển, và các biến thể màu đỏ, xanh (Blue Ram), ngũ sắc, tượng trưng cho may mắn. ",
        specs: {
            "Số lượng": "2 con/Đơn"
        }
    },
    {
        id: 5,
        name: "Cá Thần Tiên",
        price: 40000,
        category: "fish",
        type: "fish",
        rating: 4.7,
        reviews: 2341,
        image: "image/Fish/Cá Thần Tiên.jpg",
        stock: 1000,
        isNew: false,
        isSale: false,
        salePrice: 40000,
        description: "Cá Thần Tiên",
        detailedDescription: "Cá Thần Tiên (Angelfish) nổi bật với thân hình dẹt, hình đĩa cao với vây lưng và vây hậu môn kéo dài thành hình tam giác, tạo dáng bơi uyển chuyển, chậm rãi như dải lụa. Chúng có nguồn gốc từ lưu vực sông Amazon, màu sắc đa dạng (bạc, vằn, đen, vàng, marble), tuổi thọ cao từ 8-10 năm, là loài ăn tạp, sống theo đàn và rất ưa chuộng trong giới thủy sinh. ",
        specs: {
            "Số lượng": "8 con/Đơn"
        }
    },
    {
        id: 6,
        name: "Thức ăn cho cá cảnh",
        price: 75000,
        category: "fish",
        type: "food",
        rating: 4.1,
        reviews: 236,
        image: "image/food/Thức ăn cho cá cảnh.jpg",
        stock: 1000,
        isNew: false,
        isSale: true,
        salePrice: 40000,
        description: "Thức ăn dạng viên cho cá cảnh, dễ sử dụng"
    },
    //SẢN PHẨM CHIM =)))))))
    {
        id: 1,
        name: "Chim Chào Mào",
        price: 126000,
        category: "bird",
        type: "bird",
        rating: 4.5,
        reviews: 2141,
        image: "image/bird/Chim Chào Mào.jpg",
        stock: 20,
        isNew: false,
        isSale: true,
        salePrice: 400000,
        description: "Chim Chào Mào",
        detailedDescription: "Chim Chào Mào (Red-whiskered Bulbul) là loài chim cảnh phổ biến với đặc điểm nhận diện nổi bật là chiếc mào đen cao, nhọn dựng đứng trên đầu, hai bên má trắng có vệt đỏ rực rỡ, bụng trắng và lông hậu môn màu đỏ. Chúng có kích thước nhỏ gọn (18-22 cm), mỏ nhọn cứng, tiếng hót líu lo, hoạt bát và rất hiếu chiến khi đấu. ",
    },
    {
        id: 2,
        name: "Chim Chích Chòe",
        price: 300000,
        category: "bird",
        type: "bird",
        rating: 4.5,
        reviews: 1141,
        image: "image/bird/Chim Chích Chòe.jpg",
        stock: 30,
        isNew: false,
        isSale: true,
        salePrice: 260000,
        description: "Chim Chích Chòe",
        detailedDescription: "Chim chích chòe là loài chim cảnh nhỏ, thông minh, nổi bật với bộ lông đen-trắng (hoặc nâu), giọng hót hay, vang và khả năng bắt chước âm thanh tốt. Chúng thường có đuôi dài, điệu bộ linh hoạt, đuôi hay dựng đứng hoặc múa đuôi duyên dáng, rất được ưa chuộng nuôi hót và làm cảnh. ",
    },
    {
        id: 3,
        name: "Chim Cu Gáy",
        price: 500000,
        category: "bird",
        type: "bird",
        rating: 4.5,
        reviews: 1231,
        image: "image/bird/Chim Cu Gáy.jpg",
        stock: 35,
        isNew: false,
        isSale: true,
        salePrice: 490000,
        description: "Chim Cu Gáy",
        detailedDescription: "Chim cu gáy là loài chim cảnh phổ biến ở Việt Nam, nổi bật với tiếng gáy trầm ấm ('cục cú cu') và vòng cườm trắng đen đặc trưng quanh cổ. Chúng có thân hình nhỏ gọn (khoảng 30cm), bộ lông màu nâu xám, mắt đỏ/cam và tập tính sống chung thủy từng đôi. Cu gáy được ưa chuộng nhờ giọng gáy vang, thường ăn các loại hạt nhỏ và dễ thuần hóa. ",
    },
    {
        id: 4,
        name: "Chim Hút Mật",
        price: 750000,
        category: "bird",
        type: "bird",
        rating: 4.5,
        reviews: 451,
        image: "image/bird/Chim Hút Mật.jpg",
        stock: 15,
        isNew: false,
        isSale: true,
        salePrice: 700000,
        description: "Chim Hút Mật",
        detailedDescription: "Chim hút mật (Nectariniidae) nổi bật với kích thước nhỏ (10-20cm), bộ lông rực rỡ óng ánh và khả năng bay lượn siêu việt. Chúng có mỏ dài, mỏng, cong xuống và lưỡi hình ống chuyên hóa để hút mật hoa, đôi khi ăn côn trùng nhỏ. Chúng hoạt động nhanh nhẹn, có thể đứng yên trên không trung để lấy mật. ",
    },
    {
        id: 5,
        name: "Chim Vẹt",
        price: 400000,
        category: "bird",
        type: "bird",
        rating: 4.7,
        reviews: 401,
        image: "image/bird/Chim Vẹt.jpg",
        stock: 25,
        isNew: false,
        isSale: true,
        salePrice: 380000,
        description: "Chim Vẹt",
        detailedDescription: "Chim Vẹt nổi bật với trí thông minh cao, khả năng bắt chước tiếng người và âm thanh xuất sắc, cùng bộ lông rực rỡ, đa sắc màu. Chúng sở hữu chiếc mỏ cong cứng chắc để ăn hạt/trái cây, đôi chân khỏe để leo trèo, và tập tính xã hội cao, thường sống theo đàn. Vẹt là loài chim nhiệt đới phổ biến, sống trong hốc cây và rất thân thiện với con người. ",
    },
    {
        id: 6,
        name: "Thức Ăn Cho Chim",
        price: 400000,
        category: "bird",
        type: "food",
        rating: 4.7,
        reviews: 4401,
        image: "image/food/Thức Ăn Cho Chim.jpg",
        stock: 25,
        isNew: false,
        isSale: true,
        salePrice: 380000,
        description: "Thức Ăn Cho Chim",
        specs: {
            "Trọng lượng": "800g",
            "Thành phần": "Protein, Vitamin",
            "Cách bảo quản": "Để ở nơi khô ráo, tránh ánh sáng trực tiếp",
            "Hạn sử dụng": "2 năm"
        }
    },
    //PHỤ KIỆN
    {
        id: 1,
        name: "Bàn Chải lông Mèo",
        price: 75000,
        category: "cat",
        type: "accessory",
        brand: "",
        rating: 4.2,
        reviews: 3400,
        image: "image/Khác/Bàn chải chải lông mèo.jpg",
        stock: 100,
        isNew: false,
        isSale: false,
        salePrice: 75000,
        description: "Bàn chải chải lông mèo"
    },
    {
        id: 2,
        name: "Bể Cá Thuỷ Sinh",
        price: 400000,
        category: "fish",
        type: "accessory",
        rating: 4.1,
        reviews: 4401,
        image: "image/Khác/Bể cá thuỷ sinh 50cm.jpg",
        stock: 100,
        isNew: false,
        isSale: true,
        salePrice: 380000,
        description: "Bể cá thuỷ sinh 50cm",
    },
    {
        id: 3,
        name: "Bộ Lọc Nước Cho Bể Cá",
        price: 500000,
        category: "fish",
        type: "accessory",
        rating: 4.1,
        reviews: 1344,
        image: "image/Khác/Bộ lọc nước cho bể cá.jpg",
        stock: 100,
        isNew: false,
        isSale: true,
        salePrice: 490000,
        description: "Bộ lọc nước cho bể cá",
    },
    {
        id: 4,
        name: "Cát Vệ Sinh Cho Mèo",
        price: 500000,
        category: "cat",
        type: "accessory",
        rating: 4.1,
        reviews: 1344,
        image: "image/Khác/Cát vệ sinh cho mèo.jpg",
        stock: 100,
        isNew: false,
        isSale: true,
        salePrice: 490000,
        description: "Bộ lọc nước cho bể cá",
    },
    {
        id: 5,
        name: "Vòng cổ chó điều khiển từ xa",
        price: 50000,
        category: "dog",
        type: "accessory",
        rating: 4.7,
        reviews: 13434,
        image: "image/Khác/Vòng cổ chó điều khiển từ xa.jpg",
        stock: 100,
        isNew: false,
        isSale: true,
        salePrice: 49000,
        description: "Vòng cổ chó điều khiển từ xa",
    },
    {
        id: 6,
        name: "Lồng Chim Bằng Mây",
        price: 39900,
        category: "bird",
        type: "accessory",
        rating: 4.6,
        reviews: 1994,
        image: "image/Khác/Lồng chim bằng mây.jpg",
        stock: 100,
        isNew: false,
        isSale: false,
        salePrice: 39900,
        description: "Lồng chim bằng mây",
    },
    {
        id: 7,
        name: "Máng Ăn Cho Chim",
        price: 24900,
        category: "bird",
        type: "accessory",
        rating: 4.6,
        reviews: 1994,
        image: "image/Khác/Máng ăn cho chim.jpg",
        stock: 100,
        isNew: false,
        isSale: false,
        salePrice: 24900,
        description: "Máng ăn cho chim",
    },
    //ĐỒ CHƠI
    {
        id: 2,
        name: "Đồ Chơi Xương Cho Chó",
        price: 39000,
        category: "dog",
        type: "toy",
        rating: 4.6,
        reviews: 1994,
        image: "image/Khác/Đồ chơi xương cho chó.jpg",
        stock: 100,
        isNew: false,
        isSale: false,
        salePrice: 39000,
        description: "Đồ Chơi Xương Cho Chó",
    },
    {
        id: 1,
        name: "Cầu Vồng Cho Mèo",
        price: 500000,
        category: "cat",
        type: "toy",
        rating: 4.6,
        reviews: 1994,
        image: "image/Khác/Cầu vồng cho mèo.jpg",
        stock: 100,
        isNew: false,
        isSale: true,
        salePrice: 490000,
        description: "Cầu vồng cho mèo",
    },
    
    
];

function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    let html = '';
    productsData.slice(0, 8).forEach(product => {
        const isOnSale = product.isSale && product.salePrice;
        const currentPrice = isOnSale ? product.salePrice : product.price;
        const oldPrice = isOnSale ? product.price : null;
        const discount = isOnSale ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
        
        html += `
            <div class="product-card" data-id="${product.id}" data-category="${product.category}" data-type="${product.type}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-badges">
                        ${product.isNew ? '<span class="badge new">Mới</span>' : ''}
                        ${isOnSale ? '<span class="badge sale">Giảm ' + discount + '%</span>' : ''}
                    </div>
                </div>
                <div class="product-info">
                    <h3><a href="#" onclick="viewProduct(${product.id})">${product.name}</a></h3>
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
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="addToCart(${product.id}, '${product.name}', ${currentPrice}, '${product.image}')">
                            <i class="fas fa-cart-plus"></i> Thêm vào giỏ
                        </button>
                        <button class="btn btn-outline" onclick="viewProduct(${product.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function filterFeaturedProducts(filter) {
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        switch(filter) {
            case 'all':
                product.style.display = 'block';
                break;
            case 'best':
                const reviews = parseInt(product.querySelector('.review-count').textContent.replace(/[()]/g, ''));
                product.style.display = reviews > 100 ? 'block' : 'none';
                break;
            case 'new':
                const hasNewBadge = product.querySelector('.badge.new');
                product.style.display = hasNewBadge ? 'block' : 'none';
                break;
            case 'sale':
                const hasSaleBadge = product.querySelector('.badge.sale');
                product.style.display = hasSaleBadge ? 'block' : 'none';
                break;
        }
    });
}

function viewProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

function getCategoryName(category) {
    const categories = {
        'dog': 'Chó',
        'cat': 'Mèo',
        'fish': 'Thủy sinh',
        'bird': 'Chim',
        'smallpet': 'Thú nhỏ'
    };
    return categories[category] || category;
}

function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileNav.classList.toggle('show');
        });
        
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.mobile-menu-btn') && !event.target.closest('.mobile-nav')) {
                mobileNav.classList.remove('show');
            }
        });
    }
    
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
        
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') performSearch();
        });
    }
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `products.html?search=${encodeURIComponent(query)}`;
        }
    }
    
    const accountBtn = document.getElementById('accountBtn');
    const accountDropdown = document.getElementById('accountDropdown');
    
    if (accountBtn && accountDropdown) {
        accountBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            accountDropdown.classList.toggle('show');
        });
        
        document.addEventListener('click', function() {
            accountDropdown.classList.remove('show');
        });
    }
    
    const currentUser = JSON.parse(localStorage.getItem('petoriaCurrentUser'));
    const accountText = document.getElementById('accountText');
    const dropdownHeader = document.getElementById('dropdownHeader');
    const dropdownContent = document.getElementById('dropdownContent');
    
    if (currentUser) {
        if (accountText) accountText.textContent = currentUser.name;
        
        if (dropdownHeader) {
            dropdownHeader.innerHTML = `
                <p>Xin chào, <strong>${currentUser.name}</strong></p>
                <small>${currentUser.email}</small>
            `;
        }
        
        if (dropdownContent) {
            dropdownContent.innerHTML = `
                <a href="#"><i class="fas fa-user-circle"></i> Tài khoản của tôi</a>
                <a href="#"><i class="fas fa-shopping-bag"></i> Đơn hàng của tôi</a>
                <a href="#"><i class="fas fa-heart"></i> Sản phẩm yêu thích</a>
                <a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Đăng xuất</a>
            `;
            
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    localStorage.removeItem('petoriaCurrentUser');
                    location.reload();
                });
            }
        }
    } else {
        if (dropdownContent) {
            dropdownContent.innerHTML = `
                <a href="#" id="dropdownLoginBtn"><i class="fas fa-sign-in-alt"></i> Đăng nhập</a>
                <a href="#" id="dropdownRegisterBtn"><i class="fas fa-user-plus"></i> Đăng ký</a>
            `;
            
            const loginBtn = document.getElementById('dropdownLoginBtn');
            const registerBtn = document.getElementById('dropdownRegisterBtn');
            
            if (loginBtn) {
                loginBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    openAuthModal('login');
                });
            }
            
            if (registerBtn) {
                registerBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    openAuthModal('register');
                });
            }
        }
    }
    
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    const mobileRegisterBtn = document.getElementById('mobileRegisterBtn');
    
    if (mobileLoginBtn) {
        mobileLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openAuthModal('login');
        });
    }
    
    if (mobileRegisterBtn) {
        mobileRegisterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openAuthModal('register');
        });
    }
});

if (window.location.pathname.includes('product-detail.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        
        if (productId) {
            loadProductDetail(productId);
        }
    });
    
    function loadProductDetail(productId) {
        const product = productsData.find(p => p.id === productId);
        if (!product) {
            window.location.href = 'products.html';
            return;
        }
        
        const productCategory = document.getElementById('productCategory');
        const productName = document.getElementById('productName');
        if (productCategory) productCategory.textContent = getCategoryName(product.category);
        if (productName) productName.textContent = product.name;
        
        const mainImage = document.getElementById('productMainImage');
        const thumbnailImages = document.getElementById('thumbnailImages');
        if (mainImage) {
            mainImage.src = product.image;
            mainImage.alt = product.name;
        }
        
        if (thumbnailImages) {
            for (let i = 0; i < 4; i++) {
                const img = document.createElement('img');
                img.src = product.image;
                img.alt = `${product.name} - ảnh ${i + 1}`;
                if (i === 0) img.classList.add('active');
                img.addEventListener('click', function() {
                    if (mainImage) {
                        mainImage.src = this.src;
                        mainImage.alt = this.alt;
                        document.querySelectorAll('.thumbnail-images img').forEach(img => img.classList.remove('active'));
                        this.classList.add('active');
                    }
                });
                thumbnailImages.appendChild(img);
            }
        }
        
        const newBadge = document.getElementById('newBadge');
        const saleBadge = document.getElementById('saleBadge');
        if (newBadge) newBadge.style.display = product.isNew ? 'block' : 'none';
        if (saleBadge) saleBadge.style.display = product.isSale ? 'block' : 'none';
        
        const productTitle = document.getElementById('productTitle');
        const productCategoryText = document.getElementById('productCategoryText');
        const productRating = document.getElementById('productRating');
        const productReviews = document.getElementById('productReviews');
        const productStock = document.getElementById('productStock');
        
        if (productTitle) productTitle.textContent = product.name;
        if (productCategoryText) productCategoryText.textContent = getCategoryName(product.category);
        if (productRating) productRating.innerHTML = generateStars(product.rating);
        if (productReviews) productReviews.textContent = `(${product.reviews} đánh giá)`;
        if (productStock) {
            productStock.textContent = product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng';
        }
        
        const isOnSale = product.isSale && product.salePrice;
        const currentPrice = isOnSale ? product.salePrice : product.price;
        const oldPrice = isOnSale ? product.price : null;
        const discount = isOnSale ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
        
        const productPrice = document.getElementById('productPrice');
        const productOldPrice = document.getElementById('productOldPrice');
        const discountBadge = document.getElementById('discountBadge');
        
        if (productPrice) productPrice.textContent = `${formatPrice(currentPrice)}₫`;
        if (productOldPrice) {
            productOldPrice.textContent = oldPrice ? `${formatPrice(oldPrice)}₫` : '';
            productOldPrice.style.display = oldPrice ? 'block' : 'none';
        }
        if (discountBadge) {
            if (discount > 0) {
                discountBadge.textContent = `-${discount}%`;
                discountBadge.style.display = 'block';
            } else {
                discountBadge.style.display = 'none';
            }
        }
        
        const productDescription = document.getElementById('productDescription');
        const detailedDescription = document.getElementById('detailedDescription');
        if (productDescription) productDescription.textContent = product.description;
        if (detailedDescription && product.detailedDescription) {
            detailedDescription.innerHTML = product.detailedDescription;
        }
        
        const productSpecs = document.getElementById('productSpecs');
        const specsTable = document.getElementById('specsTable');
        
        if (productSpecs && product.specs) {
            let specsHtml = '';
            for (const [key, value] of Object.entries(product.specs)) {
                specsHtml += `
                    <div class="spec-item">
                        <span class="spec-label">${key}:</span>
                        <span class="spec-value">${value}</span>
                    </div>
                `;
            }
            productSpecs.innerHTML = specsHtml;
        }
        
        if (specsTable && product.specs) {
            let tableHtml = '';
            for (const [key, value] of Object.entries(product.specs)) {
                tableHtml += `
                    <tr>
                        <td><strong>${key}</strong></td>
                        <td>${value}</td>
                    </tr>
                `;
            }
            specsTable.innerHTML = tableHtml;
        }
        
        const addToCartBtn = document.getElementById('addToCartBtn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                const quantity = parseInt(document.querySelector('.quantity-input').value) || 1;
                addToCart(product.id, product.name, currentPrice, product.image, quantity);
            });
        }
        
        const buyNowBtn = document.getElementById('buyNowBtn');
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', function() {
                const quantity = parseInt(document.querySelector('.quantity-input').value) || 1;
                addToCart(product.id, product.name, currentPrice, product.image, quantity);
                window.location.href = 'cart.html';
            });
        }
        
        const wishlistBtn = document.getElementById('wishlistBtn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', function() {
                const icon = this.querySelector('i');
                if (icon.classList.contains('far')) {
                    icon.className = 'fas fa-heart';
                    showToast('Đã thêm vào danh sách yêu thích!', 'success');
                } else {
                    icon.className = 'far fa-heart';
                    showToast('Đã xóa khỏi danh sách yêu thích!', 'info');
                }
            });
        }
        
        const quantityMinus = document.querySelector('.quantity-btn.minus');
        const quantityPlus = document.querySelector('.quantity-btn.plus');
        const quantityInput = document.querySelector('.quantity-input');
        
        if (quantityMinus && quantityPlus && quantityInput) {
            quantityMinus.addEventListener('click', function() {
                let value = parseInt(quantityInput.value) || 1;
                if (value > 1) {
                    quantityInput.value = value - 1;
                }
            });
            
            quantityPlus.addEventListener('click', function() {
                let value = parseInt(quantityInput.value) || 1;
                if (value < 50) {
                    quantityInput.value = value + 1;
                }
            });
            
            quantityInput.addEventListener('change', function() {
                let value = parseInt(this.value) || 1;
                if (value < 1) this.value = 1;
                if (value > 50) this.value = 50;
            });
        }
        
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                tabPanes.forEach(pane => {
                    pane.classList.remove('active');
                    if (pane.id === tabId) {
                        pane.classList.add('active');
                    }
                });
            });
        });
        
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const item = this.parentElement;
                item.classList.toggle('active');
            });
        });
        
        setupReviews(product.rating, product.reviews);
        
        loadRelatedProducts(product.category, product.id);
    }
    
    function setupReviews(averageRating, totalReviews) {
        const averageRatingElement = document.getElementById('averageRating');
        const totalReviewsElement = document.getElementById('totalReviews');
        
        if (averageRatingElement) averageRatingElement.textContent = averageRating.toFixed(1);
        if (totalReviewsElement) totalReviewsElement.textContent = `${totalReviews} đánh giá`;
        
        const stars = document.querySelectorAll('.star-rating i');
        let selectedRating = 0;
        
        stars.forEach(star => {
            star.addEventListener('mouseenter', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                highlightStars(rating);
            });
            
            star.addEventListener('mouseleave', function() {
                highlightStars(selectedRating);
            });
            
            star.addEventListener('click', function() {
                selectedRating = parseInt(this.getAttribute('data-rating'));
                highlightStars(selectedRating);
            });
        });
        
        function highlightStars(rating) {
            stars.forEach((star, index) => {
                if (index < rating) {
                    star.className = 'fas fa-star';
                } else {
                    star.className = 'far fa-star';
                }
            });
        }
        
        const reviewForm = document.getElementById('reviewForm');
        if (reviewForm) {
            reviewForm.addEventListener('submit', function(e) {
                e.preventDefault();
                if (selectedRating === 0) {
                    showToast('Vui lòng chọn số sao đánh giá!', 'warning');
                    return;
                }
                
                const reviewText = this.querySelector('textarea').value.trim();
                if (!reviewText) {
                    showToast('Vui lòng nhập nội dung đánh giá!', 'warning');
                    return;
                }
                
                showToast('Cảm ơn bạn đã đánh giá sản phẩm!', 'success');
                this.reset();
                selectedRating = 0;
                highlightStars(0);
            });
        }
    }
    
    function loadRelatedProducts(category, currentProductId) {
        const relatedProductsContainer = document.getElementById('relatedProducts');
        const recentlyViewedContainer = document.getElementById('recentlyViewed');
        
        if (relatedProductsContainer) {
            const related = productsData.filter(p => p.category === category && p.id !== currentProductId).slice(0, 4);
            let html = '';
            
            related.forEach(product => {
                const isOnSale = product.isSale && product.salePrice;
                const currentPrice = isOnSale ? product.salePrice : product.price;
                
                html += `
                    <div class="product-card">
                        <div class="product-image">
                            <img src="${product.image}" alt="${product.name}">
                            ${product.isNew ? '<span class="badge new">Mới</span>' : ''}
                        </div>
                        <div class="product-info">
                            <h3><a href="#" onclick="viewProduct(${product.id})">${product.name}</a></h3>
                            <div class="product-price">
                                <span class="current-price">${formatPrice(currentPrice)}₫</span>
                            </div>
                            <button class="btn btn-primary" onclick="addToCart(${product.id}, '${product.name}', ${currentPrice}, '${product.image}')">
                                <i class="fas fa-cart-plus"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            
            relatedProductsContainer.innerHTML = html;
        }
        
        if (recentlyViewedContainer) {
            const recentlyViewed = productsData.filter(p => p.id !== currentProductId).slice(0, 4);
            let html = '';
            
            recentlyViewed.forEach(product => {
                const isOnSale = product.isSale && product.salePrice;
                const currentPrice = isOnSale ? product.salePrice : product.price;
                
                html += `
                    <div class="product-card">
                        <div class="product-image">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="product-info">
                            <h3><a href="#" onclick="viewProduct(${product.id})">${product.name}</a></h3>
                            <div class="product-price">
                                <span class="current-price">${formatPrice(currentPrice)}₫</span>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            recentlyViewedContainer.innerHTML = html;
        }
    }
}