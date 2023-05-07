
let buttonsignup = document.getElementById("buttonsignup");

let email = document.getElementById("email");
let password = document.getElementById("password");

buttonsignup.addEventListener("click", function () {

    alert("hi")

    if (email.value == "" || password.value == "") {
        const module = document.getElementById('cart-module');
        module.innerText = "Please fill all details !!"
        module.style.display = 'block';
        module.style.borderRadius = '20px';
        module.style.backgroundColor = "red";

        setTimeout(() => {
            module.style.display = 'none';
        }, 3000);
        return;
    }

    let payload = {
        email: email.value,
        password: password.value
    }
    console.log(payload)
    fetch("http://localhost:4000/admin/adminlogin", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => {
        return res.json();
    }).then((data) => {
        console.log(data);
        if ( data.adminData.role == "admin") {
            console.log(data)
            localStorage.setItem("admin_token", data.token)
        
            swal(`Welcome Admin 🤝`, data.adminData.role, "success");
            setTimeout(() => {
                window.location.href = "../Public/admin.html"
            }, 4000)

        } else {
            const module = document.getElementById('cart-module');
            module.innerText = "Verify Your Details !!"
            module.style.display = 'block';
            module.style.borderRadius = '20px';
            module.style.backgroundColor = "red";

            setTimeout(() => {
                module.style.display = 'none';
            }, 3000);
        }

    }).catch((err) => {
        console.log(err);
    })
});

