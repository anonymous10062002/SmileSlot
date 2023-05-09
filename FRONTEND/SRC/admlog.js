let buttonsignup = document.getElementById("buttonsignup");

let email = document.getElementById("email");
let password = document.getElementById("password");

buttonsignup.addEventListener("click", function () {
  if (email.value == "" || password.value == "") {
    const module = document.getElementById("cart-module");
    module.innerText = "Please fill all details !!";
    module.style.display = "block";
    module.style.borderRadius = "20px";
    module.style.backgroundColor = "red";

    setTimeout(() => {
      module.style.display = "none";
    }, 3000);
    return;
  }

  let payload = {
    email: email.value,
    password: password.value,
  };
  console.log(payload);
  fetch(`https://dull-cyan-hatchling-yoke.cyclic.app/admin/login`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      if (data.msg) {
        console.log(data);
        localStorage.setItem("admin_token", data.token);

        swal(`Welcome Admin 🤝`, data.msg, "success");
        setTimeout(() => {
          window.location.href = "../Public/admin.html";
        }, 3000);
      } else {
        swal(``, "Wrong Credentials, Please Try Again", "error");
        email.value = null;
        password.value = null;
      }
    })
    .catch((err) => {
      swal(``, err, "error");
      email.value = null;
      password.value = null;
    });
});

function openBMIForm() {
  document.getElementById("bmi-form").style.display = "block";
}

function closeBMIForm() {
  document.getElementById("bmi-form").style.display = "none";
}

function calculateBMI() {
  const weight = document.getElementById("weight").value;
  const height = document.getElementById("height").value / 100;
  const bmi = weight / (height * height);
  if (bmi < 18.5) {
    document.getElementById("bmi-result").textContent =
      bmi.toFixed(1) + " (Underweight)";
    document.getElementById("bmi-result").style.color = "red";
  } else if (bmi >= 18.5 && bmi < 25) {
    document.getElementById("bmi-result").textContent =
      bmi.toFixed(1) + " (Normal)";
    document.getElementById("bmi-result").style.color = "green";
  } else if (bmi >= 25 && bmi < 30) {
    document.getElementById("bmi-result").textContent =
      bmi.toFixed(1) + " (Overweight)";
    document.getElementById("bmi-result").style.color = "orange";
  } else if (bmi >= 30) {
    document.getElementById("bmi-result").textContent =
      bmi.toFixed(1) + " (Obese)";
    document.getElementById("bmi-result").style.color = "red";
  } else {
    document.getElementById("bmi-result").textContent = bmi.toFixed(1);
    document.getElementById("bmi-result").style.color = "black";
  }
}
