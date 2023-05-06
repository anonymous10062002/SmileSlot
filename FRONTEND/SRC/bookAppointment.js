const appointmentForm = document.querySelector("form");
appointmentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const day = document.querySelector("#day").value;
  const date = document.querySelector("#date").value;
  const year = document.querySelector("#year").value;
  const exact_date = year+":"+day+":"+date;
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

const appointmentData = (
  city,
  clinic,
  date,
  mobile_number,
  name,
  email,
  text_msg
) => {
  console.log(city, clinic, date, mobile_number, name, email, text_msg);
};
