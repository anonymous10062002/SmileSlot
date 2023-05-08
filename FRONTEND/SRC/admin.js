let userBtn = document.getElementById("user_data_btn");
let clinicBtn = document.getElementById("clinic_data_btn");
let logoutBtn = document.getElementById("logoutBtn");
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

  col1.innerText = "City";
  col2.innerText = "Clinic Name";
  col3.innerHTML = "Verified";
  col4.innerText = "Owner ID";
  col5.innerHTML = "DELETE";
  col5.style = "text-align:center";

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

  col1.innerText = "Username";
  col2.innerText = "Age";
  col3.innerText = "Role";
  col4.innerText = "Block";
  col5.innerText = "Verified";
  col5.style = "text-align:center";

  fetch(`http://localhost:4000/admin/getusers`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      console.log(res);
      showData(res);
    })
    .catch((err) => console.log(err));
}

let tbody = document.getElementById("tbody");

function showData(arr) {
  tbody.innerHTML = null;
  arr.forEach((el) => {
    let tr = document.createElement("tr");

    let username = document.createElement("td");
    username.innerText = el.username;

    let age = document.createElement("td");
    age.innerText = el.age;

    let role = document.createElement("td");
    role.innerText = el.role;

    let Delete = document.createElement("td");
    if (el.blocked) {
      Delete.innerText = "BLOCKED";
    } else {
      Delete.innerText = "BLOCK";
    }
    Delete.setAttribute("id", "delete");

    let verified = document.createElement("td");
    verified.innerHTML = `<p class="deleteClcBtn">${el.verified}</p>`;

    if (!el.blocked) {
      Delete.addEventListener("click", () => {
        fetch(`http://localhost:4000/admin/blockuser/${el._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            if (data.msg) {
              swal(``, `${el.username} is blocked successfully`, "success");
              setTimeout(() => {
                fetchingUserData();
              }, 2000);
            } else {
              swal(``, data.err, "error");
            }
          })
          .catch((err) => {
            swal(``, err.message, "error");
          });
      });
    }

    tr.append(username, age, role, Delete, verified);

    tbody.append(tr);
  });
}

function showClinicData(arr) {
  tbody.innerHTML = null;
  arr.forEach((el) => {
    console.log(el);
    let tr = document.createElement("tr");

    let city = document.createElement("td");
    city.innerText = el.city;

    let verified = document.createElement("td");
    verified.innerText = "true";

    let clinic = document.createElement("td");
    clinic.innerText = el.clinic;

    let ownerId = document.createElement("td");
    ownerId.innerText = el.userID;

    let Delete = document.createElement("td");
    Delete.innerHTML = `<button class="deleteClinicBtn">DELETE</button>`;

    Delete.addEventListener("click", () => {
      fetch(`http://localhost:4000/admin/clinic/${el._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.msg) {
            swal(``, `${el.clinic} is deleted successfully`, "success");
            setTimeout(() => {
              fetchingClinicData();
            }, 2000);
          } else {
            swal(``, data.err, "error");
          }
        })
        .catch((err) => {
          swal(``, err.message, "error");
        });
    });

    tr.append(city, clinic, verified, ownerId, Delete);

    tbody.append(tr);
  });
}

logoutBtn.addEventListener("click", logoutAdmin);

function logoutAdmin() {
  fetch(`http://localhost:4000/admin/logout`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      swal(``, res.msg, "success");
      setTimeout(() => {
        localStorage.removeItem("admin_token");
        token = null;
        window.location.href = "../Public/admlog.html";
      }, 3000);
    })
    .catch((error) => {
      swal(``, error.message, "error");
    });
}
