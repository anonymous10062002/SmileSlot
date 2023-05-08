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

//  Sign up process

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
  fetch("http://localhost:4000/users/login", {
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
      if (data.msg == "login successfull") {
        console.log(data.user);
        localStorage.setItem("dentaltoken", data.token);
        localStorage.setItem("dentalusername", data.user.username);
        localStorage.setItem("dentaluserID", data.user._id);

        if (data.user.role == "dentist") {
          swal(`Welcome Dentist ${data.user.username} 🤝`, data.msg, "success");
          setTimeout(() => {
            window.location.href = "../Public/dentistpanel.html";
          }, 3000);
        } else {
          swal(`Welcome ${data.user.username} 🤝`, data.msg, "success");
          setTimeout(() => {
            window.location.href = "../Public/after.html";
          }, 3000);
        }
      } else {
        const module = document.getElementById("cart-module");
        module.innerText = "Verify Your Details !!";
        module.style.display = "block";
        module.style.borderRadius = "20px";
        module.style.backgroundColor = "red";

        setTimeout(() => {
          module.style.display = "none";
        }, 3000);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
