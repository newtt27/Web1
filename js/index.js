let cart = document.querySelector('.cart');
let iconCart = document.querySelector('.cart-icon');
let closeCart = document.querySelector('.close');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.addedToCart');
let content = document.querySelector('.content');
const filter_icon = document.getElementById('filter-icon');

let carts = [];
//Sự kiện khi click vào nút lọc thì sẽ show ra bảng chọn hãng và nút tìm kiếm
filter_icon.addEventListener('click', ()=>{
    const Selectedandbtn = document.getElementById('Selectedandbtn');
    const filter_btn = document.getElementById('Timkiem');
    Selectedandbtn.classList.toggle('show');
    filter_btn.classList.toggle('show');
})

//Sự kiện mở giỏ hàng khi click vào icon giỏ hàng
iconCart.addEventListener('click', () => {
    cart.classList.toggle('showCart');
})
closeCart.addEventListener('click', () => {
    cart.classList.toggle('showCart');
})

//Lọc sản phẩm
function filterProductsByBrand(listProductscopied) {
    const searchButton = document.getElementById('Timkiem');
    searchButton.addEventListener('click', function() {
        const brandSelect = document.getElementById('brandid');
        const minprice = document.getElementById('From');
        const maxprice = document.getElementById('To');
        const filt_Search = document.getElementById('filt_search');
        
        listProducts = listProductscopied;
        
        const selectedBrand = brandSelect.value;
        if(isNumeberInput(minprice.value) && isNumeberInput(maxprice.value) && isValidProductName(filt_Search.value)){
            const minPrice = parseFloat((minprice.value).split('.').join(""));
            const maxPrice = parseFloat((maxprice.value).split('.').join(""));
            const search = filt_Search.value;
            const filteredProducts = listProductscopied.filter(product => {
                let productpriceString = product.price;
                let price = productpriceString.split('.').join("");
                const isBrandMatched = selectedBrand === '0' || product.brand === selectedBrand;
                const isPriceMatched = (isNaN(minPrice) || parseFloat(price) >= minPrice) && (isNaN(maxPrice) || parseFloat(price) <= maxPrice);
                const isNameMatched = search === '' || product.name.toLowerCase().includes(search.toLowerCase());
                return isBrandMatched && isNameMatched && isPriceMatched;   
            });
          listProducts = filteredProducts;
          currentpage = 1;
          addDatatoHTML();
          updatePagination();
        }
        else{
            alert("Xin hãy kiểm tra lại khoảng giá chỉ chứa số và tên sản phẩm không chứa kí tự đặc biệt")
        }   
    });
}
//Tìm kiếm sản phẩm
function Searching() {
    let search_icon = document.getElementById('search_icon');
    listProductscopied = listProducts;
    search_icon.addEventListener('click', () => {
        let search_input = document.getElementById('search_input').value;
        if (search_input.trim() === '' || !isValidSeachInput(search_input)) {
            var searching_products = listProducts;  
            alert('Hãy nhập hãng bạn muốn tìm và không sử dụng kí tự đặc biệt');
            //Khi dữ liệu bằng rỗng thì sẽ load lại tất cả sản phẩm
            addDatatoHTML();
            updatePagination();
        } else {
            var searching_products = listProducts.filter(product =>{
                return product.name.toLowerCase().includes(search_input.toLowerCase());
            });
            if(searching_products.length == 0){
                alert('Sản phẩm bạn tìm kiếm không tồn tại')
            }
            else{
                listProducts = searching_products;
                currentpage = 1;
                addDatatoHTML();
                updatePagination();
                listProducts = listProductscopied;
            }
            
        }
    });
}
//Tìm kiếm phân trang
function filternav_2(){
    const divtags = document.querySelectorAll('.brand');
    divtags.forEach(div =>{
        div.addEventListener('click', ()=>{
            const value = div.textContent;
            listProducts = listProductscopied;
            const filteredProductsbynav = listProductscopied.filter(product => {
                return value === '0' || product.brand === value;
              });
              listProducts = filteredProductsbynav;
              currentpage = 1;
              addDatatoHTML();
              updatePagination();
        })
    })
}
//Kiểm tra đăng nhập
window.onload = function(){
    let user_loggedin = localStorage.getItem('isLogged');
    let admin_loggedin = localStorage.getItem('AdminLogged');
    let logout_btn = document.getElementById('logout_btn');
    let gear = document.getElementsByClassName('gear');
    let signin = document.getElementById('signin');
    let user_name = document.getElementById('user_name');
    if(user_loggedin){
        logout_btn.style.display = 'block';
        signin.style.display = 'none';
        user_name.innerHTML = localStorage.getItem('Username');
    }
    //Hiển thị công cụ qly sản phẩm
    if(admin_loggedin){
        logout_btn.style.display = 'block';
        gear[0].style.display = 'block';
        signin.style.display = 'none';  
        user_name.innerHTML = localStorage.getItem('Username');
    }
}

//Chuyển qua trang Admin
let gear_icon = document.getElementById('gear_icon');
gear_icon.addEventListener('click', function(){
    window.location.href = "admin.html";
})

//Chức năng đăng xuất
let logout_btn = document.getElementById('logout_btn');
logout_btn.addEventListener('click',()=>{
    localStorage.removeItem("isLogged");
    localStorage.removeItem("AdminLogged");
    localStorage.removeItem("Username");
    window.location.href="Login-register.html";
});

//Quay về trang chủ khi click logo
let logo = document.getElementById('Logo');
logo.addEventListener('click', ()=>{
    location.reload();
})

//Số liệu để thực hiện hàm phân trang
let currentpage = 1;
let perpage = 8;
let totalpage = 0;
let listProductHTML = document.querySelector('.products-container');
//Load dữ liệu json ra products container
const addDatatoHTML = () => {
    listProducts = listProducts.filter((item) => item.status == 1);
    listProductHTML.innerHTML = '';
    if (listProducts.length > 0) {
        const startIndex = (currentpage - 1) * perpage;
        const endIndex = startIndex + perpage;
        const displayedProducts = listProducts.slice(startIndex, endIndex);
        displayedProducts.forEach(product => {
            let newproduct = document.createElement('a');
            newproduct.href = './productdetail.html?id=' + product.id;
            newproduct.classList.add('products-card');
            newproduct.innerHTML = `
            <div class="products-img">
            <img src="${product.img}" alt="">
            </div>
            <div class="products-name">
                <h3>${product.name}</h3>
            </div>
            <div class="products-price">
                <p>${product.price}VND</p>
            </div>
            `;
            listProductHTML.appendChild(newproduct);
        })
    }
}
//Phân trang
function updatePagination(){
        const pageList = document.querySelector('.page-list');
        pageList.innerHTML = '';
        totalpage = Math.ceil(listProducts.length / perpage);   // Sử dụng Math.ceil() để làm tròn lên vi:2.75 => 3 not 2
        if (totalpage >= 1) {
            for (let i = 1; i <= totalpage; i++) {
                let pageItem = document.createElement('li');
                pageItem.textContent = i;
                if (i == currentpage) {
                    pageItem.classList.add('active');
                }
                pageItem.addEventListener('click', () => {
                    currentpage = i;
                    addDatatoHTML();
                    updatePagination();
                });
                pageList.appendChild(pageItem);
            }
        }
}
//them gio hang vao memory
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
}
//them item vao gio hang
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if(carts.length > 0){
        carts.forEach(cart => {
            totalQuantity = totalQuantity + cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('item_products');
            newCart.dataset.id = cart.product_id;
            let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
            let info = listProducts[positionProduct];
            newCart.innerHTML = `
            <div class="cart-container">
                <div class="img-product">
                    <img src="${info.img}" alt="">
                </div>
                <div class="name">
                    ${info.name}
                </div>
                <div class="totalPrice">
                    ${addPeriodsToNumberString(''+getNumbersFromString(info.price) * cart.quantity)}
                </div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${cart.quantity}</span>
                    <span class="plus">></span> 
                </div>
                <!-- <button class="cart-remove" type="submit"><i class="fa-regular fa-trash-can"></i></button> -->
            </div>                
            `
            listCartHTML.appendChild(newCart);
        })
    }
    iconCartSpan.innerText = totalQuantity;
}
function addPeriodsToNumberString(str) {
    let result = '';
    
    for (let i = str.length - 1; i >= 0; i--) {
        if ((str.length - i - 1) % 3 === 0 && i !== str.length - 1) {
          result = '.' + result;
        }
        
        result = str[i] + result;
      }
      
      return result;
  }
function getNumbersFromString(str) {
    let result = '';
    
    for (let i = 0; i < str.length; i++) {
      if (!isNaN(parseInt(str[i]))) {
        result += str[i];
      }
    }
    
    return result;
  }
function isNumeberInput(value) {
    // Sử dụng regex để kiểm tra xem giá trị chỉ chứa các chữ số hoặc rỗng hay không
    const numberRegex = /^[0-9.]+$/;
    return value === '' || numberRegex.test(value);
}
function isValidProductName(value) {
    // Sử dụng regex để kiểm tra xem giá trị chỉ chứa chữ cái hoặc rỗng hay không
    const productRegex = /^[a-zA-Z0-9\s]*$/;
    return value === '' || productRegex.test(value);    
}
function isValidSeachInput(value) {
    // Sử dụng regex để kiểm tra xem giá trị chỉ chứa chữ cái và số hay không
    const SearchinputRegex = /^[a-zA-Z0-9]+$/;
    return SearchinputRegex.test(value);
}
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus'))
    {
        let product_id = positionClick.parentElement.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if (positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQuantity(product_id, type);
    }
})
const changeQuantity = (product_id, type) => {
    let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0)
    {
        switch (type) {
            case 'plus':
                carts[positionItemInCart].quantity += 1;
                break;
        
            default:
                let valueChange = carts[positionItemInCart].quantity - 1;

                if(valueChange > 0){
                    carts[positionItemInCart].quantity = valueChange;
                }else{
                    carts.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToMemory();
    addCartToHTML();
}
//Lấy data từ file products.json lên html
const initApp = ()=>{
    console.log("RELOAD DATA JSON");
    //get data from json
    fetch('/json/products.json')
    .then(response => response.json())
    .then(data => {
        listProducts = data;    //Cho tất cả dữ liệu vào biến listProducts  
        localStorage.setItem('products', JSON.stringify(listProducts)); //đẩy listproducts lên local storage
        // addDatatoHTML();
        // updatePagination();
        // listProductscopied = listProducts;
        // filterProductsByBrand(listProductscopied);
        // Searching();
        // //get cart from memory
        // if (localStorage.getItem('cart')) {
        //     carts = JSON.parse(localStorage.getItem('cart'));
        //     addCartToHTML();
        // }
    })
}
//Gọi hàm
function runOnce() {
    if (!localStorage.getItem('hasRun')) {
        initApp();
        // Đánh dấu rằng hàm đã được chạy
        localStorage.setItem('hasRun', 'true');
    } 
}

// Gọi hàm runOnce khi chương trình được tải
runOnce();

function getDataProducts(){
    listProducts = localStorage.getItem('products') ? JSON.parse(localStorage.getItem("products")) : [];
    addDatatoHTML();
    updatePagination();
    listProductscopied = listProducts;
    filterProductsByBrand(listProductscopied);
    Searching();
    //get cart from memory
    if (localStorage.getItem('cart')) {
        carts = JSON.parse(localStorage.getItem('cart'));
        addCartToHTML();
    }
}
getDataProducts();
 