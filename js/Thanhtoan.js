let carts = [];
let listProduct = [];
// let listCity = [];
// let listDistrict = [];
// let listWard = [];
let cart = document.querySelector('.cart');
let listCartHTML = document.querySelector('.products-list');
const needToPay = 0;
let currentpage = 1;
let perpage = 5;
let totalpage = 0;
let address = document.querySelector('.address');
let checkOutBtn = document.querySelector('.checkOutBtn');
let totalPrice = document.querySelector('.totalPrice');

//Them dia chi
// const customerShippingProvince = document.getElementById('customer_shipping_province');

const readDataProducts = () => {
    // // get datas from file json
    // fetch('/json/products.json')
    // .then(response => response.json())
    // .then(data => {
    //     listProduct = data;

    //     //get cart from memory
    listProduct = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
        if (localStorage.getItem('cart')) {
            carts = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();       
            updatePagination();  
        }

    // })
}

function totalCartPrice() {
    let total = 0;
    if(carts.length > 0){
        carts.forEach(cart => {
            let positionProduct = listProduct.findIndex((value) => value.id == cart.product_id);
            let info = listProduct[positionProduct];
            let priceNumber = getNumbersFromString(info.price) * cart.quantity;
            total = total + priceNumber;
        })
    }
    // alert(typeof(total));
    return total;
}
function setTotalPrice() {
    // alert(typeof(total));
    totalPrice.innerText = 'Tổng giá: ' + addPeriodsToNumberString(''+totalCartPrice()) + " VNĐ";
}
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
}

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if(carts.length > 0){
        const startIndex = (currentpage - 1) * perpage;
        const endIndex = startIndex + perpage;
        const displayedCarts = carts.slice(startIndex, endIndex);
        displayedCarts.forEach(cart => {
            totalQuantity = totalQuantity + cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id;
            let positionProduct = listProduct.findIndex((value) => value.id == cart.product_id);
            let info = listProduct[positionProduct];
            newCart.innerHTML = `
            <div class="products-card">
                <div class="picandname">
                    <img src="${info.img}" alt="">
                    <p>${info.name}</p>
                </div>
                <div class="price">
                    <span><b>${addPeriodsToNumberString(''+getNumbersFromString(info.price) * cart.quantity)}</b></span>
                </div>        
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${cart.quantity}</span>
                    <span class="plus">></span> 
                 </div>               
            </div>           
            `
            listCartHTML.appendChild(newCart);
        })
    }
    setTotalPrice();

    //iconCartSpan.innerText = totalQuantity;
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
    let result = 0;
    
    for (let i = 0; i < str.length; i++) {
      if (!isNaN(parseInt(str[i]))) {
        result += str[i];
      }
    }
    
    return Number(result);
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
    updatePagination();
    setTotalPrice();

}
//Chức năng thanh toan
checkOutBtn.addEventListener('click', () => {
    if (localStorage.getItem('cart') == null) {
        alert('Vui lòng thêm hàng vào giỏ thanh toán');
        window.location.href = 'index.html';
    }
    else{
        event.preventDefault();  
        let fullname = document.getElementById('fullname').value;
        let email = document.getElementById('email').value;
        let phone = document.getElementById('phone').value;
        let detailAddress = document.getElementById('detailAddress').value;
        let fullname_announce = document.getElementById('fullname_announce');
        let email_announce = document.getElementById('email_announce');
        let phone_announce = document.getElementById('phone_announce');
        let detailAddress_announce = document.getElementById('detailAddress_announce');
        let ngayhientai = new Date();
        let thoigiandat = ngayhientai.getFullYear() + '/' + (ngayhientai.getMonth() + 1 ) + '/' + ngayhientai.getDate();
        let trangthai;
        let thoigiangiao = ngayhientai.getFullYear() + '/' + (ngayhientai.getMonth() + 1) + '/' + (ngayhientai.getDate());
        isFullnameValid = true;
        isEmailValid = true;
        isPhoneValid = true;
        isDetailAdressValid = true;
        if(fullname.length < 5 || fullname.length == null){
            fullname_announce.style.display = 'flex';
            fullname_announce.innerHTML = `Tên không hợp lệ (tối thiếu 5 kí tự)`;
            isFullnameValid = false;
        } 
        else{
            fullname_announce.style.display = 'none';
            isFullnameValid = true;
        }

        if (email.length == 0)
        {
            email_announce.style.display = 'flex';
            email_announce.innerHTML = `Vui lòng nhập email (@gmail.com)`;
            isEmailValid = false;
        }
        else if(!isGmailFormat(email)){
            email_announce.style.display = 'flex';
            email_announce.innerHTML = `Chỉ chấp nhân địa chỉ email: abc@gmail.com`;
            isEmailValid = false;
        }
        else{
            email_announce.style.display = 'none';
            isEmailValid = true;
        } 

        if (phone.length == 0)
        {
            phone_announce.style.display = 'flex';
            phone_announce.innerHTML = `SĐT không bỏ trống`;
            isPhoneValid = false;
        }
        else if(!validatePhoneNumber(phone)){
            phone_announce.style.display = 'flex';
            phone_announce.innerHTML = `SĐT không hợp lệ (từ 1-11 số và bắt đầu bằng số 0)`;
            isPhoneValid = false;
        } 
        else{
            phone_announce.style.display = 'none';
            isPhoneValid = true;
        }

        if(detailAddress.length < 5 || detailAddress.length == null){
            detailAddress_announce.style.display = 'flex';
            detailAddress_announce.innerHTML = `Vui lòng không bỏ trống và nhập chi tiết địa chỉ`;
            isDetailAdressValid = false;
        } 
        else{
            detailAddress_announce.style.display = 'none';
            isDetailAdressValid = true;
        }
        
        if(isDetailAdressValid && isEmailValid && isPhoneValid && isFullnameValid){
            let selectedOptProvince = customerShippingProvince.options[customerShippingProvince.selectedIndex];
            // alert(typeof(selectedOpt.value));
            let isAddressValid = true;
            if (selectedOptProvince.value == 'null') {
                alert('Vui lòng chọn tỉnh / thành');
                isAddressValid = false;
            }
            let selectedOptDistrict = customerShippingDistrict.options[customerShippingDistrict.selectedIndex];
            if (isAddressValid && selectedOptDistrict.value == 'null'){
                alert('Vui lòng chọn quận / huyện');
                isAddressValid = false;
            }
            let selectedOptWard = customerShippingWard.options[customerShippingWard.selectedIndex];
            if (isAddressValid && selectedOptWard.value == 'null'){
                alert('Vui lòng chọn phường / xã');
                isAddressValid = false;
            }
            if (isAddressValid)
            {
                var orders = JSON.parse(localStorage.getItem("orders"));
                orders = orders ? orders : [];
                
                var newOrder = {
                    fullname: fullname,
                    email: email,
                    phone: phone,
                    province: selectedOptProvince.value,
                    district: selectedOptDistrict.value,
                    ward: selectedOptWard.value,
                    detailAddress: detailAddress,
                    orderId: createOrderId(),
                    thoigiandat: thoigiandat,
                    thoigiangiao: thoiGianGiao(new Date(thoigiangiao)),
                    trangthai: 0,
                    totalPrice: totalCartPrice(),
                };      
                orders.push(newOrder);
                localStorage.setItem('orders', JSON.stringify(orders));
                console.log(localStorage.getItem('orders'));

                var orderDetails = JSON.parse(localStorage.getItem("orderDetails"));
                orderDetails = orderDetails ? orderDetails : [];
                
                var orderedCart = [];
                if(carts.length > 0){
                    carts.forEach(cart => {
                        var item = {
                            itemId: cart.product_id,
                            quantity: cart.quantity,
                        };
                        orderedCart.push(item);
                    })
                }
                var newOrderDetail = {
                    fullname: fullname,
                    email: email,
                    phone: phone,
                    province: selectedOptProvince.value,
                    district: selectedOptDistrict.value,
                    ward: selectedOptWard.value,
                    detailAddress: detailAddress,
                    orderId: newOrder.orderId,
                    orderedCart: orderedCart,
                    totalPrice: totalCartPrice(),
                    thoigiandat: thoigiandat,
                    thoigiangiao: thoiGianGiao(new Date(thoigiandat)),
                };      

                orderDetails.push(newOrderDetail);
                localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
                console.log(localStorage.getItem('orderDetails'));

                alert('Thanh toán thành công');
                localStorage.removeItem('cart');
                window.location.href = 'index.html';
            }
        }


            //localStorage.removeItem('cart');
        }
    }
    
);
function getCustomerInformationByUsername(username) {
    let listAdmin = [];
    let listCustomer = [];
    if (localStorage.getItem('Admin')) {
        listAdmin = JSON.parse(localStorage.getItem('Admin'));
        console.log(listAdmin);
    }
    for (let i = 0; i < listAdmin.length; i++){
        if (username === listAdmin[i].username)
            return listAdmin[i];
    }

    if (localStorage.getItem('registrations')) {
        listCustomer = JSON.parse(localStorage.getItem('registrations'));
        console.log(listCustomer);
    }
    for (let i = 0; i < listCustomer.length; i++){
        if (username === listCustomer[i].username)
            return listCustomer[i];
    }
}
function validateUsername(username) {
// Sử dụng biểu thức chính quy để kiểm tra tên đăng nhập
const regex = /^[a-zA-Z0-9]{1,20}$/;
return regex.test(username);
}
function validatePassword(password) {
const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{5,}$/;
return regex.test(password);
}
function validatePhoneNumber(phoneNumber) {
// Sử dụng biểu thức chính quy để kiểm tra số điện thoại
const regex = /^0\d{1,10}$/;
return regex.test(phoneNumber);
}
function validateEmail(Email){
const regex = /^[a-zA-Z0-9.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z\.]{2,}$/;
return regex.test(Email);
}
function isGmailFormat(email) {
    var gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
}
function thoiGianGiao(thoigiandat){
    const ngaygiao = new Date(thoigiandat);
    console.log(ngaygiao); // Tạo một bản sao của thoigiandat
    ngaygiao.setDate(ngaygiao.getDate() + 1); // Thêm 1 ngày vào ngày đặt hàng
    return ngaygiao.getFullYear() + '/' + (ngaygiao.getMonth() + 1) + '/' + ngaygiao.getDate();
}


function createOrderId () {
    var orders = JSON.parse(localStorage.getItem("orders"));
    orders = orders ? orders : [];
    let orderId = 1;
    
    if (orders.length > 0){
        orders.sort((a, b) => { // Sort the orders array based on orderId property in ascending order
            if (a.orderId < b.orderId) return -1; // If a's orderId is less than b's, return -1 to sort them in ascending order
            if (a.orderId > b.orderId) return 1; // If a's orderId is greater than b's, return 1 to sort them in descending order (this is redundant since we already sorted in ascending order)
            return 0; // If a's and b's orderIds are equal, return 0 to maintain their original order
        });
        for (let i =0; i < orders.length; i++) {
            if (orderId == Number(orders[i].orderId)) orderId++;
            else break;
        }
    }
    return orderId;
}
function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.floor(Math.random() * 10000);
  return `${timestamp}-${randomNumber}`;
}
function updatePagination(){
    const pageList = document.querySelector('.page-list');
    pageList.innerHTML = '';
    totalpage = Math.ceil(carts.length / perpage);   // Sử dụng Math.ceil() để làm tròn lên vi:2.75 => 3 not 2
    if (totalpage >= 1) {
        for (let i = 1; i <= totalpage; i++) {
            let pageItem = document.createElement('li');
            pageItem.textContent = i;
            if (i == currentpage) {
                pageItem.classList.add('active');
            }
            pageItem.addEventListener('click', () => {
                currentpage = i;
                addCartToHTML();
                updatePagination();
            });
            pageList.appendChild(pageItem);
        }
    }
}
window.onload = function(){
    let user_loggedin = localStorage.getItem('isLogged');
    let admin_loggedin = localStorage.getItem('AdminLogged');
    let logout_btn = document.getElementById('logout_btn');
    let gear = document.getElementsByClassName('gear');
    if(user_loggedin){
        logout_btn.style.display = 'block';
        signin.style.display = 'none';
        user_name.innerHTML = localStorage.getItem('Username');
    }
    //Hiển thị công cụ qly sản phẩm
    if(admin_loggedin){
        logout_btn.style.display = 'block';
        user_name.innerHTML = localStorage.getItem('Username');
    }
}
window.onload = function(){
    let username = localStorage.getItem('Username');
    let user_name = document.getElementById('user_name');
    user_name.innerHTML = username ;
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    var customer = getCustomerInformationByUsername(username);
    emailInput.value = customer.email;
    phoneInput.value = customer.sdt || customer.phone;

}

readDataProducts();
