// tab for section
const sidebars = document.querySelectorAll(".sidebar-list-item.tab-content");
const sections = document.querySelectorAll(".section");

for(let i = 0; i < sidebars.length; i++) {
    sidebars[i].onclick = function () {
        document.querySelector(".sidebar-list-item.active").classList.remove("active");
        document.querySelector(".section.active").classList.remove("active");
        sidebars[i].classList.add("active");
        sections[i].classList.add("active");
    };
}

// Get amount product
function getAmoumtProduct() {
    let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
    products = products.filter((item) => item.status == 1);
    return products.length;
}

// Get amount user
function getAmoumtUser() {
    let accounts = localStorage.getItem("registrations") ? JSON.parse(localStorage.getItem("registrations")) : [];
    accounts = accounts.filter(item => item.status == 1);
    return accounts.length;
}

// Get amount doanh thu
function getMoney(arr) {
    let tongtien = 0;
    if(arr.length != 0){
    // let orders = localStorage.getItem("orders") ? JSON.parse(localStorage.getItem("orders")) : [];
    arr.forEach(item => {
        tongtien += item.totalPrice;        
    });
    }
    return tongtien; 
}

function getMoney1(arr) {
    let tongtien = 0;
    if(arr.length != 0){
    // let orders = localStorage.getItem("orders") ? JSON.parse(localStorage.getItem("orders")) : [];
    arr.forEach(item => {
        tongtien += item.doanhthu;        
    });
    }
    return tongtien; 
}
function toVND(soTien){
    let formatVND = '';
    if(soTien>0){
        let strNumber = soTien.toString();
        let tmp = [];
        while(strNumber.length > 2){
            tmp.unshift(strNumber.slice(-3));
            strNumber = strNumber.slice(0,-3);
        }
        if(strNumber.length != 0){
            tmp.unshift(strNumber.slice(-strNumber.length));
        }
        formatVND = tmp.join(".");
    return formatVND;
    }
    return soTien.toString();

}
window.addEventListener('load', function() {
    setDefaultValue();
});

function setDefaultValue(){
    resetDataAmountUser();
    resetDataAmountProduct();
    resetDataAmountDoanhThu();
}
function resetDataAmountUser(){
    document.getElementById("amount-user").innerHTML = getAmoumtUser();
}
function resetDataAmountProduct(){
    document.getElementById("amount-product").innerHTML = getAmoumtProduct();
}
function resetDataAmountDoanhThu(){
    let orders = localStorage.getItem("orders") ? JSON.parse(localStorage.getItem("orders")) : [];
    document.getElementById("doanh-thu").innerHTML = toVND(getMoney(orders)) + " đ";
}

let logout = document.getElementById('logout-acc');
logout.addEventListener('click',()=>{
    localStorage.removeItem("AdminLogged");
})

let getAdminName = document.getElementById('name-acc');
let getName = localStorage.getItem("Admin") ? JSON.parse(localStorage.getItem("Admin")) : [];
let adminName = getName[0].username;
getAdminName.innerHTML = `${adminName}`;


// Phân trang

// Công thức tính

// item: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10

// 1: 0, 1, 2, 3, 4
// 2: 5, 6, 7, 8, 9
// 3: 10

// itemPerPage: 5, currentPage = 1

// start = 0, end = itemPerPage

// start = (currentPage - 1) * itemPerPage

// end = currentPage * itemPerPage

// 1: currentPage = 1; start = (1-1)*5 = 0; end = 1*5 = 5, start=0, end=5
// 2: currentPage = 2; start = (2-1)*5 = 5; end = 2*5 = 10, start=5, end=10
// 3: currentPage = 3: start = (3-1)*5 = 10; end = 3*5 = 15, start=10, end=15

let currentPage = 1;
let itemPerPage = 5;

function displayList(productAll, itemPerPage, currentPage){
    let start = (currentPage - 1) * itemPerPage;
    let end = currentPage * itemPerPage;
    let productShow = productAll.slice(start,end);
    showArrayProduct(productShow);
}

function setupPagination(productAll,itemPerPage){
    if(productAll.length > 0){
        document.querySelector('.page-nav-list').innerHTML = '';
        let page_count = Math.ceil(productAll.length / itemPerPage);
        for(let i=1; i <= page_count; i++){
            let li = paginationChange(i,productAll,currentPage);
            document.querySelector('.page-nav-list').appendChild(li);
        }
    }
}

function paginationChange(page,productAll,currentPage){
    let node = document.createElement('li');
    node.classList.add("page-nav-item");
    node.innerHTML = `<a href="#">${page}</a>`;
    if(currentPage == page) node.classList.add('active');
    node.addEventListener('click', function(){
        currentPage = page;
        document.querySelector('.box-product').scrollTop = 0;
        displayList(productAll,itemPerPage,currentPage);
        let t = document.querySelectorAll('.page-nav-item.active');
        for(let i = 0 ; i < t.length ; i++){
            t[i].classList.remove('active');
        }
        node.classList.add('active');
    })
    return node;
}




// Hiển thị danh sách sản phẩm
function showArrayProduct(arr){
    let productHtml = "";
    if(arr.length <= 0){
        document.querySelector(".box-product").classList.add("empty");
        productHtml = `<p>Không có dữ liệu để hiển thị !!!</p>`;
        document.querySelector(".box-product.empty").innerHTML = productHtml;
    } else{
        productHtml = "";
        if(document.querySelector(".box-product.empty")){
            document.querySelector(".box-product.empty").classList.remove("empty");
            document.querySelector(".box-product").innerHTML = `
                        <div id="show-product"></div>
                        <div class="page-nav">
                            <ul class="page-nav-list"></ul>
                        </div>`;
        }
        arr.forEach(product => {
            let btnCtl = product.status == 1 ?
            `<button class="control-btn changeStatus-product-control" onclick="changeStatusProductOff(${product.id})"><i class="fa-solid fa-trash"></i></button>` :
            `<button class="changeStatus-product-control undo-btn control-btn" onclick="changeStatusProductOn(${product.id})"><i class="fa-solid fa-trash"></i></button>`;
            productHtml += 
            `<div class="item-list">
            <div class="item-single">
                <div class="item-left">
                    <img src="${product.img}" alt="">
                </div>
                <div class="item-center">
                    <h2>${product.name}</h2>
                    <p>${product.des}</p>
                    <span>${product.brand}</span>
                </div>
                <div class="item-right">
                    <h3>${product.price} đ</h3>
                    <div class="item-btn">
                        <button class="item-btn-edit control-btn" onclick="editProduct(${product.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                        ${btnCtl}
                        
                    </div>
                </div>
            </div>`;
        });
    
    document.getElementById('show-product').innerHTML = productHtml;
    }
}

function showProduct(){
    let selectOp = document.getElementById('brands-select').value;
    let valueSearchInput = document.getElementById('form-search-product').value;
    let products  = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
    if (selectOp === "Tất cả"){
        result = products;
    }
    else if(selectOp === "Đã ẩn"){
        result = products.filter((item) => item.status == 0);
    }
    else{
        result = products.filter((item) => item.brand == selectOp).filter((item) => item.status == 1);
    }
    result = valueSearchInput == "" ? result : result.filter(item => {
        return item.name.toString().toUpperCase().includes(valueSearchInput.toString().toUpperCase());
    })
    displayList(result,itemPerPage,currentPage);
    setupPagination(result,itemPerPage,currentPage);
}

function cancelSearchProduct(){
    let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
    document.getElementById('brands-select').value = "Tất cả";
    document.getElementById('form-search-product').value = "";
    displayList(products,itemPerPage,currentPage);
    setupPagination(products,itemPerPage,currentPage);
}

// onLoad
window.onload = showProduct();
window.onload = showUser();


//Modal
// Default value
function setDefaultValueProduct(){
    document.querySelector(".image-upload-preview").setAttribute("src","./img/empty-image.png");
    document.getElementById("product-name-form").value = "";
    document.getElementById("product-price-form").value = "";
    document.getElementById("product-des-form").value = "";
    document.getElementById("product-brand-select").value = "Apple";
}
function setDefaultValueUser(){
    document.getElementById("user-username-form").value = "";
    document.getElementById("user-email-form").value = "";
    document.getElementById("user-password-form").value = "";
    document.getElementById("user-sdt-form").value = "";
}

// Open modal add product
let btnAddProduct = document.getElementById("btn-add-product");
btnAddProduct.addEventListener('click', () =>{
    document.querySelectorAll(".add-product-title").forEach(item => {
        item.style.display = "block";
    })
    document.querySelectorAll(".edit-product-title").forEach(item => {
        item.style.display = "none";
    })
    document.querySelector(".add-product").classList.add("open");
    uploadImage();
    setDefaultValueProduct();
})

// let btnAddUser = document.getElementById("btn-add-user");
// btnAddUser.addEventListener('click',() => {
//     document.querySelectorAll(".add-user-title").forEach(item =>{
//         item.style.display = "block";
//     })
//     document.querySelectorAll(".edit-user-title").forEach(item =>{
//         item.style.display = "none";
//     })
//     document.querySelector(".add-user").classList.add("open");
//     setDefaultValueUser();
// })
// Close modal
let btnCloseModal = document.querySelectorAll(".modal-close");
let modalOpen = document.querySelectorAll(".modal");

for(let i = 0 ; i < modalOpen.length ; i++){
    btnCloseModal[i].onclick = () => {
        modalOpen[i].classList.remove("open");
    };
}

// Upload hình ảnh
function uploadImage(){
    
    let btnUploadImg = document.getElementById("up-hinh-anh");
    btnUploadImg.addEventListener('change', () =>{
        const file = event.target.files[0];
        if(file){
            let path = './img/';   
            const fileName = file.name
            path += fileName;
            document.querySelector(".image-upload-preview").setAttribute("src",path);
        } else{
            document.querySelector(".image-upload-preview").setAttribute("src","img/empty-image.png");
        }
    })
}


// get path image
function getPath(src){
    let path = src.split("/");
    return "/img/" + path[path.length - 1];
}
// tạo id mới cho product
function createID(){
    let idProduct = localStorage.getItem('products') ? JSON.parse(localStorage.getItem("products")) : [];
    return idProduct.length + 1;
}
// Save dữ liệu 
// Save Product
function btnSaveProduct(){
    let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
    var nameValue = document.getElementById("product-name-form").value;
    var brandValue = document.getElementById("product-brand-select").value;
    var priceValue = document.getElementById("product-price-form").value;
    var desValue = document.getElementById("product-des-form").value;
    var imgValue = getPath(document.querySelector(".image-upload-preview").src);
    if(nameValue == "" || desValue == "" || priceValue == ""){
        alert("Vui lòng nhập đầy đủ thông tin");
    } 
    else{
        let product = {
            id: createID(),
            name: nameValue,
            brand: brandValue,
            des: desValue,
            price: priceValue,
            img: imgValue,
            status: 1
        }
        products.push(product);
        localStorage.setItem("products",JSON.stringify(products));
        showProduct();
        document.querySelector(".add-product").classList.remove("open");
        setDefaultValueProduct();
        resetDataAmountProduct();
        alert("Thêm sản phẩm thành công");
    }
}

// // save user
// function btnSaveUser(){
//     let users = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")) : [];
//     var nameValue = document.getElementById("user-name-form").value;
//     var sdtValue = document.getElementById("user-sdt-form").value;
//     var passwordValue = document.getElementById("user-password-form").value;
//     var dateStartValue = dateFormat(new Date());
    
//     if(nameValue == "" || sdtValue == "" || passwordValue == ""){
//         alert("Vui lòng nhập đầy đủ thông tin");
//     } 
//     else{
//         let user = {
//             id: 0,
//             name: nameValue,
//             sdt: sdtValue,
//             dateStart: dateStartValue,
//             password: passwordValue,
//             status: 1
//         }
//         users.push(user);
//         users = resetId(users);
//         localStorage.setItem("accounts",JSON.stringify(users));
//         showUser();
//         document.querySelector(".add-user").classList.remove("open");
//         setDefaultValueUser();
//         alert("Thêm khách hàng thành công");
//     }
// }
// edit product
var indexCur;
function editProduct(id){
    let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
    let index = products.findIndex(item =>{
        return item.id == id
    })
    indexCur = index;
    document.querySelectorAll(".add-product-title").forEach(item =>{
        item.style.display = "none";
    })
    document.querySelectorAll(".edit-product-title").forEach(item =>{
        item.style.display = "inline-block";
    })
    document.querySelector(".add-product").classList.add("open");
    document.querySelector(".image-upload-preview").src = products[index].img;
    document.getElementById("product-name-form").value = products[index].name;
    document.getElementById("product-price-form").value = products[index].price;
    document.getElementById("product-des-form").value = products[index].des;
    document.getElementById("product-brand-select").value = products[index].brand;
}

function btnEditProduct(){
    let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
    let idProduct = products[indexCur].id;
    let imgProduct = products[indexCur].img;
    let nameProduct = products[indexCur].name;
    let priceProduct = products[indexCur].price;
    let desProduct = products[indexCur].des;
    let brandProduct = products[indexCur].brand;
    let statusProductCur = products[indexCur].status;
    let imgProductCur = getPath(document.querySelector(".image-upload-preview").src)
    let nameProductCur = document.getElementById("product-name-form").value;
    let priceProductCur = document.getElementById("product-price-form").value;
    let desProductCur = document.getElementById("product-des-form").value;
    let brandProductCur = document.getElementById("product-brand-select").value;

    if (imgProductCur != imgProduct || nameProductCur != nameProduct || priceProductCur != priceProduct || desProductCur != desProduct || brandProductCur != brandProduct) {
        let productadd = {
            id: idProduct,
            name: nameProductCur,
            img: imgProductCur,
            brand: brandProductCur,
            price: priceProductCur,
            des: desProductCur,
            status: statusProductCur,
        };
        products.splice(indexCur, 1);
        products.splice(indexCur, 0, productadd);
        localStorage.setItem("products", JSON.stringify(products));
        alert("Sửa thông tin thành công");
        setDefaultValueProduct();
        document.querySelector(".add-product").classList.remove("open");
        showProduct();
    } else {
        alert("Thông tin sản phẩm không thay đổi");
    }
}

function deleteProduct(id){
    let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
    let index = products.findIndex(item =>{
        return item.id == id
    })
    if(confirm("Xóa sản phẩm ?")){
        alert("Xóa sản phẩm " + products[index].name + " thành công !!!");
        products = products.filter(item => item != products[index]);
        localStorage.setItem("products", JSON.stringify(products));
        showProduct();
        resetDataAmountProduct();
    }
}

function changeStatusProductOn(id){
    let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [] ;
    let index = products.findIndex((item) => {
        return item.id == id;
    })

    if(confirm("Khôi phục sản phẩm "+ products[index].name +" ?")){
        products[index].status = 1;
        localStorage.setItem("products", JSON.stringify(products));
        showProduct();
        resetDataAmountProduct();
        alert("Đã khôi phục sản phẩm " + products[index].name +" thành công");
    }
}

function changeStatusProductOff(id){
    let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [] ;
    let index = products.findIndex((item) => {
        return item.id == id;
    })
    if(confirm("Xóa sản phẩm "+ products[index].name +" ?")){
        alert("Đã Xóa sản phẩm " + products[index].name +" thành công");
        products[index].status = 0;
        localStorage.setItem("products", JSON.stringify(products));
        showProduct();
        resetDataAmountProduct();
    }
}

let product_priceInput = document.getElementById("product-price-form");
    product_priceInput.addEventListener("input",function(){
        let inputValue = product_priceInput.value.replace(/\D/g, '');
        let formattedValue = toVND(inputValue);

        if (formattedValue != product_priceInput.value) {
            product_priceInput.value = formattedValue;
        }
    })

function showUser(){
    let selectOp = document.getElementById('admin-user-select').value;
    let valueSearchInput = document.getElementById('form-search-user').value;
    let users;
    users  = localStorage.getItem("registrations") ? JSON.parse(localStorage.getItem("registrations")) : [];
    if (selectOp === "Tất cả"){
        result = users;
    }
    else if(selectOp ==="Hoạt động"){
        result = users.filter(item => item.status == 1)
    }
    else if(selectOp === "Bị khóa"){
        result = users.filter((item) => item.status == 0);
    }
    
    result = valueSearchInput == "" ? result : result.filter(item => {
        return item.username.toString().toUpperCase().includes(valueSearchInput.toString().toUpperCase());
    })
    displayUser(result);
}
function displayUser(users){
    userHtml = ``;
    if(users.length <= 0){
        userHtml = `<td colspan="6">Không có dữ liệu !!!</td>`;
    } else{
        users.forEach(item => {
            let itemBtn = item.status == 1 ? 
            `<button class="control-btn changeStatus-user-control" onclick="changeStatusUserOff(${item.id})"><i class="fa-solid fa-trash"></i></button>` :
            `<button class="control-btn changeStatus-user-control undo-btn" onclick="changeStatusUserOn(${item.id})"><i class="fa-solid fa-trash"></i></button>`;
            let status = item.status == 1 ?
            `<button class="status-btn" id="statusOn"><i class="fa-solid fa-check"></i><span>Hoạt động</span></button>` :
            `<button class="status-btn" id="statusOff"><i class="fa-solid fa-lock"></i><span>Bị khóa</span></button>`
            userHtml += `
            <tr>
                <td>${item.id}</td>
                <td>${item.username}</td>
                <td>${item.password}</td>
                <td>${item.email}</td>
                <td>${item.sdt}</td>
                <td>${status}</td>
                <td class="user-data-control">
                    <button class="control-btn edit-user-control" onclick="editUser(${item.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                    ${itemBtn}
                </td>
            </tr>
        `;
        });
    }
    document.getElementById("showUser").innerHTML = userHtml;

}

function changeStatusUserOn(id){
    let users = localStorage.getItem("registrations") ? JSON.parse(localStorage.getItem("registrations")) : [];
    let index = users.findIndex(item => {
        return item.id == id;
    })

    if(confirm("Khôi phục người dùng " + users[index].username +" ?")){
        alert("Đã khôi phục người dùng " + users[index].username +" thành công");
        users[index].status = 1;
        localStorage.setItem("registrations", JSON.stringify(users));
        showUser();
        resetDataAmountUser();
    }
}

function changeStatusUserOff(id){
    let users = localStorage.getItem("registrations") ? JSON.parse(localStorage.getItem("registrations")) : [];
    let index = users.findIndex(item => {
        return item.id == id;
    })

    if(confirm("Ẩn người dùng " + users[index].username +" ?")){
        alert("Đã ẩn người dùng " + users[index].username +" thành công");
        users[index].status = 0;
        localStorage.setItem("registrations", JSON.stringify(users));
        showUser();
        resetDataAmountUser();
    }
}

function deleteUser(id){
    let users = localStorage.getItem("registrations")  ? JSON.parse(localStorage.getItem("registrations")) : [];
    let index = users.findIndex(item =>{
        return item.id == id;
    });
    if(confirm("Xóa thông tin người dùng " + users[index].username +" ?")){
        alert("Xóa thông tin người dùng " + users[index].username +" thành công");
        users = users.filter(item => item != users[index]);
        localStorage.setItem("registrations", JSON.stringify(users));
        showUser();
        resetDataAmountUser();
    }
}

function editUser(id){
    let users = localStorage.getItem("registrations") ? JSON.parse(localStorage.getItem("registrations")) : [];
    let index = users.findIndex(item => {
        return item.id == id;
    })
    indexCur = index;
    document.querySelectorAll(".add-user-title").forEach(item =>{
        item.style.display = "none";
    })
    document.querySelectorAll(".edit-user-title").forEach(item =>{
        item.style.display = "inline-block";
    })

    document.querySelector(".add-user").classList.add("open");
    document.getElementById("user-username-form").value = users[indexCur].username;
    document.getElementById("user-password-form").value = users[indexCur].password;
    document.getElementById("user-sdt-form").value = users[indexCur].sdt;
    document.getElementById("user-email-form").value = users[indexCur].email;   
}

function cancelSearchUser(){
    let users = localStorage.getItem("registrations") ? JSON.parse(localStorage.getItem("registrations")) : [];
    document.getElementById('admin-user-select').value = "Tất cả";
    document.getElementById('form-search-user').value = "";
    document.getElementById('user-start-time').value = '';
    document.getElementById('user-end-time').value = ''
    displayUser(users,itemPerPage,currentPage);
}
function resetDataUser(){
    let messages = document.querySelectorAll(".form-message.active");
    messages.forEach(item => {
        item.classList.remove("active");
    })
}
function checkAllDataUser(){
    checkDataUsername();
    checkDataSdt();
    checkDataEmail();
    checkDataPassword();
}

function btnEditUser(){
    resetDataUser();
    console.log(isUsernameValid + " " + isPasswordValid + " " + isEmailValid + " " + isSdtValid);
    if(!isUsernameValid && !isPasswordValid && !isEmailValid & !isSdtValid){
        let users = localStorage.getItem("registrations") ? JSON.parse(localStorage.getItem("registrations")) : [];
        let idUser = users[indexCur].id;
        let UsernameUser = users[indexCur].username;
        let sdtUser = users[indexCur].sdt;
        let emailUser = users[indexCur].email;
        let passwordUser = users[indexCur].password;

        let statusUserCur = users[indexCur].status;
        let UsernameUserCur = document.getElementById("user-username-form").value;
        let PasswordUserCur = document.getElementById("user-password-form").value;
        let EmailUserCur = document.getElementById("user-email-form").value;
        let sdtUserCur = document.getElementById("user-sdt-form").value;
        if (UsernameUser != UsernameUserCur || sdtUser != sdtUserCur || passwordUser != PasswordUserCur || emailUser != EmailUserCur) {
            let useradd = {
                id: idUser,
                username: UsernameUserCur,
                email: EmailUserCur,
                sdt: sdtUserCur,
                password: PasswordUserCur,
                status: statusUserCur,
            };
            users.splice(indexCur, 1);
            users.splice(indexCur, 0, useradd);
            localStorage.setItem("registrations", JSON.stringify(users));
            alert("Sửa thông tin thành công");
            setDefaultValueUser();
            document.querySelector(".add-user").classList.remove("open");
            showUser();
        } else {
            alert("Thông tin khách hàng không thay đổi");
        }
    } else{
        alert("Hãy nhập dữ liệu phù hợp");
    }
}

function checkData(inputValue, pattern){
   const regex = new RegExp(pattern);
   return regex.test(inputValue);
 }
let isUsernameValid = false;
let isPasswordValid = false;
let isEmailValid = false;
let isSdtValid = false;

function checkDataUsername(){
    let userPattern = "^[a-zA-Z0-9]+$";
    let username = document.getElementById("user-username-form").value.trim();
    console.log(username + " " + checkData(username,userPattern));
    if(!checkData(username,userPattern)){
        document.getElementById("user-username-message").classList.add("active");
        isUsernameValid = true;
    } 
    else{
        if(document.querySelector(".form-message.active")){
            document.querySelector(".form-message.active").classList.remove("active");
            isUsernameValid = false;
        }
    }
}
function checkDataPassword(){
    let passwordPattern = "^[a-zA-Z0-9]+$";
    let pass = document.getElementById("user-password-form").value.trim();

    if(!checkData(pass,passwordPattern)) {
        document.getElementById("user-password-message").classList.add("active");
        isPasswordValid = true;
    } 
    else{
        if(document.querySelector(".form-message.active")){
            document.querySelector(".form-message.active").classList.remove("active");
            isPasswordValid =false;
        }
    }
}
function checkDataEmail(){
    let emailPattern = "^[a-zA-Z0-9.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z\.]{2,}$";
    let email = document.getElementById("user-email-form").value.trim();

    if(!checkData(email,emailPattern)){
        document.getElementById("user-email-message").classList.add("active");
        isEmailValid = true;
    } 
    else{
        if(document.querySelector(".form-message.active")){
            document.querySelector(".form-message.active").classList.remove("active");
            isEmailValid = false;
        }
    }
}
function checkDataSdt(){
    let sdtPattern = "^0[0-9]{9,10}$";
    let sdt = document.getElementById("user-sdt-form").value.trim();
    if(!checkData(sdt,sdtPattern)){
        document.getElementById("user-sdt-message").classList.add("active");
        isSdtValid = true;
    }
    else{
        if(document.querySelector(".form-message.active")){
            document.querySelector(".form-message.active").classList.remove("active");
            isSdtValid = false;
        }
    }
}

// Order
// thay đổi trạng thái đơn hàng
// order{id,trangthai,khachhang,thoigiandat}
// function changeStatus(id, el){
//     let orders = JSON.parse(localStorage.getItem('orders'));
//     let order = orders.find((item) =>{
//         return item.orderId == id;
//     })
//     order.trangthai = 1;
//     el.classList.remove('btn-chuaxuly');
//     el.classList.add('btn-daxuly');
//     el.innerHTML = 'Đã xử lý';
//     localStorage.setItem('orders',JSON.stringify(orders));
//     showOrder(orders);
// }
// // tìm đơn hàng
// function findOrder(){
//     let status = parseInt(document.getElementById('status').value);
//     let ct = document.getElementById('form-search-order').value;
//     let timeStart = document.getElementById('order-time-start').value;
//     let timeEnd = document.getElementById('order-time-end').value;
//     if(timeEnd < timeStart && timeEnd != '' & timeStart != ''){
//         alert("Thời gian không hợp lệ !");
//         return;
//     }
//     let orders = localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')) : [];
//     let result = status == 0 ? orders : orders.filter((items) =>{
//         return items.trangthai == status;
//         console.log(orders)
//     });
//     result = ct == '' ? result : result.filter((item) =>{
//         return (item.fullname.toLowerCase().includes(ct.toLowerCase()) || item.orderId.toString().toLowerCase().includes(ct.toLowerCase()));
//     });
//     alert(formatDate(timeStart) >=  formatDate("06/10/2023").setHours(0,0,0));
    
//     if(result != null){
//         if(timeStart == '' && timeEnd == ''){
//             result = result;
            
//         } else if(timeStart == '' && timeEnd != ''){
//             result = result.filter((item) =>
//                 new Date(formatDate(item.thoigiandat)) <= new Date(timeEnd).setHours(23,59,59)
//             );
//         } else if(timeStart != '' && timeEnd == ''){
            
//             result = result.filter((item)=>
//                 (new Date(formatDate(item.thoigiandat)) >= new Date(timeStart).setHours(0,0,0))
//             );   
//         } else{
//             result = result.filter(item => 
//                 new Date(formatDate(item.thoigiandat)) >= new Date(timeStart).setHours(0,0,0) && new Date(formatDate(item.thoigiangiao)) <= new Date(timeEnd).setHours(23,59,59))
//         }
//     }
    
//     showOrder(result);
// }
// // hiển thị đơn hàng
// function showOrder(arr){
//     let orderHtml = '';
//     if(arr.length == 0){
//         orderHtml = `<td colspan='6'>Không có dữ liệu</td>`
//     } else{
//         arr.forEach((item) =>{
//             let status = item.trangthai == 0 ? `<span class="status-no-complete">Chưa xử lý</span>` : `<span class="status-complete">Đã xử lý</span>`
//             let date = formatDate(item.thoigiandat);
//             orderHtml += `
//             <tr>
//                 <td>${item.orderId}</td>
//                 <td>${item.fullname}</td>
//                 <td>${date}</td>
//                 <td>${VND(item.totalPrice)}</td>
//                 <td>${status}</td>
//                 <td class="control"><button class="bnt-detail"  onclick="detailOrder('${item.orderId}')"><i class="fa-regular fa-eye"></i> Chi tiết</button></td>
//             </tr>
//             `
//         })
//     }
//     document.getElementById('showOrder').innerHTML = orderHtml;
// }

// let orders = localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')) : [];
// window.onload = showOrder(orders);
function changeStatus(id, el){
    let orders = JSON.parse(localStorage.getItem('orders'));
    let index = orders.findIndex((item) =>{
        return item.orderId == id;
    })
    if(orders[index].trangthai === 0){
        orders[index].trangthai = 1; // trang thai da xu ly
        el.classList.remove('btn-chuaxuly');
        el.classList.add('btn-daxuly');
        el.innerHTML = 'Đã xử lý';
        localStorage.setItem('orders',JSON.stringify(orders));
        let arr = JSON.parse(localStorage.getItem('orders'));
        location.reload;
        showOrder(arr);
        showOverview();
        Thongke(2);
        let thongke = localStorage.getItem('thongke') ? JSON.parse(localStorage.getItem('thongke')) : [];
        
        thongke.forEach((tk, tkIndex) => {
            orderDetails.forEach(item => {
                item.orderedCart.forEach(i => {
                    let product = products.find(p => p.id == i.itemId);
        
                    if (product && product.brand == tk.name) {
                        thongke[tkIndex].quanlity++;
                        if (product.price <= 7) {
                            thongke[tkIndex].doanhthu += parseInt(i.quantity) * parseFloat(product.price) * 1000;
                        } else {
                            thongke[tkIndex].doanhthu += parseInt(i.quantity) * parseFloat(product.price) * 1000000;
                        }
        
                        // Thêm orderId vào mảng orderId của thống kê
                        thongke[tkIndex].orderId.push({ orderId: item.orderId });
                    }
                });
            });
        });
        localStorage.setItem('thongke',JSON.stringify(thongke));
    } else{
        alert("Đơn hàng đã được xử lý");
    }
}
function findOrder(){
    let status = parseInt(document.getElementById('status').value);
    let ct = document.getElementById('form-search-order').value;
    let timeStart = document.getElementById('order-time-start').value;
    let timeEnd = document.getElementById('order-time-end').value;
    
    let orders = localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')) : [];
    let result = status == 2 ? orders : orders.filter((items) =>{
        return items.trangthai == status;
    });
    if(timeEnd < timeStart && timeEnd != '' & timeStart != ''){
        alert("Thời gian không hợp lệ !");
        return;
    }
    result = ct == '' ? result : result.filter((item) =>{
        return (item.fullname.toLowerCase().includes(ct.toLowerCase()) || item.orderId.toString().toLowerCase().includes(ct.toLowerCase()));
    });

    // if(result != null){
    //     if(timeStart === '' && timeEnd === ''){
    //         // result = result;
    //     } else if(timeStart === '' && timeEnd !== ''){
    //         result = result.filter((item) =>
    //               new Date(item.thoigiangiao) <= new Date(timeEnd).setHours(23,59,59)
    //         );
    //     } else if(timeStart !== '' && timeEnd === ''){
    //         result = result.filter((item)=>
    //             (new Date(item.thoigiandat) >= new Date(timeStart).setHours(0,0,0))
    //         );   
    //     } else{
    //         result = result.filter(item => 
    //             new Date(item.thoigiandat) >= new Date(timeStart).setHours(0,0,0) && new Date(item.thoigiangiao) <= new Date(timeEnd).setHours(23,59,59))
    //     }
    // }
    if (timeStart != "" && timeEnd == "") {
        result = result.filter((item) => {
            return new Date(item.thoigiandat) >= new Date(timeStart).setHours(0, 0, 0);
        });
    } else if (timeStart == "" && timeEnd != "") {
        result = result.filter((item) => {
            return new Date(item.thoigiandat) <= new Date(timeEnd).setHours(23, 59, 59);
        });
    } else if (timeStart != "" && timeEnd != "") {
        result = result.filter((item) => {
            return (new Date(item.thoigiandat) >= new Date(timeStart).setHours(0, 0, 0) && new Date(item.thoigiandat) <= new Date(timeEnd).setHours(23, 59, 59)
            );
        });
    }
    
    showOrder(result);
}
// hiển thị đơn hàng
function showOrder(arr){
    let orderHtml = '';
    if(arr.length == 0){
        orderHtml = `<td colspan='6'>Không có dữ liệu</td>`
    } else{
        arr.forEach((item) =>{
            let status = item.trangthai == 0 ? `<span class="status-no-complete">Chưa xử lý</span>` : `<span class="status-complete">Đã xử lý</span>`
            let date = formatDate(item.thoigiandat);
            orderHtml += 
            `
            <tr>
                <td>${item.orderId}</td>
                <td>${item.fullname}</td>
                <td>${date}</td>
                <td>${VND(item.totalPrice)}</td>
                <td>${status}</td>
                <td class="control"><button class="bnt-detail"  onclick="detailOrder('${item.orderId}')"><i class="fa-regular fa-eye"></i> Chi tiết</button></td>
            </tr>
            `
        })
    }
    document.getElementById('showOrder').innerHTML = orderHtml;
}

let orders = localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')) : [];
window.onload = showOrder(orders);
// hiển thị thời gian
function formatDate(date){
    let fm = new Date(date)
    let year = fm.getFullYear();
    let month = fm.getMonth() + 1;
    let day = fm.getDate();
    if(day < 10)    day = '0' + day;
    if(month < 10)  month = '0' + month;
    return day + '/' + month + '/' + year;
}
// đơn giá VND
function VND(price) {
    if (typeof price !== 'number') {
        return "Invalid input"; // hoặc bất kỳ giá trị bạn muốn trả về khi giá trị đầu vào không phải là số
    }
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}
// function tongSoLuong(orderId){
//     let sum = 0;
//     let detailOrder = JSON.parse(localStorage.getItem('orderDetails')) ?? [];
//     detailOrder.filter(item => item.orderId == orderId).forEach(item => {
//         sum += item.orderedCart.quantity;
//     });

//     return parseInt(sum);
// }
function tongSoLuong(orderedCart) {
    if(orderedCart == null){
        return 'ERROR!!!'
    }
    return parseInt(orderedCart.reduce((sum, item) => sum + item.quantity, 0));
}
// chi tiết đơn hàng
// function detailOrder(id){
//     document.querySelector('.modal.detail-order').classList.add('open');
//     let orders = localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')) : [];
//     let products = localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [] ;
//     let order = orders.find((item) => item.orderId == id);
//     let dtDon = getOrderDetails(id);
//     let orderedCart = dtDon.orderedCart;
//     let spHtml = `<div class="modal-detail-left"><div class="order-item-group">`;
//     dtDon.forEach((item) => {
//         // orderedCart = dtDon.orderedCart;
//         // orderedCart.push(dtDon.orderedCart);
//         // console.log(orderedCart);
//         orderedCart.forEach(i => {
//             let detailSP = products.find(product => product.id == item.orderId);
//             spHtml += `
//         <div class="order-product">
//             <div class="order-product-left">    
//                 <img src="${detailSP.img}">
//                 <div class="order-product-info">
//                     <h4>${detailSP.name}</h4>
//                     <p class="order-product-quanlity">SL: ${i.quantity}</p>
//                 </div>
//             </div>
//             <div class="order-product-right">s
//                 <div class="order-product-price">
//                     <span class="order-product-current-price">${VND(item.doanhthu)}</span>
//                 </div>
//             </div>
//         </div>
//         `
//         })
//         console.log(spHtml);
//         });
//         spHtml += `</div></div>`
//         spHtml += `
//         <div class="modal-detail-right">
//                 <ul class="detail-order-group">
//                     <li class="detail-order-item">
//                         <span class="detail-order-item-left">Nguời nhận: </span>
//                         <span class="detail-order-item-right">${order.fullname}</span>
//                     </li>
//                     <li class="detail-order-item">
//                         <span class="detail-order-item-left">Số điện thoại: </span>
//                         <span class="detail-order-item-right">${order.phone}</span>
//                     </li>
//                     <li class="detail-order-item">
//                         <span class="detail-order-item-left">Ngày đặt hàng: </span>
//                         <span class="detail-order-item-right">${order.thoigiandat}</span>
//                     </li>
//                     <li class="detail-order-item">
//                         <span class="detail-order-item-left">Ngày giap hàng: </span>
//                         <span class="detail-order-item-right">${order.thoigiangiao}</span>
//                     </li>
//                     <li class="detail-order-item">
//                         <span class="detail-order-item-left">Địa chỉ nhận hàng: </span>
//                         <span class="detail-order-item-right">${order.detailAddress + '-' + order.ward + '-' + order.district + '-' + order.province}</span>
//                     </li>
//                 </ul>
//         </div>
//         `
//     document.querySelector('.modal-detail-order').innerHTML = spHtml;
//     let classDetailBtn = order.trangthai == 0 ? 'btn-chuaxuly' : 'btn-daxuly';
//     let textDetailBtn = order.trangthai == 0 ? 'Chưa xử lý' : 'Đã xử lý';
//     document.querySelector('.modal-detail-bottom').innerHTML = `
//     <div class="modal-detail-bottom">
//         <button class="modal-detail-btn ${classDetailBtn}" onclick="changeStatus(${order.id}, this)">${textDetailBtn}</button>
//     </div>
//     `   
// }
function detailOrder(id) {
    document.querySelector('.modal.detail-order').classList.add('open');
    let orders = localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')) : [];
    let products = localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [] ;
    let order = orders.find((item) => item.orderId == id);
    let dtDon = getOrderDetails(id);
    let Cart = [];
    // console.log(order);
    // console.log(dtDon);
    // dtDon.forEach(item=>{
    //     console.log(item.orderedCart);
    //     if (item.hasOwnProperty('orderedCart') && Array.isArray(item.orderedCart)) {
    //         // Đẩy tất cả các phần tử của 'orderedCart' vào 'Cart'
    //         Cart.push(...item.orderedCart);
    //     }
    //     console(Cart);
    //     });
    let spHtml = `
        <div class="modal-detail-left">
            <div class="order-item-group">
    `;
    
    dtDon.forEach(i=>{
        i.orderedCart.forEach((item) => {
            // console.log(i.orderedCart);
                    let detailSP = products.find(product => product.id == item.itemId);
                    // console.log(detailSP.price)
                    spHtml += `
                        <div class="order-product">
                            <div class="order-product-left">    
                                <img src="${detailSP.img}">
                                <div class="order-product-info">
                                    <h4>${detailSP.name}</h4>
                                    <p class="order-product-quanlity">SL: ${item.quantity}</p>
                                </div>
                            </div>
                            <div class="order-product-right">
                                <div class="order-product-price">
                                    <span class="order-product-current-price">${detailSP.price}</span>
                                </div>
                            </div>
                        </div>
                    `;
                });
    
        
   
    spHtml += `
            </div>
        </div>
        <div class="modal-detail-right">
            <ul class="detail-order-group">
                <li class="detail-order-item">
                    <span class="detail-order-item-left">Người nhận:</span>
                    <span class="detail-order-item-right">${order.fullname}</span>
                </li>
                <li class="detail-order-item">
                    <span class="detail-order-item-left">Số điện thoại:</span>
                    <span class="detail-order-item-right">${order.phone}</span>
                </li>
                <li class="detail-order-item">
                    <span class="detail-order-item-left">Ngày đặt hàng:</span>
                    <span class="detail-order-item-right">${formatDate(order.thoigiandat)}</span>
                </li>
                <li class="detail-order-item">
                    <span class="detail-order-item-left">Ngày giao hàng:</span>
                    <span class="detail-order-item-right">${formatDate(i.thoigiangiao)}</span>
                </li>
                <li class="detail-order-item">
                    <span class="detail-order-item-left">Địa chỉ nhận hàng:</span>
                    <span class="detail-order-item-right">${order.detailAddress + '-' + order.ward + '-' + order.district + '-' + order.province}</span>
                </li>
            </ul>
        </div>
    `});
    ;
    document.querySelector('.modal-detail-order').innerHTML = spHtml;

    let classDetailBtn = order.trangthai == 0 ? 'btn-chuaxuly' : 'btn-daxuly';
    let textDetailBtn = order.trangthai == 0 ? 'Chưa xử lý' : 'Đã xử lý';

    document.querySelector('.modal-detail-bottom').innerHTML = `
        <div class="modal-detail-bottom">
            <button class="modal-detail-btn ${classDetailBtn}" onclick="changeStatus(${order.orderId}, this)">${textDetailBtn}</button>
        </div>
    `;
}


// lấy chi tiết đơn hàng
function getOrderDetails(madon){
    let orderDetails = JSON.parse(localStorage.getItem('orderDetails')) ?? [];
    let ctDon = [];
    orderDetails.forEach((item) => {
        if(item.orderId == madon){
            ctDon.push(item)
        }
    });
    return ctDon;
}
// thoát tìm kiếm đơn hàng
function cancelSearchOrder(){
    let orders = localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')) : [];
    document.getElementById('status').value = 2;
    document.getElementById('form-search-order'),value = '';
    document.getElementById('order-time-start').value = '';
    document.getElementById('order-time-end').value = '';
    showOrder(orders);
}

// Thống kê
// tạo object thống kê
// Statistical = {id,madon,price,soluong,brand,name,img,time}




let products = localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
let orderDetails = localStorage.getItem('orderDetails') ? JSON.parse(localStorage.getItem('orderDetails')) : [];
const brandProduct = [...new Set(products.map(product => product.brand))];
function createObjTK() {
    // let thongke = localStorage.getItem('thongke') ? JSON.parse(localStorage.getItem('thongke')) : [];
    // console.log(thongke)
    let idOrder = [];
    let re = [];
    let orderCart = [];
     orders.forEach(item => {
            if (parseInt(item.trangthai) === 1) {
                idOrder.push(item.orderId);
            }
            
    });

    orderDetails.forEach(item => {
            if (idOrder.includes(item.orderId)) {
                orderCart.push(item.orderedCart);
            }
    });

    for (let i = 0; i < brandProduct.length; i++) {
       
        let soluong = 0;
        let doanhthu = 0;
        let ord = [];
        let arr = {}
        for (let j = 0; j < orderCart.length; j++) {
            for (let k = 0; k < orderCart[j].length; k++) {
                let detailSP = products.find(product => product.id == orderCart[j][k].itemId);
                if (detailSP && detailSP.brand == brandProduct[i]) {
                    soluong += orderCart[j][k].quantity;
                    // doanhthu += parseInt(orderCart[j][k].quantity) * parseFloat(detailSP.price);
                    if(detailSP.price.length <= 7){
                        doanhthu += parseInt(orderCart[j][k].quantity) * parseFloat(detailSP.price)*1000;
                    } else {
                        doanhthu += parseInt(orderCart[j][k].quantity) * parseFloat(detailSP.price)*1000000;
                    }
                }
            }
        }


        orderDetails.forEach(item => {
            if (idOrder.includes(item.orderId)) {
                item.orderedCart.forEach(i => {
                    let tmp = products.filter(product => product.id == i.itemId);
                    if(tmp && tmp.brand == brandProduct[i]){
                        arr = {
                            orderId: item.orderId
                        }
                        
                    }
                    
                })
                ord.push(arr)
            }
            
        });

        let obj = {
            name: brandProduct[i],
            quanlity: soluong,
            doanhthu: doanhthu,
            orderId: ord
        };
        re.push(obj);
        
    }
    

    localStorage.setItem('thongke', JSON.stringify(re));
    // re = localStorage.getItem('thongke') ? JSON.parse(localStorage.getItem('thongke')) : [];
    // return re;
}

window.onload =  createObjTK();

// tìm danh sách thống kê 
function Thongke(mode){
    let arr = localStorage.getItem('thongke') ? JSON.parse(localStorage.getItem('thongke')) : [];
    let result;

    let phanloai = document.getElementById('phanloai').value;
    let ct = document.getElementById('form-search-tk').value;
    
    result = phanloai === 'Tất cả' ? arr : arr.filter((item) => item.name == phanloai);
    result = ct == '' ? result : result.filter((item)=>{
        return item.name.toString().toLowerCase().includes(ct.toString().toLowerCase());
    });
    showThongKe(result, mode);
}
window.onload = Thongke(2);
// hiển thị danh sách thống kê theo sắp xếp

function showThongKe(arr, mode){
    let html = '';
    showOverview(arr);
    if(arr.length <= 0){
        html += `<td colspan='6'>Không có dữ liệu</td>`;
    }
    else{
        
        switch(mode){
            case 2:
                document.getElementById('phanloai').value = 'Tất cả';
                document.getElementById('form-search-tk').value = '';
                // document.getElementById('time-start-tk').value = '';
                // document.getElementById('time-end-tk').value = '';
                break;
            case 0:
                arr.sort((a,b) => parseInt(a.doanhthu) - parseInt(b.doanhthu));
                break;
            case 1:
                arr.sort((a,b) => parseInt(b.doanhthu) - parseInt(a.doanhthu));
                break;
        }
        for(let i = 0 ; i < arr.length ; i++){
            html += `
            <tr>
                <td>${i + 1}</td>
                <td>${arr[i].name}</td>
                <td>${arr[i].quanlity}</td>
                <td>${VND(arr[i].doanhthu)}</td>
                <td><button class="btn-detail-thongke product-order-detail" onclick="detailOrderProduct('${arr[i].name}')">Chi tiết</button></td>
            </tr>
            `
        }
    }
    document.getElementById('showThongKe').innerHTML = html;
}


// hiển thị số lượng sp, đơn hàng, doanh thu
function showOverview(arr){
    let tmp = arr.filter(item => item.quanlity != 0);
    // let arr = createObjTK();
    let orders = JSON.parse(localStorage.getItem('orders')) ?? [];
    orders.filter(item => item.status === 1);
    document.getElementById("quantity-product-sold").innerText = getNumberOfProductSold(tmp);
    document.getElementById("quanlity-order").innerText = tmp.length;
    resetDataAmountDoanhThu();
    document.getElementById("revenue").innerText = toVND(getMoney1(tmp)) + " đ";
}
function getOrderComplete(){
    // let arr = createObjTK();

    let orders = localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')) : [];
    let count = 0;
    orders.forEach(item => {
        if(parseInt(item.trangthai) == 1){
            count++;
        }
    })
    return count;
}
function getNumberOfProductSold(arr){
    // // let arr = createObjTK();
    // let arr = localStorage.getItem('thongke') ? JSON.parse(localStorage.getItem('thongke')) : [];
    // let tmp = [];
    // let otp;
    // for(let i = 0 ; i < arr.length ; i++){
    //     for(let j = 0 ; j < arr[i].orderId.length ; j++){
    //         let detail = orderDetails.find(item => item.orderId == arr[i].orderId[j].orderId);
    //         detail.orderedCart.forEach(i => {
    //             otp = {
    //                 itemId: i.itemId
    //             }
    //             tmp.push(otp)
    //         })
            
    //     }
        
    // }
    // // const brandProduct = [...new Set(products.map(product => product.brand))];
    // tmp = [...new Set(tmp.map(tm => tm.itemId))];
    // console.log(tmp);

    // return tmp.length;
    let rs = 0;
    // let orders = localStorage.getItem('thongke') ? JSON.parse(localStorage.getItem('thongke')) : [];
    arr.forEach(order =>{
        rs += order.quanlity;
    })
    return rs;
}



function detailOrderProduct(brand) {
    // let arr = createObjTK();
    let arr = localStorage.getItem('thongke') ? JSON.parse(localStorage.getItem('thongke')) : [];


    let rows = [];

    for (let a = 0; a < arr.length; a++) {
        for (let b = 0; b < arr[a].orderId.length; b++) {
            let order = orders.find(t => t.orderId == arr[a].orderId[b].orderId);
            // console.log('Order ID:', order.orderId);

            let detail = orderDetails.find(item => item.orderId == arr[a].orderId[b].orderId);
            detail.orderedCart.forEach(item => {
                let product = products.find(t => t.id == item.itemId);
                // console.log('Product ID:', product.id);

                if (product.brand == brand) {
                    let price;
                    if(product.price.length <= 7){
                        price = parseInt(item.quantity) * parseFloat(product.price) * 1000;
                    }
                    else{
                        price = parseInt(item.quantity) * parseFloat(product.price) * 1000000;
                    }
                    let row = `
                        <tr>
                            <td>${order.orderId}</td>
                            <td>${item.quantity}</td>
                            <td>${VND(price)}</td>
                            <td>${formatDate(order.thoigiandat)}</td>
                            <td>${formatDate(order.thoigiangiao)}</td>
                        </tr>
                    `;
                    rows.push(row);
                }
            });
        }
    }
    rows = [...new Set(rows)];
    document.querySelector('.show-detail-order-product').innerHTML = rows.join('');
    document.querySelector('.modal.detail-order-product').classList.add('open');
}

