let userBtn = document.getElementById("user_data_btn");
let clinicBtn = document.getElementById("clinic_data_btn");

let token = localStorage.getItem("admin_token");

let tableheading = document.getElementById("tableHeading");

let col1 = document.getElementById("col1");
let col2 = document.getElementById("col2");
let col3 = document.getElementById("col3");
let col4 = document.getElementById("col4");
let col5 = document.getElementById("col5");

userBtn.addEventListener("click", fetchingUserData);
clinicBtn.addEventListener("click", fetchingClinicData);
window.addEventListener("load", fetchingUserData);

function fetchingClinicData() {
  tableheading.innerText = "Smile Slot Clinic Data";

  col1.innerText = "Owner ID";
  col2.innerText = "City";
  col3.innerText = "Clinic Name";
  col4.innerHTML = null;
  col5.innerHTML = null;

  fetch(`http://localhost:4000/admin/allclinics`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res, res.msg);
      showClinicData(res.msg);
    })
    .catch((err) => console.log(err));
}

function fetchingUserData() {
  tableheading.innerText = "Smile Slot User Data";

  col1.innerText = "Email";
  col2.innerText = "Age";
  col3.innerText = "Role";
  col4.innerText = "Block";
  col5.innerText = "Verified";

  fetch(`http://localhost:4000/admin/getusers`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) =>{ return res.json()})
    .then((res) => {
      console.log(res, res.msg);
      showData(res.msg);
    })
    .catch((err) => console.log(err));
}

let tbody = document.getElementById("tbody");

function showData(arr) {
  tbody.innerHTML = null;
  arr.forEach((el) => {
    let tr = document.createElement("tr");

    let email = document.createElement("td");
    email.innerText = el.email;

    let age = document.createElement("td");
    age.innerText = el.age;

    let role = document.createElement("td");
    role.innerText = el.role;

    let Delete = document.createElement("td");
    Delete.innerText = "BLOCK";
    Delete.setAttribute("id", "delete");

    let verified = document.createElement("td");
    verified.innerText = el.verified;

    // Delete.addEventListener("click", function () {
    //   arr.splice(index, 1);
    //   localStorage.setItem("addData", JSON.stringify(arr));
    //   showData(arr);
    // });

    tr.append(email, age, role, Delete, verified);
    tbody.append(tr);
  });
}

function showClinicData(arr) {
  tbody.innerHTML = null;
  arr.forEach((el) => {
    let tr = document.createElement("tr");

    let ownerId = document.createElement("td");
    ownerId.innerText = el.userID;

    let city = document.createElement("td");
    city.innerText = el.city;

    let clinic = document.createElement("td");
    clinic.innerText = el.clinic;

    tr.append(ownerId, city, clinic);

    tbody.append(tr);
  });
}
