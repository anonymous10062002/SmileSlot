const inputs = document.querySelectorAll("input"),
button = document.querySelector("button");
inputs.forEach((input, index1) => {
    input.addEventListener("keyup", (e) => {
        const currentInput = input,
            nextInput = input.nextElementSibling,
            prevInput = input.previousElementSibling;

        if (currentInput.value.length > 1) {
            currentInput.value = "";
            return;
        }
        if (nextInput && nextInput.hasAttribute("disabled") && currentInput.value !== "") {
            nextInput.removeAttribute("disabled");
            nextInput.focus();
        }
        if (e.key === "Backspace") {
            inputs.forEach((input, index2) => {
                if (index1 <= index2 && prevInput) {
                    input.setAttribute("disabled", true);
                    input.value = "";
                    prevInput.focus();
                }
            });
        }
        if (!inputs[3].disabled && inputs[3].value !== "") {
            button.classList.add("active");
            return;
        }
        button.classList.remove("active");
    });
});

let verifyotp = document.getElementById("verifyotp");
let emailhere = document.getElementById("emailhere");

verifyotp.addEventListener("click", (e) => {
    e.preventDefault()
    if (emailhere.value == "") {
        alert("Please enter your email");
    } else {
        let otp = "";
        inputs.forEach((input) => {
            otp += input.value;
        });
        
        let data = {
            email: emailhere.value,
            otp: otp
        }

        fetch("http://localhost:4000/users/verifyuser", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
            return res.json();
        }).then((data) => {

            if (data.msg) {
                swal("Greetings 🤝", data.msg, "success");

                setTimeout(()=>{
                    window.location.href = "../Public/login.html";
                },3000)

            }else{
                swal('', "OTP is invalid", "error");
                setTimeout(()=>{
                    window.location.href = "../Public/signup.html";
                },3000)
            }
        })
    }
});