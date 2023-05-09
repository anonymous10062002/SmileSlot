
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
        document.getElementById("bmi-result").textContent = bmi.toFixed(1) + " (Underweight)"
        document.getElementById("bmi-result").style.color = "red";
    }
    else if (bmi >= 18.5 && bmi < 25) {
        document.getElementById("bmi-result").textContent = bmi.toFixed(1) + " (Normal)";
        document.getElementById("bmi-result").style.color = "green";
    }
    else if (bmi >= 25 && bmi < 30) {
        document.getElementById("bmi-result").textContent = bmi.toFixed(1) + " (Overweight)";
        document.getElementById("bmi-result").style.color = "orange";
    }
    else if (bmi >= 30) {
        document.getElementById("bmi-result").textContent = bmi.toFixed(1) + " (Obese)";
        document.getElementById("bmi-result").style.color = "red";
    } else {
        document.getElementById("bmi-result").textContent = bmi.toFixed(1);
        document.getElementById("bmi-result").style.color = "black";
    }
}

//  Sign up process 
let buttonsignup = document.getElementById("buttonsignup");
let Username = document.getElementById("Username");
let email = document.getElementById("email");
let age = document.getElementById("age");
let mobile = document.getElementById("mobile");
let password = document.getElementById("password");
let checkbox = document.getElementById("dentistinput")

// handle click event on checkbox
let role = "user"
checkbox.addEventListener('change', function () {
    if (this.checked) {
        role = "dentist"
    }
});

checkbox.addEventListener('change', function () {
    if (!this.checked) {
        role = "user"
    }
});

let alertempty = document.getElementById("alertempty")
buttonsignup.addEventListener("click", function () {

    if (Username.value == "" || email.value == "" || age.value == "" || mobile.value == "" || password.value == "") {
        alertempty.innerText = "Fill all details first"

        const module = document.getElementById('cart-module');
        module.innerText = "Fill all details first"
        module.style.display = 'block';
        module.style.borderRadius = '20px';
        module.style.backgroundColor = "red";

        setTimeout(() => {
            alertempty.innerText = ""
            module.style.display = 'none';
        }, 3000);
        return;
    }

    let payload = {
        username: Username.value,
        email: email.value,
        age: age.value,
        mobile: mobile.value,
        password: password.value,
        role: role
    }

    fetch(`https://dull-cyan-hatchling-yoke.cyclic.app/users/signup`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json"
        }
        
    }).then((res) => {

        return res.json();

    }).then((data) => {
    
        if(data.msg){
            swal(``, `OTP send to ${email.value}, please verify`, "success");
            setTimeout(()=>{
                window.location.href = "../Public/otp.html"
            },3000)
        } else {
            swal(``,data.err, "error");
        }

    }).catch((err) => {
        swal(``,err, "error");
    })

});


