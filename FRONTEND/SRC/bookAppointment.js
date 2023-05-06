const cityClinicForm = document.querySelector("#city-form");
const dateForm = document.querySelector("#date-form");
const personalDetail = document.querySelector("#personal-detail");
const allData = new Array();

cityClinicForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  const cityClinicData = {
    city: document.getElementById("city").value,
    clinic: document.getElementById("clinic").value
  }
  allData.push(cityClinicData.city)
  allData.push(cityClinicData.clinic)
})

dateForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  const dateData = {
    day: document.getElementById("day").value,
    date: document.getElementById("date").value,
    year: document.getElementById("year").value
  }
  allData.push(dateData.day);
  allData.push(dateData.date);
  allData.push(dateData.year);
})

personalDetail.addEventListener("submit", (e)=>{
  e.preventDefault();
  const personalDetail = {
    mobile: document.getElementById("mobile-number").value,
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    text_msg: document.getElementById("text-message").value
  }
  allData.push(personalDetail.mobile, personalDetail.name, personalDetail.email, personalDetail.text_msg)
})


const formData = (allData) => {
  console.log(city, clinic);
} 
formData();


