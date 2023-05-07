const token = sessionStorage.getItem("token");
const fetchCity = async () => {
  let res = await fetch("http://localhost:4000/users/allcities", {
    method:"GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  let cityData = await res.json();
  // console.log(cityData)
  const citySelect = document.querySelector("#city");
  cityData.map((city)=>{
    citySelect.innerHTML = `
    <option value="">Select City</option>
    <option value="${city}">${city}</option>
    `
  });
  citySelect.addEventListener("change", () => {
    fetchClinic(citySelect.value);
  })

  const fetchClinic = async (city) => {
    const response = await fetch(`http://localhost:4000/clinic/:${city}`, {
      method: "GET",
      headers: {
        'Content-Type':"application/json",
        Authorization: `Bearer ${token}`
      }
    });
    const clinicData = await response.json();
    console.log(clinicData)
  }
}
window.onload = fetchCity();

const appointmentForm = document.querySelector("form");
appointmentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const month = document.querySelector("#month").value;
  const date = document.querySelector("#datee").value;
  const year = document.querySelector("#year").value;
  const exact_date = year+":"+month+":"+date;
  const userDetails = {
    city: document.querySelector("#city").value,
    clinic: document.querySelector("#clinic").value,
    date: exact_date,
    mobile_number: document.querySelector("#mobile-number").value,
    name: document.querySelector("#name").value,
    email: document.querySelector("#email").value,
    text_msg: document.querySelector("#text-message").value,
  };

  appointmentData(
    userDetails.city,
    userDetails.clinic,
    userDetails.date,
    userDetails.mobile_number,
    userDetails.name,
    userDetails.email,
    userDetails.text_msg
  );
});

const appointmentData = async (
  city,
  clinic,
  date,
  mobile_number,
  name,
  email,
  text_msg
) => {
  const appointData = {city,clinic,date,mobile_number,name,email,text_msg}
  const response = fetch("http://localhost:4000/users/bookslot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(appointData)
  })
  if(response.status){
    alert("Slot Booked");
  }
  console.log(city, clinic, date, mobile_number, name, email, text_msg);
};