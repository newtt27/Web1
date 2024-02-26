let customerShippingProvince = document.getElementById('customer_shipping_province');
let customerShippingDistrict = document.getElementById('customer_shipping_district');
let customerShippingWard = document.getElementById('customer_shipping_ward');
let listCity = [];
let listDistrict = [];
let listWard = [];

let currentCityCode = 0;
let currentDistrictCode = 0;
let currentWardCode = 0;
function initAddress() {
    fetch('/json/wards.json')
    .then(response => response.json())
    .then(data => {
        listWard = data;
    })
    // get datas from file json
    fetch('/json/districts.json')
    .then(response => response.json())
    .then(data => {
        listDistrict = data;
    })
    fetch('/json/cities.json')
    .then(response => response.json())
    .then(data => {
        listCity = data;
        addCity();
    })
}
const addCity = () => {
    customerShippingProvince.innerHTML = '';
        if(listCity.length > 0){
            if (currentCityCode == 0){
                customerShippingProvince.innerHTML = `<option value="null" data-code="null">Chọn tỉnh / thành</option>`;
                listCity.forEach(city => {
                    const newCity = document.createElement('option');
                    newCity.dataset.code = city.code;
                    newCity.value = city.name;
                    newCity.text = city.name_with_type;
                    newCity.name = city.slug;
                    customerShippingProvince.appendChild(newCity);
                    // console.log(newCity.name);
                })
            }
            else{
                listCity.forEach(city => {
                    {
                        const newCity = document.createElement('option');
                        newCity.dataset.code = city.code;
                        newCity.value = city.name;
                        newCity.text = city.name_with_type;
                        newCity.name = city.slug;
                        if (Number(city.code) == currentCityCode) 
                            newCity.selected = true;
                        customerShippingProvince.appendChild(newCity);
                        // console.log(newCity.name);
                    }
                })
            }
        }
        currentDistrictCode = 0;
    addDistrict(currentCityCode);
}
customerShippingProvince.addEventListener('change', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('field-input-province'))
    {
        currentCityCode = getCityCode();
        addCity();
    }
})
function getCityCode() {
    let selectedOpt = customerShippingProvince.options[customerShippingProvince.selectedIndex];
    let cityCode = selectedOpt.dataset.code;
    //  alert(cityCode);
    return cityCode;
}
function addDistrict(cityCode){
    
    customerShippingDistrict.innerHTML = '<option value="null" data-code="null">Chọn quận / huyện</option>';
    if(listDistrict.length > 0){
        if (currentDistrictCode == 0) {
            listDistrict.forEach(district => {
                const parentCode = Number(district.parent_code);
                if (parentCode == cityCode) {
                    if (currentDistrictCode == 0) {
                        currentDistrictCode = Number(district.code);
                    }
                    console.log(typeof(district.parent_code));
                    const newDistrict = document.createElement('option');
                    newDistrict.dataset.code = district.code;
                    newDistrict.value = district.name;
                    newDistrict.text = district.name_with_type;
                    newDistrict.name = district.slug;
                    customerShippingDistrict.appendChild(newDistrict);
                    // console.log(newDistrict.name);
                }

            })
        }
        else{
            listDistrict.forEach(district => {
                const parentCode = Number(district.parent_code);
                if (parentCode == cityCode) {
                    console.log(typeof(district.parent_code));
                    const newDistrict = document.createElement('option');
                    newDistrict.dataset.code = district.code;
                    newDistrict.value = district.name;
                    newDistrict.text = district.name_with_type;
                    newDistrict.name = district.slug;
                    if (Number(district.code) == currentDistrictCode) 
                    {
                        newDistrict.selected = true;
                    }
                    customerShippingDistrict.appendChild(newDistrict);
                    // console.log(newDistrict.name);
                }
            })
            // currentDistrictCode = 0;
        }
    }
    addWard(currentDistrictCode);
}
customerShippingDistrict.addEventListener('change', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('field-input-district'))
    {
        currentDistrictCode = getDistrictCode();
        addDistrict(currentCityCode);
    }
})
function getDistrictCode() {
    let selectedOpt = customerShippingDistrict.options[customerShippingDistrict.selectedIndex];
    let districtCode = selectedOpt.dataset.code;
    // alert(districtCode);
    return districtCode;
}
function addWard(districtCode){
    
    customerShippingWard.innerHTML = '<option value="null" data-code="null">Chọn phường / xã</option>';
    if(listWard.length > 0){
        if (currentWardCode == 0) {
            listWard.forEach(ward => {
                const parentCode = Number(ward.parent_code);
                if (parentCode == districtCode) {
                    console.log(typeof(ward.parent_code));
                    const newWard = document.createElement('option');
                    newWard.dataset.code = ward.code;
                    newWard.value = ward.name;
                    newWard.text = ward.name_with_type;
                    newWard.name = ward.slug;
                    customerShippingWard.appendChild(newWard);
                    // console.log(newDistrict.name);
                }
            })
        }
        else{
            listWard.forEach(ward => {
                const parentCode = Number(ward.parent_code);
                if (parentCode == districtCode) {
                    console.log(typeof(ward.parent_code));
                    const newWard = document.createElement('option');
                    newWard.dataset.code = ward.code;
                    newWard.value = ward.name;
                    newWard.text = ward.name_with_type;
                    newWard.name = ward.slug;
                    if (Number(ward.code) == currentWardCode) 
                        newWard.selected = true;
                    customerShippingWard.appendChild(newWard);
                    // console.log(newDistrict.name);
                }
            })
        }
    }
}
customerShippingWard.addEventListener('change', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('field-input-ward'))
    {
        currentWardCode = getWardCode();
        addWard(currentDistrictCode);
    }
})
function getWardCode() {
    let selectedOpt = customerShippingWard.options[customerShippingWard.selectedIndex];
    let wardCode = selectedOpt.dataset.code;
    // alert(wardCode);
    return wardCode;
}
initAddress();