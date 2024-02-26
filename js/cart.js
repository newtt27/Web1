let cart = document.querySelector('.cart');
let iconCart = document.querySelector('.cart-icon');
let closeCart = document.querySelector('.close');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.addedToCart');
// let productId =  new URLSearchParams(window.location.search).get('id');
let content = document.querySelector('.content');

let listProduct = [];
let carts = [];
iconCart.addEventListener('click', () => {
    cart.classList.toggle('showCart');
})
closeCart.addEventListener('click', () => {
    cart.classList.toggle('showCart');
})

const initApp = () => {
// get datas from file json
    listProduct = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
        //get cart from memory
        if (localStorage.getItem('cart')) {
            carts = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    
}
content.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addtocart'))
    {
        let product_id = positionClick.parentElement.parentElement.parentElement.dataset.id;
        addToCart(product_id);
    }
    if (positionClick.classList.contains('checkout'))
    {
        let product_id = positionClick.parentElement.parentElement.parentElement.dataset.id;
        addToCart(product_id);
        window.location.href = "thanhtoan.html";
    }
})
const addToCart = (product_id) => {
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
    if (carts.length <= 0) {
        carts = [{
            product_id: product_id,
            quantity: 1
        }];
    }
    else if (positionThisProductInCart < 0) {
        carts.push({
            product_id: product_id,
            quantity: 1
        });
    }
    else {
        carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1
    }
    addCartToHTML();
    addCartToMemory();
}

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
}

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if(carts.length > 0){
        carts.forEach(cart => {
            totalQuantity = totalQuantity + cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id;
            let positionProduct = listProduct.findIndex((value) => value.id == cart.product_id);
            let info = listProduct[positionProduct];
            console.log(info);
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
initApp();