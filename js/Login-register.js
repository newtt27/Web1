const loregbox = document.querySelector('.logreg-box');
const loginLink = document.querySelector('.login-link');
const registerLink= document.querySelector('.register-link');

//Chuyển sang phần đăng kí
registerLink.addEventListener('click', () =>{
    loregbox.classList.add('active');
})

//Chuyển sang phần đăng nhập
loginLink.addEventListener('click', () =>{
    loregbox.classList.remove('active');
})

//Kéo trang xuống phần footer khi click contact
function scrollToElement(id) {
    var element = document.getElementById(id);
    element.scrollIntoView({ behavior: 'smooth' });
}

let signin = document.getElementById('signin_btn');
let signup = document.getElementById('signup_btn');

// Chức năng đăng nhập
signin.addEventListener('click', ()=>{
    event.preventDefault();  
    let userlog = document.getElementById('Userlog').value;
    let password_log = document.getElementById('pwlog').value;
    let userannounce = document.getElementById('user_announce');
    let passwordannounce = document.getElementById('password_announce');

    isusernamevalid = true;
    ispasswordvalid = true;
    if(!validateUsername(userlog) || userlog.length == null){
        userannounce.style.display = 'flex';
        userannounce.innerHTML = `Tài khoản không hợp lệ`;
        isusernamevalid = false;
    }
    else{
        userannounce.style.display = 'none';
        isusernamevalid = true;
    }
    if(password_log.length === null || !validatePassword(password_log)){
      passwordannounce.style.display = 'flex';
      passwordannounce.innerHTML = `Mật khẩu không hợp lệ`;
      ispasswordvalid = false;
    }
    else{
      passwordannounce.style.display = 'none';
      ispasswordvalid = true;
    } 
    if(isusernamevalid==true && ispasswordvalid==true){
        let users = JSON.parse(localStorage.getItem('registrations'));
        let admin = JSON.parse(localStorage.getItem('Admin'));
        let loginsuccess_customer = false;
        let loginsuccess_admin = false;

        //Kiểm tra đăng nhập của admin
        if(admin[0].username === userlog && admin[0].password === password_log){
          loginsuccess_admin = true;
          window.location.href="index.html";
          localStorage.setItem('Username',admin[0].username);
          localStorage.setItem('AdminLogged', true); 
        }
        event.preventDefault(); 
        if(!loginsuccess_admin){
          //Kiểm tra đăng nhập của khách hàng
          users.forEach(user => {
          if(user.status === 1){
            if(user.username === userlog && user.password === password_log){
              loginsuccess_customer = true;
              alert('Đăng nhập thành công');
              window.location.href="index.html";
              localStorage.setItem('Username',user.username);
              localStorage.setItem('isLogged', true); 
            }
          } else{
            alert("Tài khoản đã bị khóa vui lòng liên hệ admin để mở.");
          }
          
          });   
          if(!loginsuccess_customer){
            alert("Tên đăng nhập hoặc mật khẩu không chính xác. Quý khách vui lòng kiểm tra và đăng nhập lại");
          }
        }
    }
  });


  function formatDate(date){
    let fm = new Date(date)
    let year = fm.getFullYear();
    let month = fm.getMonth();
    let day = fm.getDate();
    if(day < 10)    day = '0' + day;
    if(month < 10)  month = '0' + month;
    return day + '/' + month + '/' + year;
}  
//regex
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
  const regex = /^0[0-9]{9,10}$/;
  return regex.test(phoneNumber);
}
function validateEmail(Email){
  const regex = /^[a-zA-Z0-9.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z\.]{2,}$/;
  return regex.test(Email);
}
// Chức năng đăng kí
signup.addEventListener('click', ()=>{
    let Email_regis = document.getElementById('emailregis').value;
    let SDT_regis = document.getElementById('sdtregis').value;
    let User_regis = document.getElementById('userregis').value;
    let Pass_regis = document.getElementById('pwregis').value;
    let emailannounce = document.getElementById('email_announce');
    let sdtannounce = document.getElementById('sdt_announce');
    let userregannounce = document.getElementById('userreg_announce');
    let passregannounce = document.getElementById('passreg_announce');
    // Kiểm tra thông tin đăng ký hợp lệ
  let isValid = true;
  // Email
  if (Email_regis.length === 0) {
    emailannounce.style.display = 'flex';
    emailannounce.innerHTML = "Email không bỏ trống";
    isValid = false;
  }
  else if(!validateEmail(Email_regis)){
    emailannounce.style.display = 'flex';
    emailannounce.innerHTML = "Email không hợp lệ";
    isValid = false;
  }
  else{
    emailannounce.style.display = 'none';
  }
  // SDT
  if (SDT_regis.length === 0) {
    sdtannounce.style.display = 'flex';
    sdtannounce.innerHTML = "Số điện thoại không bỏ trống";
    isValid = false;
  }
  else if(!validatePhoneNumber(SDT_regis)) {
    sdtannounce.style.display = 'flex';
    sdtannounce.innerHTML = "Số điện thoại từ 10-11 số và bắt đầu bằng số 0";
    isValid = false;
  }
  else{
    sdtannounce.style.display = 'none';
  }
  // Tên đăng nhập
  if(validateUsername(User_regis)){
    userregannounce.style.display = 'none';
  }
  else{
    userregannounce.style.display = 'flex';
    userregannounce.innerHTML = 'Tên đăng nhập chỉ có chữ cái và số và dưới 20 kí tự'
    isValid = false;
  } 
  // Mật khẩu
  if(validatePassword(Pass_regis)){
    passregannounce.style.display = 'none';
  }
  else{
    passregannounce.style.display = 'flex';
    passregannounce.innerHTML = 'Mật khẩu chỉ có chữ cái và số và ít nhất 5 kí tự'
    isValid = false;
  }
  // Lưu thông tin đăng ký vào local storage
  if (isValid) {
    var registrations = localStorage.getItem('registrations');
    registrations = registrations ? JSON.parse(registrations) : [];

    // Kiểm tra xem tên đăng nhập đã tồn tại chưa
    var isExistingUser = registrations.some(
      (registration) => registration.username === User_regis
    );
    var isExistingEmail = registrations.some(
      (registration) => registration.email === Email_regis
    );
    var isExistingPhone = registrations.some(
      (registration) => registration.sdt === SDT_regis
    );
    if (isExistingUser) {
      alert('Tên đăng nhập đã tồn tại. Vui lòng chọn tên đăng nhập khác.');
    }
    else if(isExistingEmail){
      alert("Địa chỉ mail đã tồn tại. Vui lòng nhập lại email khác");
    }
    else if(isExistingPhone){
      alert("Số điện thoại này đã được sử dụng. Vui lòng nhập lại số điện thoại khác");
    }
    else {
      var newRegistration = {
        id:0,
        email: Email_regis,
        sdt: SDT_regis,
        username: User_regis,
        password: Pass_regis,
        status: 1
      };
      registrations.push(newRegistration);
      registrations = resetId(registrations);
      localStorage.setItem('registrations', JSON.stringify(registrations));
      alert('Đăng ký thành công!');
    }
    }
})
function resetId(array){
  var id = 0;
  array.forEach((item,id) => {
      item.id = id++;
  });
  return array;
}
//Chức năng ẩn/hiện pw
let eye = document.getElementById('eye');
let eye_slash = document.getElementById('eye_slash');
let password_input = document.getElementById('pwlog');
let eye_regis = document.getElementById('eye_regis');
let eye_slash_regis = document.getElementById('eye_slash_regis'); 
let pwregis = document.getElementById('pwregis');
//Hiện mật khẩu
eye_slash.addEventListener('click', ()=>{
  eye.style.display = 'flex';
  eye_slash.style.display = 'none';
  password_input.type = 'text';
})

eye.addEventListener('click', ()=>{
  eye_slash.style.display = 'flex';
  eye.style.display = 'none';
  password_input.type = 'password';
})

eye_slash_regis.addEventListener('click', ()=>{
  eye_regis.style.display = 'flex';
  eye_slash_regis.style.display = 'none';
  pwregis.type = 'text';
})
eye_regis.addEventListener('click', ()=>{
  eye_slash_regis.style.display = 'flex';
  eye_regis.style.display = 'none';
  pwregis.type = 'password';  
})
//Admin account
window.onload = function() {
  var Admin = localStorage.getItem('Admin');
      Admin = Admin ? JSON.parse(Admin) : [];
  if (Admin.length===0) { 
    var Adminaccount = {
      email: "moctan27@gmail.com",
      username: "moctan27",
      phone: "0123456789",
      password: "admin1234",  
    };
    Admin.push(Adminaccount);
    localStorage.setItem('Admin', JSON.stringify(Admin));
  }
}

