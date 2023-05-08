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
  fetch("http://localhost:4000/admin/login", {
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
       email.value = null; password.value = null;
      }
    })
    .catch((err) => {
        swal(``, err, "error");
        email.value = null; password.value = null;
    });
});
