const token = localStorage.getItem("dentaltoken");
const fetchCity = async () => {
  let res = await fetch(`https://dull-cyan-hatchling-yoke.cyclic.app/users/allcities`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  let cityData = await res.json();
  const citySelect = document.querySelector("#city");
  cityData.cities.map((el) => {
    let option = new Option(el, el);
    citySelect.add(option, undefined);
    // citySelect.innerHTML = `
    // <option value="">Select City</option>
    // <option value="${city}">${city}</option>
    //`
  });
  citySelect.addEventListener("change", () => {
    fetchClinic(citySelect.value);
  });

  const fetchClinic = async (city) => {
    const response = await fetch(`https://dull-cyan-hatchling-yoke.cyclic.app/users/clinic/${city}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    let clinicData = await response.json();
    clinicData = clinicData.clinic;
    console.log("clini", clinicData);

    const clinicSelect = document.querySelector("#clinic");
    clinicSelect.innerHTML = "";
    clinicData.map((el) => {
      let option = new Option(el.clinic, el._id);
      // option.value=el._id;
      // option.text=el.clinic;

      clinicSelect.add(option, undefined);
      // clinicSelect.innerHTML = `
      // <option value="">Select City</option>
      // <option value="${el._id}">${el.clinic}</option>
      // `
    });
    citySelect.addEventListener("change", () => {});
  };
};
window.onload = fetchCity();

const appointmentForm = document.querySelector("form");
appointmentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const month = document.querySelector("#month").value;
  const date = document.querySelector("#datee").value;
  const year = document.querySelector("#year").value;
  const exact_date = year + ":" + month + ":" + date;
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
  //let appointData = {city,clinic,date,mobile_number,name,email,text_msg}
  let appointData = { date };

  let clinic_id = document.querySelector("#clinic").value;

  //console.log(clinic_id,appointData)

  const response = await fetch(
    `https://dull-cyan-hatchling-yoke.cyclic.app/users/bookslot/${clinic_id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(appointData),
    }
  );

  let result = await response.json();
  if(result.msg){
    swal(``, result.msg, "success");
    setTimeout(()=>{
      window.location.href = "../Public/thankyou.html"
    },2000)
  }else{
    swal(``, result.err, "error");
  }
};
